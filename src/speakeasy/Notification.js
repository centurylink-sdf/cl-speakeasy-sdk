define([
    'Ctl.speakeasy/Config',
    'Ctl/Subscription',
    'Ctl/Logger',
    'Ctl/Utils',
    'fcs'
], function (
    Config,
    Subscription,
    Logger,
    Utils,
    fcs
) {

    /**
     * [Notification description]
     * @class Ctl.speakeasy.Notification
     * @private
     */
    function Notification() {

        var self = this;
        var logger = new Logger('Notification');

        var config = {
            storageKeywords: {
                notificationId: 'NotificationId'
            }
        };

        this.webRTCServerList = [];
        this.serverIndex = 0;
        this.activeWebRTCServer = null;
        this.initialized = false;
        this.defaultWebsocketPort = 8591;
        this.serverAttemptCount = 0;
        this.connectionAttemptCount = 0;

        //bind event handler
        this.connectionLostHandler = connectionLostHandler.bind(this);

        /**
         * Prepare for use by loading WebRTC server list and listening to events
         */
        function init(){
            //get spider servers from localStorage

            var speakEasyServiceCatalog = Subscription.getServiceCatalog('SpeakEasy');

            if (speakEasyServiceCatalog && speakEasyServiceCatalog.WebSocketEndpoints) {
                var endpoints = speakEasyServiceCatalog.WebSocketEndpoints.split('$');
                for (var i = 0; i < endpoints.length; i++) {
                    var temp = endpoints[i].split(':');
                    self.webRTCServerList.push({
                        url: temp[0],
                        port: temp[1]
                    });
                }
            }

            if(fcs.fcsConfig.websocketPort) {
                self.defaultWebsocketPort = fcs.fcsConfig.websocketPort;
            }
            updateLibraryConfig();
            attachListeners();
            self.initialized = true;
        }

        function updateLibraryConfig(){
            self.activeWebRTCServer = self.webRTCServerList[self.serverIndex].url;
            fcs.fcsConfig.websocketIP = self.activeWebRTCServer;
            var port = self.webRTCServerList[self.serverIndex].port;
            if(port){
                fcs.fcsConfig.websocketPort = port;
            }else{
                fcs.fcsConfig.websocketPort = self.defaultWebsocketPort;
            }
        }

        /**
         * Establish WebSocket connection to receive calling events and push notifications.
         */
        function start(onSuccess, onFailure){
            if(!self.initialized){
                init();
            }

            //fcs will fail silently if fcs.notification.start() is called while fcs.isConnected() returns false
            //check it before we try to establish webSocket.
            if(fcs.isConnected() && self.serverAttemptCount < self.webRTCServerList.length){
                self.connectionAttemptCount++;
                //switch servers after trying to connect twice
                if(self.connectionAttemptCount > 2){
                    self.connectionAttemptCount = 0;
                    self.serverAttemptCount++;
                    useNextWebRTCServer();
                }

                fcs.notification.start(function(){
                        self.serverAttemptCount = 0;
                        self.connectionAttemptCount = 0;
                        onSuccess();
                    }.bind(self),
                    function(){
                        start(onSuccess, onFailure); //try again with next attempt
                    }.bind(self)
                );

            }else{
                if (typeof onFailure === 'function'){
                    onFailure();
                }
            }
        }

        /**
         * Attach event listeners to fcs lib to recieve websocket events
         */
        function attachListeners(){
            fcs.notification.setOnConnectionEstablished(function(){
                self.serverAttemptCount = 0;
                self.connectionAttemptCount = 0;
                start(self.connectionEstablishedCallback);
            }.bind(self));

            fcs.notification.setOnConnectionLost(self.connectionLostHandler);

            fcs.notification.setOnError(function(){
                connectionLostHandler();
                start(self.connectionEstablishedCallback);
            }.bind(self));

            fcs.call.onReceived = function(callData){
                if(self.callReceivedCallback) {
                    self.callReceivedCallback(callData);
                }
            }.bind(self);
        }

        /**
         * handle connection lost callback from fcs
         */
        function connectionLostHandler(){
            if(self.connectionLostCallback) {
                self.connectionLostCallback();
            }
        }

        /**
         * Place the current webrtc server at lowest priority and promote the next server from list
         */
        function useNextWebRTCServer(){
            //clear local storage id so that we initiate a new subscription
            localStorage.removeItem(config.storageKeywords.notificationId);

            self.serverIndex++;
            if(self.serverIndex >= self.webRTCServerList.length){
                self.serverIndex = 0;
            }
            updateLibraryConfig();
        }

        /**
         * set function to call when isAlive polling or websocket fails
         * @param callback
         */
        function setOnConnectionLost(callback) {
            self.connectionLostCallback = callback;
        }

        /**
         * set function to call when isAlive polling retry succeeds
         * @param callback
         */
        function setOnConnectionEstablished(callback) {
            self.connectionEstablishedCallback = callback;
        }

        /**
         * set function to be called when phone call received
         * @param callback
         */
        function setOnCallReceived(callback) {
            self.callReceivedCallback = callback;
        }

        this.start = start;
    }

    return new Notification();

});
