define({
    settings: {
        'subscribeServiceURI': '/{serviceName}/{identity}@{domain}/subscription',
        'unsubscribeServiceURI': '/SpeakEasy/{identity}@ctlvoip.lab.centurylink/subscription/{channelId}',
        'getInstantMessageURI': '/rest/version/{versionId}/user/{userId}/notification/{notificationChannelId}',
        'postImByUseridURI': '/rest/version/{versionId}/user/{userId}/instantmessage',
        'postImByDeviceidURI': '/rest/version/{versionId}/device/{deviceId}/instantmessage',
        'proxyForURLPatterns': ['/rest/version/[0-9]+/user','/rest/version/latest'],
        'SEProxyPrependURL': '/SpeakEasy/',
        "defaultOutgoingCallDomain": "ctlvoip.lab.centurylink"
    },
    fcsapi: {
        'notificationType': 'websocket',
        'callAuditTimer': '30000',
        'codecsToRemove': ['103', '104', '105', '106', '107'],
        'protocol': 'https',
        'restUrl': 'auth.veuxdu.centurylink.com',
        'restPort': '443',
        'clientControlled': 'true',
        'services':['CallControl', 'custom'],
        'websocketProtocol': 'wss',
        'websocketIP': 'www.intg104.centurylink.com',
        'websocketPort': '8590',
        'earlyMedia': true
    }
});
