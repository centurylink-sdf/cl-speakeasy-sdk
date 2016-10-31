/**
 * @class Ctl.ctlapiloader.Config
 * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
 * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
 * @private
 *
 * List of configuration options for Ctl.ctlapiloader.CtlApiLoader.
 */
define({
    useConfig: 'intg',
    settings: {
        intg: {
            'ctlServerURL': 'https://lab.iaf.centurylink.com:8889'
        },
        cert: {
            'ctlServerURL': 'https://lab.af.centurylink.com:443'
        },
        'loginURI': '/token',
        'getSubscriptionServiceIdentitiesURI': '/SpeakEasyProvision/v1/util/products',
        'getSubscriptionServiceCatalogURI': '/SpeakEasyProvision/v1/serviceProfile/{publicId}'
    }
});
