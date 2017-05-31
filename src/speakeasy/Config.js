/**
 * @class Ctl.speakeasy.Config
 * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
 * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
 * @private
 *
 * List of configuration options for Ctl.speakeasy.CtlApiLoader.
 */
define({
    useConfig: 'cert',
    settings: {
        'intg': {
            'ctlServerURL': 'https://lab.iaf.centurylink.com:8889',
            'ctlIdServerURL': 'https://intg.iaf.centurylink.com'
        },
        'cert': {
            'ctlServerURL': 'https://lab.af.centurylink.com:8889',
            'ctlIdServerURL': 'https://lab.af.centurylink.com'
        },
        'prod': {
            'ctlServerURL': 'https://live.af.centurylink.com:8889',
            'ctlIdServerURL': 'https://live.af.centurylink.com'
        },
        'OAuthUserDomains': ['@instalink', '@consumer', '@ctlvoip'],
        'loginURI': '/token',
        'ctlIdLoginURI': '/WEBRTC/RequestServletRWS/restful/PreRegister/WEB/v3/login?servicecatalog=true',
        'getSubscriptionServiceIdentitiesURI': '/SpeakEasyProvision/v1/util/products',
        'getSubscriptionServiceCatalogURI': '/SpeakEasyProvision/v1/serviceProfile/{publicId}',

        'Instalink': {
            'getSubscriptionServiceIdentitiesURI': '/CVoipON/api/v1/communicator/products',
            'getSubscriptionServiceCatalogURI': '/CVoipON/api/v1/communicator/profile/{publicId}'
        },

        'subscribeServiceURI': '/{serviceName}/{identity}@{domain}/subscription',
        'unsubscribeServiceURI': '/SpeakEasy/{identity}@ctlvoip.lab.centurylink/subscription/{channelId}',
        'getInstantMessageURI': '/rest/version/{versionId}/user/{userId}/notification/{notificationChannelId}',
        'postImByUseridURI': '/rest/version/{versionId}/user/{userId}/instantmessage',
        'postImByDeviceidURI': '/rest/version/{versionId}/device/{deviceId}/instantmessage',
        'defaultOutgoingCallDomain': 'ctlvoip.lab.centurylink',
        'proxyForURLPatterns': ['/rest/version/[0-9]+/user','/rest/version/latest'],
        'SEProxyPrependURL': '/SpeakEasy/'
    },
    'fcs-api': {
        'notificationType': 'websocketonly',
        'callAuditTimer': '30000',
        'codecsToRemove': ['103', '104', '105', '106', '107'],
        'clientControlled': 'true',
        'services':['CallControl', 'custom'],
        'earlyMedia': true
    },
    'fcs-servers': {
        'intg': {
            'protocol': 'https',
            'restUrl': 'lab.iaf.centurylink.com',
            'restPort': '8889',
            'websocketProtocol': 'wss'
        },
        'cert': {
            'protocol': 'https',
            'restUrl': 'lab.af.centurylink.com',
            'restPort': '8889',
            'websocketProtocol': 'wss'
        },
        'prod': {
            'protocol': 'https',
            'restUrl': 'live.af.centurylink.com',
            'restPort': '443',
            'websocketProtocol': 'wss'
        }
    },
    callManager: {
        'localVideoContainer': 'speakeasy_localVideoContainer',
        'remoteVideoContainer': 'speakeasy_remoteVideoContainer',
        'videoQuality': '640x480',
        'baseToneUrl': '../dist/tones'
    }
});
