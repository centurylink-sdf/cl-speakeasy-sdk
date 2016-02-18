define([
    'Ctl.speakeasy.Config',
    'Ctl.common.Logger',
    'Ctl.common.Promise',
    'Ctl.common.Ajax',
    'Ctl.common.Utils',
    'fcs'
], function (Config, Logger, Promise, Ajax, Utils, fcs) {

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
        }

        /**
         * Get active call
         *
         */
        function getActiveCall() {
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
        function createCall(numToCall) {

            var currentUser = fcs.getUser();
            debugger;
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
                        self.onStreamAddedHandler(outgoingCall, streamURL);
                    };

                    self.calls[callId] = outgoingCall;
                    self.currentCall = outgoingCall;

                },
                function(errorMessage) {
                    if (errorMessage === 2) {
                        self.logger.log("CREATE_PEER_FAILED", "error");
                    } else {
                        self.logger.log("CALL_FAILED", "error");
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

            self.logger.log("Incoming call remote stream added: " + streamURL);
            self.logger.log('canReceiveVideo: ' + call.canReceiveVideo());
            self.logger.log('canSendVideo: ' + call.canSendVideo());

            if (streamURL) {
                call.remoteStreamURL = streamURL;
                self.setRemoteStream(streamURL);
            } else {
                var remoteUserDisabledVideo = !call.canReceiveVideo() && call.canSendVideo();
                if (remoteUserDisabledVideo) {
                    self.logger.log('Remote user has disabled video feature');
                }
            }
        }

        function setRemoteStream(streamUrl) {
            var video = document.getElementById('remoteVideo');

            video.pause();
            video.src = streamUrl;
            video.load();
            video.play();

        }

        this.getCalls = getCalls;
        this.getActiveCall = getActiveCall;
        this.subscribeEvents = subscribeEvents;
        this.get = get;
        this.createCall = createCall;
    }

    return new CallManager();

});
