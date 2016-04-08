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

        attachListeners();
    }

    function attachListeners() {

        //This function listens call state changes in JSL API level
        self.fcsCall.onStateChange = function(state, statusCode) {
            //Add statusCode that returned from the server property to the call
            self.logger.log('status changed: ' + statusCode);

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
                removeLocalStream();
                removeRemoteStream();

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
                removeRemoteStream();

                Utils.doCallback(successCallback);
            },
            function () {
                Utils.doCallback(failureCallback);
            });

    }

    function onStreamAddedHandler(streamURL) {

        self.logger.log("Outgoing call remote stream added: " + streamURL);
        self.logger.log('canReceiveVideo: ' + self.internalCall.canReceiveVideo());
        self.logger.log('canSendVideo: ' + self.internalCall.canSendVideo());

        if (streamURL) {
            self.remoteStreamURL = streamURL;
            setRemoteStream(streamURL);
        } else {
            var remoteUserDisabledVideo = !self.internalCall.canReceiveVideo() && self.internalCall.canSendVideo();
            if (remoteUserDisabledVideo) {
                self.logger.log('Remote user has disabled video feature');
            }
        }
    }

    function onLocalStreamAddedHandler(streamURL) {

        self.logger.log("local stream added: " + streamURL);
        self.logger.log('canReceiveVideo: ' + self.internalCall.canReceiveVideo());
        self.logger.log('canSendVideo: ' + self.internalCall.canSendVideo());

        if (streamURL) {
            self.localStreamURL = streamURL;


            setLocalStream(streamURL);
        }
    }

    function setRemoteStream(streamUrl) {

        removeRemoteStream();

        var videoContainer = document.getElementById(Config.callManager.remoteVideoContainer);

        var video = document.createElement('video');
        video.id = 'video_' + self.getCallId();
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
        var videoElements = videoContainer.getElementsById('video_' + self.getCallId());

        if(videoElements.length > 0) {
            for(var i = videoElements.length - 1; i >= 0; i--) {
                videoContainer.removeChild(videoElements[i]);
            }
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
                break;
            case fcs.call.States.IN_CALL:

                tils.doCallback(self.onStateChanged, [null, self.events.CALL_STARTED]);
                break;
            case fcs.call.States.CALL_IN_PROGRESS:
                break;
            case fcs.call.States.INCOMING:
                break;
            case fcs.call.States.ANSWERING:
                break;
            case fcs.call.States.JOINED:
                break;
            case fcs.call.States.ON_HOLD:
                Utils.doCallback(self.onStateChanged, [null, self.events.CALL_HELD]);
                break;
            case fcs.call.States.ON_REMOTE_HOLD:
                Utils.doCallback(self.onStateChanged, [null, self.events.CALL_HELD]);
                break;
            case fcs.call.States.OUTGOING:
                break;
            case fcs.call.States.RENEGOTIATION:
                break;
            case fcs.call.States.ENDED:

                removeAllVideoStreams();
                Utils.doCallback(self.onStateChanged, [null, self.events.CALL_ENDED]);

                break;
            case fcs.call.States.REJECTED:

                Utils.doCallback(self.onStateChanged, [null, self.events.CALL_REJECTED]);
                break;
            case fcs.call.States.OUTGOING:
                break;
            case fcs.call.States.EARLY_MEDIA:
                break;
            case fcs.call.States.TRANSFERRED:
                break;
            case fcs.call.States.TRANSFER_FAILURE:
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
        CALL_STARTED: 0,
        CALL_ENDED: 1,
        CALL_HELD: 2,
        CALL_REJECTED: 3
    };

    return BaseCall;
});
