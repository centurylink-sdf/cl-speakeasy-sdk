/**
 * @class Ctl.ctlapiloader.Config
 *
 * List of configuration options for Ctl.ctlapiloader.CtlApiLoader.
 */
define({
    settings: {
        'ctlServerURL': 'https://auth.veuxdu.centurylink.com',
        'loginURI': '/AuthServer/token',
        'getSubscriptionServiceIdentitiesURI': '/ServiceCatalog/serviceList/RhWnYptT',
        'getSubscriptionServiceCatalogURI': '/ServiceCatalog/{service}/{publicId}'
    },
    services: {
        'speakEasyServiceName': 'SpeakEasy',
        'courierServiceName': 'Courier'
    }
});
