define([
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'fcs',
    'Ctl.speakeasy/IncomingCall',
    'Ctl.speakeasy/OutgoingCall'
], function (
    Config,
    Logger,
    Promise,
    Ajax,
    Utils,
    fcs,
    IncomingCall,
    OutgoingCall
) {

    /**
     * @class Ctl.speakeasy.CallManager
     * Manage calls
     *
     * @requires Config
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function CallManager() {

        var self = this;
        self.logger = new Logger('CallManager');
        self.calls = [];
        self.currentCall = null;

        /**
         *
         */
        function setup(config) {
            Utils.extend(Config.callManager, config);
        }

        /**
         * Get all calls
         *
         */
        function getCalls() {
            return self.calls;
        }

        /**
         * Get active call
         *
         */
        function getCurrentCall() {
            return self.currentCall;
        }

        /**
         * Load CneturyLink API
         *
         */
        function subscribeEvents(callback) {
        }

        /**
         * Get call by callID
         *
         * @param   {String} callID
         * @return  {Call} Contains call object with required info
         */
        function get(callID) {
            return self.calls[callID];
        }

        /**
         * Starts a call.
         *
         * @param {String} numToCall The callee's address used to establish the call
         * @param {Boolean} isVideoEnabled In order to make video call set this to true.
         * @param {function} callback The callback function to be called after success
         *
         * @return  {OutgoingCall} Contains call object with required info
         */
        function createCall(numToCall, isVideoEnabled, callback) {

            var domain = Config.settings.defaultOutgoingCallDomain;
            var numToCall = !/@/.test(numToCall) ?  numToCall + "@" + domain : numToCall;

            var currentUser = fcs.getUser();
            fcs.call.startCall(
                currentUser,
                null,
                numToCall,

                function(call) {
                    var callId = call.getId();

                    var outgoingCall = new OutgoingCall(call);

                    self.calls[callId] = outgoingCall;
                    self.currentCall = outgoingCall;

                    Utils.doCallback(callback, [ null, outgoingCall ]);

                },
                function(errorMessage) {
                    if (errorMessage === 2) {
                        self.logger.log("CREATE_PEER_FAILED", "error");
                    } else {
                        self.logger.log("CALL_FAILED", errorMessage);
                    }
                },
                isVideoEnabled,
                isVideoEnabled,
                Config.callManager.videoQuality
            );
        }

        function processReceivedCall(call) {
            self.logger.info("There is an incomming call...");

            var incomingCall = new IncomingCall(call);

            //TODO: not sure shoud we set incoming call as active (we can already have outgoing call as active)
            self.currentCall = incomingCall;

            Utils.doCallback(self.onCallReceived, [ null, incomingCall ]);
        }

        this.setup = setup;
        this.getCalls = getCalls;
        this.getCurrentCall = getCurrentCall;
        this.subscribeEvents = subscribeEvents;
        this.get = get;
        this.createCall = createCall;
        this.processReceivedCall = processReceivedCall;

        /**
         * @event
         * Raised when incoming call received
         *
         */
        this.onCallReceived = null;
    }

    return new CallManager();

});
