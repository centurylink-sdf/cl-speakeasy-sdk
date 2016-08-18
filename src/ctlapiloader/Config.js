/**
 * @class Ctl.ctlapiloader.Config
 *
 * List of configuration options for Ctl.ctlapiloader.CtlApiLoader.
 */
define({
    settings: {
        'ctlServerURL': 'https://lab.iaf.centurylink.com:8889',
        'loginURI': '/token',
        'getSubscriptionServiceIdentitiesURI': '/SpeakEasyProvision/v1/util/products',
        'getSubscriptionServiceCatalogURI': '/SpeakEasyProvision/v1/serviceProfile/{publicId}'
    },
    services: {
        'speakEasyServiceName': 'SpeakEasy',
        'courierServiceName': 'Courier'
    }
});
