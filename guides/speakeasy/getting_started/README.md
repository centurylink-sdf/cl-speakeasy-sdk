# Getting Started with CenturyLink Speak Easy API JavaScript SDK

This introduction to CenturyLink Speak Easy API explains how you can get started.

## What is CenturyLink Speak Easy API?

CenturyLink Speak Easy API allows you to easily:

- Do audio and video calls anywhere in the world.
- Call to regular telephone numbers and mobile.

CenturyLink Speak Easy API JavaScript SDK allows you easily integrate above
features in your web application.

## Loading CenturyLink Speak Easy API

To load the APIs, include the following script in the header of your web page.

    <script type="text/javascript" src="https://onbui.ctl.io/dist/ctlapi-0.1.4.js"></script>

After that in **index.js** we could reference API Loader like in example below:

    var Ctl = CtlApiLoader;

Before moving forward and loading Speak Easy API we would like to check our authentication state:

    if ({@link Ctl.Auth#isAuthenticated Ctl.Auth.isAuthenticated()}) {
        // already authenticated, we can load Speak Easy now
    } else {
        // not authenticated, we need to follow authentication process
    }

Next, load the CenturyLink Speak Easy API with  {@link Ctl.ctlapiloader.CtlApiLoader#load Ctl.load(module, version)}, where

- **module** calls the specific API module you wish to use on your page - Speak Easy.
- **version** is the version number of the module you wish to load.

The example below loads the latest stable version of the Speak Easy API.

    {@link Ctl.ctlapiloader.CtlApiLoader#load Ctl.load}('SpeakEasy', '0.1.4', function(err, speakEasy) {
        if (err) {
            console.log('Error loading SpeakEasy', err);
        } else {
            console.log('Running SpeakEasy v' + {@link Ctl.speakeasy.SpeakEasy#version speakEasy.version()});
            // now you can use {@link Ctl.speakeasy.SpeakEasy Speak Easy API} features...
        }
    })

## Setting up CenturyLink Speak Easy API

Before doing calling with Speak Easy API we should init/setup it by calling
{@link Ctl.speakeasy.CallManager#setup speakEasy.CallManager.setup} method. For example:

    {@link Ctl.speakeasy.CallManager#setup speakEasy.CallManager.setup}({
        localVideoContainer: 'localVideo',
        remoteVideoContainer: 'remoteVideo'
    });

Where:

- **localVideoContainer** holds id of the HTML tag where local video should be placed
- **remoteVideoContainer** holds id of the HTML tag where remote video should be placed

## Making Call

Now we can try to make call. We can do it using {@link Ctl.speakeasy.CallManager#createCall speakEasy.CallManager.createCall} method.

    {@link Ctl.speakeasy.CallManager#createCall speakEasy.CallManager.createCall}(numToCall, false, function(call) {
        // now you can attach call listeners
        attachCallListeners(call); // this function described in the following guide section
    }, function() {
        console.log('Make new call failed!');
    });

Where:

- **numToCall** is desired callee number
- second parameter defines if video initially enabled or not.
In our case it is initially disabled. We are doing just audio call.

## Attach Call Listeners

To be able to see how call status changes we should attach call listeners to the created call.
We can do it with following approach:

    function attachCallListeners(call) {

        {@link Ctl.speakeasy.OutgoingCall#on call.on}('CALL_RINGING', function() {
            console.log('Ringing!');
        });

        {@link Ctl.speakeasy.OutgoingCall#on call.on}('CALL_STARTED', function() {
            console.log('Call is started!');
        });

        {@link Ctl.speakeasy.OutgoingCall#on call.on}('CALL_ENDED', function() {
            console.log('Call was ended on other side!');
        });

        {@link Ctl.speakeasy.OutgoingCall#on call.on}('CALL_HELD', function() {
            console.log('Call is held!');
        });

        {@link Ctl.speakeasy.OutgoingCall#on call.on}('CALL_REMOTE_HELD', function() {
            console.log('Call was held on other side!');
        });

        {@link Ctl.speakeasy.OutgoingCall#on call.on}('CALL_REJECTED', function() {
            console.log('Call was rejected!');
        });

    }

Now you can handle different state changes of the call and adjust your UI appropriately.

See How it Works in [Kitchensink](../kitchensink/www/index.html)

[Download Speak Easy Getting Started Example](guides/speakeasy_getting_started/getting_started.zip)

Continue reading [Answering an Incoming Call](#!/guide/speakeasy_answering)
