define([
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'fcs',
    'Ctl.speakeasy/EventEmitter',
    'Ctl.speakeasy/IncomingCall',
    'Ctl.speakeasy/OutgoingCall',
    'Ctl.speakeasy/CallInfo'
], function (
    Config,
    Logger,
    Promise,
    Ajax,
    Utils,
    fcs,
    EventEmitter,
    IncomingCall,
    OutgoingCall,
    CallInfo
) {

    /**
     * @class Ctl.speakeasy.CallManager
     * Manage calls
     *
     * @requires Ctl.speakeasy.Config
     * @requires Ctl.Logger
     * @requires Ctl.Promise
     * @requires Ctl.Ajax
     * @requires Ctl.Utils
     * @requires fcs
     * @requires Ctl.speakeasy.EventEmitter
     * @requires Ctl.speakeasy.IncomingCall
     * @requires Ctl.speakeasy.OutgoingCall
     * @requires Ctl.speakeasy.CallInfo
     */
    function CallManager() {

        var self = this;
        self.logger = new Logger('CallManager');

        /**
         * Setup SpeakEasy main configuration
         * @param  {Object} config Configuration to setup calling
         * @return {Ctl.Promise} p Promise object
         */
        function setup(config) {
            Utils.extend(Config.callManager, config);

            EventEmitter.on(EventEmitter.events.ON_DELETE_CALL, self, function(callId) {
                var p = new Promise();
                CallInfo.deleteCall(callId);
                p.done(false);
                return p;
            });

            EventEmitter.on(EventEmitter.events.BEFORE_ANSWER_CALL, self, function() {
                return holdCurrentCall();
            });

            EventEmitter.on(EventEmitter.events.BEFORE_UNHOLD, self, function(callId) {

                var p = new Promise();
                var currentCall = CallInfo.getCurrentCall();
                if(currentCall != null && currentCall.id != callId) {
                    p = holdCurrentCall();
                }
                else {
                    p.done(false);
                }
                return p;
            });
        }

        /**
         * Put current call on hold
         * @return {Ctl.Promise} Promise object
         */
        function holdCurrentCall() {

            var promise = new Promise(),
                currentCall = CallInfo.getCurrentCall();

            if(currentCall != null) {
                // place current call on hold
                if(currentCall.isActive()) {
                    currentCall.hold(function() {
                        promise.done(false);
                    },
                    function() {
                        promise.done(true);
                    });
                }
                else {
                    promise.done(false);
                }
            }
            else {
                promise.done(false);
            }

            return promise;
        }

        /**
         * Get all calls
         *
         */
        function getCalls() {
            return CallInfo.getCalls();
        }

        /**
         * Get total call count
         * @return {int} Calls count
         */
        function getCallsCount() {
            return CallInfo.getCallsCount();
        }

        /**
         * Get active call
         *
         */
        function getCurrentCall() {
            return CallInfo.getCurrentCall();
        }

        /**
         * Get call by callID
         *
         * @param   {String} callID
         * @return  {Call} Contains call object with required info
         */
        function get(callID) {
            return CallInfo.get(callID);
        }

        /**
         * Starts a call
         *
         * @param {String} numToCall The callee's address used to establish the call
         * @param {Boolean} isVideoEnabled In order to make video call set this to true.
         * @param {function} successCallback The callback function to be called after success
         *
         * @return  {OutgoingCall} Contains call object with required info
         */
        function createCall(numToCall, isVideoEnabled, successCallback, failureCallback) {

            var domain = Config.settings.defaultOutgoingCallDomain;
            numToCall = !/@/.test(numToCall) ?  numToCall + "@" + domain : numToCall;

            var currentUser = fcs.getUser();

            holdCurrentCall().then(function(error) {

                if(error) {
                    Utils.doCallback(failureCallback);
                }
                else {
                    fcs.call.startCall(
                        currentUser,
                        null,
                        numToCall,

                        function(call) {

                            holdCurrentCall();

                            var outgoingCall = new OutgoingCall(call);

                            CallInfo.addCall(outgoingCall, true);

                            Utils.doCallback(successCallback, [ outgoingCall ]);

                        },
                        function(errorMessage) {
                            if (errorMessage === 2) {
                                self.logger.log("CREATE_PEER_FAILED", "error");
                            } else {
                                self.logger.log("CALL_FAILED", errorMessage);
                            }
                            Utils.doCallback(failureCallback);
                        },
                        isVideoEnabled,
                        isVideoEnabled,
                        Config.callManager.videoQuality
                    );
                }

            });
        }

        /**
         * Make active another call
         * @param {String} callId The call id to switch to
         * @param {function} successCallback The callback function to be called after success
         * @param {function} failureCallback The callback function to be called after failure
         */
        function switchTo(callId, successCallback, failureCallback) {
            holdCurrentCall().then(function(error) {
                if(error) {
                    Utils.doCallback(failureCallback);
                }
                else {
                    var call = CallInfo.get(callId);
                    CallInfo.setCurrentCall(call);
                    if(!call.isActive()) {
                        call.unhold(function() {
                            Utils.doCallback(successCallback);
                        },
                        function() {
                            Utils.doCallback(failureCallback);
                        })
                    }
                }
            });
        }

        /**
         * handle incoming call
         * @param  {Ctl.speakeasy.BaseCall} call Call object
         */
        function processReceivedCall(call) {
            self.logger.info("There is an incomming call...");

            var incomingCall = new IncomingCall(call);
            CallInfo.addCall(incomingCall, false);

            Utils.doCallback(self.onCallReceived, [ incomingCall ]);
        }

        this.setup = setup;
        this.getCalls = getCalls;
        this.getCallsCount = getCallsCount;
        this.getCurrentCall = getCurrentCall;
        this.get = get;
        this.createCall = createCall;
        this.switchTo = switchTo;
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
