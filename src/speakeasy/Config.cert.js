/**
 * @class Ctl.speakeasy.Config
 * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
 * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
 * @private
 *
 * List of configuration options for Ctl.speakeasy.CtlApiLoader.
 */
define({
    useCertification: true,
    settings: {
        'subscribeServiceURI': '/{serviceName}/{identity}@{domain}/subscription',
        'unsubscribeServiceURI': '/SpeakEasy/{identity}@ctlvoip.lab.centurylink/subscription/{channelId}',
        'getInstantMessageURI': '/rest/version/{versionId}/user/{userId}/notification/{notificationChannelId}',
        'postImByUseridURI': '/rest/version/{versionId}/user/{userId}/instantmessage',
        'postImByDeviceidURI': '/rest/version/{versionId}/device/{deviceId}/instantmessage',
        'proxyForURLPatterns': ['/rest/version/[0-9]+','/rest/version/latest'],
        'SEProxyPrependURL': '/WEBRTC/RequestServletRWS/restful/',
        "AFAdditionalURLDetails": "/multiSite/v3_1",
        "defaultOutgoingCallDomain": "ctlvoip.lab.centurylink"
    },
    fcsapi: {
        'notificationType': 'websocketonly',
        'callAuditTimer': '30000',
        'codecsToRemove': ['103', '104', '105', '106', '107'],
        'protocol': 'https',
        'restUrl': 'lab.af.centurylink.com',
        'restPort': '443',
        'clientControlled': 'true',
        'services':['CallControl', 'custom'],
        'websocketProtocol': 'wss',
        // 'websocketIP': 'www.intg104.centurylink.com',
        // 'websocketPort': '8590',
        'earlyMedia': true
    },
    callManager: {
        'localVideoContainer': '',
        'remoteVideoContainer': '',
        'videoQuality': '640x480'

    }
});
