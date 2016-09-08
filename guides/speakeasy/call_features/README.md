# Checking and Setting Call Features

This guide explains how you can hang up, mute/un-mute, hold/un-hold etc. your call.

## Hang up the Call
To hang up the call you can simply call {@link Ctl.speakeasy.BaseCall#hangUp hangUp} method of the call object.For example:

    var currentCall = {@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()};
    {@link Ctl.speakeasy.BaseCall#hangUp currentCall.hangUp}(function() {
        console.log('Call is ended!');
    }, function() {
        console.log("Call couldn't be ended!");
    });

## Hold/un-hold the Call
You can put the call on hold by calling {@link Ctl.speakeasy.BaseCall#hold hold} method of the call object.

For example:

    var currentCall = {@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()};
    {@link Ctl.speakeasy.BaseCall#hold currentCall.hold}(
        function() {
            console.log("Call is held!");
        },
        function() {
            console.log("Call couldn't be held!");
        }
    );

And similarly you can do {@link Ctl.speakeasy.BaseCall#unhold un-hold}:

    var currentCall = {@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()};
    {@link Ctl.speakeasy.BaseCall#unhold currentCall.unhold}(
        function() {
            console.log("Call is resumed!");
        },
        function() {
            console.log("Call couldn't be resumed!");
        }
    );

### Checking if the Call is on Hold

Also you can check if call is already on hold:

    var currentCall = {@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()};
    if ({@link Ctl.speakeasy.BaseCall#isOnHold currentCall.isOnHold()}) {
        console.log('Call is on hold!');
    } else {
        console.log('Call is active!');
    }

## Mute/un-mute the Call

To mute the call you can call synchronous function {@link Ctl.speakeasy.BaseCall#mute mute()}. It will stop sending
audio stream.

    var currentCall = {@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()};
    {@link Ctl.speakeasy.BaseCall#mute currentCall.mute()};
    console.log('Call is muted!');

And to {@link Ctl.speakeasy.BaseCall#unmute un-mute} you can simply do:

    var currentCall = {@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()};
    {@link Ctl.speakeasy.BaseCall#unmute currentCall.unmute()};
    console.log('Call is unmuted!');

## Send Dual-Tone Multi-Frequency Signaling

In addition you can send DTMF with Speak Easy API.

>Dual-tone multi-frequency signaling (DTMF) is an in-band telecommunication
signaling system using the voice-frequency band over telephone lines between
telephone equipment and other communications devices and switching centers.

<br />
To better understand how we can use it, let's explain some code.

Imagine we have text input on our page:

    <input id="confDestination" type="text" />

We can attache **keydown** event listener on the field, grab keyboard key code
and send it as DTMF signal.

For example:

    var confDestination = document.getElementById('confDestination');
    confDestination.addEventListener('keydown', function (e) {
        var keyCode = e.keyCode;
        var currentCall = {@link Ctl.speakeasy.CallManager#getCurrentCall speakEasy.CallManager.getCurrentCall()};
        if (currentCall) {
            var keyStr = String.fromCharCode(keyCode);
            var regexKey = /[0-9]|[#]|[*]/;
            if (regexKey.test(keyStr)) {
                {@link Ctl.speakeasy.BaseCall#sendDigits currentCall.sendDigits(keyStr)};
            }

        }
    },
    false);

Here we are grabbing keyCode, checking if it is a digit, asterisk or hashtag and sending
with help of {@link Ctl.speakeasy.BaseCall#sendDigits currentCall.sendDigits(keyStr)} function.

That is it.

See How it Works in [Kitchensink](/kitchensink/www/index.html)
