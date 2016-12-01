# CenturyLink SpeakEasy JavaScript SDK

A CenturyLink SpeakEasy API JavaScript SDK. Check out the demo in example/index.html

## Installation

```
npm install cl-speakeasy-sdk
```

## Documentation

See the [documentation](https://speakeasy.veuxdu.centurylink.com/SpeakEasyDemo/docs)
for CenturyLink SpeakEasy JavaScript SDK Get Started and Guides. Also you
can run `gulp doc` and see generated documentation at /docs/.

## Build process details

### Build process requirements
* [Node.js](https://nodejs.org/) 0.12 (or later)
* [r.js](https://github.com/jrburke/r.js)
* [Gulp](http://gulpjs.com/)

To build the CenturyLink SpeakEasy JavaScript SDK source, issue the following commands:
* open the command line and switch into the project folder
* ```npm install```
* ```sudo npm install -g gulp```
* ```gulp``` to see the list of available tasks

### Essential gulp tasks

* ```gulp build``` dumps a plain and a minified file from all files in the folder ```src``` into the folder ```dist```.
* ```gulp clean``` removes all files in the folder ```dist```.
* ```gulp doc``` generates JSDuck documentation in the folder ```docs```.
* ```gulp test``` runs the tests and linting for all files in the folder ```src```.
* ```gulp bump-patch``` increases the version by ```0.0.1``` for the last git commit and pushes the new tag to the remote repository.
* ```gulp bump-minor``` increases the version by ```0.1.0``` for the last git commit and pushes the new tag to the remote repository.
* ```gulp bump-major``` increases the version by ```1.0.0``` for the last git commit and pushes the new tag to the remote repository.

## Configuration details

Please see the [Getting Started](https://speakeasy.veuxdu.centurylink.com/SpeakEasyDemo/docs/#!/guide/speakeasy_getting_started)
section for details and examples of how to configure the CenturyLink SpeakEasy
JavaScript SDK.

## Example

This example shows some of the functionality supported by the CenturyLink SpeakEasy JavaScript SDK.

index.html:
``` html
<!DOCTYPE html>
<html>
<head>
    <title>Usage example for the CenturyLink SpeakEasy JavaScript SDK</title>
    <script type="text/javascript" src="speakeasy-0.1.4.js"></script>
</head>
<body>

    <script type="text/javascript" src="index.js"></script>

</body>
</html>

```

index.js:
``` javascript
var username = 'joe';
var password = 'some-secret-pass';

CtlSpeakEasy.Auth.login(username, password, function(error, response) {
    if (!error && response) {
        console.info('Successfully authenticated. Exposing subscription services selection.');
    } else {
        console.error('Authentication failed: ', error);
    }
});

//...

CtlSpeakEasy.CallManager.createCall('3031234567', false, function(call) {
    console.info('Calling 3031234567...');
}, function() {
    console.error('Make new call failed!');
});


```

## License

This project is licensed under the [Apache License v2.0](http://www.apache.org/licenses/LICENSE-2.0.html).
