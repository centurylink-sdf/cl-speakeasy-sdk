/**
 * @class Ctl.speakeasy.Config
 * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
 * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
 * @private
 *
 * List of configuration options for Ctl.speakeasy.CtlApiLoader.
 */
define({
    useConfig: 'intg',
    settings: {
        'subscribeServiceURI': '/{serviceName}/{identity}@{domain}/subscription',
        'unsubscribeServiceURI': '/SpeakEasy/{identity}@ctlvoip.lab.centurylink/subscription/{channelId}',
        'getInstantMessageURI': '/rest/version/{versionId}/user/{userId}/notification/{notificationChannelId}',
        'postImByUseridURI': '/rest/version/{versionId}/user/{userId}/instantmessage',
        'postImByDeviceidURI': '/rest/version/{versionId}/device/{deviceId}/instantmessage',
        'defaultOutgoingCallDomain': 'ctlvoip.lab.centurylink',
        'proxyForURLPatterns': ['/rest/version/[0-9]+/user','/rest/version/latest'],
        'SEProxyPrependURL': '/SpeakEasy/'
    },
    fcsapi: {
        'intg': {
            'notificationType': 'websocket',
            'restUrl': 'lab.iaf.centurylink.com',
            'restPort': '8889',
            'callAuditTimer': '30000',
            'codecsToRemove': ['103', '104', '105', '106', '107'],
            'protocol': 'https',
            'clientControlled': 'true',
            'services':['CallControl', 'custom'],
            'websocketProtocol': 'wss',
            // 'websocketIP': 'www.intg104.centurylink.com',
            // 'websocketPort': '8590',
            'earlyMedia': true
        },
        'cert': {
            'notificationType': 'websocketonly',
            'restUrl': 'lab.af.centurylink.com',
            'restPort': '443',
            'callAuditTimer': '30000',
            'codecsToRemove': ['103', '104', '105', '106', '107'],
            'protocol': 'https',
            'clientControlled': 'true',
            'services':['CallControl', 'custom'],
            'websocketProtocol': 'wss',
            // 'websocketIP': 'www.intg104.centurylink.com',
            // 'websocketPort': '8590',
            'earlyMedia': true
        }
    },
    callManager: {
        'localVideoContainer': 'speakeasy_localVideoContainer',
        'remoteVideoContainer': 'speakeasy_remoteVideoContainer',
        'videoQuality': '640x480'
    }
});
