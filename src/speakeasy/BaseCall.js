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

    function attachListeners() {

        //This function listens call state changes in JSL API level
        self.fcsCall.onStateChange = function(state, statusCode) {
            //Add statusCode that returned from the server property to the call
            processStateChange(state);
        };

        self.fcsCall.onStreamAdded = function(streamURL) {
            onStreamAddedHandler(streamURL);
        };

        self.fcsCall.onLocalStreamAdded = function(streamURL) {
            onLocalStreamAddedHandler(streamURL);
        };
    }

    function getCallId() {
        return self.fcsCall.getId();
    }

    /**
     * End the call.
     */
    function hangUp(successCallback, failureCallback) {

        self.fcsCall.end(
            function () {
                removeAllVideoStreams();

                CallInfo.triggerEvent(CallInfo.events.ON_DELETE_CALL, self.getCallId());

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
     * @param successCallback
     * @param failureCallback
     */
    function hold(successCallback, failureCallback) {

        self.fcsCall.hold(
            function () {
                Utils.doCallback(successCallback);
            },
            function () {
                Utils.doCallback(failureCallback);
            });
    }

    /**
     * Resume the call.
     *
     * @param successCallback
     * @param failureCallback
     */
    function unhold(successCallback, failureCallback) {
        self.fcsCall.unhold(
            function () {
                Utils.doCallback(successCallback);
            },
            function () {
                Utils.doCallback(failureCallback);
            });
    }

    /**
     * Start the video for this call after the call is established.
     * @param successCallback
     * @param failureCallback
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
     * @param successCallback
     * @param failureCallback
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

    function onStreamAddedHandler(streamURL) {

        self.logger.log("Outgoing call remote stream added: " + streamURL);
        self.logger.log('canReceiveVideo: ' + self.fcsCall.canReceiveVideo());
        self.logger.log('canSendVideo: ' + self.fcsCall.canSendVideo());

        if (streamURL) {
            self.remoteStreamURL = streamURL;
            setRemoteStream(streamURL);
        } else {
            var remoteUserDisabledVideo = !self.fcsCall.canReceiveVideo() && self.fcsCall.canSendVideo();
            if (remoteUserDisabledVideo) {
                self.logger.log('Remote user has disabled video feature');
            }
        }
    }

    function onLocalStreamAddedHandler(streamURL) {

        self.logger.log("local stream added: " + streamURL);
        self.logger.log('canReceiveVideo: ' + self.fcsCall.canReceiveVideo());
        self.logger.log('canSendVideo: ' + self.fcsCall.canSendVideo());

        if (streamURL) {
            self.localStreamURL = streamURL;
            setLocalStream(streamURL);
        }
    }

    function setRemoteStream(streamUrl) {

        removeRemoteStream();

        var videoContainer = document.getElementById(Config.callManager.remoteVideoContainer);

        var video = document.createElement('video');
        video.id = 'video_' + self.id;
        video.css.width = '100%';
        video.css.height = '100%';

        videoContainer.appendChild(video);

        video.pause();
        video.src = streamUrl;
        video.load();
        video.play();
    }

    function removeRemoteStream() {
        var videoContainer = document.getElementById(Config.callManager.remoteVideoContainer);
        var videoElement = document.getElementById('video_' + self.id);

        if(videoElement != null) {
            videoContainer.removeChild(videoElement);
        }
    }

    function setLocalStream(streamUrl) {

        removeLocalStream();

        var videoContainer = document.getElementById(Config.callManager.localVideoContainer);
        var video = document.createElement('video');
        video.css.width = '100%';
        video.css.height = '100%';

        videoContainer.appendChild(video);

        video.src = streamUrl;
        video.pause();
        video.load();
        video.play();
    }

    function removeLocalStream() {

        var videoContainer = document.getElementById(Config.callManager.localVideoContainer);
        var videoElements = videoContainer.getElementsByTagName('video');

        if(videoElements.length > 0) {
            videoContainer.removeChild(videoElements[0]);
        }
    }

    function removeAllVideoStreams() {
        removeLocalStream();
        removeRemoteStream();
    }

    function toggleLocalStream() {

    }

    function toggleRemoteStream() {

    }

    function processStateChange(state) {
        self.callState = state;

        switch(state) {
            case fcs.call.States.RINGING:
                self.logger.debug('status changed: RINGING');
                Utils.doCallback(self.onStateChanged, [self.events.CALL_RINGING]);
                break;
            case fcs.call.States.IN_CALL:
                self.logger.debug('status changed: IN_CALL');
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
                Utils.doCallback(self.onStateChanged, [self.events.CALL_HELD]);
                break;
            case fcs.call.States.ON_REMOTE_HOLD:
                self.logger.debug('status changed: ON_REMOTE_HOLD');
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

                //removeAllVideoStreams();
                Utils.doCallback(self.onStateChanged, [self.events.CALL_ENDED]);

                break;
            case fcs.call.States.REJECTED:
                self.logger.debug('status changed: REJECTED');

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

    BaseCall.prototype.hangUp = hangUp;
    BaseCall.prototype.mute = mute;
    BaseCall.prototype.unmute = unmute;
    BaseCall.prototype.hold = hold;
    BaseCall.prototype.unhold = unhold;
    BaseCall.prototype.videoStart = videoStart;
    BaseCall.prototype.videoStop = videoStop;
    BaseCall.prototype.getCallId = getCallId;

    /**
     * @event
     * Raised when call state is changed
     *
     */
    BaseCall.prototype.onStateChanged = null;

    /**
     * Enum call states.
     * @readonly
     * @enum {number}
     */
    BaseCall.prototype.events = {
        CALL_RINGING: 0,
        CALL_STARTED: 1,
        CALL_ENDED: 2,
        CALL_HELD: 3,
        CALL_REJECTED: 4
    };

    return BaseCall;
});
