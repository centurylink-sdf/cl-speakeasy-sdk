define([
    'Ctl.speakeasy.Config',
    'Ctl.common.Logger',
    'Ctl.common.Promise',
    'Ctl.common.Ajax',
    'Ctl.common.Utils',
    'fcs',
    'Ctl.speakeasy.Call'
], function (Config, Logger, Promise, Ajax, Utils, fcs, Call) {

    /**
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

        var p = new Promise();

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
        }

        /**
         *
         *
         * @return  {Call} Contains call object with required info
         */
        function createCall(numToCall, callback) {

            var domain = Config.settings.defaultOutgoingCallDomain;
            var numToCall = !/@/.test(numToCall) ?  numToCall + "@" + domain : numToCall;

            var currentUser = fcs.getUser();
            fcs.call.startCall(
                currentUser,
                null,
                numToCall,

                function(outgoingCall) {
                    var callId = outgoingCall.getId();

                    outgoingCall.onStateChange = function(state, statusCode) {
                        //Add statusCode that returned from the server property to the call
                        self.logger.log('outgoingCall status changed: ' + statusCode);
                    };

                    outgoingCall.onStreamAdded = function(streamURL) {
                        onStreamAddedHandler(outgoingCall, streamURL);
                    };


                    outgoingCall.onLocalStreamAdded = function(streamURL) {
                        onLocalStreamAddedHandler(outgoingCall, streamURL);
                    };

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
                true,
                true,
                '640x480'
            );

        }

        /**
         *
         * @param call
         * @param streamURL
         *
         * NOTE: Currently, all endpoints that CTLCommunicator works with always answer audio.
         *
         * call.canReceiveVideo returns with the GENBAND plugin:
         *   'false' when we offer audio only ('inactive' (audio <--> audio))
         *   'true' when we offer video  ('recvonly' from other end (video/audio <--> audio))
         *
         * call.canReceiveVideo returns with Chrome native RTC:
         *   'false' when we offer audio only ('inactive' (audio <--> audio))
         *   'false' when we offer video  ('recvonly' from other end (video/audio <--> audio))
         *
         *  NOTE the issue -- Chrome returns 'false', GENBAND plugin returns 'true' for recvonly
         *
         *    We  display a blank video screen with GENBAND plugin in 'recvonly' scenario
         */
        function onStreamAddedHandler(call, streamURL) {

            self.logger.log("Outgoing call remote stream added: " + streamURL);
            self.logger.log('canReceiveVideo: ' + call.canReceiveVideo());
            self.logger.log('canSendVideo: ' + call.canSendVideo());

            if (streamURL) {
                call.remoteStreamURL = streamURL;
                setRemoteStream(streamURL);
            } else {
                var remoteUserDisabledVideo = !call.canReceiveVideo() && call.canSendVideo();
                if (remoteUserDisabledVideo) {
                    self.logger.log('Remote user has disabled video feature');
                }
            }
        }

        function onLocalStreamAddedHandler(call, streamURL) {

            self.logger.log("Outgoing call local stream added: " + streamURL);
            self.logger.log('canReceiveVideo: ' + call.canReceiveVideo());
            self.logger.log('canSendVideo: ' + call.canSendVideo());

            if (streamURL) {
                call.localStreamURL = streamURL;
                setLocalStream(streamURL);
            }
        }

        function setRemoteStream(streamUrl) {
            var video = document.getElementById('remoteVideo');

            video.pause();
            video.src = streamUrl;
            video.load();
            video.play();

        }

        function setLocalStream(streamUrl) {
            var video = document.getElementById('localVideo');

            video.pause();
            video.src = streamUrl;
            video.load();
            video.play();

        }

        function onCallReceived(incomingCall) {
            self.logger.info("There is an incomming call...");

            self.currentCall = incomingCall;

            //This function listens call state changes in JSL API level
            incomingCall.onStateChange = function (state) {
                onStateChange(incomingCall, state);
            };

            incomingCall.onStreamAdded = function (streamURL) {
                self.logger.info("Remote stream added...");
                setRemoteStream(streamURL);
            };

            incomingCall.onLocalStreamAdded = function (streamURL) {
                self.logger.info("Remote stream added...");
                setLocalStream(streamURL) ;
            };

            // Call dialog box
            var r = confirm("Incoming call! Would you like to answer?");
            if (r === true) {
                self.logger.info("Answering the incomming call...");
                incomingCall.answer(
                    function () {
                        self.logger.info("You are on call.");
                    },
                    function () {
                        self.logger.error("Call answer is failed!");
                    },
                    false
                );
            } else {
                // Rejecting the incomming call
                incomingCall.eject(
                function () {
                    self.logger.info("Rejected incomming call...");
                },
                function () {
                    self.logger.error("Call reject is failed!");
                });
            }
        }

        function onStateChange(call, state) {

        }

        this.getCalls = getCalls;
        this.getCurrentCall = getCurrentCall;
        this.subscribeEvents = subscribeEvents;
        this.get = get;
        this.createCall = createCall;
        this.onCallReceived = onCallReceived;
    }

    return new CallManager();

});
