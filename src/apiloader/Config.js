/**
 * @class Ctl.apiloader.Config
 * @param  {[type]} [description]
 * @return {[type]} [description]
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
