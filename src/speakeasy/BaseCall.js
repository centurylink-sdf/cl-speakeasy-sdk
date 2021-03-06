define([
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'fcs',
    'Ctl.speakeasy/EventEmitter',
    'Ctl.speakeasy/CallInfo',
    'Ctl.speakeasy/AudiotonesManager'
], function (
    Config,
    Logger,
    Promise,
    Ajax,
    Utils,
    fcs,
    EventEmitter,
    CallInfo,
    AudiotonesManager
) {

    /**
     * @abstract
     * @class Ctl.speakeasy.BaseCall
     * A base class that implements call functionality
     *
     * @requires Ctl.speakeasy.Config
     * @requires Ctl.Logger
     * @requires Ctl.Promise
     * @requires Ctl.Ajax
     * @requires Ctl.Utils
     * @requires fcs
     * @requires Ctl.speakeasy.EventEmitter
     * @requires Ctl.speakeasy.CallInfo
     * @requires Ctl.speakeasy.AudiotonesManager
     */
    function BaseCall(fcsCall, isVideoEnabled) {

        var self = this;
        var remoteVideoElement = null;
        var remoteVideoContainer = document.getElementById(Config.callManager.remoteVideoContainer);
        var localVideoContainer = document.getElementById(Config.callManager.localVideoContainer);

        if (self.constructor === BaseCall) {
            throw new Error("Can't instantiate abstract BaseCall!");
        }

        self.logger = new Logger(self.constructor.name);

        //the call object from FCS library
        self.fcsCall = fcsCall;

        self.remoteStreamURL = null;
        self.localStreamURL = null;
        self.callState = null;

        self.id = self.fcsCall.getId();
        self.isMuted = false;
        self.isVideoStarted = isVideoEnabled;
        self.isEnded = false; // true if current user ends the call
        self.ringing = true;

        /**
         * The caller name
         * @type {string}
         */
        self.callerName = '';

        /**
         * The caller number
         * @type {string}
         */
        self.callerNumber = '';

        /**
         * Attaches handlers for listening call events
         * @private
         */
        function attachListeners() {

            //This function listens call state changes in JSL API level
            self.fcsCall.onStateChange = function(state, statusCode) {
                //Add statusCode that returned from the server property to the call
                processStateChange(state, statusCode);
            };

            self.fcsCall.onStreamAdded = function(streamURL) {
                onStreamAddedHandler(streamURL);
                EventEmitter.trigger(EventEmitter.events.CALL_STREAM_ADDED, self, false, self, streamURL);
            };

            self.fcsCall.onLocalStreamAdded = function(streamURL) {
                onLocalStreamAddedHandler(streamURL);
                EventEmitter.trigger(EventEmitter.events.CALL_LOCAL_STREAM_ADDED, self, false, self, streamURL);
            };
        }

        /**
         * Handler for listening remote video stream ready event.
         * @private
         *
         * @param {String} streamURL Remote video stream url
         */
        function onStreamAddedHandler(streamURL) {

            self.logger.log("Outgoing call remote stream added: " + streamURL);
            self.logger.log('canReceiveVideo: ' + self.fcsCall.canReceiveVideo());
            self.logger.log('canSendVideo: ' + self.fcsCall.canSendVideo());


            if(streamURL) {
                self.remoteStreamURL = streamURL;
                setRemoteStream(streamURL);

                if(self.fcsCall.canReceiveVideo()) {
                    showRemoteVideo();
                }
                else {
                    var remoteUserDisabledVideo = !self.fcsCall.canReceiveVideo() && self.fcsCall.canSendVideo();
                    if (remoteUserDisabledVideo) {
                        self.logger.log('Remote user has disabled video feature');
                    }
                }
            }
        }

        /**
         * The handler for listening local video stream ready event
         * @private
         *
         * @param {String} streamURL Local video stream url
         */
        function onLocalStreamAddedHandler(streamURL) {

            self.logger.log("local stream added: " + streamURL);
            self.logger.log('canReceiveVideo: ' + self.fcsCall.canReceiveVideo());
            self.logger.log('canSendVideo: ' + self.fcsCall.canSendVideo());

            if (streamURL) {
                self.localStreamURL = streamURL;
                setLocalStream(streamURL);
            }
        }

        /**
         * Creates local video element in DOM
         * @private
         */
        function showLocalVideo() {
            if(self.localStreamURL && self.fcsCall.canSendVideo()) {
                setLocalStream(self.localStreamURL);
            }
        }

        /**
         * Show remote video element in DOM
         * @private
         */
        function showRemoteVideo() {
            if(self.fcsCall.canReceiveVideo() && remoteVideoElement != null) {
                remoteVideoElement.style.display = 'block';
            }
        }

        /**
         * Hide remote video element in DOM
         * @private
         */
        function hideRemoteVideo() {
            if(remoteVideoElement != null) {
                remoteVideoElement.style.display = 'none';
            }
        }

        /**
         * Creates all video elements in DOM
         * @private
         */
        function showAllVideoStreams() {
            showLocalVideo();
            showRemoteVideo();
        }

        /**
         * Creates remote video element in DOM
         * @private
         *
         * @param {String} streamUrl The remote video stream url
         */
        function setRemoteStream(streamUrl) {

            if(!isRemoteVideoExist(streamUrl)) {
                removeRemoteStream();

                var video = document.createElement('video');
                video.id = 'video_' + self.id;
                video.style.width = '100%';
                video.style.height = '100%';
                video.style.display = 'none';

                remoteVideoContainer.appendChild(video);

                video.pause();
                video.src = streamUrl;
                video.load();
                video.play();

                remoteVideoElement = document.getElementById('video_' + self.id);
            }
        }

        /**
         * Removes remote stream element from DOM
         * @private
         */
        function removeRemoteStream() {
            if(remoteVideoElement != null) {
                remoteVideoContainer.removeChild(remoteVideoElement);
                remoteVideoElement = null;
            }
        }

        /**
         * Creates local video element in DOM
         * @private
         *
         * @param {String} streamUrl The local stream url
         */
        function setLocalStream(streamUrl) {

            if(!isLocalVideoExist(streamUrl)) {
                removeLocalStream();

                var video = document.createElement('video');
                video.style.width = '100%';
                video.style.height = '100%';
                video.muted = true;

                localVideoContainer.appendChild(video);

                video.src = streamUrl;
                video.pause();
                video.load();
                video.play();
            }
        }

        /**
         * Removes local video element from DOM
         * @private
         */
        function removeLocalStream() {

            var currentCall = CallInfo.getCurrentCall();

            if(currentCall.id == self.id) { //remove local video only for current call

                var videoElements = localVideoContainer.getElementsByTagName('video');

                if(videoElements.length > 0) {
                    localVideoContainer.removeChild(videoElements[0]);
                }
            }
        }

        /**
         * Removes all video elements from DOM
         * @private
         */
        function removeAllVideoStreams() {
            removeLocalStream();
            removeRemoteStream();
        }

        function hideAllVideoStreams() {
            self.isVideoStarted = false;
            removeLocalStream();
            hideRemoteVideo();
        }

        /**
         * Checks if local video element exist in DOM
         * @private
         *
         * @param {String} streamUrl The local stream url
         * @returns {Boolean}
         */
        function isLocalVideoExist(streamUrl) {

            var isExist = false;

            if(localVideoContainer) {
                var videoElements = localVideoContainer.getElementsByTagName('video');
                isExist = videoElements.length > 0 && videoElements[0].src == streamUrl
            }
            return isExist;
        }

        /**
         * Checks if remote video element exist in DOM
         * @private
         *
         * @param {String} streamUrl The remote stream url
         * @returns {Boolean}
         */
        function isRemoteVideoExist(streamUrl) {

            var isExist = false;

            if(remoteVideoElement != null) {
                isExist = remoteVideoElement.src == streamUrl
            }

            return isExist;
        }

        /**
         * The handler for listening call state changes in JSL API level
         * @private
         *
         * @param state
         * @param statusCode
         */
        function processStateChange(state, statusCode) {
            self.callState = state;

            if (state !== fcs.call.States.RINGING && state !== fcs.call.States.INCOMING) {
                AudiotonesManager.stop(AudiotonesManager.RING_OUT);
                AudiotonesManager.stop(AudiotonesManager.RING_IN);
                AudiotonesManager.stop(AudiotonesManager.INTERRUPT);
            }

            switch(state) {
                case fcs.call.States.RINGING:
                    self.logger.debug('status changed: RINGING');

                    if(statusCode !== '183') {
                        AudiotonesManager.play(AudiotonesManager.RING_OUT);
                    }

                    EventEmitter.trigger(EventEmitter.events.CALL_RINGING, self, false, self, statusCode);
                    break;
                case fcs.call.States.IN_CALL:
                    self.ringing = false;
                    self.logger.debug('status changed: IN_CALL');
                    showAllVideoStreams();
                    EventEmitter.trigger(EventEmitter.events.CALL_STARTED, self, false, self, statusCode);
                    break;
                case fcs.call.States.CALL_IN_PROGRESS:
                    self.logger.debug('status changed: CALL_IN_PROGRESS');
                    break;
                case fcs.call.States.INCOMING:
                    self.logger.debug('status changed: INCOMING');
                    break;
                case fcs.call.States.ANSWERING:
                    self.logger.debug('status changed: ANSWERING');
                    break;
                case fcs.call.States.JOINED:
                    self.logger.debug('status changed: JOINED');
                    break;
                case fcs.call.States.ON_HOLD:
                    self.logger.debug('status changed: ON_HOLD');
                    EventEmitter.trigger(EventEmitter.events.CALL_HELD, self, false, self, statusCode);
                    break;
                case fcs.call.States.ON_REMOTE_HOLD:
                    self.logger.debug('status changed: ON_REMOTE_HOLD');
                    hideAllVideoStreams();
                    EventEmitter.trigger(EventEmitter.events.CALL_REMOTE_HELD, self, false, self, statusCode);
                    break;
                case fcs.call.States.OUTGOING:
                    self.logger.debug('status changed: OUTGOING');
                    break;
                case fcs.call.States.RENEGOTIATION:
                    self.logger.debug('status changed: RENEGOTIATION');
                    break;
                case fcs.call.States.ENDED:
                    self.logger.debug('status changed: ENDED');

                    if(!self.isEnded) {

                        if (statusCode == 200 || statusCode === undefined) {
                            AudiotonesManager.play(AudiotonesManager.HANG_UP);
                        }
                        else {
                            AudiotonesManager.play(AudiotonesManager.BUSY);
                            setTimeout(function() {
                                AudiotonesManager.stop(AudiotonesManager.BUSY);
                            }, 1500);
                        }

                        removeAllVideoStreams();
                        EventEmitter.trigger(EventEmitter.events.ON_DELETE_CALL, null, true, self.id);
                        EventEmitter.trigger(EventEmitter.events.CALL_ENDED, self, false, self, statusCode);
                    }
                    break;
                case fcs.call.States.REJECTED:
                    self.logger.debug('status changed: REJECTED');
                    removeAllVideoStreams();
                    EventEmitter.trigger(EventEmitter.events.CALL_REJECTED, self, false,  self, statusCode);
                    break;
                case fcs.call.States.EARLY_MEDIA:
                    self.logger.debug('status changed: EARLY_MEDIA');
                    break;
                case fcs.call.States.TRANSFERRED:
                    self.logger.debug('status changed: TRANSFERRED');
                    break;
                case fcs.call.States.TRANSFER_FAILURE:
                    self.logger.debug('status changed: TRANSFER_FAILURE');
                    break;
            }
        }

        /**
         * Checks if video containers are exist
         * @private
         */
        function checkVideoContainersExists() {

            self.logger.debug('Check video containers exist');
            self.logger.debug('Call manager config: ');
            self.logger.debug(Config.callManager);

            var bodyElements = document.getElementsByTagName('body');
            var container = null;

            if(bodyElements.length > 0) {

                var body = bodyElements[0];

                if(remoteVideoContainer === null) {

                    self.logger.debug('Remote video container did not found. Trying to get one more time...');
                    remoteVideoContainer = document.getElementById(Config.callManager.remoteVideoContainer);

                    if(remoteVideoContainer === null) {

                        self.logger.debug('Remote video container did not found. Creating new one...');

                        container = document.createElement('div');
                        container.id = Config.callManager.remoteVideoContainer;

                        body.appendChild(container);

                        remoteVideoContainer = document.getElementById(Config.callManager.remoteVideoContainer);
                    }
                }

                if(localVideoContainer === null) {

                    self.logger.debug('Local video container did not found. Trying to get one more time...');
                    localVideoContainer = document.getElementById(Config.callManager.localVideoContainer);

                    if(localVideoContainer === null) {

                        self.logger.debug('Local video container did not found. Creating new one...');

                        container = document.createElement('div');
                        container.id = Config.callManager.localVideoContainer;

                        body.appendChild(container);

                        localVideoContainer = document.getElementById(Config.callManager.localVideoContainer);
                    }
                }
            }
        }

        /**
         * Play dialpad key tone, mutes microphone to prevent feedback
         * @private
         *
         * @param key 0-9, # or *
         */
        function playKeyTone(key){
            var promise = new Promise(),
                unMutePlease = false,
                toneComplete;

            if (!self.isMuted ) {
                unMutePlease = true;
                self.mute();
            }
            toneComplete = AudiotonesManager.dialTonePlay(key);

            if(unMutePlease){
                toneComplete.then(function(){
                    self.unmute();
                    promise.done();
                });
            }
            else {
                promise.done();
            }

            return promise;
        }

        /**
         * Gets call id
         * @returns {String} Unique identifier for the call
         */
        self.getCallId = function() {
            return self.fcsCall.getId();
        };

        /**
         * End the call.
         * @param {Function} successCallback The callback function to be called after success
         * @param {Function} failureCallback The callback function to be called after failure
         */
        self.hangUp = function(successCallback, failureCallback) {
            self.isEnded = true;
            AudiotonesManager.stop(AudiotonesManager.RING_OUT);
            AudiotonesManager.play(AudiotonesManager.HANG_UP);

            self.fcsCall.end(
                function () {
                    removeAllVideoStreams();
                    EventEmitter.trigger(EventEmitter.events.ON_DELETE_CALL, null, true, self.id);
                    Utils.doCallback(successCallback);
                },
                function () {
                    self.isEnded = false;
                    Utils.doCallback(failureCallback);
                });
        };

        /**
         * Puts the speaker into mute.
         */
        self.mute = function() {
            self.fcsCall.mute();
            self.isMuted = true;
        };

        /**
         * Puts the speaker into unmute.
         */
        self.unmute = function() {
            self.fcsCall.unmute();
            self.isMuted = false;
        };

        /**
         * Holds the call.
         *
         * @param {Function} successCallback The callback function to be called after success
         * @param {Function} failureCallback The callback function to be called after failure
         */
        self.hold = function(successCallback, failureCallback) {

            self.fcsCall.hold(
                function () {
                    hideAllVideoStreams();
                    self.fcsCall.onStateChange(fcs.call.States.ON_HOLD);
                    Utils.doCallback(successCallback);
                },
                function () {
                    Utils.doCallback(failureCallback);
                });
        };

        /**
         * Resume the call.
         *
         * @param {Function} successCallback The callback function to be called after success
         * @param {Function} failureCallback The callback function to be called after failure
         */
        self.unhold = function(successCallback, failureCallback) {

            EventEmitter.trigger(EventEmitter.events.BEFORE_UNHOLD, null, true, self.id);

            self.fcsCall.unhold(
                function () {
                    showAllVideoStreams();
                    self.fcsCall.onStateChange(fcs.call.States.IN_CALL);
                    Utils.doCallback(successCallback);
                },
                function () {
                    Utils.doCallback(failureCallback);
                });
        };

        /**
         * Start the video for this call after the call is established.
         * @param {Function} successCallback The callback function to be called after success
         * @param {Function} failureCallback The callback function to be called after failure
         */
        self.startVideoSend = function(successCallback, failureCallback) {

            self.fcsCall.videoStart(
                function () {
                    self.isVideoStarted = true;
                    Utils.doCallback(successCallback);
                },
                function () {
                    Utils.doCallback(failureCallback);
                },
                Config.callManager.videoQuality
            );

        };

        /**
         * Stop the video for this call after the call is established.
         *
         * @param {Function} successCallback The callback function to be called after success
         * @param {Function} failureCallback The callback function to be called after failure
         */
        self.stopVideoSend = function(successCallback, failureCallback) {

            self.fcsCall.videoStop(
                function () {
                    self.isVideoStarted = false;
                    removeLocalStream();
                    Utils.doCallback(successCallback);
                },
                function () {
                    Utils.doCallback(failureCallback);
                });
        };

        /**
         * Send Dual-tone multi-frequency signaling
         * @param {String} digit Digit to be send as dtmf
         */
        self.sendDigits = function(digit) {
            var muted = false;
            if (!self.isMuted ) {
                muted = true;
                self.mute();
            }

            playKeyTone(digit).then(function() {
                self.fcsCall.sendDTMF(digit);

                if(muted) {
                    self.unmute();
                }
            })
        };

        /**
         * Checks if call is established
         * @returns {boolean}   If call established or not
         */
        self.isActive = function() {
            return self.callState == fcs.call.States.IN_CALL || self.callState == fcs.call.States.RENEGOTIATION;
        };

        /**
         * Check if call is held
         * @returns {boolean} If call has been held or not
         */
        self.isOnHold = function() {
            var holdState = self.fcsCall.getHoldState();

            if(Utils.isNotNull(holdState) && (holdState == fcs.call.HoldStates.BOTH_HOLD || holdState == fcs.call.HoldStates.LOCAL_HOLD || holdState == fcs.call.HoldStates.REMOTE_HOLD)) {
                return true;
            }
            return false;
        };

        /**
         * Subscribe to call events
         * @param {string} event The event to subscribe to
         * @param {function} callback The function will be called when event will rise
         */
        self.on = function(event, callback) {
            EventEmitter.on(event, self, callback);
        };

        self.trigger = function(event) {
            EventEmitter.trigger(event, self, false, self);
        };

        self.failureReasons = {
            HOLD_FAILURE: "The call hold is failed",
            UNHOLD_FAILURE: "The call unhold is failed",
            START_CALL_FAILURE: "The call start is failed",
            ANSWER_CALL_FAILURE: "The call answer is failed"
        };

        attachListeners();
        checkVideoContainersExists();
    }

    return BaseCall;
});
