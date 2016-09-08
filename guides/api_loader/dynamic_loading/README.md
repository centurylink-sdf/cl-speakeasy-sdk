# Dynamic Loading

The standard {@link Ctl.ctlapiloader.CtlApiLoader#load Ctl.load} functionality loads the API(s) dynamically.
This is useful because you don't need the API to be available when the page loads.

To load the API dynamically, pass a callback function as a third parameter.
The below example loads the Speak Easy API, and specifies the callback function.

    {@link Ctl.ctlapiloader.CtlApiLoader#load Ctl.load}('SpeakEasy', '0.1.4', function(err, speakEasy) {
        // now you can use Speak Easy API features...
    })

Subsequent calls to load the API will immediately execute the provided callback,
so you don't have to worry about loading the same API more than once.
