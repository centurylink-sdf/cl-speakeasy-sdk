# Answering an Incoming Call

This guide explains how you can handle incoming call in your web application with
CenturyLink Speak Easy API.

## Setting Handler for Incoming Call

In [Getting Started](#!/guide/speakeasy_getting_started) chapter we already
discussed how to initiate a call. Now it is good time to show how to handle incoming call.
It is very simple procedure. We only should define {@link Ctl.speakeasy.CallManager#onCallReceived speakEasy.CallManager.onCallReceived} handler.

For example:

    {@link Ctl.speakeasy.CallManager#onCallReceived speakEasy.CallManager.onCallReceived} = function (call) {

        // attach call listeners described in chapter Getting Started
        attachCallListeners(call);

        var callerInfo = {@link Ctl.speakeasy.IncomingCall#getCallerInfo call.getCallerInfo()};

        // Show confirm dialog box for incoming call
        var r = confirm('Incoming call from '+ callerInfo.name +'(' + callerInfo.number + ')! Would you like to answer?');
        if (r === true) {
            // Answering on the incoming call
            {@link Ctl.speakeasy.IncomingCall#answer call.answer}(function() {
                console.log('Call is answered!');
            }, function() {
                console.log("Call couldn't be answered!");
            });
        } else {
            // Rejecting the incoming call
            {@link Ctl.speakeasy.IncomingCall#reject call.reject}(function() {
                console.log("Call has been successfully rejected!");
            }, function() {
                console.log("Call couldn't be rejected!");
            });
        }
    };

Where:

- **attachCallListeners(call)** is function where we attach call listeners to
the incoming call same way we did for outgoing call
- **{@link Ctl.speakeasy.IncomingCall#getCallerInfo call.getCallerInfo()}** retrieves information about caller (i.e. caller name or phone number)
- **{@link Ctl.speakeasy.IncomingCall#answer call.answer}** answers the incoming call
- **{@link Ctl.speakeasy.IncomingCall#reject call.reject}** just rejecting the incoming call

Here is an example of confirmation dialog for incoming call:
{@img incoming.png Speak Easy Incoming Call}

That is it that simple.

[Download Speak Easy Answering an Incoming Call Example](guides/speakeasy_answering/answering.zip)

Continue reading [Making Video Call](#!/guide/speakeasy_video_call)
