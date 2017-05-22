define([
    'Ctl.speakeasy/Config',
    'Ctl/Subscription',
    'Ctl/Logger',
    'Ctl/Utils',
    'Ctl/Error',
    'fcs'
], function (
    Config,
    Subscription,
    Logger,
    Utils,
    Error,
    fcs
) {

    /**
     * [Notification description]
     * @class Ctl.speakeasy.Notification
     * @private
     */
    function Notification() {

        var self = this;
        var lastNotificationError;

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
        this.connectionErrorHandler = connectionErrorHandler.bind(this);

        var messagesHash = new Map();
        messagesHash.set( 2, "Authentication error occured");
        messagesHash.set( 10, "Maximum number of sessions encountered.  Please reduce number of sessions");
        messagesHash.set( 13, "You have been disconnected by the administrator.  If you think this is an error, please login again");
        messagesHash.set( 16, "Session expired.  Please login again.");

        /**
         * Prepare for use by loading WebRTC server list and listening to events
         */
        function init(){
            //get spider servers from localStorage
            this.fcsConfig = fcs.g || fcs.fcsConfig;

            var speakEasyServiceCatalog = Subscription.getServiceCatalog();
            if (speakEasyServiceCatalog && speakEasyServiceCatalog.rtc && speakEasyServiceCatalog.rtc.routing) {
                var sites = JSON.parse(speakEasyServiceCatalog.rtc.routing);
                for (var i = 0; i < sites.length; i++) {
                    for (var key in sites[i]) {
                        if(sites[i].hasOwnProperty(key)) {
                            var endpoints = sites[i][key];
                            for (var j = 0; j < endpoints.length; j++) {
                                var temp = endpoints[j].split(':');
                                self.webRTCServerList.push({
                                    url: temp[0],
                                    port: temp[1]
                                });
                            }
                        }
                    }
                }
            }

            if(this.fcsConfig.websocketPort) {
                self.defaultWebsocketPort = this.fcsConfig.websocketPort;
            }
            updateLibraryConfig();
            attachListeners();
            self.initialized = true;
        }

        function updateLibraryConfig(){
            self.activeWebRTCServer = self.webRTCServerList[self.serverIndex].url;
            this.fcsConfig.websocketIP = self.activeWebRTCServer;
            var port = self.webRTCServerList[self.serverIndex].port;
            if(port){
                this.fcsConfig.websocketPort = port;
            }else{
                this.fcsConfig.websocketPort = self.defaultWebsocketPort;
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
                    function(err){
                        lastNotificationError = err;
                        connectionErrorHandler(resolveError(err));
                        start(onSuccess, onFailure); //try again with next attempt
                    }.bind(self)
                );

            }else{
                if (typeof onFailure === 'function'){
                    onFailure(resolveError(lastNotificationError));
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
         * handle connection error callback from fcs
         */
        function connectionErrorHandler(err){
            if(self.connectionErrorCallback) {
                self.connectionErrorCallback(err);
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
         * set function to call when connection is failed
         * @param callback
         */
        function setOnConnectionError(callback) {
            self.connectionErrorCallback = callback;
        }

        /**
         * set function to be called when phone call received
         * @param callback
         */
        function setOnCallReceived(callback) {
            self.callReceivedCallback = callback;
        }

        function resolveError(errorCode) {
            var errorText = "Failed to establish session. You won't be able to Call, Chat, or receive new message notifications.";

            if( errorCode && messagesHash.get(errorCode) ){
                errorText = messagesHash.get(errorCode);
            }

            return new Error(Error.Types.NOTIFICATION, errorCode, errorText);
        }

        this.start = start;
        this.setOnConnectionLost = setOnConnectionLost;
        this.setOnConnectionEstablished = setOnConnectionEstablished;
        this.setOnConnectionError = setOnConnectionError;
        this.setOnCallReceived = setOnCallReceived;
    }

    return new Notification();

});
