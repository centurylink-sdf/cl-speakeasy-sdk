define([
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'fcs',
    'Ctl.speakeasy/CallInfo'
], function (
    Config,
    Logger,
    Promise,
    Ajax,
    Utils,
    fcs,
    CallInfo
) {

    var self = null;

    /**
     * @abstract
     * @class Ctl.speakeasy.BaseCall
     * A base class that implements call functionality
     *
     * @requires Config
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     * @requires CallInfo
     */
    function BaseCall(fcsCall) {

        self = this;

        if (this.constructor === BaseCall) {
            throw new Error("Can't instantiate abstract BaseCall!");
        }

        self.logger = new Logger(self.constructor.name);

        //the call object from FCS library
        self.fcsCall = fcsCall;

        self.remoteStreamURL = null;
        self.localStreamURL = null;
        self.callState = null;

        self.id = self.fcsCall.getId();

        attachListeners();
    }

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
        };

        self.fcsCall.onLocalStreamAdded = function(streamURL) {
            onLocalStreamAddedHandler(streamURL);
        };
    }

    /**
     * Gets call id
     * @returns {String} Unique identifier for the call
     */
    function getCallId() {
        return self.fcsCall.getId();
    }

    /**
     * End the call.
     * @param {Function} successCallback The callback function to be called after success
     * @param {Function} failureCallback The callback function to be called after failure
     */
    function hangUp(successCallback, failureCallback) {

        self.fcsCall.end(
            function () {
                removeAllVideoStreams();

                CallInfo.triggerEvent(CallInfo.events.ON_DELETE_CALL, self.id);

                Utils.doCallback(successCallback);
            },
            function () {
                Utils.doCallback(failureCallback);
            });
    }

    /**
     * Puts the speaker into mute.
     */
    function mute() {
        self.fcsCall.mute();
    }

    /**
     * Puts the speaker into unmute.
     */
    function unmute() {
        self.fcsCall.unmute();
    }

    /**
     * Holds the call.
     *
     * @param {Function} successCallback The callback function to be called after success
     * @param {Function} failureCallback The callback function to be called after failure
     */
    function hold(successCallback, failureCallback) {

        self.fcsCall.hold(
            function () {
                removeAllVideoStreams();
                Utils.doCallback(successCallback);
            },
            function () {
                Utils.doCallback(failureCallback);
            });
    }

    /**
     * Resume the call.
     *
     * @param {Function} successCallback The callback function to be called after success
     * @param {Function} failureCallback The callback function to be called after failure
     */
    function unhold(successCallback, failureCallback) {

        CallInfo.triggerEvent(CallInfo.events.BEFORE_UNHOLD, self.id);

        self.fcsCall.unhold(
            function () {
                showAllVideoStreams();
                Utils.doCallback(successCallback);
            },
            function () {
                Utils.doCallback(failureCallback);
            });
    }

    /**
     * Start the video for this call after the call is established.
     * @param {Function} successCallback The callback function to be called after success
     * @param {Function} failureCallback The callback function to be called after failure
     */
    function videoStart(successCallback, failureCallback) {

        self.fcsCall.videoStart(
            function () {
                Utils.doCallback(successCallback);
            },
            function () {
                Utils.doCallback(failureCallback);
            },
            Config.callManager.videoQuality
        );

    }

    /**
     * Stop the video for this call after the call is established.
     *
     * @param {Function} successCallback The callback function to be called after success
     * @param {Function} failureCallback The callback function to be called after failure
     */
    function videoStop(successCallback, failureCallback) {

        self.fcsCall.videoStop(
            function () {
                removeLocalStream();

                Utils.doCallback(successCallback);
            },
            function () {
                Utils.doCallback(failureCallback);
            });
    }

    /**
     * Send Dual-tone multi-frequency signaling
     * @param {String} tone Tone to be send as dtmf
     */
    function sendDTMF(tone) {
        self.fcsCall.sendDTMF(tone);
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

        if (streamURL && self.fcsCall.canReceiveVideo()) {
            self.remoteStreamURL = streamURL;
            setRemoteStream(streamURL);
        } else {
            var remoteUserDisabledVideo = !self.fcsCall.canReceiveVideo() && self.fcsCall.canSendVideo();
            if (remoteUserDisabledVideo) {
                self.logger.log('Remote user has disabled video feature');
            }
            removeRemoteStream();
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
     * Creates remote video element in DOM
     * @private
     */
    function showRemoteVideo() {
        if(self.remoteStreamURL && self.fcsCall.canReceiveVideo()) {
            setRemoteStream(self.remoteStreamURL);
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

            var videoContainer = document.getElementById(Config.callManager.remoteVideoContainer);

            var video = document.createElement('video');
            video.id = 'video_' + self.id;
            video.style.width = '100%';
            video.style.height = '100%';

            videoContainer.appendChild(video);

            video.pause();
            video.src = streamUrl;
            video.load();
            video.play();
        }
    }

    /**
     * Removes remote stream element from DOM
     * @private
     */
    function removeRemoteStream() {
        var videoContainer = document.getElementById(Config.callManager.remoteVideoContainer);
        var videoElement = document.getElementById('video_' + self.id);

        if(videoElement != null) {
            videoContainer.removeChild(videoElement);
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

            var videoContainer = document.getElementById(Config.callManager.localVideoContainer);
            var video = document.createElement('video');
            video.style.width = '100%';
            video.style.height = '100%';

            videoContainer.appendChild(video);

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

        var videoContainer = document.getElementById(Config.callManager.localVideoContainer);
        var videoElements = videoContainer.getElementsByTagName('video');

        if(videoElements.length > 0) {
            videoContainer.removeChild(videoElements[0]);
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

    /**
     * Checks if local video element exist in DOM
     * @private
     *
     * @param {String} streamUrl The local stream url
     * @returns {Boolean}
     */
    function isLocalVideoExist(streamUrl) {

        var isExist = false;
        var videoContainer = document.getElementById(Config.callManager.localVideoContainer);

        if(videoContainer) {
            var videoElements = videoContainer.getElementsByTagName('video');
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
        var videoElement = document.getElementById('video_' + self.id);

        if(videoElement != null) {
            isExist = videoElement.src == streamUrl
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

        switch(state) {
            case fcs.call.States.RINGING:
                self.logger.debug('status changed: RINGING');
                Utils.doCallback(self.onStateChanged, [self.events.CALL_RINGING]);
                break;
            case fcs.call.States.IN_CALL:
                self.logger.debug('status changed: IN_CALL');
                showAllVideoStreams();
                Utils.doCallback(self.onStateChanged, [self.events.CALL_STARTED]);
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

                break;
            case fcs.call.States.ON_REMOTE_HOLD:
                self.logger.debug('status changed: ON_REMOTE_HOLD');
                removeAllVideoStreams();
                Utils.doCallback(self.onStateChanged, [self.events.CALL_HELD]);
                break;
            case fcs.call.States.OUTGOING:
                self.logger.debug('status changed: OUTGOING');
                break;
            case fcs.call.States.RENEGOTIATION:
                self.logger.debug('status changed: RENEGOTIATION');
                break;
            case fcs.call.States.ENDED:
                self.logger.debug('status changed: ENDED');

                removeAllVideoStreams();
                CallInfo.triggerEvent(CallInfo.events.ON_DELETE_CALL, self.id);
                Utils.doCallback(self.onStateChanged, [self.events.CALL_ENDED]);

                break;
            case fcs.call.States.REJECTED:
                self.logger.debug('status changed: REJECTED');
                removeAllVideoStreams();
                Utils.doCallback(self.onStateChanged, [self.events.CALL_REJECTED]);
                break;
            case fcs.call.States.OUTGOING:
                self.logger.debug('status changed: OUTGOING');
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
     * Checks if call is established
     * @returns {boolean} If call established or not
     */
    function isActive() {
        return self.callState == fcs.call.States.IN_CALL || self.callState == fcs.call.States.RENEGOTIATION;
    }

    BaseCall.prototype.hangUp = hangUp;
    BaseCall.prototype.mute = mute;
    BaseCall.prototype.unmute = unmute;
    BaseCall.prototype.hold = hold;
    BaseCall.prototype.unhold = unhold;
    BaseCall.prototype.videoStart = videoStart;
    BaseCall.prototype.videoStop = videoStop;
    BaseCall.prototype.getCallId = getCallId;
    BaseCall.prototype.isActive = isActive;
    BaseCall.prototype.sendDTMF = sendDTMF;

    /**
     * @event
     * Sets the handler for listening the call state change.
     */
    BaseCall.prototype.onStateChanged = null;


    /**
     * @enum
     * The state events of the Call
     */
    BaseCall.prototype.events = {
        CALL_RINGING: 0,
        CALL_STARTED: 1,
        CALL_ENDED: 2,
        CALL_HELD: 3,
        CALL_REJECTED: 4
    };

    BaseCall.prototype.failureReasons = {
        HOLD_FAILURE: "The call hold is failed",
        UNHOLD_FAILURE: "The call unhold is failed",
        START_CALL_FAILURE: "The call start is failed",
        ANSWER_CALL_FAILURE: "The call answer is failed"
    };

    return BaseCall;
});
