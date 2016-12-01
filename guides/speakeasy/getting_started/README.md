# Getting Started with CenturyLink Speak Easy API JavaScript SDK

This introduction to CenturyLink Speak Easy API explains how you can get started.

## What is CenturyLink Speak Easy API?

CenturyLink Speak Easy API allows you to easily:

- Do audio and video calls anywhere in the world.
- Call to regular telephone numbers and mobile.

CenturyLink Speak Easy API JavaScript SDK allows you easily integrate above
features in your web application.

## Include CenturyLink SpeakEasy JavaScript SDK in your web application

To include SpeakEasy JavaScript library you simply need to define it on a page:

    <script type="text/javascript" src="https://onbui.ctl.io/dist/speakeasy-0.1.4.js"></script>

Once downloaded, it will be available under global variable **SpeakEasy**.


## Authenticating with CenturyLink Speak Easy JavaScript SDK

CenturyLink Speak Easy JavaScript SDK allows you to authenticate in CenturyLink
service and re-use it with any other exposed service. All the authentication methods
placed under {@link Ctl.Auth SpeakEasy.Auth} namespace.

### Checking if Already Authenticated

But before doing authentication you would want to check if client already authenticated.
You can do it with {@link Ctl.Auth#isAuthenticated SpeakEasy.Auth.isAuthenticated()} method. It simply returns **true** or **false**.

### Login

You can login using {@link Ctl.Auth#login SpeakEasy.Auth.login} method. There are only 3 parameters
you should pass:

- username
- password
- callback to handle successful or failed response

For example:

    {@link Ctl.Auth#login SpeakEasy.Auth.login}(username, password, function(error, response) {
        if (!error && response) {
            console.info('Successfully authenticated. Exposing subscription services selection.');
            // now you can work with list of subscribed services
        } else {
            console.error('Authentication failed: ', error);
        }
    });

If the login was successful you should be able to see list of available for this
account products in the response. For example:

    {  
       "Products":{  
          "7202839244":[  
             "SpeakEasy"
          ]
       }
    }

Where:

- **7202839244** is public ID
- **SpeakEasy** is product/service name

Now you can select required product (subscribed service) from the list and set
it to use in your client with {@link Ctl.Auth#setDefaultSubscriptionService  SpeakEasy.Auth.setDefaultSubscriptionService} method.

### Select Subscription Services

There are only 3 parameters required to pass into {@link Ctl.Auth#setDefaultSubscriptionService SpeakEasy.Auth.setDefaultSubscriptionService} method:

- **serviceName** represents name of CenturyLink service we are going to use
- **publicId** represents unique ID of the authenticated user (i.e. phone number or SIP URI)
- **callback** to handle successful or failed response

For example:

    {@link Ctl.Auth#setDefaultSubscriptionService SpeakEasy.Auth.setDefaultSubscriptionService}(serviceName, publicId, function(error, response) {
        if (!error && response) {
            console.info('Successfully set default service.');
            // now you are authenticated and set default product for usage
        } else {
            console.error('Service subscription details retrieval failed: ', error);
        }

    });

Now we can continue and use CenturyLink SpeakEasy APIs without additional authentication steps.

## Standalone Usage of the CenturyLink Speak Easy API

If you already have authentication mechanism implemented, you can use SpeakEasy without
embedded authentication mechanism.

You will need to pass access token, refresh token and publicId (moniker) to
initialize SpeakEasy like in example below:

    var accessToken = '77c8787aff45466a28082b6647c90e38389c2f7e936f630cbb7ce553b4aadf95';
    var refreshToken = '77c8787aff45466a28082b6647c90e38389c2f7e936f630cbb7ce553b4aadf95';
    var publicId = '3031234567';

    SpeakEasy.init(accessToken, refreshToken, publicId, function(error) {
        if (!error) {
            console.log('SpeakEasy has been successfully initialized!');
        } else {
            console.error('SpeakEasy could not be initialized!');
        }
    });


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
