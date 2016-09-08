# Making Video Call

This guide explains how you can do video call in your web application with
CenturyLink Speak Easy API.

## Video Call Prerequisites

To do video calls you should have camera available on your device.
Also client's (browser's) security settings should allow access to your camera.
Speak Easy JavaScript SDK uses WebRTC technology and

>it could be a simple matter for a website residing in a background tab to abuse
the user's trust (the user may not even realise a site harbours such a communication application).
WebRTC combats this by requiring the user to give explicit permission for the
camera or microphone to be used (both can be configured indivudally). It is
possible to ask the user for one-time or permanent access. It is not possible
for a WebRTC application to arbitrarily gain access or operate either device.
Furthermore, when either the microphone or camera is being used the client UI is
required to expressly show the user that the microphone or camera are being
operated. In Chrome, this takes the form of a red dot on any tab accessing a user's media.

{@img permissions.png Chrome UI Indicators}

Note: Nowadays most of the browsers doesn't even allow access to the microphone or
camera if it is not secured (TLS) connection. So you might see success running it on localhost,
but will get errors on non-secured http website.

Also there are few configuration options you should be aware of before making video call:

    {@link Ctl.speakeasy.CallManager#setup speakEasy.CallManager.setup}({
        localVideoContainer: 'localVideo',
        remoteVideoContainer: 'remoteVideo',
        videoQuality: '640x480'
    });

Where:

- **localVideoContainer** holds id of the HTML tag where local video should be placed
- **remoteVideoContainer** holds id of the HTML tag where remote video should be placed
- **videoQuality** is the resolution of local/sending video

If you do not specify selectors for local and remote video containers you will get an exception.
**videoQuality** set by default to **'640x480'**.

## Starting Video Call

To start call with video enable you should simply pass **true** as a second parameter in
{@link Ctl.speakeasy.CallManager#createCall speakEasy.CallManager.createCall} function.

For example:

    {@link Ctl.speakeasy.CallManager#createCall speakEasy.CallManager.createCall}(numToCall, true, function(call) {
        attachCallListeners(call);
    }, function() {
        console.log('Make new call failed!');
    });

The video will be inserted into **localVideoContainer** container, defined within setup.

## Upgrading from Audio to Video Call

If you already started audio call you can upgrade it to video call. It is simply
could be done by calling {@link Ctl.speakeasy.BaseCall#startVideoSend startVideoSend}
method of required call.

For example:

    var currentCall = {@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()};
    {@link Ctl.speakeasy.BaseCall#startVideoSend currentCall.startVideoSend} (
       function() {
           console.log('Video is started!');
       },
       function() {
           console.log("Video couldn't be started!");
       }
    );

Where:

- **{@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()}** returns currently ongoing call
- **{@link Ctl.speakeasy.BaseCall#startVideoSend currentCall.startVideoSend}** function to start video streaming with success
and failure callbacks

## Downgrading from Video to Audio Call

Turn off your local video you can simply with currentCall.stopVideoSend method.

For example:

    var currentCall = {@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()};
    {@link Ctl.speakeasy.BaseCall#stopVideoSend currentCall.stopVideoSend}(
       function() {
           console.log('Video is stopped!');
       },
       function() {
           console.log("Video couldn't be stopped!");
       }
    );

[Download Speak Easy Making Video Call Example](guides/speakeasy_video_call/video_call.zip)

Continue reading [Checking and Setting Call Features](#!/guide/speakeasy_call_features)
