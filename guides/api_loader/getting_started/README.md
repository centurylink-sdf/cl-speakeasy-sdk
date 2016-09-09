# Getting Started with CenturyLink API Loader

This introduction to CenturyLink API Loader explains how you can get started.

## What is CenturyLink API Loader?

CenturyLink API loader allows you to easily import one or more [APIs](#!/guide/api_loader_available_apis), and specify additional settings (such as language, location, API version, etc.) applicable to your needs.

## Introduction to Loading CenturyLink APIs

To load the APIs, include the following script in the header of your web page.

    <script data-main="js/index" src="https://onbui.ctl.io/dist/ctlapi.js"></script>

In current version of CenturyLink API loader there is built-in [RequireJS](http://requirejs.org/) library.

> *RequireJS is a JavaScript file and module loader. It is optimized for in-browser use, but it can be used in other JavaScript environments, like Rhino and Node. Using a modular script loader like RequireJS will improve the speed and quality of your code.*

<br />
As you can se we are referencing **data-main="js/index"** as a main entry point of our application. The content of the **js/index.js** file is following:

    require(['./common'], function (common) {
        require(['app/index']);
    });

As you can see here we included **common.js** module, where we configure RequireJS. **common.js** has such content:

    require.config({
        paths: {
          "app": "../app",
          "CtlApiLoader": "https://onbui.ctl.io/dist/ctlapi"
        }
    });

Where we define:

- main application reference: **../app**
- CenturyLink Api Loader reference: **"CtlApiLoader": "https://onbui.ctl.io/dist/ctlapi"**

After that in **app/index.js** we could require API Loader like in example below:

    define(['CtlApiLoader'], function(Ctl) {
        // now you can use {@link Ctl.ctlapiloader.CtlApiLoader API Loader} functions of Ctl object
    });

Next, load the CenturyLink API with  {@link Ctl.ctlapiloader.CtlApiLoader#load Ctl.load(module, version)}, where

- **module** calls the specific API module you wish to use on your page.
- **version** is the version number of the module you wish to load.

The example below loads the latest stable version of the Speak Easy API.

    {@link Ctl.ctlapiloader.CtlApiLoader#load Ctl.load}('SpeakEasy', '0.1.4', function(err, speakEasy) {
        // now you can use {@link Ctl.speakeasy.SpeakEasy Speak Easy API} features...
    })

After you call {@link Ctl.ctlapiloader.CtlApiLoader#load Ctl.load}, you can use all of the loaded modules in your web page.
For specific examples of each API, visit the documentation specific to the desired
[API](#!/guide/api_loader_available_apis) (see links in the left navigation).

## Checking CenturyLink API Loader Version

You can check CenturyLink API Loader version itself. You just need to call {@link Ctl.ctlapiloader.CtlApiLoader#getVersion Ctl.getVersion()} like in the example below:

    console.log('Running CtlApi v' + {@link Ctl.ctlapiloader.CtlApiLoader#getVersion Ctl.getVersion()});

In response you will see something like **Running CtlApi v0.1.4**

## Authenticating with CenturyLink API Loader

CenturyLink API Loader JavaScript SDK allows you to authenticate in CenturyLink
service and re-use it with any other exposed service. All the authentication methods
placed under {@link Ctl.Auth Ctl.Auth} namespace.

### Checking if Already Authenticated

But before doing authentication you would want to check if client already authenticated.
You can do it with {@link Ctl.Auth#isAuthenticated Ctl.Auth.isAuthenticated()} method. It simply returns **true** or **false**.

### Login

You can login using {@link Ctl.Auth#login Ctl.Auth.login} method. There are only 3 parameters
you should pass:

- username
- password
- callback to handle successful or failed response

For example:

    {@link Ctl.Auth#login Ctl.Auth.login}(username, password, function(error, response) {
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
it to use in your client with {@link Ctl.Auth#setDefaultSubscriptionService  Ctl.Auth.setDefaultSubscriptionService} method.

### Select Subscription Services

There are only 3 parameters required to pass into {@link Ctl.Auth#setDefaultSubscriptionService Ctl.Auth.setDefaultSubscriptionService} method:

- **serviceName** represents name of CenturyLink service we are going to use
- **publicId** represents unique ID of the authenticated user (i.e. phone number or SIP URI)
- **callback** to handle successful or failed response

For example:

    {@link Ctl.Auth#setDefaultSubscriptionService Ctl.Auth.setDefaultSubscriptionService}(serviceName, publicId, function(error, response) {
        if (!error && response) {
            console.info('Successfully set default service.');
            // now you are authenticated and set default product for usage
        } else {
            console.error('Service subscription details retrieval failed: ', error);
        }

    });

Now we can continue and use other CenturyLink APIs without additional authentication steps.

See How it Works in [Kitchensink](../kitchensink/www/index.html)

Check out [Speak Easy Getting Started](#!/guide/speakeasy_getting_started) for additional reading.
