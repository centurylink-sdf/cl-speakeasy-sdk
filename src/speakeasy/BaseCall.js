define([
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils'
], function (Config, Logger, Promise, Ajax, Utils) {

    var self = null;

    /**
     * @abstract
     * @class Ctl.speakeasy.BaseCall
     * Manage calls
     *
     * @requires Config
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function BaseCall() {

        self = this;

        if (this.constructor === BaseCall) {
            throw new Error("Can't instantiate abstract BaseCall!");
        }

        self.logger = new Logger('Call'); //TODO: get class name

        //the call object from FCS library
        self.internalCall = null;
        self.remoteStreamURL = null;
        self.localStreamURL = null;
    }

    function setInternalCall(call) {

        self.internalCall = call;

        //This function listens call state changes in JSL API level
        self.internalCall.onStateChange = function(state, statusCode) {
            //Add statusCode that returned from the server property to the call
            self.logger.log('status changed: ' + statusCode);

            onStateChange(state);
        };

        self.internalCall.onStreamAdded = function(streamURL) {
            onStreamAddedHandler(streamURL);
        };

        self.internalCall.onLocalStreamAdded = function(streamURL) {
            onLocalStreamAddedHandler(streamURL);
        };
    }

    /**
     *
     */
    function hangUp(successCallback, failureCallback) {

        self.internalCall.end(
            function () {

                removeLocalStream();
                removeRemoteStream();

                Utils.doCallback(successCallback);
            },
            function () {
                Utils.doCallback(failureCallback);
            });

    }

    /**
     *
     */
    function mute() {

    }

    /**
     *
     */
    function unmute() {

    }

    /**
     *
     */
    function hold() {

    }

    /**
     *
     */
    function unhold() {

    }

    /**
     *
     */
    function startVideo(successCallback, failureCallback) {



    }

    /**
     *
     */
    function stopVideo(successCallback, failureCallback) {

    }

    /**
     *
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
    function onStreamAddedHandler(streamURL) {

        self.logger.log("Outgoing call remote stream added: " + streamURL);
        self.logger.log('canReceiveVideo: ' + self.internalCall.canReceiveVideo());
        self.logger.log('canSendVideo: ' + self.internalCall.canSendVideo());

        if (streamURL) {
            self.internalCall.remoteStreamURL = streamURL;
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
            self.internalCall.localStreamURL = streamURL;
            setLocalStream(streamURL);
        }
    }

    function setRemoteStream(streamUrl) {

        removeRemoteStream();

        var videoContainer = document.getElementById(Config.callManager.remoteVideoContainer);

        var video = document.createElement('video');

        videoContainer.appendChild(video);

        video.pause();
        video.src = streamUrl;
        video.load();
        video.play();
    }

    function removeRemoteStream() {
        var videoContainer = document.getElementById(Config.callManager.remoteVideoContainer);
        var videoElements = videoContainer.getElementsByTagName('video');

        if(videoElements.length > 0) {

            //TODO: temp solution
            for(var i = videoElements.length - 1; i >= 0; i--) {
                videoContainer.removeChild(videoElements[i]);
            }
        }
    }

    function setLocalStream(streamUrl) {

        removeLocalStream();

        var videoContainer = document.getElementById(Config.callManager.localVideoContainer);
        var video = document.createElement('video');

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

    function onStateChange(state) {

    }

    BaseCall.prototype.hangUp = hangUp;
    BaseCall.prototype.mute = mute;
    BaseCall.prototype.unmute = unmute;
    BaseCall.prototype.hold = hold;
    BaseCall.prototype.unhold = unhold;
    BaseCall.prototype.startVideo = startVideo;
    BaseCall.prototype.stopVideo = stopVideo;
    BaseCall.prototype.setInternalCall = setInternalCall;

    return BaseCall;
});
