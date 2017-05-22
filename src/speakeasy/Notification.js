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

        this.initialized = false;

        //bind event handler
        this.connectionLostHandler = connectionLostHandler.bind(this);
        this.connectionErrorHandler = connectionErrorHandler.bind(this);
        this.connectionEstablishedHandler = connectionEstablishedHandler.bind(this);

        var messagesHash = new Map();
        messagesHash.set( 2, "Authentication error occured");
        messagesHash.set( 10, "Maximum number of sessions encountered.  Please reduce number of sessions");
        messagesHash.set( 13, "You have been disconnected by the administrator.  If you think this is an error, please login again");
        messagesHash.set( 16, "Session expired.  Please login again.");

        /**
         * Prepare for use by loading WebRTC server list and listening to events
         */
        function init(){
            attachListeners();
            self.initialized = true;
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
            if(fcs.isConnected()){
                fcs.notification.start(function(){
                        onSuccess();
                    }.bind(self),
                    function(err){
                        lastNotificationError = err;
                        connectionErrorHandler(resolveError(err));
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
            fcs.notification.setOnConnectionEstablished(self.connectionEstablishedHandler);

            fcs.notification.setOnConnectionLost(self.connectionLostHandler);

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
         * handle connection established callback from fcs
         */
        function connectionEstablishedHandler(){
            if(self.connectionEstablishedCallback) {
                self.connectionEstablishedCallback();
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
