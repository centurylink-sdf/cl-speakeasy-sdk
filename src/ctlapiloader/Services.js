/**
 * @class Ctl.ctlapiloader.Services
 * @private
 *
 * List of API JavaScript libraries available to load by Ctl.ctlapiloader.CtlApiLoader.
 */
require.config({
    "paths": {
        "SpeakEasy": "http://localhost:8000/dist/speakeasy"
        // "SpeakEasy": "https://speakeasy.veuxdu.centurylink.com/SpeakEasyDemo/dist/speakeasy"
    }
});
