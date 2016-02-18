/*!
 * FCS Javascript Library
 *
 * Copyright 2012, Genband
 */

(function( window, undefined ) {

// DO NOT UPDATE THIS DEFINITION
// IT IS ONLY USED FOR REMOVING TEST
// SPECIFIC REFERENCES FROM API.
var __testonly__;
// Base64 by Kevin van Zonneveld - Public Domain
// Original Source: http://kevin.vanzonneveld.net/

function base64_encode (data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Bayron Guevara
    // +   improved by: Thunder.m
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_encode
    // *     example 1: base64_encode('Kevin van Zonneveld');
    // *     returns 1: 'S2V2aW4gdmFuIFpvbm5ldmVsZA=='

    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['atob'] == 'function') {
    //    return atob(data);
    //}

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, enc="", tmp_arr = [];

    if (!data) {
        return data;
    }

    data = utf8_encode(data+'');

    do { // pack three octets into four hexets
        o1 = data.charCodeAt(i++);
        o2 = data.charCodeAt(i++);
        o3 = data.charCodeAt(i++);

        bits = o1<<16 | o2<<8 | o3;

        h1 = bits>>18 & 0x3f;
        h2 = bits>>12 & 0x3f;
        h3 = bits>>6 & 0x3f;
        h4 = bits & 0x3f;

        // use hexets to index into b64, and append result to encoded string
        tmp_arr[ac++] = b64.charAt(h1) + b64.charAt(h2) + b64.charAt(h3) + b64.charAt(h4);
    } while (i < data.length);

    enc = tmp_arr.join('');

    switch (data.length % 3) {
        case 1:
            enc = enc.slice(0, -2) + '==';
        break;
        case 2:
            enc = enc.slice(0, -1) + '=';
        break;
    }

    return enc;
}



function base64_decode (data) {
    // http://kevin.vanzonneveld.net
    // +   original by: Tyler Akins (http://rumkin.com)
    // +   improved by: Thunder.m
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Pellentesque Malesuada
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // -    depends on: utf8_decode
    // *     example 1: base64_decode('S2V2aW4gdmFuIFpvbm5ldmVsZA==');
    // *     returns 1: 'Kevin van Zonneveld'

    // mozilla has this native
    // - but breaks in 2.0.0.12!
    //if (typeof this.window['btoa'] == 'function') {
    //    return btoa(data);
    //}

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var o1, o2, o3, h1, h2, h3, h4, bits, i = 0, ac = 0, dec = "", tmp_arr = [];

    if (!data) {
        return data;
    }

    data += '';

    do {  // unpack four hexets into three octets using index points in b64
        h1 = b64.indexOf(data.charAt(i++));
        h2 = b64.indexOf(data.charAt(i++));
        h3 = b64.indexOf(data.charAt(i++));
        h4 = b64.indexOf(data.charAt(i++));

        bits = h1<<18 | h2<<12 | h3<<6 | h4;

        o1 = bits>>16 & 0xff;
        o2 = bits>>8 & 0xff;
        o3 = bits & 0xff;

        if (h3 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1);
        } else if (h4 == 64) {
            tmp_arr[ac++] = String.fromCharCode(o1, o2);
        } else {
            tmp_arr[ac++] = String.fromCharCode(o1, o2, o3);
        }
    } while (i < data.length);

    dec = tmp_arr.join('');
    dec = utf8_decode(dec);

    return dec;
}


function utf8_encode ( argString ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: sowberry
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +   improved by: Yves Sucaet
    // +   bugfixed by: Onno Marsman
    // +   bugfixed by: Ulrich
    // *     example 1: utf8_encode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var string = (argString+''); // .replace(/\r\n/g, "\n").replace(/\r/g, "\n");

    var utftext = "";
    var start, end;
    var stringl = 0;

    start = end = 0;
    stringl = string.length;
    for (var n = 0; n < stringl; n++) {
        var c1 = string.charCodeAt(n);
        var enc = null;

        if (c1 < 128) {
            end++;
        } else if (c1 > 127 && c1 < 2048) {
            enc = String.fromCharCode((c1 >> 6) | 192) + String.fromCharCode((c1 & 63) | 128);
        } else {
            enc = String.fromCharCode((c1 >> 12) | 224) + String.fromCharCode(((c1 >> 6) & 63) | 128) + String.fromCharCode((c1 & 63) | 128);
        }
        if (enc !== null) {
            if (end > start) {
                utftext += string.substring(start, end);
            }
            utftext += enc;
            start = end = n+1;
        }
    }

    if (end > start) {
        utftext += string.substring(start, string.length);
    }

    return utftext;
}

function utf8_decode ( str_data ) {
    // http://kevin.vanzonneveld.net
    // +   original by: Webtoolkit.info (http://www.webtoolkit.info/)
    // +      input by: Aman Gupta
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: Norman "zEh" Fuchs
    // +   bugfixed by: hitwork
    // +   bugfixed by: Onno Marsman
    // +      input by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // *     example 1: utf8_decode('Kevin van Zonneveld');
    // *     returns 1: 'Kevin van Zonneveld'

    var tmp_arr = [], i = 0, ac = 0, c1 = 0, c2 = 0, c3 = 0;

    str_data += '';

    while ( i < str_data.length ) {
        c1 = str_data.charCodeAt(i);
        if (c1 < 128) {
            tmp_arr[ac++] = String.fromCharCode(c1);
            i++;
        } else if ((c1 > 191) && (c1 < 224)) {
            c2 = str_data.charCodeAt(i+1);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 31) << 6) | (c2 & 63));
            i += 2;
        } else {
            c2 = str_data.charCodeAt(i+1);
            c3 = str_data.charCodeAt(i+2);
            tmp_arr[ac++] = String.fromCharCode(((c1 & 15) << 12) | ((c2 & 63) << 6) | (c3 & 63));
            i += 3;
        }
    }

    return tmp_arr.join('');
}


var Map = function () {
    var items = {}, length = 0;

    this.size = function () {
        return length;
    };

    this.add = function (key, value) {
        length++;
        items[key] = value;
        return this;
    };

    this.get = function (key) {
        return items[key];
    };

    this.remove = function (key) {
        length--;
        return delete items[key];
    };

    this.clear = function () {
        var variableKey;
        for (variableKey in items) {
            if (items.hasOwnProperty(variableKey)) {
                if (delete items[variableKey]) {
                    length--;
                }
            }
        }
    };

    this.entries = function () {
        return items;
    };
};

//@{fcs-jsl-prod}
if (__testonly__) {__testonly__.Map = Map;}
//@{fcs-jsl-prod}
/* global __testonly__ */

function extend(target, object) {
    var prop;
    for (prop in object) {
        if (object.hasOwnProperty(prop)) {
            target[prop] = object[prop];
        }
    }
    return target;
}

//@{fcs-jsl-prod}
if (__testonly__) {__testonly__.extend = extend;}
//@{fcs-jsl-prod}


function addToServiceListImpl(instance, service, manager, _fcsConfig) {

    if (!_fcsConfig.serviceManagerMap) {
        _fcsConfig.serviceManagerMap = new Map();
    }

    if (!_fcsConfig.serviceManagerMap.get(instance)) {
        _fcsConfig.serviceManagerMap.add(instance, new Map());
    }

    _fcsConfig.serviceManagerMap.get(instance).add(service, manager);
}

function addToServiceList (instance, service, manager) {
    addToServiceListImpl(instance, service, manager, fcsConfig);
}

//@{fcs-jsl-prod}
if (__testonly__) {__testonly__.addToServiceList = addToServiceListImpl;}
//@{fcs-jsl-prod}


var GlobalBroadcaster = function() {
    var MAX_PRIORITY = 10, MIN_PRIORITY = 1, topics = {}, subUid = -1;

    function unsubscribeFromTopic(token) {
        var m, i, j;
        for (m in topics) {
            if (topics[m] && topics.hasOwnProperty(m)) {
                j = topics[m].length;
                for (i = 0; i < j; i++) {
                    if (topics[m][i].token === token) {
                        topics[m].splice(i, 1);
                        return token;
                    }
                }
            }
        }
        return false;
    }

    function subscribeToTopic(topic, func, priority, temporary) {
        var token, prio = MAX_PRIORITY, temp = false;

        if (typeof topic !== 'string') {
            throw new Error("First parameter must be a string topic name.");
        }

        if (typeof func !== 'function') {
            throw new Error("Second parameter must be a function.");
        }

        if (typeof priority !== 'undefined') {
            if (typeof priority !== 'number') {
                throw new Error("Priority must be a number.");
            }
            else {
                if (priority > MAX_PRIORITY ||
                        priority < MIN_PRIORITY) {
                    throw new Error("Priority must be between 1-10.");
                }
                else {
                    prio = priority;
                }
            }
        }

        if (temporary === true) {
            temp = temporary;
        }

        if (!topics[topic]) {
            topics[topic] = [];
        }

        token = (++subUid).toString();
        topics[topic].push({
            token: token,
            prio: prio,
            func: func,
            temp: temp
        });

        topics[topic].sort(function(a, b) {
            return parseFloat(b.prio) - parseFloat(a.prio);
        });

        return token;
    }

    function publishTopic(topic, args) {
        var subscribers, len, _args, _topic;

        if (arguments.length === 0) {
            throw new Error("First parameter must be a string topic name.");
        }

        _args = Array.prototype.slice.call(arguments);
        _topic = _args.shift();

        subscribers = topics[_topic];
        len = subscribers ? subscribers.length : 0;
        while (len--) {
            subscribers[len].func.apply(null, _args);
            if (subscribers[len].temp) {
                unsubscribeFromTopic(subscribers[len].token);
            }
        }
    }

    /*
     *
     * Publish events of interest
     * with a specific topic name and arguments
     * such as the data to pass along
     *
     * @param {string} topic - Topic name.
     * @param {...*} [args] - arguments.
     *
     * @returns {undefined}
     */
    this.publish = publishTopic;

    /*
     *
     * Subscribe to events of interest
     * with a specific topic name and a
     * callback function, to be executed
     * when the topic/event is observed.
     * Default priority 10.
     * Priority must be between 1-10.
     * Functions with lower priority
     * will be executed first.
     *
     * @param {string} topic - Topic name.
     * @param {type} func - function to be executed when the topic/event is observed
     * @param {number} [priority] - function with higher priority will be executed first
     * @param {boolean} [temporary] - if set to true, subscriber will unsubcribe automatically after first execution.
     *
     * @returns {string} token - reference to subscription
     */
    this.subscribe = subscribeToTopic;

    /*
     *
     * Unsubscribe from a specific
     * topic, based on a tokenized reference
     * to the subscription
     *
     * @param {string} token - reference to subscription
     *
     * @returns {false|string} - returns token if successfull,
     * otherwise returns false.
     */
    this.unsubscribe = unsubscribeFromTopic;
};

//@{fcs-jsl-prod}
var globalBroadcaster = new GlobalBroadcaster();
if (__testonly__) { __testonly__.GlobalBroadcaster = GlobalBroadcaster; }
//@{fcs-jsl-prod}


var CONSTANTS = {
    "WEBRTC": {
        "PLUGIN_ID": "fcsPlugin",
        "MEDIA_STATE": {
            NOT_FOUND: "notfound",
            SEND_RECEIVE: "sendrecv",
            SEND_ONLY: "sendonly",
            RECEIVE_ONLY: "recvonly",
            INACTIVE: "inactive"
        },
        "RTC_SIGNALING_STATE": {
            STABLE: "stable",
            HAVE_LOCAL_OFFER: "have-local-offer",
            HAVE_REMOTE_OFFER: "have-remote-offer",
            HAVE_LOCAL_PRANSWER: "have-local-pranswer",
            HAVE_REMOTE_PRANSWER: "have-remote-pranswer",
            CLOSED: "closed"
        },
        "RTC_SDP_TYPE": {
            "OFFER": "offer",
            "ANSWER": "answer",
            "PRANSWER": "pranswer"
        },
        "ERROR": {
            "ICE_ICELITE": "ICE_ICELITE"
        }
    },
    "STRING": {
        "NEW_LINE": "\n",
        "CARRIAGE_RETURN": "\r",
        "VIDEO" : "video",
        "AUDIO" : "audio"
    },
    "SDP" : {
        "A_LINE" : "a=",
        "M_LINE" : "m=",
        "CRYPTO" : "crypto",
        "FINGERPRINT" : "fingerprint",
        "ICE_UFRAG": "ice-ufrag:",
        "ICE_PWD": "ice-pwd:",
        "NACK": "nack",
        "NACKPLI": "nack pli",
        "SETUP_ACTIVE": "a=setup:active",
        "SETUP_PASSIVE": "a=setup:passive",
        "SETUP_ACTPASS": "a=setup:actpass"
    },
    "HTTP_METHOD" : {
        "GET" : "GET",
        "POST" : "POST",
        "PUT" : "PUT",
        "DELETE" : "DELETE",
        "OPTIONS" : "OPTIONS"
    },
    "WEBSOCKET": {
        "PROTOCOL": {
            "SECURE": "wss",
            "NONSECURE": "ws"
        },
        "DEFAULT_PORT": "8581",
        "STATUS": {
            "OPENED": 1,
            "ALREADY_OPENED": 2,
            "CREATE_ERROR": 3,
            "CONNECTION_ERROR": 4,
            "NOT_FOUND": 5,
            "CONNECTION_CLOSED": 6
        }
    },
    "LONG_POLLING": {
        "STATUS": {
            "TRIGGERED_CONNECT" : 1
        }
    },
    "NOTIFICATION" : {
        "STATUS" : {
            "NOT_STARTED" : 3,
            "CONFIGURATION_ERROR" : 4,
            "STOP_FOR_LP_TO_WS_UPGRADE" : 5
        }
    },
    "EVENT": {
        "XHR_REQUEST_NOT_INITIALIZED" : "XHR_REQUEST_NOT_INITIALIZED",
        "DEVICE_SUBSCRIPTION_STARTED": "DEVICE_SUBSCRIPTION_STARTED",
        "DEVICE_SUBSCRIPTION_ENDED": "DEVICE_SUBSCRIPTION_ENDED",
        "CONNECTION_REESTABLISHED": "CONNECTION_REESTABLISHED",
        "CONNECTION_LOST": "CONNECTION_LOST",
        "TOKEN_AUTH_STARTED": "TOKEN_AUTH_STARTED",
        "BASIC_AUTH_STARTED": "BASIC_AUTH_STARTED",
        "TOKEN_NOT_FOUND": "TOKEN_NOT_FOUND",
        "SESSION_EXPIRED": "SESSION_EXPIRED",
        "NOTIFICATION_CHANNEL_LOST": "NOTIFICATION_CHANNEL_LOST",
        "FCS_SETUP_COMPLETED": "FCS_SETUP_COMPLETED",
        "WEBSOCKET_CONNECTED": "WEBSOCKET_CONNECTED",
        "WEBSOCKET_DISCONNECTED": "WEBSOCKET_DISCONNECTED"
    },
    "SUBSCRIPTION_EVENT": {
        "TOKEN_OR_SESSION_LOSS" : "TOKEN_OR_SESSION_LOSS",
        "SUBSCRIPTION_SUCCESS" : "SUBSCRIPTION_SUCCESS",
        "EXTEND_SUCCESS" : "EXTEND_SUCCESS",
        "EXTEND_FAILURE" : "EXTEND_FAILURE",
        "REGULAR_EXTEND_PROCESSING" : "REGULAR_EXTEND_PROCESSING",
        "STOP_SUCCESS" : "STOP_SUCCESS",
        "STOP_FAILURE" : "STOP_FAILURE",
        "CONNECTION_LOSS" : "CONNECTION_LOSS",
        "SET_NOTIFICATION_ONERROR" : "SET_NOTIFICATION_ONERROR",
        "SET_NOTIFICATION_ONSUCCESS" : "SET_NOTIFICATION_ONSUCCESS",
        "TRIGGER_LONG_POLLING" : "TRIGGER_LONG_POLLING",
        "RESTART_SUBSCRIPTION_REQUEST" : "RESTART_SUBSCRIPTION_REQUEST"
    },
    "NOTIFICATION_EVENT" :{
        "NOTIFICATION_SUCCESS":"NOTIFICATION_SUCCESS",
        "NOTIFICATION_FAILURE":"NOTIFICATION_FAILURE"
    },
    "CACHE": {
        "NOTIFYURL": "NotificationUrl",
        "NOTIFYID": "NotificationId",
        "SUBSCRIBEURL": "SubscriptionUrl",
        "SUBSCRIBEEXPIRY": "SubscriptionExpiry",
        "SUBSCRIBEEXTENDINTERVAL": "SubscriptionExtendInterval",
        "USERNAME": "USERNAME",
        "PASSWORD" : "PASSWORD",
        "SESSION": "SESSION"
    },
    "TIMEOUT" : {
        "INTERVAL_TO_PREVENT_CONFLICTS": 5000,
        "DEFAULT_CONNECTIVITY_CHECK_INTERVAL" : 10000
    }
};

//@{fcs-jsl-prod}
if (__testonly__) { __testonly__.CONSTANTS = CONSTANTS; }
//@{fcs-jsl-prod}


var JQrestfulImpl = function(_globalBroadcaster) {

    var DEFAULT_LONGPOLLING_TOLERANCE = 30000,
        DEFAULT_AJAX_TIMEOUT = 40000,
        XHR_READY_STATE = {
            REQUEST_NOT_INITIALIZED: 0,
            REQUEST_DONE: 4
        };

    function getLogger() {
        return logManager.getLogger("jQrestful");
    }

    function composeAjaxRequestResponseLog(context, xhr, errorThrown, data) {
        var responseLog = context;
        if (data) {
            responseLog.data = data;
        }
        if (errorThrown) {
            responseLog.errorThrown = errorThrown;
        }
        if (xhr) {
            responseLog.status = xhr.status;
            responseLog.statusText = xhr.statusText;
            responseLog.responseText = xhr.responseText;
            responseLog.readyState = xhr.readyState;
        }
        return responseLog;
    }

    function parseError(x, e) {
        var returnResult, statusCode;
        getLogger().error("parseError:'" + e + "' Status:'" + x.status + "' ResponseText:'" + x.responseText + "'");

        if (x.responseText && x.responseText.search("statusCode") !== -1) {
            if (JSON.parse(x.responseText).subscribeResponse !== undefined) {
                statusCode = JSON.parse(x.responseText).subscribeResponse.statusCode;
            } else if (JSON.parse(x.responseText).authorizationResponse !== undefined) {
                statusCode = JSON.parse(x.responseText).authorizationResponse.statusCode;
            }
        }

        statusCode = statusCode ? statusCode : x.status;

        switch (statusCode) {
            case 401:
                returnResult = fcs.Errors.AUTH;
                break;
            case 403:
                returnResult = fcs.Errors.INCORRECT_LOGIN_PASS;
                break;
            case 19:
                returnResult = fcs.Errors.LOGIN_LIMIT_CLIENT;
                break;
            case 20:
                returnResult = fcs.Errors.LOGIN_LIMIT_TABLET;
                break;
            case 44:
                returnResult = fcs.Errors.FORCE_LOGOUT_ERROR;
                break;
            case 46:
                returnResult = fcs.Errors.TOKEN_NOT_FOUND;
                break;
            case 47:
                returnResult = fcs.Errors.SESSION_EXPIRED;
                break;
            default:
                returnResult = fcs.Errors.NETWORK;
        }
        return returnResult;
    }

    // TODO tolga: remove parseError when all of the responseTypes are added
    function parseErrorStatusCode(x, e, responseType) {
        getLogger().error("parseErrorStatusCode:'" + e + "' Status:'" + x.status + "' ResponseText:'" + x.responseText + "'");

        if (x.responseText && x.responseText.search("statusCode") !== -1 && JSON.parse(x.responseText)[responseType] !== undefined) {

            return JSON.parse(x.responseText)[responseType].statusCode;
        }

        return (x.status === 401 || x.status === 403) ? x.status : 400;
    }


    /*
     * @ignore
     */
    this.call = function(method, callParams, successHandler, errorHandler, successParser, errorParser, responseType, headers) {
        var data,
            timeout = DEFAULT_AJAX_TIMEOUT,
            url = callParams.url,
            urlWithoutRestVersion = url.split("/rest/version/")[1],
            resourceString,
            logger = getLogger(),
            xhr,
            queryString,
            finalHeaders,
            headerKey,
            responseLogContext,
            handleSuccess,
            handleError,
            isSuccess,
            modValues;

        if (callParams && callParams.data) {
            data = callParams.data;
        }

        if (fcsConfig.polling) {
            timeout = fcsConfig.polling * 1000;
            if (fcsConfig.longpollingTolerans) {
                timeout = timeout + fcsConfig.longpollingTolerans;
            } else {
                timeout = timeout + DEFAULT_LONGPOLLING_TOLERANCE;
            }
        }

        // do not log isAlive requests
        if (urlWithoutRestVersion && urlWithoutRestVersion.indexOf("isAlive") === -1) {
            // extracting rest resource from url.
            // ".../rest/version/<ver>/<user/anonymous>/<userName>/restResource/..."
            resourceString = urlWithoutRestVersion.split("/")[3];
            if (!resourceString) {
                // rest resource string not found, get last string in the url
                resourceString = url.substring(url.lastIndexOf("/") + 1, url.length);
            }
            // remove "?" if exists
            resourceString = resourceString.split("?")[0];

            if (data && !data.imRequest) {
                logger.info("Send ajax request: " + resourceString, data);
            } else {
                logger.info("Send ajax request: " + resourceString);
            }
        }

        if (method === 'GET') {
            // Take the data parameters and append them to the URL.
            queryString = utils.serialize(data);

            if (queryString.length > 0) {
                if (url.indexOf('?') === -1) {
                    url += '?' + queryString;
                } else {
                    url += '&' + queryString;
                }
            }

            // Remove data so that we don't add it to the body.
            data = null;
        }

        xhr = new XMLHttpRequest();

        // TODO: Kadir Goktas
        // listeners below are functional expect for IE9.
        // we can replace xhr.onstatechange handler
        // accordingly, once IE9 is deprecated.

        xhr.onload = function () {
            handleSuccess(xhr);
        };
        xhr.onabort = function () {
            logger.trace("Ajax request aborted internally. not calling failure callback");
        };
        xhr.onerror = function () {
            logger.error("Ajax request error! Handle the error");
            handleError(xhr);
        };

        // ajax hook to modify url and headers
        if (fcsConfig.ajaxHook) {
            modValues = utils.callFunctionIfExist(fcsConfig.ajaxHook, xhr, window, {type: method, url: url, headers: headers, data: data});
            if (modValues) {
                url = modValues.url ? modValues.url : url;
                headers = modValues.headers ? modValues.headers : headers;
            }
        }

        xhr.open(method, url, fcs.isAsync());
        if (fcs.isAsync()) {
            xhr.withCredentials = fcsConfig.cors ? true : false;
            xhr.timeout = timeout;
        }

        finalHeaders = {
            // Old implementation used jQuery without changing content type. Doing the same here for
            // backwards compatibility.
            'Content-Type': 'application/x-www-form-urlencoded',

            // JQuery always adds this header by default. Adding here for backwards compatibility.
            'X-Requested-With': 'XMLHttpRequest'
        };

        finalHeaders = extend(finalHeaders, headers);

        // Set the headers.
        for (headerKey in finalHeaders) {
            if (finalHeaders.hasOwnProperty(headerKey)) {
                xhr.setRequestHeader(headerKey, finalHeaders[headerKey]);
            }
        }

        if (typeof data !==  "string") {
            data = JSON.stringify(data);
        }

        xhr.send(data);

        // Used for logging information,
        responseLogContext = {
            type: method,
            url: url,
            dataType: "json",
            async: fcs.isAsync(),
            jsonp: false,
            crossDomain: fcsConfig.cors ? true : false,
            timeout: timeout
        };

        function checkIE9HackForAbortedAjaxRequest(xhr) {
            // IE9 hack: identifying internally aborted ajax requests.
            try {
                isSuccess = (xhr.status >= 200 && xhr.status < 300) || xhr.status === 304;
            } catch (err) {
                // when an ajax request is aborted by javascript, accessing xhr.status will throw
                // exception. "c00c023f" is the exact code that IE9 throws.
                // but all exceptions are considered as same.
                if (err instanceof Error) {
                    if (err.description === "Could not complete the operation due to error c00c023f.") {
                        logger.trace("Ajax request aborted internally. not calling failure callback");
                    }
                }
                return -1;
            }
            return isSuccess;
        }

        handleSuccess = function (xhr) {

            if (xhr.readyState === XHR_READY_STATE.REQUEST_DONE) {

                isSuccess = checkIE9HackForAbortedAjaxRequest(xhr);
                if (isSuccess === -1) {
                    return;
                }

                // onload hack: need to handle both success and failure in xhr load event
                if (!isSuccess) {
                    handleError(xhr);
                    return;
                }

                var val = {};
                try {
                    // Make sure that the response isn't empty before parsing. Empty is considered
                    // an empty object.
                    if (typeof xhr.responseText === 'string' && xhr.responseText.length) {
                        val = JSON.parse(xhr.responseText);
                    }

                    // do not log success response for isAlive requests
                    if (typeof xhr.responseURL === 'string' && xhr.responseURL.indexOf("isAlive") === -1) {
                        logger.info("ajax success: " + xhr.status + " " + xhr.statusText,
                                composeAjaxRequestResponseLog(responseLogContext, xhr, undefined, val));
                    }
                } catch (e) {
                    if (e instanceof SyntaxError) {
                        logger.error("Failed to parse json ajax response into object:" + xhr.responseText,
                                composeAjaxRequestResponseLog(responseLogContext, xhr, undefined, val));
                    } else {
                        logger.error("Unknown error:" + xhr.status + " " + xhr.statusText,
                                composeAjaxRequestResponseLog(responseLogContext, xhr, undefined, val));
                    }

                    handleError(xhr);
                    return;
                }

                if (successParser && typeof successParser === 'function') {
                    val = successParser(val);
                }
                if (successHandler && typeof successHandler === 'function') {
                    successHandler(val);
                }
            }
        };

        handleError = function (xhr) {
            // TODO: Error Thrown
            logger.error("ajax error: " + xhr.status + " " + xhr.statusText,
                    composeAjaxRequestResponseLog(responseLogContext, xhr, xhr.statusText));

            if (xhr.status === 410) {
                logger.error("410 Gone received");
                utils.callFunctionIfExist(fcs.notification.onGoneReceived);
                return;
            }

            if (xhr.readyState === XHR_READY_STATE.REQUEST_NOT_INITIALIZED) {
                _globalBroadcaster.publish(CONSTANTS.EVENT.XHR_REQUEST_NOT_INITIALIZED);
                logger.debug("Ajax request cannot be sent, this is a connection problem.");
            }

            if (errorHandler && typeof errorHandler === 'function') {
                //TODO after unit tests moved to addressbook class, responseType parameter should be removed
                if (responseType === "addressBookResponse") {
                    errorHandler(parseErrorStatusCode(xhr, xhr.statusText, responseType));
                } else {
                    if (errorParser && typeof errorParser === 'function') {
                        errorHandler(errorParser(xhr, xhr.statusText));
                    } else {
                        errorHandler(parseError(xhr, xhr.statusText));
                    }
                }
            } else {
                logger.trace("Error handler is not defined or not a function");
            }
        };

        // This code is similar to jQuery. It is done like this because the documentations says not
        // to use onreadystatechange if in synchronous mode.
        if (!fcs.isAsync()) {
            // In sync mode, just call the callback
            handleSuccess(xhr);
        } else if (xhr.readyState === 4) {
            // If the request already completed, just fire the callback asynchronously
            setTimeout(function () {
                handleSuccess(xhr);
            });
        } else {
            // sucess and fail scenarios are handled with "load" and "error" event listeners
            // onreadystatechange is only need for IE9 hack
            xhr.onreadystatechange = function () {
                if (checkIE9HackForAbortedAjaxRequest(xhr) === -1) {
                    return;
                }
            };
        }

        return xhr;
    };
};

//@{fcs-jsl-prod}
var JQrestful = function(_globalBroadcaster) {
    return new JQrestfulImpl(_globalBroadcaster || globalBroadcaster);
};

var jQueryAdapter = new JQrestful();
//@{fcs-jsl-prod}



var JqrestfullManagerImpl = function(_jQueryAdapter, _globalBroadcaster) {

    var REQUEST_TYPE_PUT = "PUT",
            REQUEST_TYPE_POST = "POST",
            REQUEST_TYPE_GET = "GET",
            REQUEST_TYPE_DELETE = "DELETE",username, password, session, authname;

    function onSubscriptionStarted(data) {
        session = data.session;
    }

    // In order to delete previous session
    function onSubscriptionEnded() {
        session = null;
    }

    function onTokenAuth(data) {
        username = data.username;
    }

    function onBasicAuth(data) {
        username = data.username;
        password = data.password;
        authname = data.authname;
    }

    function manipulateHeader(header) {
        if (!header) {
            header = {};
        }
        if (!header.Accept) {
            header.Accept = "application/json";
        }
        if (!header['Content-Type']) {
            header['Content-Type'] = "application/json";
        }

        //Check whether auth or basic auth
        if (session) {
            header['x-session'] = session;
            delete header.Authorization;
        } else {
            if (authname && password){
                header.Authorization = "basic " + base64_encode(authname + ":" + password);
            }else if (username && password) {
                header.Authorization = "basic " + base64_encode(username + ":" + password);
            }
            delete header['x-session'];
        }
        return header;
    }

    //TODO: requestTimeout, synchronous parameters should be refactored.
    //TODO: Header parameter should be  the first one. This would be corrected in refactor
    function sendRequest(method, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        var failureHandler = function(statusCode) {
            if (statusCode === fcs.Errors.TOKEN_NOT_FOUND) {
                _globalBroadcaster.publish(CONSTANTS.EVENT.TOKEN_NOT_FOUND);
                session = null;
            } else if (statusCode === fcs.Errors.SESSION_EXPIRED){
                _globalBroadcaster.publish(CONSTANTS.EVENT.SESSION_EXPIRED);
                session = null;
            }

            if (errorHandler && typeof errorHandler === 'function') {
                errorHandler(statusCode);
            }
        };
        return _jQueryAdapter.call(method, callParams, successHandler, failureHandler, successParser, errorParser, responseType, header);
    }

    function sendPostRequestTokenAuth(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header, token) {
        if (!header) {
            header = {};
        }
        if (!header.Accept) {
            header.Accept = "application/json";
        }
        if (!header['Content-Type']) {
            header['Content-Type'] = "application/json";
        }
        //Check whether auth or basic auth
        if (header['x-session']) {
            delete header['x-session'];
        }
        if (header.Authorization) {
            delete header.Authorization;
        }
        if (!header['x-token']) {
            header['x-token'] = token;
        }
        return sendRequest(REQUEST_TYPE_POST, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    }

    this.call = function(method, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        header = manipulateHeader(header);
        return sendRequest(method, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    };

    this.sendPostRequest = function(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header, token) {
        if (token) {
            return sendPostRequestTokenAuth(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header, token);
        } else {
            header = manipulateHeader(header);
            return sendRequest(REQUEST_TYPE_POST, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
        }
    };

    this.sendGetRequest = function(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        header = manipulateHeader(header);
        return sendRequest(REQUEST_TYPE_GET, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    };

    this.sendDeleteRequest = function(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        header = manipulateHeader(header);
        return sendRequest(REQUEST_TYPE_DELETE, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    };

    this.sendPutRequest = function(callParams, successHandler, errorHandler, successParser, errorParser, responseType, header) {
        header = manipulateHeader(header);
        return sendRequest(REQUEST_TYPE_PUT, callParams, successHandler, errorHandler, successParser, errorParser, responseType, header);
    };

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.TOKEN_AUTH_STARTED, onTokenAuth, 9);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.BASIC_AUTH_STARTED, onBasicAuth, 10);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED, onSubscriptionStarted);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_ENDED, onSubscriptionEnded);


};

//@{fcs-jsl-prod}
var JqrestfullManager = function(_jQueryAdapter, _globalBroadcaster) {
    return new JqrestfullManagerImpl(_jQueryAdapter || jQueryAdapter,
                               _globalBroadcaster || globalBroadcaster);
};

var server = new JqrestfullManager();
//@{fcs-jsl-prod}


var fcsConfig = {
    polling: 30,
    iceCandidateCollectionTimeoutInterval: 3000,
    codecsToReplace: [{name : 'opus', value : '109'}],
    pluginMode: {mode: "auto"}
};


var un = null, pw = null, authorizationName = null, connected = true, tkn = null;

function getDomain() {
    return un.split('@')[1];
}

function getUser() {
    return un;
}

function getAuthUser(){
    if(authorizationName){
        return authorizationName;
    }else {
        return un;
    }
}

function getUserToken() {
    return tkn;
}

function getVersion() {
    return "3.1.3.45";
}

function isConnected() {
    return connected;
}

function setConnected(connectionStatus) {
    connected = connectionStatus === true ? true : false;
}

/**
 * @name fcs
 * @namespace
 * @param _server
 * @param _globalBroadcaster
 * @param _window
 */
var CoreImpl = function(_server, _globalBroadcaster, _window) {

    var dev = null, pluginVer = null, services = {}, async = true;

    /**
     * This function returns value of async paramater of $.ajax requests
     *
     * @name fcs.isAsync
     * @function
     * @returns {Boolean} true/false
     * @since 3.0.0
     *
     * @example
     * fcs.isAsync();
     */
    this.isAsync = function() {
        return async;
    };

    /**
     * This function sets async option of $.ajax() requests.
     * If It is set to false, ajax requests will be sent synchronously
     * otherwise ajax requests will be sent asynchronously.
     *
     * @name fcs.setAsync
     * @function
     * @param {Boolean} value
     * @return {Boolean} true/false
     * @since 3.0.0
     *
     * @example
     * fcs.setAsync(false);
     */
    this.setAsync = function(value) {
        async = value;
    };

    /**
     * This function returns username of authenticated user in user@domain format.
     *
     * @name fcs.getUser
     * @function
     * @returns {string} Username of current user
     * @since 3.0.0
     *
     * @example
     * fcs.getUser();
     */
    this.getUser = getUser;

    /**
     * This function returns authorization name of authenticated user
     *
     * @name fcs.getAuthUser
     * @function
     * @returns {String} Authorization name of current user
     * @since 3.0.0
     *
     * @example
     * fcs.getAuthUser();
     */
    this.getAuthUser = getAuthUser;

    /**
     * This function returns current domain name of authenticated user
     *
     * @name fcs.getDomain
     * @function
     * @returns {string} Current domain name
     * @since 3.0.0
     *
     * @example
     * fcs.getDomain();
     */
    this.getDomain = getDomain;

    /**
     * This function returns the version of the JSL-API
     *
     * @name fcs.getVersion
     * @function
     * @returns {string} Version of the JSL-API
     * @since 3.0.0
     *
     * @example
     * fcs.getVersion();
     */
    this.getVersion = getVersion;

    /**
     * This fucntion returns current device.
     *
     * @name fcs.getDevice
     * @function
     * @returns {string} Device specified for communicating with the server
     * @since 3.0.0
     *
     * @example
     * fcs.getDevice();
     */
    this.getDevice = function() {
        return dev;
    };

    /**
     * This function sets the user as authentication mode and cancels device authentication (if such exists),
     * as user and device modes are mutually exclusive.
     * authname parameter is optional.
     *
     * @name fcs.setUserAuth
     * @function
     * @param {string} user User name to be used for communicating with the server
     * @param {string} password Password to be used for communicating with the server
     * @param {string} authname If provided authname is used instead of user name for authentication
     *
     * @since 3.0.0
     *
     * @example
     * fcs.setUserAuth("Username", "Password","Authname");
     */
    this.setUserAuth = function(user, password, authname) {
        un = user;
        pw = password;
        dev = null;
        var data = {
            'username': user,
            'password': password
        };
        if( ( typeof authname === 'string' ) && ( authname.trim().length > 0 ) ){
          data.authname=authname;
          authorizationName = authname;
        }else{
            authorizationName = null;
        }
        _globalBroadcaster.publish(CONSTANTS.EVENT.BASIC_AUTH_STARTED, data);
    };

    /**
     * This function sets the user as token mode authentication and cancels user authentication or/and device authentication (if such exists),
     * token authentication has priority over other authentications
     *
     * @name fcs.setTokenAuth
     * @function
     * @param {string} user to be used for communicating with the server
     * @param {string} token to be used for communicating with the server
     *
     * @since 3.0.0
     *
     * @example
     * fcs.setTokenAuth("Username", "Token");
     */
    this.setTokenAuth = function(user, token){
        un = user;
        tkn = token;
        _globalBroadcaster.publish(CONSTANTS.EVENT.TOKEN_AUTH_STARTED, {'username' : user, 'token': token});
    };

    /**
     * This function sets the device as authentication mode and cancels user authentication (if such exists),
     * as user and device modes are mutually exclusive.
     *
     * @name fcs.setDeviceAuth
     * @function
     * @since 3.0.0
     * @param {string} deviceID The device to be used for communicating with the server
     *
     * @example
     * fcs.setDeviceAuth("DeviceID");
     */
    this.setDeviceAuth = function(deviceID) {
        dev = deviceID;
        un = null;
    };

    /**
     * List of Authentication Types.
     * @see setDeviceAuth
     * @see setUserAuth
     * @name AuthenticationType
     * @property {number} USER User authentication
     * @property {number} DEVICE Device authentication
     * @readonly
     * @memberOf fcs
     */
    this.AuthenticationType = {
        USER: 1,
        DEVICE: 2
    };

    /**
     * List of Error Types
     *
     * @name fcs.Errors
     * @property {number} NETWORK Network failures
     * @property {number} AUTH Authentication / Authorization failures
     * @property {number} STATE Invalid state
     * @property {number} PRIV Privilege failures
     * @property {number} UNKNOWN Unknown failures
     * @property {number} LOGIN_LIMIT Login limit exceeded
     * @property {number} INCORRECT_LOGIN_PASS Incorrect identifier
     * @property {number} INVALID_LOGIN Invalid username
     * @property {number} TOKEN_NOT_FOUND Token provided is not valid
     * @property {number} SESSION_EXPIRED Session generated from token is expired
     * @property {number} VIDEO_SESSION_NOT_AVAILABLE Video Session is not available
     * @property {number} PENDING_REQUEST There is a pending request.
     * @property {number} NOT_ALLOWED_SERVICE Service is not allowed.
     * @property {number} NOT_ALLOWED_METHOD Method is not allowed.
     * @property {number} NOT_ALLOWED_INSTANCE Instance is not allowed.
     * @property {number} INVALID_PARAMETER Parameter is invalid.
     * @property {number} CONNECTION_ISSUE Connection problem.
     * @property {number} MEDIA_NOT_FOUND Media not found error.
     * @property {number} MEDIA_NOT_ALLOWED Media not allowed error.
     * @property {number} CALL_FAILED Call failed.
     * @property {number} CALL_ENDED Call ended.
     * @readonly
     * @memberOf fcs
     * @example
     * if (e === fcs.Errors.AUTH)
     * {
     *     console.log("Authentication error occured")
     * }
     */
    this.Errors = {
        NETWORK: 1,
        AUTH: 2,
        STATE: 3,
        PRIV: 4,
        UNKNOWN: 9,
        LOGIN_LIMIT_CLIENT: 10,
        INCORRECT_LOGIN_PASS: 11,
        INVALID_LOGIN: 12,
        // smartoffice2.0 specific
        FORCE_LOGOUT_ERROR : 13,
        // smartoffice2.0 specific
        LOGIN_LIMIT_TABLET: 14,
        TOKEN_NOT_FOUND: 15,
        SESSION_EXPIRED: 16,
        VIDEO_SESSION_NOT_AVAILABLE: 17,
        PENDING_REQUEST: 18,
        NOT_ALLOWED_SERVICE : 19,
        NOT_ALLOWED_METHOD : 20,
        NOT_ALLOWED_INSTANCE : 21,
        INVALID_PARAMETER: 22,
        CONNECTION_ISSUE: 23,
        MEDIA_NOT_FOUND: 24,
        MEDIA_NOT_ALLOWED: 25,
        CALL_FAILED: 26,
        CALL_ENDED: 27
    };

    /**
     * @typedef modifiedValues
     * @type Object
     * @property {number} url Modified url to replace xhr original url
     * @property {object} headers Mofied headers object to replace original xhr headers
     * @since 3.1.2
     */

    /**
     * Ajax hook to intercept outgoing xhr request to modify url and headers
     *
     * @since 3.1.2
     *
     * @callback ajaxHook
     * @param {Object} xhr XMLHttpRequest object
     * @param {window} window window object
     * @param {object} params object containing parameters
     * @param {string} [params.type] The HTTP method to use, such as "GET", "POST", "PUT", "DELETE", etc
     * @param {string} [params.url] The URL to send the request to
     * @param {string} [params.headers] Request headers
     * @param {string} [params.data] Request body
     *
     * @return {modifiedValues} object containing modified url and headers
     *
     */

    /**
     * This function is used to set up JSL library
     *
     * @name fcs.setup
     * @function
     * @param {object} configParams Object containing parameters to be configured
     * @param {fcs.notification.NotificationTypes} [configParams.notificationType] The notification type to be used. Defauts to: LONGPOLLING
     * @param {string} [configParams.serverRetryNumber] Server retry number is used when websocket failure. The current websocket will be tried for the given parameter. Default value is 5. (Between 0 and 10)
     * @param {string} [configParams.serverRetryInterval] Server retry time interval is the current failed websocket retry interval. Default value is 5000. (Between 1000 and 10000)
     * @param {Object[]} [configParams.servers] Array of servers to be tried to for notification subscription.
     * @param {string} [configParams.servers[].protocol] HTTP protocol to be used. Ex: Http, Https
     * @param {string} [configParams.servers[].restUrl] The URL of REST server http://ip:port.
     * @param {string} [configParams.servers[].restPort] The port of REST server http://ip:port.
     * @param {string} [configParams.servers[].websocketProtocol] Determines if the websocketProtocol is secure or non-secure. Default is non-secure, which is "ws".
     * @param {string} [configParams.servers[].websocketIP] Holds the websocket connection's IP adress.
     * @param {string} [configParams.servers[].websocketPort] Holds the websocket connection's port value. By defult, it is 8581.
     * @param {string} [configParams.restUrl] The URL of REST server http://ip:port. Defaults to an absolute url : /rest
     * @param {string} [configParams.restPort] The port of REST server http://ip:port.
     * @param {string} [configParams.polling] Polling time value in seconds. Default is 30.
     * @param {string} [configParams.expires] Expire time value in miliseconds. Default is 3600.
     * @param {string} [configParams.websocketProtocol] Determines if the websocketProtocol is secure or non-secure. Default is non-secure, which is "ws".
     * @param {string} [configParams.websocketIP] Holds the websocket connection's IP adress.
     * @param {string} [configParams.websocketPort] Holds the websocket connection's port value. By defult, it is 8581.
     * @param {string} [configParams.codecsToRemove] Audio codesc to be removed.
     * @param {string} [configParams.callAuditTimer] Audit time value for calls.
     * @param {string} [configParams.cors] True if Cross-Origin Request Sharing supported.
     * @param {string} [configParams.services] Defines the enabled services for client. Ex: CallControl, IM, call
     * @param {string} [configParams.protocol] HTTP protocol to be used. Ex: Http, Https
     * @param {string} [configParams.clientIp] The client IP address for SNMP triggers
     * @param {string} [configParams.serverProvidedTurnCredentials] Provide TURN server credentials from server or not.
     * @param {number} [configParams.iceCandidateCollectionTimeoutInterval] When provided (in milliseconds), ice candidate collection assumed to be completed if at least one candidate is received within the interval. Default is 3000.
     * @param {number} [configParams.relayCandidateCollectionTimeoutCycle] When provided, iceCandidateCollectionTimeoutInterval is restarted until receiving first relay candidate. if the provided cycle limit is reached, ice candidate collection assumed to be completed.
     * @param {object} [configParams.pluginMode] Configures plugin mode (as 'webrtc' or 'auto') and h264 status as browser-specific with version restriction (for Chrome and Firefox) or as general default values.
     * @param {string} [configParams.pluginMode.mode="auto"] General plugin mode. 'webrtc' for default webrtc plugin, 'auto' for the usage of native chrome and firefox or the usage of default webrtc plugin for the others.
     * @param {boolean} [configParams.pluginMode.h264=false] General H264 codec status.
     * @param {object} [configParams.pluginMode.chrome] Chrome-specific configurations
     * @param {string} [configParams.pluginMode.chrome.mode] Chrome-specific plugin mode. Overrides the general one.
     * @param {boolean} [configParams.pluginMode.chrome.h264] Chrome-specific H264 codec status. Overrides the general one.
     * @param {string} [configParams.pluginMode.chrome.version] Version lowerbound for Chrome configurations. Ex: "40+". Includes all the versions if not given.
     * @param {object} [configParams.pluginMode.firefox] Firefox-specific configurations
     * @param {string} [configParams.pluginMode.firefox.mode] Firefox-specific plugin mode. Overrides the general one.
     * @param {boolean} [configParams.pluginMode.firefox.h264] Firefox-specific H264 codec status. Overrides the general one.
     * @param {string} [configParams.pluginMode.firefox.version] Version lowerbound for Firefox configurations. Ex: "40+". Includes all the versions if not given.
     * @param {string} [configParams.connectivityInterval] Connectivity check interval time value. Default value is 10000. If it is 0 connectivity check is diabled. Recommended to use values greater than 10000, due to performance issues.
     * @param {string} [configParams.websocketInterval] Websocket health check interval default 10000. If the websocketInterval parameter value is 0, websocket health check will be disabled.
     * @param {ajaxHook} [configParams.ajaxHook] ajax hook to intercept outgoing xhr request to modify url and headers
     * @since 3.0.0
     * @example
     *
     * fcs.setup(
     *   {
     *       notificationType: fcs.notification.NotificationTypes.WEBSOCKET,
     *       websocketProtocol : 'wss',
     *       websocketIP: '1.1.1.1',
     *       websocketPort : '8581',
     *       clientIp: 'IP Address',
     *       restUrl: 'http://ip:port',
     *       restPort: '443',
     *       callAuditTimer: 30000,
     *       clientControlled : true,
     *       pluginMode: {
     *          mode: 'webrtc',
     *          h264: false,
     *          chrome: {
     *              mode: 'auto'
     *          },
     *          firefox: {
     *              version: '38+',
     *              mode: 'auto'
     *          }
     *       },
     *       connectivityInterval: '20000'
     *   }
     * );
     *
     * // example for multiple server
     *
     * fcs.setup(
     *   {
     *       notificationType: fcs.notification.NotificationTypes.WEBSOCKET_ONLY,
     *       servers: [{protocol: 'http',
     *                   restUrl: '1.1.1.1',
     *                   restPort: '8580',
     *                   websocketProtocol: 'ws',
     *                   websocketIP: '1.1.1.1',
     *                   websocketPort: '8578'},
     *                  {protocol: 'http',
     *                   restUrl: '1.1.1.1',
     *                   restPort: '8580',
     *                   websocketProtocol: 'ws',
     *                   websocketIP: '1.1.1.1',
     *                   websocketPort: '8581'}],
     *      serverRetryNumber: '2',
     *      serverRetryInterval: '3000',
     *       pluginMode: {
     *          mode: 'webrtc',
     *          h264: false,
     *          chrome: {
     *              mode: 'auto'
     *          },
     *          firefox: {
     *              version: '38+',
     *              mode: 'auto'
     *          }
     *       },
     *       connectivityInterval: '20000'
     *       websocketInterval: '20000'
     *   }
     * );
     *
     *
     */
    this.setup = function(configParams) {
        var param;
        for (param in configParams) {
            if (configParams.hasOwnProperty(param)) {
                fcsConfig[param] = configParams[param];
            }
        }
    };

    /**
     * This function sets version of plugin
     *
     * @name fcs.setPluginVersion
     * @function
     * @param {string} version
     * @since 3.0.0
     * @example
     *
     * fcs.setPluginVersion(version);
     */
    this.setPluginVersion = function(version) {
        pluginVer = version;
    };

    /**
     * This function returns version of plugin
     *
     * @name fcs.getPluginVersion
     * @function
     * @returns {String} Version of Current Plugin
     * @since 3.0.0
     * @example
     *
     * fcs.getPluginVersion();
     */
    this.getPluginVersion = function() {
        return pluginVer;
    };

    /**
     * This function returns assigned services of authenticated user.
     *
     * @name fcs.getServices
     * @function
     * @returns {object} The assigned services of authenticated user
     * @since 3.0.0
     * @example
     *
     * fcs.getServices();
     */
    this.getServices = function() {
        return services;
    };

    /**
     * This function assigns determined services to current user
     *
     * @name fcs.setServices
     * @function
     * @param {array} serviceParam The list of assigned services for the user
     * @since 3.0.0
     * @example
     * fcs.setServices(["CallControl", "RestfulClient"]);
     */
    this.setServices = function(serviceParam) {
        var i;
        // for each element in serviceParam array, we create the service with value "true" in "services" object
        if (serviceParam) {
            for (i = 0; i < serviceParam.length; i++) {
                switch (serviceParam[i]) {
                    case "CallDisplay":
                        services.callDisplay = true;
                        break;
                    case "CallDisposition":
                        services.callDisposition = true;
                        break;
                    case "RestfulClient":
                        services.restfulClient = true;
                        break;
                    case "call":
                        services.callControl = true;
                        services.remoteCallControl = false;
                        break;
                    case "CallControl":
                        services.callControl = true;
                        services.remoteCallControl = false;
                        break;
                    case "RCC":
                        services.callControl = false;
                        services.remoteCallControl = true;
                        break;
                    case "CallMe":
                        services.callMe = true;
                        break;
                    case "Directory":
                        services.directory = true;
                        break;
                    case "ClickToCall":
                        services.clickToCall = true;
                        break;
                    case "Presence":
                        services.presence = true;
                        break;
                    case "AddressBook":
                        services.contacts = true;
                        break;
                    case "CallLog":
                        services.history = true;
                        break;
                    case "Custom":
                        services.custom = true;
                        break;
                    case "IM":
                        services.IM = true;
                        break;
                    case "Route":
                        services.routes = true;
                        break;
                    default:
                        break;
                }
            }
        }
    };

    this.getUserLocale = function(onSuccess, onFailure) {
        _server.sendGetRequest({
                "url":getWAMUrl(1, "/localization", false)
            },
            function (data) {
                utils.callFunctionIfExist(onSuccess, data);
            },
            onFailure
        );
    };


    /**
     * Returns network connectivity status.
     *
     * @name fcs.isConnected
     * @function
     *
     * @returns {Boolean}, true if connection is up otherwise false.
     */
    this.isConnected = isConnected;



}, fcs;

//@{fcs-jsl-prod}
var Core = function(_server, _globalBroadcaster, _window) {
    return new CoreImpl(_server || server,
                       _globalBroadcaster || globalBroadcaster,
                       _window || window);
};

fcs = new Core();

window.fcs = fcs;
fcs.fcsConfig = fcsConfig;

if (__testonly__) { __testonly__.Core = Core; }
//@{fcs-jsl-prod}



/**
 *
 * LogManager provides javascript logging framework.<br />
 *
 * <br />The logging level strategy is as follows:<br />
 *
 * <br />DEBUG: Used for development and detailed debugging logs<br />
 * INFO: Messages that provide information about the high level flow<br />
 * through. Contain basic information about the actions being performed<br />
 * by the user and/or the system<br />
 * WARN: Things that shouldn't happen but don't have any immediate effect, and should be flagged<br />
 * ERROR: Errors and Exceptions<br />
 * FATAL: Anything that causes the system to enter into an unstable and unusable state<br />
 *
 *
 * @name logManager
 * @namespace
 * @memberOf fcs
 *
 * @version 3.1.3.45
 * @since 3.0.0
 *
 */
var LogManagerImpl = function() {
    var loggers = {},
            enabled = false,
            Level = {
        OFF: "OFF",
        FATAL: "FATAL",
        ERROR: "ERROR",
        WARN: "WARN",
        INFO: "INFO",
        DEBUG: "DEBUG",
        TRACE: "TRACE",
        ALL: "ALL"
    }, _logHandler = null;

    /**
     *
     * Log object.
     *
     * @typedef {Object} logObject
     * @readonly
     * @since 3.0.0
     *
     * @property {String}  user - the user registered to fcs library.
     * @property {String}  timestamp - the time stamp of the log.
     * @property {String}  logger - the name of the logger.
     * @property {String}  level - the level of message.
     * @property {String}  message -  the message string.
     * @property {Object}  args - the arguments.
     *
     */

    /**
     *
     * Log handler function.
     *
     * @typedef {function} logHandler
     * @param {string} loggerName Name of the logger
     * @param {string} level Level of message
     * @param {logObject} logObject Log object
     * @since 3.0.0
     */

    /**
     *
     * Initializes logging using user-provided log handler.
     * @name initLogging
     * @since 3.0.0
     * @function
     * @memberOf fcs.logManager
     *
     * @param {logHandler} logHandler, Function that will receive log entries
     * @param {boolean} enableDebug, Flag defining whether debugging should be enabled or not
     * @returns {undefined}
     *
     * @example
     *
     * function jslLogHandler(loggerName, level, logObject) {
     *     var LOG_LEVEL = fcs.logManager.Level,
     *         msg = logObject.timestamp + " - " + loggerName + " - " + level + " - " + logObject.message;
     *
     *     switch(level) {
     *         case LOG_LEVEL.DEBUG:
     *             window.console.debug(msg, logObject.args);
     *             break;
     *         case LOG_LEVEL.INFO:
     *             window.console.info(msg, logObject.args);
     *             break;
     *         case LOG_LEVEL.ERROR:
     *             window.console.error(msg, logObject.args);
     *             break;
     *             default:
     *             window.console.log(msg, logObject.args);
     *     }
     * }
     *
     * fcs.logManager.initLogging(jslLogHandler, true);
     */
    this.initLogging = function(logHandler, enableDebug) {
        if (!logHandler || typeof logHandler !== 'function') {
            return false;
        }
        _logHandler = logHandler;
        enabled = enableDebug === true ? true : false;
        return true;
    };

    /**
     *
     * Enumerates all possible log levels.
     * @name Level
     * @enum {string}
     * @since 3.0.0
     * @readonly
     * @memberOf fcs.logManager
     * @property {string} [OFF=OFF] string representation of the Off level.
     * @property {string} [FATAL=FATAL]  string representation of the Fatal level.
     * @property {string} [ERROR=ERROR] string representation of the Error level.
     * @property {string} [WARN=WARN] string representation of the Warn level.
     * @property {string} [INFO=INFO] string representation of the Info level.
     * @property {string} [DEBUG=DEBUG] string representation of the Debug level.
     * @property {string} [TRACE=TRACE] string representation of the Trace level.
     * @property {string} [ALL=ALL] string representation of the All level.
     */
    this.Level = Level;

    /**
     * Returns true or false depending on whether logging is enabled.
     *
     * @name isEnabled
     * @function
     * @memberOf fcs.logManager
     *
     * @returns {Boolean}
     * @since 3.0.0
     *
     * @example
     *
     * fcs.logManager.isEnabled();
     *
     */
    this.isEnabled = function() {
        return enabled;
    };

    function Logger(loggerName) {
        var name = loggerName;

        this.getName = function() {
            return name;
        };

        function log(level, message, argument) {
            if (enabled) {
                var logObject = {};

                logObject.user = getUser();
                logObject.timestamp = new Date().getTime();
                logObject.logger = name;
                logObject.level = level;
                logObject.message = message;
                logObject.args = argument;


                if (_logHandler) {
                    try {
                        _logHandler(logObject.logger, logObject.level, logObject);
                    }
                    catch (e) {
                        return undefined;
                    }
                }
            }
            return false;
        }

        this.trace = function trace(msg, argument) {
            return log(Level.TRACE, msg, argument);
        };

        this.debug = function debug(msg, argument) {
            return log(Level.DEBUG, msg, argument);
        };

        this.info = function info(msg, argument) {
            return log(Level.INFO, msg, argument);
        };

        this.warn = function warn(msg, argument) {
            return log(Level.WARN, msg, argument);
        };

        this.error = function error(msg, argument) {
            return log(Level.ERROR, msg, argument);
        };

        this.fatal = function fatal(msg, argument) {
            return log(Level.FATAL, msg, argument);
        };
    }

    this.getLogger = function(loggerName) {
        var logger, _loggerName;
        _loggerName = loggerName ? loggerName.trim().length !== 0 ? loggerName : "Default" : "Default";
        if (loggers[_loggerName]) {
            logger = loggers[_loggerName];
        }
        else {
            logger = new Logger(_loggerName);
            loggers[logger.getName()] = logger;
        }

        return logger;
    };
};
//@{fcs-jsl-prod}
var LogManager = function() {
    return new LogManagerImpl();
};

if (__testonly__) { __testonly__.LogManager = LogManager; }
var logManager = new LogManager();
fcs.logManager = logManager;
//@{fcs-jsl-prod}


var ServiceInvokeManager = function (_logManager,_fcsConfig, _fcsErrors) {
    var logger = _logManager.getLogger("ServiceInvokeManager"),
            serviceName, instance = null, method = null, service = null,
            invokerSuccessCallback, invokerFailureCallback;

    this.invoke = function (serviceInstance, serviceMethodName, data, onSuccess, onFailure) {

        invokerSuccessCallback = onSuccess;
        invokerFailureCallback = onFailure;

        function invokeFailureCallback(reason) {
            logger.error("Service mapping error : " + reason);
            if (typeof invokerFailureCallback === 'function') {
                invokerFailureCallback({errorText: reason});
                return;
            }
            else {
                return;
            }
        }
        if (typeof data !== "object" || data === null) {
            logger.info("Data parameter not object!");
            if (!data) {
                data = {};
                logger.info("Data parameter undefined.Created object for data parameter.");
            } else {
                logger.error("Wrong parameter for data object " + data + " .The process cannot be made");
                invokeFailureCallback(_fcsErrors.INVALID_PARAMETER);
                return;
            }
        }
        serviceName = data.serviceName ? data.serviceName : 'spidr';

        instance = _fcsConfig.serviceManagerMap.get(serviceInstance);
        if (!instance) {
            invokeFailureCallback(_fcsErrors.NOT_ALLOWED_INSTANCE);
            return;
        }

        if (typeof serviceName !== "string") {
            invokeFailureCallback(_fcsErrors.NOT_ALLOWED_SERVICE);
            return;
        }

        service = instance.get(serviceName);

        if (!service) {
            invokeFailureCallback(_fcsErrors.NOT_ALLOWED_SERVICE);
            return;
        }

        method = service[serviceMethodName];

        if (!method) {
            invokeFailureCallback(_fcsErrors.NOT_ALLOWED_METHOD);
            return;
        }

        logger.debug("Called Invoke Method - instance : " + serviceInstance + " service : " + serviceName + " method : " + serviceMethodName);
        return method(data, invokerSuccessCallback, invokerFailureCallback);
    };
};

//@{fcs-jsl-prod}
var serviceInvokeManager = new ServiceInvokeManager(logManager, fcsConfig, fcs.Errors);

if (__testonly__) {__testonly__.ServiceInvokeManager = ServiceInvokeManager;}
//@{fcs-jsl-prod}


function getUrl() {
    var url = "";

    if (!fcsConfig.protocol || !fcsConfig.restUrl || !fcsConfig.restPort) {
        return url;
    }
    return url + fcsConfig.protocol + "://" + fcsConfig.restUrl + ":" + fcsConfig.restPort;
}

function getWAMUrl(version, url, authNeeded) {
    if (authNeeded === false) {
        // Authentcation is not needed.
        return getUrl() + "/rest/version/" + (version ? version : "latest") + url;
    } else {
        // Authentcation is needed for the rest request
        if (fcs.notification) {
            return getUrl() + "/rest/version/" + (version ? version : "latest") + (fcs.notification.isAnonymous() ? "/anonymous/" : "/user/") + fcs.getUser() + url;
        }
        else {
            return getUrl() + "/rest/version/" + (version ? version : "latest") + "/user/" + fcs.getUser() + url;
        }
    }
}

function getAbsolutePath() {
    var loc = window.location, pathName = loc.pathname.substring(0, loc.pathname.lastIndexOf('/') + 1);
    return loc.href.substring(0, loc.href.length - ((loc.pathname + loc.search + loc.hash).length - pathName.length));
}



var CookieStorage = function() {
    // Get an object that holds all cookies
    var cookies = (function() {
        var cookies = {},
            all = document.cookie,
            list,
            i = 0,
            cookie, firstEq, name, value;
        if (all === "") {
            return cookies;
        }

        // Split into individual name=value pairs
        list = all.split("; ");

        for(; i < list.length; i += 1) {
            cookie = list[i];
            // Find the first = sign
            firstEq = cookie.indexOf("=");
            // Get cookie name
            name = cookie.substring(0, firstEq);
            // Get cookie value
            value = cookie.substring(firstEq+1);
            // Decode the value
            value = decodeURIComponent(value);

            cookies[name] = value;
        }
        return cookies;
    }()),

    // Collect the cookie names in an array
    keys = [],
    key;
    for(key in cookies) {
        if(cookies.hasOwnProperty(key)){
            keys.push(key);
        }

    }
    // Public API
    this.length = keys.length;


    // Return the name of the nth cookie, or null if n is out of range
    this.key = function(n) {
        if (n < 0 || n >= keys.length) {
            return null;
        }

        return keys[n];
    };

    // Return the value of the named cookie, or null.
    this.getItem = function(name) {
        if (arguments.length !== 1) {
            throw new Error("Provide one argument");
        }

        return cookies[name] || null;
    };

    this.setItem = function(key, value) {
        if (arguments.length !== 2) {
           throw new Error("Provide two arguments");
        }

        if (cookies[key] === undefined) { // If no existing cookie with this name
            keys.push(key);
            this.length++;
        }

        cookies[key] = value;

        var cookie = key + "=" + encodeURIComponent(value),
        today = new Date(),
        expiry = new Date(today.getTime() + 30 * 24 * 3600 * 1000);
        // Add cookie attributes to that string

        cookie += "; max-age=" + expiry;


        cookie += "; path=/";

        // Set the cookie through the document.cookie property
        document.cookie = cookie;
    };

    // Remove the specified cookie
    this.removeItem = function(key) {
        if (arguments.length !== 1) {
            throw new Error("Provide one argument");
        }

        var i = 0, max;
        if (cookies[key] === undefined) { // If it doesn't exist, do nothing
            return;
        }

        // Delete the cookie from our internal set of cookies
        delete cookies[key];

        // And remove the key from the array of names, too.
        for(max = keys.length; i < max; i += 1) {
            // When we find the one we want
            if (keys[i] === key) {
                // Remove it from the array.
                keys.splice(i,1);
                break;
            }
        }

        // Decrement cookie length
        this.length--;

        // Actually delete the cookie
        document.cookie = key + "=; max-age=0";
    };

    // Remove all cookies
    this.clear = function() {
        var i = 0;
        for(; i < keys.length; i++) {
            document.cookie = keys[i] + "=; max-age=0";
        }

        // Reset our internal state
        cookies = {};
        keys = [];
        this.length = 0;
    };
};

//@{fcs-jsl-prod}
if (__testonly__) { __testonly__.CookieStorage = CookieStorage; }
//@{fcs-jsl-prod}

//@{fcs-jsl-prod}
var cache = (typeof window.localStorage !== 'undefined') ? window.localStorage : new CookieStorage();
window.cache = cache;
//@{fcs-jsl-prod}


var Utils = function(_logManager) {
    var logger = _logManager.getLogger("utils");

    this.getProperty = function(obj, property) {
        return ((typeof obj[property]) === 'undefined') ? null : obj[property];
    };

    this.callFunctionIfExist = function() {
        var args = Array.prototype.slice.call(arguments), func;
        func = args.shift();
        if (typeof (func) === 'function') {
            try {
                return func.apply(null, args);
            }
            catch (e) {
                logger.error("Exception occured:\n" + e.stack);
            }
        }
        else {
            logger.info("Not a function:" + func);
        }
    };

    this.compose = function(base, extendme) {
        var prop;
        for (prop in base) {
            if (typeof base[prop] === 'function' && !extendme[prop]) {
                extendme[prop] = base[prop].bind(base);
            }
        }
    };

    this.getTimestamp = function() {
        return new Date().getTime();
    };

    this.Queue = function() {

        var items;

        this.enqueue = function(item) {
            if (typeof(items) === 'undefined') {
                items = [];
            }
            items.push(item);
        };

        this.dequeue = function() {
            return items.shift();
        };

        this.peek = function() {
            return items[0];
        };

        this.size = function() {
            return typeof(items)==='undefined' ? 0 : items.length;
        };
    };

    this.getQueue = function(){
        return new this.Queue();
    };

    /*
     * Similar to http://api.jquery.com/jquery.param/
     *
     */
    this.serialize = function (object) {
        var encodedString = '',
                prop;
        for (prop in object) {
            if (object.hasOwnProperty(prop)) {
                if (encodedString.length > 0) {
                    encodedString += '&';
                }
                encodedString += encodeURI(prop + '=' + object[prop]);
            }
        }
        return encodedString;
    };

};

/* jshint ignore:start */
/*
 * Function.prototype.bind function not supported in phantom.js (used for unit test specs),
 * this fix, provides support for this function.
 *
 * TODO: This function should be checked in new release of phantom.js and
 * should be removed if not necessary anymore
 */
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        FNOP    = function() {},
        FBound  = function() {
          return fToBind.apply(this instanceof FNOP && oThis
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    FNOP.prototype = this.prototype;
    FBound.prototype = new FNOP();

    return FBound;
  };
}
/* jshint ignore:end */

//@{fcs-jsl-prod}
var utils = new Utils(logManager);

if (__testonly__) { __testonly__.UtilsQueue = utils.Queue;}
//@{fcs-jsl-prod}

/* global cache, base64_decode, base64_encode, utils*/

var TurnCredentialsManagerImpl = function (_cache, _utils) {
    var self = this, CREDENTIALS_CACHE_KEY = "JSL/VHVybkNyZWRlbnRpYWxz";

    self.get = function () {
        return JSON.parse(base64_decode(_cache.getItem(CREDENTIALS_CACHE_KEY)));
    };

    self.save = function (data) {
        _cache.setItem(CREDENTIALS_CACHE_KEY, base64_encode(JSON.stringify(data)));
        _utils.callFunctionIfExist(self.onCredentialsReceived);
    };

    self.remove = function () {
        _cache.removeItem(CREDENTIALS_CACHE_KEY);
    };
};

//@{fcs-jsl-prod}
var turnCredentialsManager = new TurnCredentialsManagerImpl(cache, utils);
//@{fcs-jsl-prod}


var SDPParserImpl = function (_logManager, _fcsConfig, _CONSTANTS) {
    var logger = _logManager.getLogger("sdpParser"),
            self, mediaDescriptions, sessionDescription,
            nl = "\n", lf = "\r";

    this.init = function (sdpData) {
        self = this;
        self.sessionDescription = {};
        self.mediaDescriptions = [];
        self.sdp = sdpData;
        self.parseSDP();
        self.setSessionDescriptionAttributes();
        self.setMediaDescriptionsAttributes();
    };

    this.parseSDP = function () {
        var descriptions = [], index = 1, mediaDescription;
        descriptions = self.sdp.split(/^(?=m=)/m);
        self.sessionDescription.data = descriptions[0];
        for (index; index < descriptions.length; index++) {
            mediaDescription = {};
            mediaDescription.data = descriptions[index];
            self.mediaDescriptions.push(mediaDescription);
        }
    };

    this.setSessionDescriptionAttributes = function () {
        var line = 0, sessionDescriptions = self.sessionDescription.data.split(/\r\n|\r|\n/), connectionData;

        for (line; line < sessionDescriptions.length; line++) {
            if ((sessionDescriptions[line].match("^e="))) {
                self.sessionDescription.email = sessionDescriptions[line].split('=')[1];
            }
            else if ((sessionDescriptions[line].match("^c="))) {
                connectionData = sessionDescriptions[line].split('=')[1];
                self.sessionDescription.connection = connectionData;
                self.sessionDescription.ip = connectionData.split(' ')[2];
            }
        }
    };

    this.setMediaDescriptionsAttributes = function () {
        var line = 0, mediaDescriptionIndex, mediaDescriptionAttributes, mediaData, connectionData;

        for (mediaDescriptionIndex in self.mediaDescriptions) {
            if (self.mediaDescriptions.hasOwnProperty(mediaDescriptionIndex)) {
                mediaDescriptionAttributes = self.mediaDescriptions[mediaDescriptionIndex].data.split(/\r\n|\r|\n/);
                this.mediaDescriptions[mediaDescriptionIndex].direction = "sendrecv";
                for (line in mediaDescriptionAttributes) {
                    if (mediaDescriptionAttributes.hasOwnProperty(line)) {
                        //direction default sendrcv setle
                        if ((mediaDescriptionAttributes[line].match("^m="))) {
                            mediaData = mediaDescriptionAttributes[line].split('=')[1];
                            self.mediaDescriptions[mediaDescriptionIndex].media = mediaData;
                            self.mediaDescriptions[mediaDescriptionIndex].port = mediaData.split(' ')[1];
                        }
                        else if ((mediaDescriptionAttributes[line].match("^a=sendrecv")) || (mediaDescriptionAttributes[line].match("^a=sendonly")) || (mediaDescriptionAttributes[line].match("^a=recvonly")) || (mediaDescriptionAttributes[line].match("^a=inactive"))) {
                            self.mediaDescriptions[mediaDescriptionIndex].direction = mediaDescriptionAttributes[line].split('=')[1];
                        }
                        else if ((mediaDescriptionAttributes[line].match("^c="))) {
                            connectionData = mediaDescriptionAttributes[line].split('=')[1];
                            self.mediaDescriptions[mediaDescriptionIndex].connection = connectionData;
                            self.mediaDescriptions[mediaDescriptionIndex].ip = connectionData.split(' ')[2];
                        }
                    }
                }
            }
        }

    };

    this.isHold = function (isRemote) {
        var isHold = false, ip, media_index = 0, mediaDesc, direction;
        for (media_index in self.mediaDescriptions) {
            if (self.mediaDescriptions.hasOwnProperty(media_index)) {
                mediaDesc = this.mediaDescriptions[media_index];
                if (mediaDesc.ip) {
                    ip = mediaDesc.ip;
                }
                else {
                    if (self.sessionDescription.ip) {
                        ip = self.sessionDescription.ip;
                    }
                }

                if (mediaDesc.port !== 0) {
                    if ((mediaDesc.direction === "inactive") ||
                            ((mediaDesc.direction === "sendonly") && isRemote) ||
                            ((mediaDesc.direction === "recvonly") && !isRemote) ||
                            (ip === "0.0.0.0")) {
                        isHold = true;
                    }
                    else {
                        isHold = false;
                        break;
                    }
                }
            }
        }
        return isHold;
    };

    this.isRemoteHold = function () {
        return this.isHold(true);
    };

    this.isLocalHold = function () {
        return this.isHold(false);
    };

    this.getSessionDescription = function () {
        return self.sessionDescription;
    };

    this.getMediaDescriptions = function () {
        return self.mediaDescriptions;
    };

    this.isSdpHas = function (pSdp, type) {
        var result = false;

        if (pSdp === null || pSdp === undefined) {
            return result;
        }

        if (pSdp.indexOf(_CONSTANTS.SDP.M_LINE + type) !== -1) {
            result = true;
            return result;
        }

        return result;
    };

    this.isSdpHasAudio = function (pSdp) {
        return this.isSdpHas(pSdp, _CONSTANTS.STRING.AUDIO);
    };

    this.isSdpHasVideo = function (pSdp) {
        return this.isSdpHas(pSdp, _CONSTANTS.STRING.VIDEO);
    };

    this.isSdpHasUfrag = function (pSdp) {
        var result = false;

        if (pSdp === null || pSdp === undefined) {
            return result;
        }

        if (pSdp.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.SDP.ICE_UFRAG) !== -1) {
            result = true;
            return result;
        }

        return result;
    };

    this.isSdpHasMediaWithExpectedPort = function (pSdp, type, port) {
        if (pSdp === null || pSdp === undefined) {
            return false;
        }
        return pSdp.indexOf(_CONSTANTS.SDP.M_LINE + type + " " + port) !== -1;
    };

    this.isSdpHasAudioWithZeroPort = function (pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, _CONSTANTS.STRING.AUDIO, 0);
    };

    this.isSdpHasVideoWithZeroPort = function (pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, _CONSTANTS.STRING.VIDEO, 0);
    };

    this.isSdpHasAudioWithOnePort = function (pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, _CONSTANTS.STRING.AUDIO, 1);
    };

    this.isSdpHasVideoWithOnePort = function (pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, _CONSTANTS.STRING.VIDEO, 1);
    };

    this.isSdpHasAudioWithNinePort = function (pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, _CONSTANTS.STRING.AUDIO, 9);
    };

    this.isSdpHasVideoWithNinePort = function (pSdp) {
        return this.isSdpHasMediaWithExpectedPort(pSdp, _CONSTANTS.STRING.VIDEO, 9);
    };

    this.replaceZeroVideoPortWithOne = function (pSdp) {
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }
        if (this.isSdpHasVideoWithZeroPort(pSdp)) {
            pSdp = pSdp.replace(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " 0 ", _CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " 1 ");
        }
        return pSdp;
    };

    this.getSdpDirection = function (pSdp, type) {
        var substr = "", descriptions = [], index,
                direction = _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, logmsg;

        logmsg = function (state) {
            logger.info("getSdpDirection: type= " + type + " state= " + state);
        };

        if (!this.isSdpHas(pSdp, type)) {
            logmsg(direction);
            return direction;
        }

        if (this.isSdpHasMediaWithExpectedPort(pSdp, type, 0)) {
            // return if media port is 0
            logmsg(direction);
            return direction;
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (substr.indexOf(_CONSTANTS.SDP.M_LINE + type) !== -1) {
                if (substr.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) !== -1) {
                    direction = _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) !== -1) {
                    direction = _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) !== -1) {
                    direction = _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) !== -1) {
                    logmsg(direction);
                    return direction;
                }
                direction = _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
                return direction;
            }
        }
        direction = _CONSTANTS.WEBRTC.MEDIA_STATE.NOT_FOUND;
        logmsg(direction);
        return direction;
    };

    this.getAudioSdpDirection = function (pSdp) {
        return this.getSdpDirection(pSdp, _CONSTANTS.STRING.AUDIO);
    };

    this.getVideoSdpDirection = function (pSdp) {
        return this.getSdpDirection(pSdp, _CONSTANTS.STRING.VIDEO);
    };

    this.isAudioSdpDirectionInactive = function (pSdp) {
        return this.getAudioSdpDirection(pSdp) === _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE;
    };

    this.isAudioSdpDirectionSendrecv = function (pSdp) {
        return this.getAudioSdpDirection(pSdp) === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
    };

    this.isAudioSdpDirectionSendonly = function (pSdp) {
        return this.getAudioSdpDirection(pSdp) === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY;
    };

    this.isAudioSdpDirectionRecvonly = function (pSdp) {
        return this.getAudioSdpDirection(pSdp) === _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
    };

    this.isSdpContainsAudioDirection = function (pSdp) {
        return this.getAudioSdpDirection(pSdp) !== _CONSTANTS.WEBRTC.MEDIA_STATE.NOT_FOUND;
    };

    this.isVideoSdpDirectionInactive = function (pSdp) {
        return this.getVideoSdpDirection(pSdp) === _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE;
    };

    this.isVideoSdpDirectionSendrecv = function (pSdp) {
        return this.getVideoSdpDirection(pSdp) === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
    };

    this.isVideoSdpDirectionSendonly = function (pSdp) {
        return this.getVideoSdpDirection(pSdp) === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY;
    };

    this.isVideoSdpDirectionRecvonly = function (pSdp) {
        return this.getVideoSdpDirection(pSdp) === _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
    };

    this.isSdpContainsVideoDirection = function (pSdp) {
        return this.getVideoSdpDirection(pSdp) !== _CONSTANTS.WEBRTC.MEDIA_STATE.NOT_FOUND;
    };

    this.changeDirection = function (pSdp, directionBefore, directionAfter, type) {
        var sdp = "", substr, descriptions = [], index,
                msg = "changeDirection: before= " + directionBefore + " after= " + directionAfter;

        if (directionBefore === directionAfter) {
            //no need to change direction
            return pSdp;
        }

        if (type === undefined || type === null) {
            logger.info(msg + " for all media types");
        } else if (directionBefore !== this.getSdpDirection(pSdp, type)) {
            //Ignore changing the direction if the "directionBefore" and existing directions do not match
            return pSdp;
        } else {
            logger.info(msg + " type= " + type);
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (type === undefined || type === null || substr.indexOf(_CONSTANTS.SDP.M_LINE + type) !== -1) {
                substr = substr.replace(_CONSTANTS.SDP.A_LINE + directionBefore, _CONSTANTS.SDP.A_LINE + directionAfter);
            }
            sdp = sdp + substr;
        }

        return sdp;
    };

    this.updateSdpDirection = function (pSdp, type, direction) {
        logger.info("updateSdpDirection: type= " + type + " direction= " + direction);
        var beforeDirection = this.getSdpDirection(pSdp, type);
        return this.changeDirection(pSdp, beforeDirection, direction, type);
    };

    this.updateAudioSdpDirection = function (pSdp, direction) {
        logger.info("updateSdpDirection: type= " + _CONSTANTS.STRING.AUDIO + " direction= " + direction);
        var beforeDirection = this.getSdpDirection(pSdp, _CONSTANTS.STRING.AUDIO);
        return this.changeDirection(pSdp, beforeDirection, direction, _CONSTANTS.STRING.AUDIO);
    };

    this.updateVideoSdpDirection = function (pSdp, direction) {
        logger.info("updateSdpDirection: type= " + _CONSTANTS.STRING.VIDEO + " direction= " + direction);
        var beforeDirection = this.getSdpDirection(pSdp, _CONSTANTS.STRING.VIDEO);
        return this.changeDirection(pSdp, beforeDirection, direction, _CONSTANTS.STRING.VIDEO);
    };

    this.updateAudioSdpDirectionToInactive = function (pSdp) {
        return this.updateAudioSdpDirection(pSdp, _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
    };

    this.updateVideoSdpDirectionToInactive = function (pSdp) {
        return this.updateVideoSdpDirection(pSdp, _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
    };

    this.isSdpHasDirection = function (pSdp) {
        var sr_indx, so_indx, ro_indx, in_indx;
        if (pSdp === null || pSdp === undefined) {
            return false;
        }

        sr_indx = pSdp.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, 0);
        so_indx = pSdp.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, 0);
        ro_indx = pSdp.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, 0);
        in_indx = pSdp.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, 0);
        return (sr_indx + 1) + (so_indx + 1) + (ro_indx + 1) + (in_indx + 1) === 0 ? false : true;
    };

    this.isSdpEnabled = function (pSdp, type) {
        var direction, msg = "isSdpEnabled for type " + type + ": ", result = false;
        if (pSdp === null || pSdp === undefined) {
            return false;
        }

        if (this.isSdpHasMediaWithExpectedPort(pSdp, type, 0)) {
            // return if media port is 0
            logger.info(msg + result);
            return result;
        }
        if (type === _CONSTANTS.STRING.VIDEO) {
            direction = this.getVideoSdpDirection(pSdp);
            if (direction === _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY || direction === _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                logger.info(msg + result);
                return result;
            }
        }
        if (this.isSdpHas(pSdp, type)) {
            result = true;
        }
        logger.info(msg + result);
        return result;
    };

    this.isAudioSdpEnabled = function (pSdp) {
        return this.isSdpEnabled(pSdp, _CONSTANTS.STRING.AUDIO);
    };

    this.isVideoSdpEnabled = function (pSdp) {
        return this.isSdpEnabled(pSdp, _CONSTANTS.STRING.VIDEO);
    };

    this.isSdpVideoReceiveEnabled = function (pSdp) {
        var direction, msg = "isSdpVideoReceiveEnabled: ", result = false;
        if (pSdp === null || pSdp === undefined) {
            return false;
        }

        if (pSdp.indexOf(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " 0") !== -1) {
            logger.info(msg + result);
            return result;
        }

        direction = this.getVideoSdpDirection(pSdp);
        if (direction === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY || direction === _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
            logger.info(msg + result);
            return result;
        }

        if (pSdp.indexOf(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO) !== -1) {
            result = true;
            logger.info(msg + result);
            return result;
        }

        logger.info(msg + result);
        return result;
    };

    this.updateH264Level = function (pSdp) {
        var sdp = "", substr = "", descriptions = [], index, reg = /\r\n|\r|\n/m, video_arr, i, new_substr = "", elm, elm_array;

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (substr.indexOf(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO) !== -1) {
                video_arr = substr.split(reg);
                for (i = 0; i < video_arr.length; i++) {
                    elm = video_arr[i];
                    if (elm && elm.indexOf("a=rtpmap:") !== -1 && elm.indexOf("H264") !== -1) {
                        elm_array = elm.split(/\:| /m);
                        elm = elm + _CONSTANTS.STRING.CARRIAGE_RETURN + _CONSTANTS.STRING.NEW_LINE;
                        elm = elm + "a=fmtp:" + elm_array[1] + " profile-level-id=428014;";
                        elm = elm + _CONSTANTS.STRING.CARRIAGE_RETURN + _CONSTANTS.STRING.NEW_LINE;
                        // Workaround for issue 1603.
                    } else if (elm && elm !== "") {
                        elm = elm + _CONSTANTS.STRING.CARRIAGE_RETURN + _CONSTANTS.STRING.NEW_LINE;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }
        return sdp;
    };
    /*
     * Firefox only accepts 42E0xx and above profile-id-level.
     * In order not to get setRemoteDescription failure we fix the H264 level
     * This snippet changes all H264 levels with 4280xx to 42E0xx
     */
    this.updateH264LevelTo42E01F = function (pSdp, isH264Enabled) {
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }
        if (isH264Enabled) {
            logger.debug('Updating the H264 profile-level-id to 42e01f');
            pSdp = pSdp.replace(/profile-level-id=4280/g, 'profile-level-id=42e0');
        }
        return pSdp;
    };

    this.isSdpVideoCandidateEnabled = function (pSdp) {
        var msg = "isSdpVideoCandidateEnabled: ", result = false;

        if (this.isSdpHasVideoWithZeroPort(pSdp) ||
                this.isVideoSdpDirectionInactive(pSdp)) {
            logger.info(msg + result);
            return result;
        } else if (!this.isSdpHasVideo(pSdp)) {
            result = true;
            logger.info(msg + result);
            return true;
        }

        logger.info(msg + result);
        return result;
    };

    this.deleteFingerprintFromSdp = function (sdp, isDtlsEnabled) {
        if (sdp === null || sdp === undefined) {
            return sdp;
        }
        if (isDtlsEnabled) {
            return sdp;
        }
        while (sdp.indexOf("a=fingerprint:") !== -1) {
            sdp = sdp.replace(/(a=fingerprint:[\w\W]*?(:\r|\n))/, "");
        }
        while (sdp.indexOf("a=setup:") !== -1) {
            sdp = sdp.replace(/(a=setup:[\w\W]*?(:\r|\n))/, "");
        }
        return sdp;
    };

    this.deleteCryptoFromSdp = function (sdp, isDtlsEnabled) {
        if (sdp === null || sdp === undefined) {
            return;
        }
        if (!isDtlsEnabled) {
            return sdp;
        }
        while (sdp.indexOf("a=crypto:") !== -1) {
            sdp = sdp.replace(/(a=crypto:[\w\W]*?(:\r|\n))/, "");
        }
        return sdp;
    };

    this.deleteCryptoZeroFromSdp = function (sdp) {
        if (sdp === null || sdp === undefined) {
            return sdp;
        }

        while (sdp.indexOf("a=crypto:0") !== -1) {
            sdp = sdp.replace(/(a=crypto:0[\w\W]*?(:\r|\n))/, "");
        }
        return sdp;
    };

    /*
     * updateAudioCodec: removes codecs listed in config file from codec list. Required for DTMF until the bug is fixed.
     * @param {type} pSdp
     */
    this.updateAudioCodec = function (pSdp) {
        var sdp = "", substr = "", descriptions = [], index, reg = /\r\n|\r|\n/m, audio_arr, i, new_substr = "", elm,
                remcodec, regExpCodec, codecsToRemove = [], j, remrtpmap;

        remrtpmap = "";
        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasAudio(substr)) {
                audio_arr = substr.split(reg);
                for (i = 0; i < audio_arr.length; i++) {
                    elm = audio_arr[i];
                    if (elm && this.isSdpHasAudio(elm)) {
                        // remove audio codecs given in config file from m=audio line
                        codecsToRemove = _fcsConfig.codecsToRemove;
                        if (codecsToRemove !== undefined) {
                            for (j = 0; j < codecsToRemove.length; j++) {
                                remcodec = codecsToRemove[j];
                                regExpCodec = new RegExp(" " + remcodec, "g");
                                elm = elm.replace(regExpCodec, "");

                                if (j !== 0) {
                                    remrtpmap = remrtpmap + "|";
                                }
                                remrtpmap = remrtpmap + remcodec;
                            }
                        }
                        elm = elm + lf + nl;
                        // Workaround for issue 1603.
                    } else if (elm && elm.indexOf("a=fmtp") !== -1) {
                        elm = elm.replace(/a=fmtp[\w\W]*/, "");
                    } else if (elm && elm !== "") {
                        elm = elm + lf + nl;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }
        // remove rtpmap of removed codecs
        if (remrtpmap !== "") {
            regExpCodec = new RegExp("a=rtpmap:(?:" + remrtpmap + ").*\r\n", "g");
            sdp = sdp.replace(regExpCodec, "");
        }
        return sdp;
    };

    /*
     * removeAudioCodec: removes given codec type from sdp.
     * @param {type} pSdp
     * @param {type} codecToRemove
     */
    this.removeAudioCodec = function (pSdp, codecToRemove) {
        var sdp = "", substr = "", descriptions = [], index, reg = /\r\n|\r|\n/m, audio_arr, i,
                new_substr = "", elm, elm2, regExpCodec;

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasAudio(substr)) {
                audio_arr = substr.split(reg);
                for (i = 0; i < audio_arr.length; i++) {
                    elm = audio_arr[i];
                    if (elm && this.isSdpHasAudio(elm)) {
                        // remove given audio codec from m=audio line
                        regExpCodec = new RegExp(" " + codecToRemove + "($| )", "m");
                        elm2 = audio_arr[i].split(/RTP[\w\W]*/);
                        elm = elm.replace(/(\m=audio+)\s(\w+)/, "");
                        elm = elm.trim();
                        elm = elm.replace(regExpCodec, " ");
                        elm = elm2[0] + elm + lf + nl;
                        // Workaround for issue 1603.
                    } else if (elm && elm.indexOf("a=fmtp:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=fmtp[\w\W]*/, "");
                    } else if (elm && elm.indexOf("a=rtpmap:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=rtpmap[\w\W]*/, "");
                    } else if (elm && elm.indexOf("a=rtcp-fb:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=rtcp-fb[\w\W]*/, "");
                    } else if (elm && elm !== "") {
                        elm = elm + lf + nl;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }
        return sdp;
    };

    /*
     * removeRTXCodec: this function will remove rtx video codec
     */
    this.removeRTXCodec = function (pSdp) {
        var rtxPayloadType, vp8SSRC, rtxSSRC;
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        vp8SSRC = this.getVp8Ssrc(pSdp);
        logger.debug("vp8SSRC = " + vp8SSRC);

        rtxSSRC = this.getRtxSsrc(pSdp);
        logger.debug("rtxSSRC = " + rtxSSRC);

        pSdp = this.removeSsrcId(pSdp, rtxSSRC);

        pSdp = pSdp.replace(/(a=ssrc-group:FID[\w\W]*?(:\r|\n))/g, "");

        if (pSdp.indexOf("rtx/90000") === -1) {
            return pSdp;
        }

        rtxPayloadType = this.getRTXPayloadType(pSdp);

        logger.debug("removeRTXCodec : Removing rtx video codec " + rtxPayloadType);
        pSdp = this.removeVideoCodec(pSdp, rtxPayloadType);

        return pSdp;
    };

    this.getVp8Ssrc = function (pSdp) {
        var splitArray, ssrcGroupArray, ssrcArray, i, reg = /\r\n|\r|\n/m;
        if (pSdp === null || pSdp === undefined) {
            return -1;
        }

        if (pSdp.indexOf("a=ssrc-group:FID ") === -1) {
            return -1;
        }

        splitArray = pSdp.split("a=ssrc-group:FID ");
        ssrcGroupArray = splitArray[1].split(reg);
        ssrcArray = ssrcGroupArray[0].split(" ");

        for (i = 0; i < ssrcArray.length; i++) {
            logger.debug("ssrcArray[" + i + "] : " + ssrcArray[i]);
        }

        return ssrcArray[0];
    };

    this.getRtxSsrc = function (pSdp) {
        var splitArray, ssrcGroupArray, ssrcArray, i, reg = /\r\n|\r|\n/m;
        if (pSdp === null || pSdp === undefined) {
            return -1;
        }

        if (pSdp.indexOf("a=ssrc-group:FID ") === -1) {
            return -1;
        }

        splitArray = pSdp.split("a=ssrc-group:FID ");
        ssrcGroupArray = splitArray[1].split(reg);
        ssrcArray = ssrcGroupArray[0].split(" ");

        for (i = 0; i < ssrcArray.length; i++) {
            logger.debug("ssrcArray[" + i + "] : " + ssrcArray[i]);
        }

        return ssrcArray[1];
    };

    /*
     * removeSsrcId: removes given SSRC ID from sdp.
     */
    this.removeSsrcId = function (pSdp, ssrcId) {
        var sdp = "", reg = /\r\n|\r|\n/m, ssrc_arr, i, new_substr = "", elm;
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        ssrc_arr = pSdp.split(reg);
        for (i = 0; i < ssrc_arr.length; i++) {
            elm = ssrc_arr[i];
            if (elm && elm.indexOf("a=ssrc:" + ssrcId) !== -1) {
                elm = elm.replace(/a=ssrc:[\w\W]*/, "");
            } else if (elm && elm !== "") {
                elm = elm + lf + nl;
            }
            new_substr = new_substr + elm;
        }
        sdp = new_substr;

        return sdp;
    };

    /*
     * removeG722Codec: this function will remove G722 audio codec
     * @param {type} pSdp
     */
    this.removeG722Codec = function (pSdp) {
        return pSdp;
    };

    this.getPayloadTypeOf = function (codecString, pSdp) {
        var rtpMapNumber, rtpMapArray, payloadTypeArray = [], index;

        if (pSdp.indexOf(codecString) === -1) {
            return -1;
        }
        rtpMapArray = pSdp.match(/(a=rtpmap[\w\W]*?(:\r|\n))/g);
        for (index = 0; index < rtpMapArray.length; index++) {
            if (rtpMapArray[index].search(new RegExp(codecString, 'i')) !== -1) {
                /*jslint regexp: false*/
                rtpMapNumber = rtpMapArray[index].match(/^[^\d]*(\d+)/g);
                rtpMapNumber = rtpMapNumber[0].split(':');
                payloadTypeArray.push(rtpMapNumber[1]);
                /*jslint regexp: true*/
            }
        }

        logger.debug("getPayloadTypeOf(" + codecString + ") = " + payloadTypeArray[0]);

        if (payloadTypeArray.length < 2) {
            // if codec has just one match, then returns it as String for compatibility of old methods
            return payloadTypeArray[0];
        } else {
            return payloadTypeArray;
        }
    };

    /*
     * Replaces new telephone event code in pSdp with the oldCode
     * This is needed for WebRTC engine compatibility
     * If an offer has a different telephone event code than what is already negotiated in that session, webrtc engine gives error
     * Ex: Negotitation is firstly done with 126, but then the call server sends an offer with 96
     * @param {type} pSdp
     * @param {type} oldCode
     * @param {type} newCode
     */
    this.replaceTelephoneEventPayloadType = function (pSdp, oldCode, newCode) {
        var finalsdp, regex, matches, tempAudioLine, descriptions, index, substr, partialsdp = "", number = "";

        if (!pSdp || (pSdp.indexOf("telephone-event") === -1)) {
            return pSdp;
        }

        regex = /^\.*(a=rtpmap:)(\d*)( telephone-event[ \w+ ]*[ \/+ ]*[ \w+ ]*)\r\n?/m;

        /* example: matches= ["a=rtpmap:96 telephone-event/8000\r\n", "a=rtpmap:", "96", " telephone-event/8000"] */

        if (oldCode === newCode) { // telephone event has not changed
            // nothing has changed, return without any changes
            return pSdp;
        }

        // telephone event has changed
        finalsdp = pSdp;

        // replace rtpmap
        regex = new RegExp("^\\.*a=rtpmap:" + newCode + " telephone-event[ \\/+ ]*([ \\w+ ]*)\\r\n", "m");
        matches = finalsdp.match(regex);
        if (matches !== null && matches.length >= 2 && matches[1] !== "") {
            number = matches[1];
        } else {
            number = 8000;
        }
        finalsdp = finalsdp.replace(regex, 'a=rtpmap:' + oldCode + ' telephone-event/' + number + '\r\n');

        // replace audio line
        regex = new RegExp("^\\.*(m=audio )[ \\w+ ]*[ \\/+ ]*[ \\w+ ]*( " + newCode + ")", "mg");
        matches = finalsdp.match(regex);

        if (matches !== null && matches.length >= 1 && matches[0] !== "") {
            tempAudioLine = matches[0];
            tempAudioLine = tempAudioLine.replace(newCode, oldCode);
            finalsdp = finalsdp.replace(regex, tempAudioLine);
        }

        // replace fmtp
        // only audio section needs to be considered, do not change video section
        descriptions = finalsdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasAudio(substr)) {
                regex = new RegExp("^\\.*a=fmtp:" + newCode, "mg");
                substr = substr.replace(regex, 'a=fmtp:' + oldCode);
            }
            partialsdp = partialsdp + substr;
        }
        if (partialsdp !== "") {
            finalsdp = partialsdp;
        }
        logger.debug("replaceTelephoneEventPayloadType: newcode " + newCode + " is replaced with oldcode " + oldCode);
        return finalsdp;
    };

    /*
     * Replaces opus codec in pSdp with the default codec number 109
     * (TODO: get the codec from config.json)
     * This is needed for trancoder enabled peer-to-peer scenarios
     * transcoder only accepts opus codec that it offers
     * @param {type} pSdp
     */
    this.replaceOpusCodec = function (pSdp) {
        var regex, matches, tempAudioLine, oldCodecNumber = "",
                defaultCodecNumber = 109, descriptions, index, substr, partialsdp = "";

        if (!pSdp || (pSdp.indexOf("opus") === -1)) {
            return pSdp;
        }

        regex = /^\.*(a=rtpmap:)(\d*)( opus)/m;
        /* example: matches= ["a=rtpmap:109 opus/48000/2\r\n", "a=rtpmap:", "111", " opus/48000/2"] */

        matches = pSdp.match(regex);
        if (matches !== null && matches.length >= 3 && matches[2] !== "") {
            oldCodecNumber = matches[2];
        }
        else {
            logger.warn("sdp has opus without codec number");
        }
        // replace rtpmap
        pSdp = pSdp.replace(regex, 'a=rtpmap:' + defaultCodecNumber + ' opus');

        // replace audio line
        regex = new RegExp("^\\.*(m=audio )[ \\w+ ]*[ \\/+ ]*[ \\w+ ]*( " + oldCodecNumber + ")", "mg");
        matches = pSdp.match(regex);

        if (matches !== null && matches.length >= 1 && matches[0] !== "") {
            tempAudioLine = matches[0];
            tempAudioLine = tempAudioLine.replace(oldCodecNumber, defaultCodecNumber);
            pSdp = pSdp.replace(regex, tempAudioLine);
        }

        // replace fmtp
        // only audio section needs to be considered, do not change video section
        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasAudio(substr)) {
                regex = new RegExp("^\\.*a=fmtp:" + oldCodecNumber, "mg");
                substr = substr.replace(regex, 'a=fmtp:' + defaultCodecNumber);
            }
            partialsdp = partialsdp + substr;
        }
        if (partialsdp !== "") {
            pSdp = partialsdp;
        }
        logger.debug("replaceOpusCodec: new codec= " + defaultCodecNumber);
        return pSdp;
    };

    this.getG7228000PayloadType = function (pSdp) {
        return this.getPayloadTypeOf("G722/8000", pSdp);
    };

    this.getVP8PayloadType = function (pSdp) {
        return this.getPayloadTypeOf("VP8/90000", pSdp);
    };

    this.getG72216000PayloadType = function (pSdp) {
        return this.getPayloadTypeOf("G722/16000", pSdp);
    };

    this.getRTXPayloadType = function (pSdp) {
        return this.getPayloadTypeOf("rtx/90000", pSdp);
    };

    this.getH264PayloadType = function (pSdp) {
        return this.getPayloadTypeOf("H264/90000", pSdp);
    };

    this.isSdpHasTelephoneEventWithRate = function (pSdp, rate) {
        if (pSdp === null || pSdp === undefined) {
            return false;
        }
        return pSdp.indexOf("telephone-event/" + rate) !== -1;
    };

    this.isSdpHasTelephoneEvent = function (pSdp) {
        if (pSdp === null || pSdp === undefined) {
            return false;
        }
        return pSdp.indexOf("telephone-event/") !== -1;
    };

    this.isSdpHasVP8Codec = function (pSdp) {
        if (pSdp === null || pSdp === undefined) {
            return false;
        }
        return pSdp.indexOf("VP8/90000") !== -1;
    };

    this.isSdpHasH264Codec = function (pSdp) {
        if (pSdp === null || pSdp === undefined) {
            return false;
        }
        return pSdp.indexOf("H264/90000") !== -1;
    };

    /*
     * checkSupportedVideoCodecs
     *
     * checks video codec support status and remove video m-line if no supported video codec is available
     * @param {type} pSdp
     * @param {type} localOfferSdp
     */
    this.checkSupportedVideoCodecs = function (pSdp, localOfferSdp, isH264Enabled) {
        var newSdp;
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }
        if (this.isVideoCodecsSupported(pSdp, isH264Enabled)) {
            return pSdp;
        } else {
            if (localOfferSdp) {
                newSdp = this.removeAllVideoCodecs(pSdp);
                newSdp = this.addVP8Codec(newSdp, localOfferSdp);
                newSdp = this.updateSdpVideoPort(newSdp, false);
                newSdp = this.performVideoPortZeroWorkaround(newSdp);
            } else {
                //******************************************************
                //Changing video port to 0 when there is no supported
                //video codecs is not working in webrtc library
                //******************************************************
                if (!this.isSdpHasVP8Codec(pSdp)) {
                    if (pSdp.indexOf(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " 0 ", 0) !== -1) {
                        newSdp = this.addVP8Codec(pSdp, newSdp);
                    } else {
                        //this is required for PCC and meetme with video
                        newSdp = this.updateSdpVideoPort(pSdp, false);
                        newSdp = this.addVP8Codec(newSdp, newSdp);
                    }
                } else {
                    //this is required for PCC and meetme with video
                    newSdp = this.removeVideoDescription(pSdp);
                }
            }

            return newSdp;
        }
    };

    /*
     * isVideoCodecsSupported: this function checks supported video codecs are listed in m=video line
     * Supported video codecs are :
     *      VP8     default supported codec
     *      H264    if h264 is enabled with plugin
     *      @param {type} pSdp
     */
    this.isVideoCodecsSupported = function (pSdp, isH264Enabled) {
        if (this.isSdpHasVP8Codec(pSdp)) {
            return true;
        }
        if (isH264Enabled) {
            if (this.isSdpHasH264Codec(pSdp)) {
                return true;
            }
        }

        return false;
    };

    this.removeAllVideoCodecs = function (pSdp) {
        var regex, matches, codecs, newSdp, index;
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        regex = new RegExp("^\\.*(m=video )(\\d*)( RTP/SAVPF )([ \\w+ ]*[ \\/+ ]*[ \\w+ ])\\r\n", "m");

        newSdp = pSdp;
        matches = newSdp.match(regex);

        if (matches !== null && matches.length >= 5 && matches[0] !== "") {
            codecs = matches[4].split(" ");
            for (index = 0; index < codecs.length; index++) {
                logger.debug("codec[" + index + "] : " + codecs[index]);
                newSdp = this.removeVideoCodec(newSdp, codecs[index]);
            }
        }

        return newSdp;
    };

    /*
     * removeVideoCodec: removes given codec type from sdp.
     * @param {type} pSdp
     * @param {type} codecToRemove
     */
    this.removeVideoCodec = function (pSdp, codecToRemove) {
        var sdp = "", substr = "", descriptions = [], index, reg = /\r\n|\r|\n/m, video_arr, i,
                new_substr = "", elm, regExpCodec;
        if (pSdp === null || pSdp === undefined || !codecToRemove) {
            return pSdp;
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasVideo(substr)) {
                video_arr = substr.split(reg);
                for (i = 0; i < video_arr.length; i++) {
                    elm = video_arr[i];
                    if (elm && this.isSdpHasVideo(elm)) {
                        // remove given video codec from m=video line
                        regExpCodec = new RegExp(" " + codecToRemove, "g");
                        elm = elm.replace(regExpCodec, "");
                        elm = elm + lf + nl;
                        // Workaround for issue 1603.
                    } else if (elm && elm.indexOf("a=fmtp:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=fmtp[\w\W]*/, "");
                    } else if (elm && elm.indexOf("a=rtpmap:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=rtpmap[\w\W]*/, "");
                    } else if (elm && elm.indexOf("a=rtcp-fb:" + codecToRemove) !== -1) {
                        elm = elm.replace(/a=rtcp-fb[\w\W]*/, "");
                    } else if (elm && elm !== "") {
                        elm = elm + lf + nl;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }
        return sdp;
    };

    /*
     * addVP8Codec: adds missing VP8 Codec
     * @param {type} pSdp
     * @param {type} offerSdp
     */
    this.addVP8Codec = function (pSdp, offerSdp) {
        var sdp = "", substr = "", descriptions = [], index,
                reg = /\r\n|\r|\n/m, video_arr, i, new_substr = "",
                vp8PayloadType, codecType, elm,
                videoUFRAGParam, videoPWDParam, ice_ufrag, ice_pwd;

        if (this.isSdpHasVP8Codec(pSdp)) {
            return pSdp;
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasVideo(substr)) {
                if (offerSdp &&
                        this.isSdpHasVideo(offerSdp) &&
                        this.isSdpHasVP8Codec(offerSdp)) {
                    vp8PayloadType = this.getVP8PayloadType(offerSdp);
                    if (substr.indexOf("a=rtpmap:" + vp8PayloadType) !== -1) {
                        this.removeSdpLineContainingText(substr, "a=rtpmap:" + vp8PayloadType);
                    }
                } else {
                    codecType = 100;
                    while (substr.indexOf("a=rtpmap:" + codecType) !== -1) {
                        codecType = codecType + 1;
                    }
                    vp8PayloadType = codecType;
                }
                video_arr = substr.split(reg);
                for (i = 0; i < video_arr.length; i++) {
                    elm = video_arr[i];
                    if (elm && this.isSdpHasVideo(elm)) {
                        if (elm.indexOf(vp8PayloadType) === -1) {
                            elm = elm + " " + vp8PayloadType;
                        }
                        elm = elm + lf + nl + "a=rtpmap:" + vp8PayloadType + " VP8/90000" + lf + nl;
                    } else if (elm && elm !== "") {
                        elm = elm + lf + nl;
                    }
                    new_substr = new_substr + elm;
                }
                substr = new_substr;
            }
            sdp = sdp + substr;
        }

        videoUFRAGParam = this.checkICEParams(sdp, "video", _CONSTANTS.SDP.ICE_UFRAG);
        if (videoUFRAGParam < 2) {
            ice_ufrag = this.getICEParams(sdp, _CONSTANTS.SDP.ICE_UFRAG, false);
            if (ice_ufrag) {
                sdp = this.restoreICEParams(sdp, "video", _CONSTANTS.SDP.ICE_UFRAG, ice_ufrag);
            }
        }
        videoPWDParam = this.checkICEParams(sdp, "video", _CONSTANTS.SDP.ICE_PWD);
        if (videoPWDParam < 2) {
            ice_pwd = this.getICEParams(sdp, _CONSTANTS.SDP.ICE_PWD, false);
            if (ice_pwd) {
                sdp = this.restoreICEParams(sdp, "video", _CONSTANTS.SDP.ICE_PWD, ice_pwd);
            }
        }

        return sdp;
    };

    this.removeSdpLineContainingText = function (pSdp, containing_text) {
        var i, splitArray;

        if (pSdp === null || pSdp === undefined || !containing_text) {
            return pSdp;
        }

        splitArray = pSdp.split(nl);
        pSdp = splitArray[0] + nl;
        for (i = 1; i < splitArray.length - 1; i++) {
            if (splitArray[i].indexOf(containing_text) !== -1) {
                logger.debug("removed line which contains " + containing_text);
            }
            else {
                pSdp += splitArray[i] + nl;
            }
        }
        return pSdp;
    };

    this.removeVideoDescription = function (pSdp) {
        var sdp = "", substr = "", descriptions = [], index;
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (!this.isSdpHasVideo(substr)) {
                sdp = sdp + substr;
            } else {
                logger.debug("removeVideoDescription : m=video description removed");
            }
        }
        return sdp;
    };

    /*
     * updateSdpVideoPort
     * @param {type} pSdp
     * @param {type} status
     */
    this.updateSdpVideoPort = function (pSdp, status) {
        var r_sdp, port_text;
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        logger.debug("updateSdpVideoPort: status= " + status);

        r_sdp = pSdp;

        if (status) {
            port_text = _CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " 1";
        }
        else {
            port_text = _CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " 0";
            r_sdp = this.updateSdpDirection(r_sdp, _CONSTANTS.STRING.VIDEO, _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        }

        if (this.isSdpHasVideo(r_sdp)) {
            r_sdp = r_sdp.replace(/m=video [0-9]+/, port_text);
        }

        return r_sdp;
    };

    /*
     * performVideoPortZeroWorkaround - apply this when term side sends an answer with video port 0
     * @param {type} pSdp
     */
    this.performVideoPortZeroWorkaround = function (pSdp) {
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        if (!this.isSdpHasVideoWithZeroPort(pSdp)) {
            return pSdp;
        }
        pSdp = this.addSdpMissingCryptoLine(pSdp);
        pSdp = this.replaceZeroVideoPortWithOne(pSdp);

        //chrome38 fix
        pSdp = this.updateVideoSdpDirectionToInactive(pSdp);

        return pSdp;
    };

    // Issue      : Meetme conference failed due to a webrtc bug
    //              When video is sent in SDP with 0 without a=crypto line(SDES) in SDP,
    //              hold scenario for meetme failed.
    // Workaround : Add dummy a=crypto or a=fingerprint line to solve the issue with a workaround
    // Note       : fingerprint(DTLS enabled) may still fails on meetme. This is known issue as below:
    //              https://code.google.com/p/webrtc/issues/detail?id=2316
    //              Check with Chrome 37
    this.addSdpMissingCryptoLine = function (sdp) {
        var mediaSplit, audioLines, cryptLine = null, reg = /\r\n|\r|\n/m, i;

        // If there is no "m=video 0" line, sdp should not be modified
        if (sdp.indexOf(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " 0 ", 0) === -1) {
            return sdp;
        }

        mediaSplit = sdp.split(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO);

        audioLines = mediaSplit[0].split(reg);
        for (i = 0; i < audioLines.length; i++) {
            if ((audioLines[i].indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.SDP.CRYPTO) !== -1) || (audioLines[i].indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.SDP.FINGERPRINT) !== -1)) {
                cryptLine = audioLines[i];
                break;
            }
        }

        if (cryptLine === null) {
            return sdp;
        }

        if (mediaSplit[0].indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.SDP.CRYPTO) !== -1) {
            if (mediaSplit[1].indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.SDP.CRYPTO, 0) === -1) {
                mediaSplit[1] += cryptLine + "\n";
                logger.debug("addSdpMissingCryptoLine : crypto line is added : " + cryptLine);
            }
        } else if (mediaSplit[0].indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.SDP.FINGERPRINT, 0) !== -1) {
            if (mediaSplit[1].indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.SDP.FINGERPRINT, 0) === -1) {
                //DTLS is enabled, even adding fingerprint line in SDP,
                //meetme scenario fails. This is known issue and followed
                //by webrtc for DTLS enabled scenarios :
                //https://code.google.com/p/webrtc/issues/detail?id=2316
                mediaSplit[1] += cryptLine + "\na=setup:passive\n";
                logger.debug("addSdpMissingCryptoLine : dtls lines are added : " + cryptLine + "and a=setup:passive");
                logger.debug("dtls enabled: known issue by webrtc may be fixed! Check it");
            }
        }
        sdp = mediaSplit.join(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO);
        return sdp;
    };

    this.checkICEParams = function (pSdp, mediaType, type) {
        var parse1, parse2;

        if (pSdp === null || pSdp === undefined) {
            return 0;
        }

        parse1 = pSdp.split('m=video');
        if (parse1.length < 2) {
            return 0;
        }

        switch (type) {
            case _CONSTANTS.SDP.ICE_UFRAG:
                if (mediaType === "audio") {
                    parse2 = parse1[0].split('a=ice-ufrag:');
                } else {
                    parse2 = parse1[1].split('a=ice-ufrag:');
                }
                break;
            case _CONSTANTS.SDP.ICE_PWD:
                if (mediaType === "audio") {
                    parse2 = parse1[0].split('a=ice-pwd:');
                } else {
                    parse2 = parse1[1].split('a=ice-pwd:');
                }
                break;
            default:
                return 0;
        }

        return parse2.length;
    };

    this.getICEParams = function (pSdp, type, isVideo) {
        var parse1, parse2, parse3, param;
        if (pSdp === null || pSdp === undefined) {
            return;
        }

        switch (type) {
            case _CONSTANTS.SDP.ICE_UFRAG:
                parse1 = pSdp.split('a=ice-ufrag:');
                break;
            case _CONSTANTS.SDP.ICE_PWD:
                parse1 = pSdp.split('a=ice-pwd:');
                break;
            default:
                return undefined;
        }

        if (isVideo) {
            if (parse1[2] !== undefined) { /*"....a=ice-....a=ice-...."*/
                parse2 = parse1[2];
                parse3 = parse2.split('a=');
                param = parse3[0];
                return param; /*return video ice params*/
            } else {
                return undefined;
            }
        } else {
            if (parse1[1] !== undefined) { /*"....a=ice-....a=ice-...."*/
                parse2 = parse1[1];
                parse3 = parse2.split('a=');
                param = parse3[0];
                return param;
            } else {
                return undefined;
            }
        }
    };

    this.restoreICEParams = function (pSdp, mediaType, type, new_value) {
        var sdp = "", substr, index, parse1;
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        parse1 = pSdp.split('m=video');
        if (parse1.length < 2) {
            return pSdp;
        }

        for (index = 0; index < parse1.length; index++)
        {
            substr = parse1[index];
            if (index === 0)
            {
                if (mediaType === "audio") {
                    substr = substr + 'a=' + type + new_value;
                }
                sdp = sdp + substr;
            }
            if (index === 1)
            {
                if (mediaType === "video") {
                    substr = substr + 'a=' + type + new_value;
                }
                sdp = sdp + 'm=video' + substr;
            }
        }
        return sdp;
    };

    this.updateICEParams = function (pSdp, type, new_value) {
        var sdp = "", subsdp = "", substr, index, num,
                parse1, parse2, parse3;
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        switch (type)
        {
            case _CONSTANTS.SDP.ICE_UFRAG:
                parse1 = pSdp.split('a=ice-ufrag:');
                break;
            case _CONSTANTS.SDP.ICE_PWD:
                parse1 = pSdp.split('a=ice-pwd:');
                break;
            default:
                return pSdp;
        }

        for (index = 0; index < parse1.length; index++)
        {
            substr = parse1[index];
            if (index === 2)
            {
                parse2 = substr.split('a=');

                for (num = 0; num < parse2.length; num++)
                {
                    parse3 = parse2[num];
                    if (num === 0)
                    {
                        parse2[num] = new_value;
                        subsdp = subsdp + parse2[num];
                    } else
                    {
                        subsdp = subsdp + 'a=' + parse2[num];
                    }
                }
                substr = subsdp;
                sdp = sdp + substr;
            } else
            {
                sdp = sdp + substr + 'a=' + type;
            }
        }
        return sdp;
    };

    this.checkIceParamsLengths = function (newSdp, oldSdp) {
        var ice_ufrag, ice_pwd;
        ice_ufrag = this.getICEParams(newSdp, _CONSTANTS.SDP.ICE_UFRAG, true);
        ice_pwd = this.getICEParams(newSdp, _CONSTANTS.SDP.ICE_PWD, true);

        if (ice_ufrag && ice_ufrag.length < 4) { /*RFC 5245 the ice-ufrag attribute can be 4 to 256 bytes long*/
            ice_ufrag = this.getICEParams(oldSdp, _CONSTANTS.SDP.ICE_UFRAG, true);
            if (ice_ufrag) {
                newSdp = this.updateICEParams(newSdp, _CONSTANTS.SDP.ICE_UFRAG, ice_ufrag);
            }
        }

        if (ice_pwd && ice_pwd.length < 22) { /*RFC 5245 the ice-pwd attribute can be 22 to 256 bytes long*/
            ice_pwd = this.getICEParams(oldSdp, _CONSTANTS.SDP.ICE_PWD, true);
            if (ice_pwd) {
                newSdp = this.updateICEParams(newSdp, _CONSTANTS.SDP.ICE_PWD, ice_pwd);
            }
        }
        return newSdp;
    };

    /*
     * isSdpVideoSendEnabled
     * @param {type} pSdp
     */
    this.isSdpVideoSendEnabled = function (pSdp) {
        var direction,
                msg = "isSdpVideoSendEnabled: ",
                result = false;
        if (pSdp === null || pSdp === undefined) {
            return false;
        }

        if (!this.isSdpEnabled(pSdp, _CONSTANTS.STRING.VIDEO)) {
            logger.debug(msg + result);
            return result;
        }

        direction = this.getSdpDirectionLogging(pSdp, _CONSTANTS.STRING.VIDEO, false);
        if (direction === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE ||
                direction === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) {
            result = true;
            logger.debug(msg + result);
            return result;
        }

        logger.debug(msg + result);
        return result;
    };

    this.getSdpDirectionLogging = function (pSdp, type, logging) {
        var substr = "", descriptions = [], index,
                direction = _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, logmsg;

        logmsg = function (state) {
            if (logging) {
                logger.debug("getSdpDirection: type= " + type + " state= " + state);
            }
        };

        if (pSdp.indexOf(_CONSTANTS.SDP.M_LINE + type) === -1) {
            logmsg(direction);
            return direction;
        }

        if (pSdp.indexOf(_CONSTANTS.SDP.M_LINE + type + " 0") !== -1) {
            logmsg(direction);
            return direction;
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (substr.indexOf(_CONSTANTS.SDP.M_LINE + type) !== -1) {
                if (substr.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) !== -1) {
                    direction = _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) !== -1) {
                    direction = _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) !== -1) {
                    direction = _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
                    logmsg(direction);
                    return direction;
                } else if (substr.indexOf(_CONSTANTS.SDP.A_LINE + _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) !== -1) {
                    logmsg(direction);
                    return direction;
                }
                direction = _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE;
                return direction;
            }
        }
        direction = _CONSTANTS.WEBRTC.MEDIA_STATE.NOT_FOUND;
        logmsg(direction);
        return direction;
    };

    /*
     * remove only video ssrc from the sdp
     * this is a workaround to hear audio in a peer-to-peer call
     * @param {type} pSdp
     */
    this.deleteInactiveVideoSsrc = function (pSdp) {
        var videoSdp = [];

        if (this.isSdpHas(pSdp, _CONSTANTS.STRING.VIDEO)) {
            videoSdp = pSdp.split(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO);
            if (videoSdp[1] !== null) {
                videoSdp[1] = this.deleteSsrcFromSdp(videoSdp[1]);
            }
        } else {
            return pSdp;
        }
        return videoSdp[0] + _CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + videoSdp[1];
    };

    /*
     * deleteSsrcFromSdp - delete ssrc from the sdp, use it when there is video continuity issue
     * @param {type} sdp
     */
    this.deleteSsrcFromSdp = function (sdp) {
        if (sdp === null || sdp === undefined) {
            return sdp;
        }
        while (sdp.indexOf("a=ssrc") !== -1) {
            sdp = sdp.replace(/(a=ssrc[\w\W]*?(:\r|\n))/, "");
        }
        return sdp;
    };

    this.getTcpSetupAttribute = function (sdp) {
        var setupAttribute;
        if (sdp === null || sdp === undefined) {
            return;
        }

        if (sdp.indexOf(_CONSTANTS.SDP.SETUP_ACTIVE) !== -1) {
            setupAttribute = _CONSTANTS.SDP.SETUP_ACTIVE;
        } else if (sdp.indexOf(_CONSTANTS.SDP.SETUP_PASSIVE) !== -1) {
            setupAttribute = _CONSTANTS.SDP.SETUP_PASSIVE;
        } else if (sdp.indexOf(_CONSTANTS.SDP.SETUP_ACTPASS) !== -1) {
            setupAttribute = _CONSTANTS.SDP.SETUP_ACTPASS;
        }

        return setupAttribute;
    };

    this.setTcpSetupAttributeTo = function (sdp, newSetupAttribute, isDtlsEnabled) {
        if (sdp === null || sdp === undefined) {
            return sdp;
        }
        if (!isDtlsEnabled) {
            return sdp;
        }

        if (newSetupAttribute !== _CONSTANTS.SDP.SETUP_ACTIVE) {
            while (sdp.indexOf(_CONSTANTS.SDP.SETUP_ACTIVE) !== -1) {
                logger.debug("a=setup:active to " + newSetupAttribute);
                sdp = sdp.replace(_CONSTANTS.SDP.SETUP_ACTIVE, newSetupAttribute);
            }
        }

        if (newSetupAttribute !== _CONSTANTS.SDP.SETUP_PASSIVE) {
            while (sdp.indexOf(_CONSTANTS.SDP.SETUP_PASSIVE) !== -1) {
                logger.debug("a=setup:passive to " + newSetupAttribute);
                sdp = sdp.replace(_CONSTANTS.SDP.SETUP_PASSIVE, newSetupAttribute);
            }
        }

        if (newSetupAttribute !== _CONSTANTS.SDP.SETUP_ACTPASS) {
            while (sdp.indexOf(_CONSTANTS.SDP.SETUP_ACTPASS) !== -1) {
                logger.debug("a=setup:passive to " + newSetupAttribute);
                sdp = sdp.replace(_CONSTANTS.SDP.SETUP_ACTPASS, newSetupAttribute);
            }
        }
        return sdp;
    };

    this.setTcpSetupAttributeToActpass = function (sdp, isDtlsEnabled) {
        return this.setTcpSetupAttributeTo(sdp, _CONSTANTS.SDP.SETUP_ACTPASS, isDtlsEnabled);
    };

    /*
     *
     * @param {type} pSdp
     * @param {type} oSdp
     * @returns pSdp
     */
    this.checkAndRestoreICEParams = function (pSdp, oSdp) {
        var audioUFRAGParam, audioPWDParam, videoUFRAGParam, videoPWDParam, ice_ufrag, ice_pwd;

        audioUFRAGParam = this.checkICEParams(pSdp, _CONSTANTS.STRING.AUDIO, _CONSTANTS.SDP.ICE_UFRAG);
        if (audioUFRAGParam < 2) {
            ice_ufrag = this.getICEParams(oSdp, _CONSTANTS.SDP.ICE_UFRAG, false);
            if (ice_ufrag) {
                pSdp = this.restoreICEParams(pSdp, _CONSTANTS.STRING.AUDIO, _CONSTANTS.SDP.ICE_UFRAG, ice_ufrag);
            }
        }
        audioPWDParam = this.checkICEParams(pSdp, _CONSTANTS.STRING.AUDIO, _CONSTANTS.SDP.ICE_PWD);
        if (audioPWDParam < 2) {
            ice_pwd = this.getICEParams(oSdp, _CONSTANTS.SDP.ICE_PWD, false);
            if (ice_pwd) {
                pSdp = this.restoreICEParams(pSdp, _CONSTANTS.STRING.AUDIO, _CONSTANTS.SDP.ICE_PWD, ice_pwd);
            }
        }
        videoUFRAGParam = this.checkICEParams(pSdp, _CONSTANTS.STRING.VIDEO, _CONSTANTS.SDP.ICE_UFRAG);
        if (videoUFRAGParam < 2) {
            ice_ufrag = this.getICEParams(oSdp, _CONSTANTS.SDP.ICE_UFRAG, false);
            if (ice_ufrag) {
                pSdp = this.restoreICEParams(pSdp, _CONSTANTS.STRING.VIDEO, _CONSTANTS.SDP.ICE_UFRAG, ice_ufrag);
            }
        }
        videoPWDParam = this.checkICEParams(pSdp, _CONSTANTS.STRING.VIDEO, _CONSTANTS.SDP.ICE_PWD);
        if (videoPWDParam < 2) {
            ice_pwd = this.getICEParams(oSdp, _CONSTANTS.SDP.ICE_PWD, false);
            if (ice_pwd) {
                pSdp = this.restoreICEParams(pSdp, _CONSTANTS.STRING.VIDEO, _CONSTANTS.SDP.ICE_PWD, ice_pwd);
            }
        }
        return pSdp;
    };

    this.incrementVersion = function (pSdp) {
        var oLineAsArray = [], newoLine = "", index, version, actualoLine;
        logger.debug("incrementVersion");

        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        // o=- 937770930552268055 2 IN IP4 127.0.0.1
        // o=mozilla...THIS_IS_SDPARTA-37.0.1 4294967295 0 IN IP4 0.0.0.0
        // get o line
        actualoLine = pSdp.match(/(o=[\w\W]*?(:\r|\n))/);

        if (!actualoLine) {
            return pSdp;
        }

        // get o line
        oLineAsArray = actualoLine[0].split(" ");

        //getting version and convering it to int
        version = +oLineAsArray[2];
        //incrementing the version
        version = version + 1;

        for (index = 0; index < oLineAsArray.length; index++) {
            if (index !== 0) {
                // prevents adding unnecessary space before the o line
                newoLine = newoLine + " ";
            }
            if (index === 2) {
                // 2nd index is version index
                newoLine = newoLine + version;
            } else {
                newoLine = newoLine + oLineAsArray[index];
            }
        }

        pSdp = pSdp.replace(actualoLine[0], newoLine);

        return pSdp;
    };

    /*
     * escalateSdpDirection for type:audio or video
     * @param {type} pSdp
     * @param {type} type
     */
    this.escalateSdpDirection = function (pSdp, type) {
        var direction = this.getSdpDirectionLogging(pSdp, type, false);
        logger.debug("escalateSdpDirection: type= " + type + " direction= " + direction);
        if (direction === _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) {
            return this.changeDirection(pSdp, direction, _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, type);
        } else if (direction === _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
            return this.changeDirection(pSdp, direction, _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, type);
        }
        return pSdp;
    };

    /*
     * deescalateSdpDirection for type:audio or video
     * @param {type} pSdp
     * @param {type} type
     */
    this.deescalateSdpDirection = function (pSdp, type) {
        var direction = this.getSdpDirectionLogging(pSdp, type, false);
        logger.debug("deescalateSdpDirection: type= " + type + " direction= " + direction);
        if (direction === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
            return this.changeDirection(pSdp, direction, _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, type);
        } else if (direction === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) {
            return this.changeDirection(pSdp, direction, _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, type);
        }
        return pSdp;
    };

    this.isIceLite = function (pSdp) {
        if (pSdp === null || pSdp === undefined) {
            return false;
        }
        if (pSdp && pSdp.indexOf("a=ice-lite") !== -1) {
            return true;
        }
        return false;
    };

    this.getSessionIdFromSdp = function (sdp) {
        var oLine;

        if (!sdp) {
            return -1;
        }
        oLine = sdp.match(/(o=[\w\W]*?(:\r|\n))/);

        if (!oLine) {
            return -1;
        }

        oLine = oLine[0].split(" ");

        if (oLine[1]) {
            logger.info("getSessionIdFromSdp = " + oLine[1]);
            return oLine[1];
        } else {
            logger.warn("getSessionIdFromSdp called with wrong sdp!!");
            return -1;
        }
    };

    /*
     * Updates the version in tosdp with the one retrieved from fromsdp with incrementing
     */
    this.updateVersion = function (fromSdp, toSdp) {
        var fromOline = [], toOline = [], newoLine = "", index, version, actualtoOline = '';

        if (fromSdp === null || fromSdp === undefined) {
            return toSdp;
        }

        logger.debug(" updateVersion called...");

        // o=- 937770930552268055 2 IN IP4 127.0.0.1
        // get o line
        fromOline = fromSdp.match(/(o=[\w\W]*?(:\r|\n))/);

        if (!fromOline) {
            return toSdp;
        }

        fromOline = fromOline[0].split(" ");

        // get o line
        actualtoOline = toSdp.match(/(o=[\w\W]*?(:\r|\n))/);
        toOline = actualtoOline[0].split(" ");

        if (fromOline) {
            version = fromOline[2];
        } else {
            logger.warn("updateVersion called with wrong fromSdp!!");
            return toSdp;
        }

        // convert to int and increment
        version = (+version) + 1;

        logger.debug(" updateVersion fromVersion incremented: " + version);

        for (index = 0; index < toOline.length; index++) {
            if (index !== 0) {
                // prevents adding unnecessary space before the o line
                newoLine = newoLine + " ";
            }
            if (index === 2) {
                // 2nd index is version index
                newoLine = newoLine + version;
            } else {
                newoLine = newoLine + toOline[index];
            }
        }
        toSdp = toSdp.replace(actualtoOline[0], newoLine);

        return toSdp;
    };

    // TODO: Method below assumes to receive only one video m-line, need to correct this logic.
    this.copyCandidatesToTheNewLocalSdp = function (oldSdp, newSdp) {
        var oldSplitSdp = [], newSplitSdp = [], oldVideoSdp, newVideoSdp,
                oldAudioSdp, newAudioSdp;

        oldSplitSdp = oldSdp.split(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO);
        newSplitSdp = newSdp.split(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO);

        oldAudioSdp = oldSplitSdp[0];
        oldVideoSdp = oldSplitSdp[1] !== undefined ? _CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + oldSplitSdp[1] : undefined;
        newAudioSdp = newSplitSdp[0];
        newVideoSdp = newSplitSdp[1] !== undefined ? _CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + newSplitSdp[1] : undefined;

        newAudioSdp = this.copyCandidates(oldAudioSdp, newAudioSdp);

        if (oldVideoSdp !== undefined && newVideoSdp !== undefined) {
            newVideoSdp = this.copyCandidates(oldVideoSdp, newVideoSdp);
        }

        if (newVideoSdp !== undefined) {
            return newAudioSdp + newVideoSdp;
        }
        else {
            return newAudioSdp;
        }
    };

    this.copyCandidates = function (oldSdp, newSdp) {
        var mediaLines, reg = /\r\n|\r|\n/m, i, port;

        mediaLines = oldSdp.split(reg);

        for (i = 0; i < mediaLines.length; i++) {
            if (mediaLines[i].indexOf("a=candidate") !== -1 && newSdp.indexOf(("a=candidate") === -1)) {
                newSdp += mediaLines[i] + "\r\n";
            } else if (mediaLines[i].indexOf("c=IN") !== -1 && newSdp.indexOf(("c=IN IP4 0.0.0.0") !== -1)) {
                newSdp = newSdp.replace(/(c=[\w\W]*?(:\r|\n))/, mediaLines[i] + "\r\n");
            } else if ((mediaLines[i].indexOf("m=audio") !== -1) &&
                    (newSdp.indexOf(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.AUDIO + " 1 ") !== -1 ||
                            newSdp.indexOf(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.AUDIO + " 9 ") !== -1)) {
                port = mediaLines[i].split(" ")[1];

                newSdp = newSdp.replace(/m=audio \d/, _CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.AUDIO + " " + port);
            } else if ((mediaLines[i].indexOf("m=video") !== -1) &&
                    (newSdp.indexOf(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " 1 ") !== -1 ||
                            newSdp.indexOf(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " 9 ") !== -1)) {
                port = mediaLines[i].split(" ")[1];

                newSdp = newSdp.replace(/m=video \d/, _CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + " " + port);
            }
        }
        return newSdp;
    };

    /*
     * getSdpFromObject
     * There is a webrtc bug in Plugin.
     * sendrecv direction changed to recvonly for offer type sdps
     * This function is the workaround solution to get the correct sdp from the object
     * until webrtc bug in plugin is fixed.
     */
    this.getSdpFromObject = function (oSdp) {
        var sdp;
        sdp = oSdp.sdp;

        return sdp;
    };

    /*
     * deleteGoogleIceFromSdp - delete google-ice option from the sdp
     */
    this.deleteGoogleIceFromSdp = function (sdp) {
        if (sdp === null || sdp === undefined) {
            return sdp;
        }
        sdp = sdp.replace(/(a=ice-options:google-ice[\w\W]*?(:\r|\n))/g, "");
        return sdp;
    };

    this.respondToRemoteSdpDirections = function (localSdp, remoteSdp) {
        localSdp = this.respondToRemoteMediaSdpDirection(localSdp, remoteSdp, _CONSTANTS.STRING.AUDIO);
        localSdp = this.respondToRemoteMediaSdpDirection(localSdp, remoteSdp, _CONSTANTS.STRING.VIDEO);

        return localSdp;
    };

    this.respondToRemoteMediaSdpDirection = function (localSdp, remoteSdp, type) {
        var remoteDirection;

        if (this.isSdpHas(remoteSdp, type)) {
            remoteDirection = this.getSdpDirection(remoteSdp, type);

            if (remoteDirection === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY) {
                logger.debug(type + " sendonly -> recvonly");
                localSdp = this.updateSdpDirection(localSdp, type, _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            }
            else if (remoteDirection === _CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) {
                logger.debug(type + " recvonly -> sendonly");
                localSdp = this.updateSdpDirection(localSdp, type, _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
            }
            else if (remoteDirection === _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                logger.debug(type + " sendrecv -> sendrecv");
                localSdp = this.updateSdpDirection(localSdp, type, _CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
            }
            else if (remoteDirection === _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                logger.debug(type + " inactive -> inactive");
                localSdp = this.updateSdpDirection(localSdp, type, _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
            }
        }
        return localSdp;
    };

    this.hasCandidates = function(sdp, relayCandidateCycle, relayCandidateConfigCycle) {
        var audioArray, videoArray, candidateParser;

        if(this.checkRelayCandidateCollectionTimeout(relayCandidateCycle, relayCandidateConfigCycle)){
            return true;
        }
        candidateParser = this.getCandidateType(relayCandidateCycle, relayCandidateConfigCycle);
        if (this.isSdpHasAudio(sdp)){
            audioArray = sdp.split("m=audio");
            if (audioArray[1].indexOf(candidateParser) === -1) {
                return false;
            } else if (this.isSdpHasVideo(sdp) && !this.isVideoSdpDirectionInactive(sdp) && !this.isVideoSdpDirectionRecvonly(sdp)) {
                videoArray = sdp.split("m=video");
                if (videoArray[1].indexOf(candidateParser) === -1) {
                    return false;
                } else {
                    return true;
                }
            } else {
                return true;
            }
        }
        return false;
    };

    this.getCandidateType = function(relayCandidateCycle, relayCandidateConfigCycle) {
        var candidateParser;
        if (relayCandidateCycle) {
            if(relayCandidateCycle <= relayCandidateConfigCycle) {
                candidateParser = "relay";
            }
            else {
                candidateParser = "a=candidate";
            }
        }
        else {
            candidateParser = "a=candidate";
        }
        return candidateParser;
    };

    this.checkRelayCandidateCollectionTimeout = function(relayCandidateCycle, relayCandidateConfigCycle) {
        if (relayCandidateCycle) {
            if(relayCandidateCycle > relayCandidateConfigCycle) {
                return true;
            }
        }
        return false;
    };

    // spidr sends both fingerprint and crypto at incoming call to the term side
    // delete the unnecessary one before setting remote description
    this.deleteFingerprintOrCrypto = function (sdp, isDtlsEnabled) {
        if (sdp === null || sdp === undefined) {
            return sdp;
        }
        if (sdp.indexOf("a=crypto:") === -1 || sdp.indexOf("a=fingerprint:") === -1) {
            return sdp;
        }
        sdp = this.deleteCryptoFromSdp(sdp, isDtlsEnabled);
        sdp = this.deleteFingerprintFromSdp(sdp, isDtlsEnabled);

        return sdp;
    };

    function addRtpmapForCodec(sdp, payload, rtpmapString) {
        var audioCodecList;
        if (sdp === null || sdp === undefined) {
            return;
        }

        audioCodecList = sdp.match(/m=audio [\w\W]*?(\r|\n)/);
        if (!audioCodecList) {
            return sdp;
        }

        audioCodecList = audioCodecList[0].split(" ");
        // shift "m=audio" out
        // shift audio port out
        // shift RTP/SAVPF out
        audioCodecList.shift();
        audioCodecList.shift();
        audioCodecList.shift();

        if (audioCodecList.indexOf(payload) === -1) {
            return sdp;
        }

        if (sdp.indexOf(rtpmapString) !== -1) {
            return sdp;
        }

        sdp = sdp.split(_CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO);

        sdp[0] = sdp[0] + rtpmapString + lf + nl;

        if (sdp[1]) {
            sdp = sdp[0] + _CONSTANTS.SDP.M_LINE + _CONSTANTS.STRING.VIDEO + sdp[1];
        }
        else {
            sdp = sdp[0];
        }

        return sdp;
    }

    /*
     *  This is only required for Firefox Native webrtc.
     *  If PCMU exists in codec list but its rtpmap is missing in sdp,
     *  firefox native webrtc does not collect ice canditates.
     *  Scenario: C2C when FF is originating client
     *            (Broker without Transcoder config)
     */
    this.addRtpmapForPCMU = function (sdp) {
        return addRtpmapForCodec(sdp, "0", "a=rtpmap:0 PCMU/8000");
    };

    /*
     *  This is only required for Firefox Native webrtc.
     *  If PCMA exists in codec list but its rtpmap is missing in sdp,
     *  firefox native webrtc does not collect ice canditates.
     *  Scenario: C2C when FF is originating client
     *            (Broker without Transcoder config)
     */
    this.addRtpmapForPCMA = function (sdp) {
        return addRtpmapForCodec(sdp, "8", "a=rtpmap:8 PCMA/8000");
    };

    /*
     * This is only required for Firefox Native webRTC.
     * Firefox native adds curly brackets to msid and cname properties(maybe more)
     * This leads to problem in multi - peer to peer configurated lab.
     * TODO : Unit test cases should be written
     */
    this.deleteCurlyBracketsSDP = function (sdp) {
        if (sdp === null || sdp === undefined) {
            return sdp;
        }
        logger.debug('Deleting curly brackets from sdp');
        sdp = sdp.replace(/(\{|\})/g, "");
        return sdp;
    };

    /*
     * If inactive video m-line has bandwith attribute in SDP(occurs in Chrome to PCC call),
     * Chrome's webRTC Engine rejects it
     * This workaround removes the b:AS line
     * TODO : Unit test cases should be written
     */
    this.deleteBandwidthLineFromSdp = function (sdp) {
        if (sdp === null || sdp === undefined) {
            return sdp;
        }

        if (this.isVideoSdpDirectionInactive(sdp)) {
            logger.debug('Deleting b:AS line from SDP');
            sdp = sdp.replace(/(b=AS:[\w\W]*?(:\r|\n))/g, '');
        }
        return sdp;
    };
    /*
     * Firefox 38.0.1 does not accept uppercase opus codec and cause basic call problem with GCFIOS.
     * The following is a workaround for this problem.
     * Feel free to remove it when Firefox 38.0.1 is updated to 38.0.5.
     */
    this.setOpusCodecToLowerCase = function (sdp) {
        if (sdp === null || sdp === undefined) {
            return sdp;
        }
        logger.debug('Setting OPUS codec to lower case');
        return sdp.replace('OPUS', 'opus');
    };

    /*
     * Replaces audio m line of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceAudioMlineOfCodec = function (sdp, prevValue, newValue) {
        if (this.isSdpHasAudio(sdp)) {
            sdp = this.replaceMlineOfCodec(sdp, _CONSTANTS.STRING.AUDIO, prevValue, newValue);
        }
        return sdp;
    };

    /*
     * Replaces video m line of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceVideoMlineOfCodec = function (sdp, prevValue, newValue) {
        if (this.isSdpHasVideo(sdp)) {
            sdp = this.replaceMlineOfCodec(sdp, _CONSTANTS.STRING.VIDEO, prevValue, newValue);
        }
        return sdp;
    };

    /*
     * Replaces m line of codec
     * @sdp Sdp to be processed
     * @option m line to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceMlineOfCodec = function (sdp, option, prevValue, newValue) {
        var prevMline, newMline = '', mLineRegex, index;
        mLineRegex = new RegExp('m=' + option + ' [\\w\\W]*?(\\r|\\n)', 'g');
        prevMline = sdp.match(mLineRegex);
        prevMline = prevMline[0].split(' ');
        for (index = 0; index < prevMline.length; index++) {
            // index[1] is actual port and we should not change it.
            if ((index !== 1) && prevMline[index] && (prevMline[index].indexOf(prevValue) !== -1)) {
                prevMline[index] = prevMline[index].replace(prevValue, newValue);
            }
            // This if check is necessary in order not to put an space at the end of m line
            if (index === (prevMline.length - 1)) {
                newMline += prevMline[index];
            } else {
                newMline += prevMline[index] + ' ';
            }
        }
        return sdp.replace(mLineRegex, newMline);
    };

    /*
     * Replaces RTPMap of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceRTPMapOfCodec = function (sdp, prevValue, newValue) {
        var regex = new RegExp('a=rtpmap:' + prevValue, 'g');
        return sdp.replace(regex, 'a=rtpmap:' + newValue);
    };

    /*
     * Replaces RTCP of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceRTCPOfCodec = function (sdp, prevValue, newValue) {
        var regex = new RegExp('a=rtcp-fb:' + prevValue, 'g');
        return sdp.replace(regex, 'a=rtcp-fb:' + newValue);
    };

    /*
     * Replaces FMTP of codec
     * @sdp Sdp to be processed
     * @prevValue previous telephony event value
     * @newValue new telephony event value
     * @returns processed SDP
     */
    this.replaceFMTPOfCodec = function (sdp, prevValue, newValue) {
        var regex = new RegExp('a=fmtp:' + prevValue, 'g');
        return sdp.replace(regex, 'a=fmtp:' + newValue);
    };

    /*
     * Replaces the codec with new value
     * @sdp Sdp to be processed
     * @codec Codec to be replaced
     * @newValue new value of codec
     */
    this.replaceCodecValue = function (sdp, codec, newValue) {
        var payloadType, prevValue;
        payloadType = this.getPayloadTypeOf(codec, sdp);
        if (payloadType) {
            // If multiple payload types returned, change first of them
            if (Array.isArray(payloadType)) {
                prevValue = payloadType[0];
            } else {
                prevValue = payloadType;
            }
            // Since we don't know which m-line contains this codec, we apply in both m-lines
            // If an m line does not have this codec, then it will simply return the sdp itself
            sdp = this.replaceAudioMlineOfCodec(sdp, prevValue, newValue);
            sdp = this.replaceVideoMlineOfCodec(sdp, prevValue, newValue);
            sdp = this.replaceRTPMapOfCodec(sdp, prevValue, newValue);
            sdp = this.replaceRTCPOfCodec(sdp, prevValue, newValue);
            sdp = this.replaceFMTPOfCodec(sdp, prevValue, newValue);
        }
        return sdp;
    };

    /*
     * Replaces codecs
     * @sdp Sdp to be used
     * @codecMap codecMap to be replaced
     * @returns processed SDP
     */
    this.replaceCodecs = function (sdp, codecMap) {
        var index;
        if (codecMap && codecMap.length) {
            for (index = 0; index < codecMap.length; index++) {
                sdp = this.replaceCodecValue(sdp, codecMap[index].name, codecMap[index].value);
            }
        }
        return sdp;
    };

    /*
     * Removes H264 codec from SDP
     * @sdp Sdp to be used
     * @returns processed SDP
     */
    this.removeH264Codec = function (pSdp) {
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }
        logger.debug("Removing H264 codec from SDP");
        var h264PayloadType, index;

        if (pSdp.indexOf("H264/90000") === -1) {
            return pSdp;
        }

        h264PayloadType = this.getH264PayloadType(pSdp);

        if (h264PayloadType !== -1) {
            for (index = 0; index < h264PayloadType.length; index++) {
                logger.debug("removeH264Codec : Removing H264/90000 video codec " + h264PayloadType[index]);
                pSdp = this.removeVideoCodec(pSdp, h264PayloadType[index]);
            }
        }
        return pSdp;
    };

    this.hasZeroConnectionIP = function(pSdp) {
        if (pSdp === null || pSdp === undefined) {
            return false;
        }
        if (pSdp.indexOf("c=IN IP4 0.0.0.0") !== -1) {
            return true;
        }
        return false;
    };

    this.findZeroConnectionIPandModify = function (pSdp) {
        var sdp = "", substr = "", descriptions = [], index, type;

        logger.debug("findZeroConnectionIPandModify received SDP: " + pSdp);
        if (pSdp === null || pSdp === undefined) {
            return pSdp;
        }

        descriptions = pSdp.split(/^(?=m=)/m);
        for (index = 0; index < descriptions.length; index++) {
            substr = descriptions[index];
            if (this.isSdpHasVideo(substr)) {
                type = _CONSTANTS.STRING.VIDEO;
            }else{
                type = _CONSTANTS.STRING.AUDIO;
            }
            if (this.hasZeroConnectionIP(substr) && this.getSdpDirection(pSdp, type) !== _CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                substr = substr.replace("c=IN IP4 0.0.0.0", "c=IN IP4 1.1.1.1");
            }
            sdp = sdp + substr;
        }
        logger.debug("findZeroConnectionIPandModify updated SDP: " + sdp);
        return sdp;
    };

    this.isRemoteEndFirefox = function (pSdp) {
        if (!pSdp) {
            return false;
        }
        return pSdp.indexOf("SDPARTA") !== -1;
    };

    // this is needed to check
    // if telephone-event payload changed
    // fixed scenario: meetme is sending a different TE payload after call setup
    this.hasCodecPayloadChanged = function (oldSdp, newSdp) {
        if (!oldSdp || !newSdp) {
            return false;
        }

        var oldTEPayloadCodec = this.getPayloadTypeOf("telephone-event/8000", oldSdp),
            newTEPayloadCodec = this.getPayloadTypeOf("telephone-event/8000", newSdp);

        return oldTEPayloadCodec !== newTEPayloadCodec;
    };
};

//@{fcs-jsl-prod}
var SDPParser = function (_logManager, _fcsConfig, _CONSTANTS) {
    return new SDPParserImpl(_logManager || logManager,
            _fcsConfig || fcsConfig,
            _CONSTANTS || CONSTANTS);
};

var sdpParser = new SDPParser();

if (__testonly__) {
    __testonly__.SDPParser = SDPParser;
}
//@{fcs-jsl-prod}

var WebRtcAdaptorModel = function() {
    var self = this, dtlsEnabled = false, iceServerUrl = "",
            containers = {video: null,
                localVideo: null,
                remoteVideo: null,
                defaultVideo: null},
            mediaConstraints = {
                audio: false,
                video: false
            },
            mediaSources = {
                video: {
                    available: false
                },
                audio: {
                    available: false
                }
            },
            initialized = false,
            rtcLibrary = {},
            language,
            logLevel = 4,
            peerCount = 0,
            pluginEnabled = false,
            h264Enabled = false,
            audioContext,
            mediaStreamDestination,
            userMediaStream,
            localStreamMap = new Map(),
            privateStreamMap = new Map(),
            localMedia = {},
            selectedMicrophoneId,
            selectedSpeakerId,
            selectedCameraId,
            mediaSourceList;

    self.getLocalMedia = function (){
        return localMedia;
    };

    self.setLocalMedia = function (media){
        localMedia = media;
    };

    self.getLocalStreamMap = function() {
        return localStreamMap;
    };

    self.isH264Enabled = function (){
        return h264Enabled;
    };

    self.setH264Enabled = function (enabled){
        h264Enabled = enabled === true ? true : false;
    };

    self.getIceServerUrl = function() {
        return iceServerUrl;
    };

    self.setIceServerUrl = function(url) {
        iceServerUrl = url;
    };

    self.isDtlsEnabled = function() {
        return dtlsEnabled;
    };

    self.setDtlsEnabled = function(enabled) {
        dtlsEnabled = enabled;
    };

    self.getVideoContainer = function() {
        return containers.video;
    };

    self.setVideoContainer = function(container) {
        containers.video = container;
    };

    self.getLocalVideoContainer = function() {
        return containers.localVideo;
    };

    self.setLocalVideoContainer = function(container) {
        containers.localVideo = container;
    };

    self.getRemoteVideoContainer = function() {
        return containers.remoteVideo;
    };

    self.setRemoteVideoContainer = function(container) {
        containers.remoteVideo = container;
    };

    self.getDefaultVideoContainer = function() {
        return containers.defaultVideo;
    };

    self.setDefaultVideoContainer = function(container) {
        containers.defaultVideo = container;
    };

    self.isInitialized = function() {
        return initialized;
    };

    self.setInitialized = function(value) {
        initialized = value === true ? true : false;
    };

    self.getRtcLibrary = function() {
        return rtcLibrary;
    };

    self.setRtcLibrary = function(library) {
        rtcLibrary = library;
    };

    self.getLogLevel = function() {
        return logLevel;
    };

    self.setLogLevel = function(level) {
        logLevel = level;
    };

    self.getLanguage = function() {
        return language;
    };

    self.setLanguage = function(lang) {
        language = lang;
    };

    self.getMediaAudio = function() {
        return mediaConstraints.audio;
    };

    self.setMediaAudio = function(_audio) {
        mediaConstraints.audio = _audio ? true : false;
    };

    self.getMediaVideo = function() {
        return mediaConstraints.video;
    };

    self.setMediaVideo = function(_video) {
        mediaConstraints.video = _video ? true : false;
    };

    self.getVideoWidth = function() {
        return mediaSources.video.width;
    };

    self.setVideoWidth = function(_videoWidth) {
        mediaSources.video.width = _videoWidth;
    };

    self.getVideoHeight = function() {
        return mediaSources.video.height;
    };

    self.setVideoHeight = function(_videoHeight) {
        mediaSources.video.height = _videoHeight;
    };

    self.getVideoSourceAvailable = function() {
        return mediaSources.video.available;
    };

    self.setVideoSourceAvailable = function(_videoSourceAvailable) {
        mediaSources.video.available = _videoSourceAvailable;
    };

    self.getAudioSourceAvailable = function() {
        return mediaSources.audio.available;
    };

    self.setAudioSourceAvailable = function(_audioSourceAvailable) {
        mediaSources.audio.available = _audioSourceAvailable;
    };

    self.setMediaSources = function(mediaSourceInfo) {
        if (mediaSourceInfo) {
            self.setVideoSourceAvailable(mediaSourceInfo.videoSourceAvailable);
            self.setAudioSourceAvailable(mediaSourceInfo.audioSourceAvailable);
            self.setMediaSourceList(mediaSourceInfo.sourceList);
        }
    };

    self.getPeerCount = function() {
        return peerCount;
    };

    self.setPeerCount = function(_peerCount) {
        peerCount = _peerCount;
    };

    self.isPluginEnabled = function() {
        return pluginEnabled;
    };

    self.setPluginEnabled = function(_isPluginEnabled) {
        pluginEnabled = _isPluginEnabled;
    };

    self.initAudioContext = function(){
        window.AudioContext = window.AudioContext || window.webkitAudioContext ||
        window.mozAudioContext || window.oAudioContext || window.msAudioContext;
        audioContext = new window.AudioContext();
    };

    self.getAudioContext = function(){
        return audioContext;
    };

    self.initMediaStreamDestination = function(){
        mediaStreamDestination = self.getAudioContext().createMediaStreamDestination();
    };

    self.getMediaStreamDestination = function(){
        return mediaStreamDestination;
    };

    self.setSelectedMicrophoneId = function(_selectedMicrophoneId) {
        selectedMicrophoneId = _selectedMicrophoneId;
    };

    self.getSelectedMicrophoneId = function() {
        return selectedMicrophoneId;
    };

    self.setSelectedSpeakerId = function(_selectedSpeakerId) {
        selectedSpeakerId = _selectedSpeakerId;
    };

    self.getSelectedSpeakerId = function() {
        return selectedSpeakerId;
    };

    self.setSelectedCameraId = function(_selectedCameraId) {
        selectedCameraId = _selectedCameraId;
    };

    self.getSelectedCameraId = function() {
        return selectedCameraId;
    };

    self.getStreamById = function(id) {
        return privateStreamMap.get(id);
    };

    self.removeStreamFromMap = function(id) {
        privateStreamMap.remove(id);
    };

    self.getPrivateStreamMap = function() {
        return privateStreamMap;
    };

    self.setMediaSourceList = function(_mediaSourceList) {
        mediaSourceList = _mediaSourceList;
    };

    self.getMediaSourceList = function() {
        return mediaSourceList;
    };
};

//@{fcs-jsl-prod}
if (__testonly__) { __testonly__.WebRtcAdaptorModel = WebRtcAdaptorModel; }
//@{fcs-jsl-prod}

var WebRtcChromeAdaptorModel = function() {
    var self = this;

    self.isH264Enabled = function () {
        return false;
    };
};

//@{fcs-jsl-prod}
WebRtcChromeAdaptorModel.prototype = new WebRtcAdaptorModel();
if (__testonly__) { __testonly__.WebRtcChromeAdaptorModel = WebRtcChromeAdaptorModel; }
//@{fcs-jsl-prod}

var WebRtcFirefoxAdaptorModel = function() {
    var self = this,
        // Since Firefox supports H264 by default, this attribute set as true
        h264Enabled = true;

    self.isH264Enabled = function (){
        return h264Enabled;
    };

    self.setH264Enabled = function (enabled){
        h264Enabled = enabled === true ? true : false;
    };
};

//@{fcs-jsl-prod}
WebRtcFirefoxAdaptorModel.prototype = new WebRtcAdaptorModel();
if (__testonly__) { __testonly__.WebRtcFirefoxAdaptorModel = WebRtcFirefoxAdaptorModel; }
//@{fcs-jsl-prod}

var WebRtcPluginAdaptorModel = function() {
    var self = this,
        //this variable will be always set by a plugin adaptor.
        pluginVersion={
            major:               0,
            minor:               0,

            min_revision:        0,
            min_build:           0,

            current_revision:    0,
            current_build:       0
        };

    self.getPluginVersion = function() {
        return pluginVersion;
    };

    self.setPluginVersion = function(version) {
        pluginVersion = version;
    };
};

//@{fcs-jsl-prod}
WebRtcPluginAdaptorModel.prototype = new WebRtcAdaptorModel();
if (__testonly__) { __testonly__.WebRtcPluginAdaptorModel = WebRtcPluginAdaptorModel; }
//@{fcs-jsl-prod}

var webRtcLibraryDecoratorImpl = function(target, _super, _utils) {
    var libraryObjWrapper = {};

    libraryObjWrapper.getUserMedia = target.getUserMedia;
    libraryObjWrapper.showSettingsWindow = target.showSettingsWindow;
    libraryObjWrapper.getURLFromStream = target.getURLFromStream;
    libraryObjWrapper.enableH264 = target.enableH264;

    libraryObjWrapper.createRTCSessionDescription = function(type, sdp) {
        return target.createSessionDescription(type, sdp);
    };

    libraryObjWrapper.createRTCIceCandidate = function(candidate, type, number) {
        return target.createIceCandidate(candidate, type, number);
    };

    libraryObjWrapper.createRTCPeerConnection = function(stunturn, constraints) {
        return target.createPeerConnection(stunturn, constraints);
    };

    libraryObjWrapper.setLang = function(lang) {
        target.setLanguage(lang || "en");
    };

    libraryObjWrapper.checkMediaSourceAvailability = function(callback) {
        _utils.callFunctionIfExist(callback, {videoSourceAvailable: (target.getVideoDeviceNames().length > 0) ? true : false,
            audioSourceAvailable: (target.getAudioInDeviceNames().length > 0) ? true : false});
    };

    libraryObjWrapper.get_audioInDeviceCount = function() {
        return target.getAudioInDeviceNames().length;
    };

    libraryObjWrapper.get_audioOutDeviceCount = function() {
        return target.getAudioOutDeviceNames().length;
    };

    libraryObjWrapper.get_videoDeviceCount = function() {
        return target.getVideoDeviceNames().length;
    };

    libraryObjWrapper.set_logSeverityLevel = function(level) {
        target.logSeverityLevel = level;
        return true;
    };

    libraryObjWrapper.get_logSeverityLevel = function() {
        return target.logSeverityLevel;
    };

    libraryObjWrapper.enable_logCallback = function(handler) {
        target.logCallback = handler;
        return true;
    };

    libraryObjWrapper.disable_logCallback = function(){
        target.logCallback = null;
    };

    libraryObjWrapper.setType = function(applicationType) {
        target.type = applicationType;
    };

    libraryObjWrapper.getType = function() {
        return target.type;
    };

    libraryObjWrapper.getVersion = function() {
        return target.version;
    };

    libraryObjWrapper.setH264CodecStateChangeHandler = function(handler) {
        target.onh264codecstatechange = handler;
    };

    libraryObjWrapper.getCurrentPluginVersionObject = function() {
        var splittedPluginVersion = target.version.split("."),
                currentPluginVersion;

        currentPluginVersion = {
            major: parseInt(splittedPluginVersion[0], 10),
            minor: parseInt(splittedPluginVersion[1], 10),
            revision: parseInt(splittedPluginVersion[2], 10),
            build: parseInt(splittedPluginVersion[3], 10)
        };
        return currentPluginVersion;
    };

    libraryObjWrapper.detachWebAudioContextFromLocalMedia = function (localMedia) {
        localMedia.audioContext.close();
        localMedia.mediaStreamDestination.disconnect();
    };

    libraryObjWrapper.stopLocalMedia = function(localMedia) {
        if (localMedia) {
            libraryObjWrapper.stopStream(localMedia.stream);
            libraryObjWrapper.stopStream(localMedia.originalStream);
        }
    };

    libraryObjWrapper.stopStream = function(stream) {
        if (stream && stream.stop) {
            stream.stop();
        }
    };

    return libraryObjWrapper;
};

//@{fcs-jsl-prod}
var webRtcLibraryDecorator = function(target, _super, _utils) {
    return webRtcLibraryDecoratorImpl(target || {}, _super, _utils || utils);
};

if (__testonly__) { __testonly__.webRtcLibraryDecorator = webRtcLibraryDecorator; }
//@{fcs-jsl-prod}

var webRtcLibraryFirefoxDecoratorImpl = function(target, _super, _window, _navigator, _utils, _logManager) {
    var logger = _logManager.getLogger("webRtcLibraryFirefoxDecoratorImpl");

    _super(target);

    target.getUserMedia = function(constraints, successCallback, failureCallback) {
        _navigator.mozGetUserMedia(constraints, successCallback, failureCallback);
    };

    target.showSettingsWindow = function() {
        return;
    };

    target.createRTCSessionDescription = function(type, sdp) {
        return new _window.mozRTCSessionDescription({"type": type, "sdp": sdp});
    };

    target.createRTCIceCandidate = function(candidate) {
        return  new _window.mozRTCIceCandidate(candidate);
    };

    target.getURLFromStream = function(stream) {
        return _window.URL.createObjectURL(stream);
    };

    target.createRTCPeerConnection = function(stunturn, constraints) {
        return new _window.mozRTCPeerConnection(stunturn, constraints);
    };

    target.checkMediaSourceAvailability = function(callback) {
        // Since _window.MediaStreamTrack.getSources or an equal method is not defined in Firefox Native,
        // sources set as true by default. This should be changed if method or workaround about getting sources provided.
        var i, videoSourceAvailable, audioSourceAvailable;

        if (!_navigator.mediaDevices || !_navigator.mediaDevices.enumerateDevices) {
            _utils.callFunctionIfExist(callback, {videoSourceAvailable: true,
                audioSourceAvailable: true});
        }else{
            _navigator.mediaDevices.enumerateDevices().then(function(mediaSources) {
                for (i = 0; i < mediaSources.length; i++) {
                    if (mediaSources[i].kind === "videoinput") {
                        // Video source is available such as webcam
                        videoSourceAvailable = true;
                    } else if (mediaSources[i].kind === "audioinput") {
                        // audio source is available such as mic
                        audioSourceAvailable = true;
                    }
                }
                _utils.callFunctionIfExist(callback, {videoSourceAvailable: videoSourceAvailable,
                    audioSourceAvailable: audioSourceAvailable, sourceList: mediaSources});
            })
            .catch(function(error) {
                logger.error("Failed to enumerate devices. Error name: " + error.name + "Error message: " + error.message);
                _utils.callFunctionIfExist(callback, {videoSourceAvailable: false,
                    audioSourceAvailable: false, sourceList: null});
            });
        }
    };

    target.detachWebAudioContextFromLocalMedia = function (localMedia) {
        localMedia.audioContext.close();
        if (localMedia.mediaStreamDestination.numberOfOutputs > 0) {
            localMedia.mediaStreamDestination.disconnect();
        }
    };

    target.stopLocalMedia = function(localMedia) {
        if (localMedia) {
            target.stopStream(localMedia.stream);
            target.stopStream(localMedia.originalStream);
        }
    };

    target.stopStream = function(stream) {
        if (stream && stream.stop) {
            stream.stop();
        }
    };

    target.get_audioInDeviceCount = function() {
        // Not Applicable for Firefox Native
        return 1;
    };

    target.get_audioOutDeviceCount = function() {
        // Not Applicable for Firefox Native
        return 1;
    };

    target.get_videoDeviceCount = function() {
        // Not Applicable for Firefox Native
        return 1;
    };

    target.set_logSeverityLevel = function() {
        // Not Applicable for Firefox Native
        return false;
    };

    target.get_logSeverityLevel = function() {
        // Not Applicable for Firefox Native
        return;
    };

    target.enable_logCallback = function() {
        // Not Applicable for Firefox Native
        return;
    };

    target.disable_logCallback = function(){
        // Not Applicable for Firefox Native
        return;
    };
};

//@{fcs-jsl-prod}
var webRtcLibraryFirefoxDecorator = function(target, _super, _window, _navigator, _utils, _logManager) {
    webRtcLibraryFirefoxDecoratorImpl(target || {},
            _super || webRtcLibraryDecorator,
            _window || window,
            _navigator || navigator,
            _utils || utils,
            _logManager || logManager);
};

if (__testonly__) { __testonly__.webRtcLibraryFirefoxDecorator = webRtcLibraryFirefoxDecorator; }
//@{fcs-jsl-prod}

var webRtcLibraryChromeDecoratorImpl = function(target, _super, _window, _navigator, _utils, _logManager) {
    var logger = _logManager.getLogger("webRtcLibraryChromeDecoratorImpl");
    _super(target);

    target.getUserMedia = function(constraints, successCallback, failureCallback) {
        _navigator.webkitGetUserMedia(constraints, successCallback, failureCallback);
    };

    target.showSettingsWindow = function() {
        return;
    };

    target.createRTCSessionDescription = function(type, sdp) {
        return new _window.RTCSessionDescription({"type": type, "sdp": sdp});
    };

    target.createRTCIceCandidate = function(candidate) {
        return  new _window.RTCIceCandidate(candidate);
    };

    target.getURLFromStream = function(stream){
        return _window.URL.createObjectURL(stream);
    };

    target.createRTCPeerConnection = function(stunturn, constraints) {
        return new _window.webkitRTCPeerConnection(stunturn, constraints);
    };

    target.checkMediaSourceAvailability = function (callback) {
        var i, videoSourceAvailable, audioSourceAvailable;

        function executeCallback(videoSourceAvailable, audioSourceAvailable, sourceList) {
            _utils.callFunctionIfExist(callback, {
                videoSourceAvailable: videoSourceAvailable,
                audioSourceAvailable: audioSourceAvailable, sourceList: sourceList
            });
        }

        function processMediaDevices(mediaSources) {
            for (i = 0; i < mediaSources.length; i++) {
                if (mediaSources[i].kind === "videoinput" || mediaSources[i].kind === "video") {
                    // Video source is available such as webcam
                    videoSourceAvailable = true;
                } else if (mediaSources[i].kind === "audioinput" || mediaSources[i].kind === "audio") {
                    // audio source is available such as mic
                    audioSourceAvailable = true;
                }
            }
            executeCallback(videoSourceAvailable, audioSourceAvailable, mediaSources);
        }

        if (_navigator.mediaDevices && _navigator.mediaDevices.enumerateDevices) {
            _navigator.mediaDevices.enumerateDevices().then(processMediaDevices).catch(function (error) {
                logger.error("Failed to enumerate devices. Error name: " + error.name + "Error message: " + error.message);
                executeCallback(false, false, null);
            });
        }
        else {
            _window.MediaStreamTrack.getSources(processMediaDevices);
        }
    };

    target.detachWebAudioContextFromLocalMedia = function (localMedia) {
        localMedia.audioContext.close();
        localMedia.mediaStreamDestination.disconnect();
    };

    target.stopLocalMedia = function(localMedia) {
        if (localMedia) {
            target.stopStream(localMedia.stream);
            target.stopStream(localMedia.originalStream);
        }
    };

    target.stopStream = function(stream) {
        var i, tracks = [];
        if (stream && stream.getTracks) {
            tracks = stream.getTracks();
        }
        for (i in tracks) {
            if (tracks.hasOwnProperty(i)) {
                tracks[i].stop();
            }
        }
    };

    target.get_audioInDeviceCount = function() {
        // Not Applicable for Chrome Native
        return 1;
    };

    target.get_audioOutDeviceCount = function() {
        // Not Applicable for Chrome Native
        return 1;
    };

    target.get_videoDeviceCount = function() {
        // Not Applicable for Chrome Native
        return 1;
    };

    target.set_logSeverityLevel = function() {
        // Not Applicable for Chrome Native
        return false;
    };

    target.get_logSeverityLevel = function() {
        // Not Applicable for Chrome Native
        return;
    };

    target.enable_logCallback = function() {
        // Not Applicable for Chrome Native
        return;
    };

    target.disable_logCallback = function(){
        // Not Applicable for Chrome Native
        return;
    };
};

//@{fcs-jsl-prod}
var webRtcLibraryChromeDecorator = function(target, _super, _window, _navigator, _utils, _logManager) {
    webRtcLibraryChromeDecoratorImpl(target || {},
            _super || webRtcLibraryDecorator,
            _window || window,
            _navigator || navigator,
            _utils || utils,
            _logManager || logManager);
};

if (__testonly__) { __testonly__.webRtcLibraryChromeDecorator = webRtcLibraryChromeDecorator; }
//@{fcs-jsl-prod}


var WebRtcAdaptorImpl = function(_super, _decorator, _model, _logManager, _utils, _sdpParser, _mediaErrors) {
    var self = this, logger = _logManager.getLogger("WebRtcAdaptorImpl");

    logger.debug('WebRtcAdaptor initializing');

    _utils.compose(_model, self);

    self.storeStableRemoteAndLocalSdpInCall = function(call) {
        if (call && call.peer) {
            if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE)
            {
                call.stableRemoteSdp = call.peer.remoteDescription.sdp;
                call.stableLocalSdp = call.peer.localDescription.sdp;
            }
        }
    };

    /*
     * Sdp workarounds performed before createOffer
     * TODO all workarounds should be detected and filled in here
     */
    self.performSdpWorkaroundsAfterCreateOffer = function(call, oSdp) {
        oSdp.sdp = _sdpParser.replaceCodecs(oSdp.sdp, call.codecsToReplace ? call.codecsToReplace : fcsConfig.codecsToReplace);
        return oSdp;
    };

    /*
     * Overrides configured codec values with originators value, in this case, webRtc is terminator side
     */
    self.overrideConfiguredCodecValues = function(call, sdp) {
        var index, newValue;
        call.codecsToReplace = call.codecsToReplace ? call.codecsToReplace :JSON.parse(JSON.stringify(fcsConfig.codecsToReplace));
        if (call.codecsToReplace) {
            for (index = 0; index < call.codecsToReplace.length; index++) {
                newValue = _sdpParser.getPayloadTypeOf(call.codecsToReplace[index].name, sdp);
                if (newValue && (newValue !== -1)) {
                    // getPayloadTypeOf method could return
                    // either array or string
                    // In such case, arrays first element will be used
                    if (Array.isArray(newValue)) {
                        newValue = newValue[0];
                    }
                    call.codecsToReplace[index].value = newValue;
                }
            }
        }
    };

    //This function is called internally when we make a new call or hold/unhold scenario
    // Native implementation lies on webRtcAdaptor.js
    self.addLocalStream = function(internalCall) {
        var streamUrl, fireEvent = false,
                isSendingLocalVideo = self.canOriginatorSendLocalVideo(internalCall);

        if (internalCall.localMedia.stream) {
            if (isSendingLocalVideo) {
                streamUrl = self.getRtcLibrary().getURLFromStream(internalCall.localMedia.stream);

                if (streamUrl) {
                    if (self.getDefaultVideoContainer()) {
                        fireEvent = self.useDefaultRenderer(streamUrl, true, true);
                    } else if (self.getLocalVideoContainer()) {
                        fireEvent = self.createStreamRenderer(streamUrl, self.getLocalVideoContainer(), {
                            muted: true});
                    } else {
                        internalCall.call.localStreamURL = streamUrl;
                        fireEvent = true;
                    }
                }
            } else {
                if (self.getDefaultVideoContainer()) {
                    if (self.getDefaultVideoContainer().lastElementChild) {
                        self.disposeStreamRenderer(self.getDefaultVideoContainer().lastElementChild);
                    }
                } else if (self.getLocalVideoContainer()) {
                    self.disposeStreamRenderer(self.getLocalVideoContainer());
                }
            }

            logger.debug("onLocalStreamAdded: " + streamUrl);
            if (fireEvent) {
                self.fireOnLocalStreamAddedEvent(internalCall, streamUrl);
            }
        }
    };

    // Native implementation lies on webRtcAdaptor.js

    self.fireOnLocalStreamAddedEvent = function(call, streamUrl) {
        if (call && call.call && call.call.onLocalStreamAdded) {
            _utils.callFunctionIfExist(call.call.onLocalStreamAdded, streamUrl);
        }
    };

    self.storeLocalStreamToCall = function(call, localStreamId) {
        logger.debug("assigning local stream [" + localStreamId + "] to call: " + call.id);
        if (call.localMedia) {
            self.endLocalMedia(call.localMedia);
        }
        call.localMedia = self.getLocalStreamMap().get(localStreamId);
    };

    self.performSdpWorkaroundsBeforeProcessingIncomingSdp = function(call) {
        call.sdp = _sdpParser.deleteBandwidthLineFromSdp(call.sdp);
        call.sdp = _sdpParser.removeG722Codec(call.sdp);
    };

    /*
     * createNativeReOffer
     */
    self.createReOffer = function(call, onSuccess, onFailure, usePreviousMediaDirection) {
        var peer = call.peer, localDescObj, localAudioDirection, localVideoDirection,
                newVideoDirection, prevLocalSdp = call.peer.localDescription.sdp, data;

        logger.debug("createReOffer:" + call.id);

        data = {
            call: call,
            mustCreatePeer: true
        };
        if (self.createNewPeerForCall(data)) {
            peer = call.peer;
        }

        peer.createOffer(
                function prwCreateOfferSuccessCallback(oSdp) {

                    if (usePreviousMediaDirection) {
                        localAudioDirection = _sdpParser.getAudioSdpDirection(prevLocalSdp);
                        oSdp.sdp = _sdpParser.updateAudioSdpDirection(oSdp.sdp, localAudioDirection);
                        localVideoDirection = _sdpParser.getVideoSdpDirection(prevLocalSdp);
                        oSdp.sdp = _sdpParser.updateVideoSdpDirection(oSdp.sdp, localVideoDirection);
                    }else{
                        localVideoDirection = _sdpParser.getVideoSdpDirection(prevLocalSdp);
                        newVideoDirection = _sdpParser.getVideoSdpDirection(oSdp.sdp);
                        if(localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE &&
                            newVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE){
                            oSdp.sdp = _sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                        }
                    }

                    oSdp.sdp = _sdpParser.deleteCryptoZeroFromSdp(oSdp.sdp);
                    oSdp.sdp = _sdpParser.updateAudioCodec(oSdp.sdp);
                    oSdp.sdp = _sdpParser.removeG722Codec(oSdp.sdp);
                    oSdp.sdp = _sdpParser.deleteCryptoFromSdp(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = _sdpParser.setTcpSetupAttributeToActpass(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = _sdpParser.updateVersion(prevLocalSdp, oSdp.sdp);
                    oSdp = self.performSdpWorkaroundsAfterCreateOffer(call, oSdp);


                    localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, oSdp.sdp);
                    peer.setLocalDescription(
                            localDescObj,
                            function prwSetLocalDescriptionSuccessCallback() {
                                logger.debug("createReOffer: setLocalDescription success" + call.id);
                            },
                            function prwSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createReOffer: setLocalDescription failed!!" + e + call.id);
                                _utils.callFunctionIfExist(onFailure);
                            });
                },
                function prwCreateOfferFailureCallback(e) {
                    logger.error("createReOffer: createOffer failed!! " + e);
                    _utils.callFunctionIfExist(onFailure);
                },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
    };

    // Native implementation lies on webRtcAdaptor.js
    self.getLocalAudioTrack = function(peer) {
        logger.debug("getLocalAudioTrack");
        var audioTracks;

        /*
         * ABE-832: On MAC OS, Safari browser version 6.1 doesn't recognize array
         * indices of integer type. Therefore, all [0] calls are changed to ["0"].
         * All other browser types function correctly with both integer and string
         * indices.
         */

        if(peer.localStreams && peer.localStreams["0"].audioTracks) {
            if (peer.localStreams["0"].audioTracks.length > 0) {
                return peer.localStreams["0"].audioTracks["0"];
            }
        }
        else if (peer.getLocalStreams) {
            audioTracks = peer.getLocalStreams()["0"].getAudioTracks();
            if(audioTracks && audioTracks.length > 0) {
                return audioTracks["0"];
            }
        }

        return null;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.getLocalVideoTrack = function(peer) {
        logger.debug("getLocalVideoTrack");
        var streams;

        /*
         * ABE-832: On MAC OS, Safari browser version 6.1 doesn't recognize array
         * indices of integer type. Therefore, all [0] calls are changed to ["0"].
         * All other browser types function correctly with both integer and string
         * indices.
         */

        if(peer.localStreams && peer.localStreams["0"].videoTracks) {
            if (peer.localStreams["0"].videoTracks.length > 0) {
                return peer.localStreams["0"].videoTracks["0"];
            }
        }
        else if (peer.getLocalStreams) {
            streams = peer.getLocalStreams();
            if(streams && streams["0"].getVideoTracks() && streams["0"].getVideoTracks().length > 0) {
                return streams["0"].getVideoTracks()["0"];
            }
        }

        return null;
    };

    self.setFcsUserMuteState = function(call, mute) {
        call.fcsUserMuteState = mute;
    };

    self.muteAudioTrack = function(call, mute) {
        var localAudioTrack;

        if (!self.isInitialized()) {
            logger.warn("muteAudioTrack: Plugin is not installed");
            return;
        }

        if (!call.peer) {
            return;
        }

        localAudioTrack = self.getLocalAudioTrack(call.peer);
        if (localAudioTrack) {
            logger.info("mute Audio Track [" + localAudioTrack.id + "], call [" + call.id + "] mute=" + mute);
            localAudioTrack.enabled = !mute;
            call.audioMuted = mute;
            self.setFcsUserMuteState(call, mute);
        }
    };

    self.muteVideoTrack = function(call, mute) {
        var localVideoTrack;

        if (!self.isInitialized()) {
            logger.warn("muteVideoTrack: Plugin is not installed");
            return;
        }

        if (!call.peer) {
            return;
        }

        localVideoTrack = self.getLocalVideoTrack(call.peer);
        if (localVideoTrack) {
            logger.info("mute Video Track [" + localVideoTrack.id + "], call [" + call.id + "] mute=" + mute);
            localVideoTrack.enabled = !mute;
            call.videoMuted = mute;
        }
    };

    self.isAudioMuted = function(call) {
        if (call && call.audioMuted) {
            return call.audioMuted;
        }
        return false;
    };

    self.restoreMuteStateOfCall = function (call) {
        var previousMuteStateOfAudio = false, previousMuteStateOfVideo = false;
        if (!call.peer) {
            return;
        }

        if (call.fcsUserMuteState) {
            previousMuteStateOfAudio = call.fcsUserMuteState;
        }

        logger.debug("previous mute state of call: " + previousMuteStateOfAudio);
        self.muteAudioTrack(call, previousMuteStateOfAudio);
        self.muteVideoTrack(call, previousMuteStateOfVideo);
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * Mutes audio and video tracks (to be used during Hold)
     *
     * @ignore
     * @name rtc.mute
     * @function
     * @param {Object} call internalCall
     * @param {boolean} mute true to mute, false to unmute
     */
    self.muteOnHold = function(call, mute) {
        self.muteAudioTrack(call, mute);
        self.muteVideoTrack(call, mute);
    };

    // Native implementation lies on webRtcAdaptor.js
    // initNativeMedia
    self.initMedia = function(onSuccess) {
        self.setInitialized(true);
        _decorator(self.getRtcLibrary());
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            self.setMediaSources(mediaSourceInfo);
        });
        onSuccess();
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * performNativeVideoStartWorkaround - term side cannot see orig's video
     */
    self.performVideoStartWorkaround = function(call, onSuccess, onFail) {
        var peer = call.peer, remoteAudioState, remoteVideoState, callSdpWithNoSsrc, localSdp;

        logger.debug("Workaround to play video");

        localSdp = call.peer.localDescription.sdp;
        call.sdp = _sdpParser.addSdpMissingCryptoLine(call.sdp);

        remoteAudioState = _sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);

        call.sdp = _sdpParser.updateAudioSdpDirectionToInactive(call.sdp);
        call.sdp = _sdpParser.updateVideoSdpDirectionToInactive(call.sdp);

        call.sdp = _sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());

        // In Peer-Peer call, in order to remove remote stream properly,
        // ssrc lines should be deleted so that workaround below will
        // first remove the remote stream and then re-add it according to
        // actuall call sdp.
        // In Non Peer-Peer call, ther is no ssrc line in sdp so it is safe
        // to keep method below.
        callSdpWithNoSsrc = _sdpParser.deleteSsrcFromSdp(call.sdp);

        peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, callSdpWithNoSsrc),
                function pvswFirstSetRemoteDescriptionSuccessCallback() {
                    logger.debug("performVideoStartWorkaround: first setRemoteDescription success");

                    // restore original values
                    call.sdp = _sdpParser.updateAudioSdpDirection(call.sdp, remoteAudioState);
                    call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, remoteVideoState);

                    peer.setRemoteDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp),
                            function pvswSecondSetRemoteDescriptionSuccessCallback() {
                                logger.debug("performVideoStartWorkaround: second setRemoteDescription success");
                                peer.createAnswer(
                                        function pvswCreateAnswerSuccessCallback(obj) {
                                            if (remoteAudioState === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                                obj.sdp = _sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                                            }

                                            if (remoteVideoState === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                                obj.sdp = _sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                                            } else if (self.canOriginatorSendLocalVideo(call)) {
                                                obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                            } else {
                                                obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                            }

                                            obj.sdp = _sdpParser.checkAndRestoreICEParams(obj.sdp, call.sdp);

                                            obj.sdp = _sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                            obj.sdp = _sdpParser.updateVersion(localSdp, obj.sdp);

                                            peer.setLocalDescription(
                                                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, obj.sdp),
                                                    function pvswSetLocalDescriptionSuccessCallback() {
                                                        logger.debug("performVideoStartWorkaround: setlocalDescription success");
                                                        _utils.callFunctionIfExist(onSuccess);
                                                    },
                                                    function pvswSetLocalDescriptionFailureCallback(e) {
                                                        logger.debug("performVideoStartWorkaround: setlocalDescription failed!!" + e);
                                                        _utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: setlocalDescription failed!!");
                                                    });
                                        },
                                        function pvswCreateAnswerFailureCallback(e) {
                                            logger.debug("performVideoStartWorkaround: createAnswer failed!! " + e);
                                            _utils.callFunctionIfExist(onFail, "Session cannot be created");
                                        },
                                        {
                                            'mandatory': {
                                                'OfferToReceiveAudio': self.getMediaAudio(),
                                                'OfferToReceiveVideo': self.getMediaVideo()
                                            }
                                        });
                            },
                            function pvswSecondSetRemoteDescriptionFailureCallback(e) {
                                logger.debug("performVideoStartWorkaround: second setRemoteDescription failed!!" + e);
                                _utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: second setRemoteDescription failed!!");
                            });
                },
                function pvswFirstSetRemoteDescriptionFailureCallback(e) {
                    logger.debug("performVideoStartWorkaround: first setRemoteDescription failed!!" + e);
                    _utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: first setRemoteDescription failed!!");
                });
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     */
    self.getUserMedia = function (params) {
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            var mediaInfo, mediaStreamSource, constraints = {audio: false, video: false}, localMedia;
            self.setMediaSources(mediaSourceInfo);

            if (mediaSourceInfo) {
                if(!mediaSourceInfo.audioSourceAvailable) {
                    logger.debug("Failed to get access to local media.");
                    _utils.callFunctionIfExist(params.onFailure, _mediaErrors.NOT_FOUND);
                    return;
                }
            }

            if (self.getMediaVideo() && self.getVideoSourceAvailable()) {
                constraints.video = params.options.videoConstraints;
            }
            if (self.getMediaAudio() && self.getAudioSourceAvailable()) {
                constraints.audio = params.options.audioConstraints;
            }

            logger.debug("getUserMedia - constraints: ", constraints);
            self.getRtcLibrary().getUserMedia(constraints, function getUserMediaSuccessCallback(stream) {
                self.initAudioContext();
                mediaStreamSource = self.getAudioContext().createMediaStreamSource(stream);
                self.initMediaStreamDestination();
                mediaStreamSource.connect(self.getMediaStreamDestination());

                if (stream.getVideoTracks() && stream.getVideoTracks()["0"]) {
                    self.getMediaStreamDestination().stream.addTrack(stream.getVideoTracks()["0"]);
                }

                localMedia = {
                    audioContext: self.getAudioContext(),
                    mediaStreamDestination: self.getMediaStreamDestination(),
                    stream: self.getMediaStreamDestination().stream,
                    originalStream: stream
                };
                self.setLocalMedia(localMedia);
                self.getLocalStreamMap().add(localMedia.stream.id, localMedia);
                self.setInitialized(true);

                mediaInfo = {
                    audio: self.getMediaAudio(),
                    video: self.getMediaVideo(),
                    id: localMedia.stream.id,
                    originalStream: stream,
                    streamURL: self.getRtcLibrary().getURLFromStream(stream)
                };

                logger.debug("user has granted access to local media: ", localMedia);
                _utils.callFunctionIfExist(params.onSuccess, mediaInfo);
            }, function getUserMediaFailureCallback(error) {
                logger.debug("Failed to get access to local media. Error code was " + error.code);
                _utils.callFunctionIfExist(params.onFailure, _mediaErrors.NOT_ALLOWED);
            });
        });
    };

    // createNativeOffer, Native implementation lies on webRtcAdaptor.js
    self.createOffer = function (call, successCallback, failureCallback, sendInitialVideo) {
        logger.debug("createOffer: sendInitialVideo= " + sendInitialVideo + " state= " + call.peer.signalingState);
        var peer = call.peer;

        call.peer.addStream(call.localMedia.stream);

        self.addCallIdInPluginContainer(call);

        peer.createOffer(
                function createOfferSuccessCallback(oSdp) {
                    sendInitialVideo = sendInitialVideo && self.getVideoSourceAvailable();
                    if (sendInitialVideo) {
                        oSdp.sdp = _sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        oSdp.sdp = _sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    }

                    oSdp.sdp = _sdpParser.deleteCryptoZeroFromSdp(oSdp.sdp);

                    oSdp.sdp = _sdpParser.updateAudioCodec(oSdp.sdp);
                    oSdp.sdp = _sdpParser.removeG722Codec(oSdp.sdp);

                    oSdp.sdp = _sdpParser.deleteCryptoFromSdp(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = _sdpParser.setTcpSetupAttributeToActpass(oSdp.sdp, self.isDtlsEnabled());

                    oSdp = self.performSdpWorkaroundsAfterCreateOffer(call, oSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, oSdp.sdp),
                            function createOfferSetLocalDescriptionSuccessCallback() {
                                //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                            }, function createOfferSetLocalDescriptionFailureCallback(error) {
                        logger.error("createOffer: setLocalDescription failed : " + error);
                        _utils.callFunctionIfExist(failureCallback, "createOffer: setLocalDescription failed");
                    });
                }, function createOfferFailureCallback(e) {
            logger.error("createOffer: createOffer failed!! " + e);
            _utils.callFunctionIfExist(failureCallback);
        },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
    };

    /*
     *  Native implementation lies on webRtcAdaptor.js
     *  createNativeAnswer to be used when native webrtc is enabled.
     *  @param {type} call
     *  @param {type} successCallback
     *  @param {type} failureCallback
     *  @param {type} isVideoEnabled
     */
    self.createAnswer = function(call, successCallback, failureCallback, isVideoEnabled) {
        logger.debug("createAnswer: isVideoEnabled= " + isVideoEnabled + " state= " + call.peer.signalingState);
        var peer = call.peer;

        call.peer.addStream(call.localMedia.stream);
        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
        call.sdp = _sdpParser.deleteFingerprintOrCrypto(call.sdp, self.isDtlsEnabled());

        self.addCallIdInPluginContainer(call);

        if (!_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = _sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }
        peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp),
            function createAnswerSetRemoteDescriptionSuccessCallback(){
                    call.remoteVideoState = _sdpParser.getSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO);

                    peer.createAnswer(
                            function(oSdp) {
                                isVideoEnabled = isVideoEnabled && self.getVideoSourceAvailable() && _sdpParser.isSdpHasVideo(call.sdp);

                                if (isVideoEnabled) {
                                    if (_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        oSdp.sdp = _sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                    } else {
                                        if (_sdpParser.getVideoSdpDirection(call.sdp) !== CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                            oSdp.sdp = _sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                        }
                                        else {
                                            oSdp.sdp = _sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                        }
                                    }
                                } else {
                                    if (_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        oSdp.sdp = _sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                    } else {
                                        oSdp.sdp = _sdpParser.updateSdpDirection(oSdp.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                    }
                                }

                                self.muteOnHold(call, false);

                                // createAnswer generates an sdp without ice params
                                // copy ice params to the local sdp
                                // scenario: incoming video call from pcc in brokeronly config
                                oSdp.sdp = _sdpParser.checkAndRestoreICEParams(oSdp.sdp, call.sdp);

                                peer.setLocalDescription(
                                        self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, oSdp.sdp),
                                        function createAnswerSetLocalDescriptionSuccessCallback(){
                                            //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                                            call.videoOfferSent = _sdpParser.isSdpHasVideo(oSdp.sdp);
                                            self.setTcpSetupAttiributesOnCreateAnswer(call, oSdp.sdp);
                                        },
                                        function createAnswerSetLocalDescriptionFailureCallback(e) {
                                            logger.error("createAnswer: setLocalDescription failed : " + e);
                                            _utils.callFunctionIfExist(failureCallback, "createNativeAnswer setLocalDescription failed");
                                        });
                            },
                            function createAnswerFailureCallback(e){
                                logger.error("createAnswer: failed!! Error: " + e);
                                _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                            },
                            {
                                'mandatory': {
                                    'OfferToReceiveAudio': self.getMediaAudio(),
                                    'OfferToReceiveVideo': self.getMediaVideo()
                                }
                            });
                },
                function createAnswerSetRemoteDescriptionFailureCallback(e){
                    logger.error("createAnswer: setremotedescription failed!! Error: " + e);
                });
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * createNativeUpdate to be used when the video start or stop
     */
    self.createUpdate = function(call, successCallback, failureCallback, isVideoStart) {
        logger.debug("createUpdate: isVideoStart= " + isVideoStart + " state= " + call.peer.signalingState);
        var peer = call.peer, localSdp, localDesc, data, newPeerNeeded;

        newPeerNeeded = (fcsConfig.iceLiteVideoWorkaround && _sdpParser.isIceLite(call.sdp) && isVideoStart) || _sdpParser.isRemoteEndFirefox(call.sdp);
        localSdp = call.peer.localDescription.sdp;

        logger.debug("create new offer to start the video");

        data = {
            call: call,
            mustCreatePeer: newPeerNeeded
        };
        if (self.createNewPeerForCall(data)) {
            logger.debug("remote end is firefox");
            peer = call.peer;
        }

        peer.removeStream(peer.getLocalStreams()[0]);
        peer.addStream(call.localMedia.stream);

        self.setMediaVideo(true);
        peer.createOffer(
                function createUpdateCreateOfferSuccessCallback(obj) {
                    isVideoStart = isVideoStart && self.getVideoSourceAvailable();
                    if (isVideoStart) {
                        obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        if (_sdpParser.isVideoSdpDirectionInactive(call.stableRemoteSdp)) {
                            obj.sdp = _sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                        } else {
                            obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                        }
                    }

                    obj.sdp = _sdpParser.updateVersion(localSdp, obj.sdp);
                    obj.sdp = _sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
                    obj.sdp = _sdpParser.deleteCryptoZeroFromSdp(obj.sdp);
                    obj.sdp = _sdpParser.updateAudioCodec(obj.sdp);
                    obj.sdp = _sdpParser.removeG722Codec(obj.sdp);
                    obj.sdp = _sdpParser.deleteCryptoFromSdp(obj.sdp, self.isDtlsEnabled());
                    obj = self.performSdpWorkaroundsAfterCreateOffer(call, obj);

                    localDesc = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

                    peer.setLocalDescription(localDesc,
                            function createUpdateCreateOfferSetLocalDescriptionSuccessCallback() {
                                logger.debug("createUpdate setLocalDescription success. iceConnectionState: " + peer.iceConnectionState + " iceGatheringState: " + peer.iceGatheringState);
                                if (peer.iceGatheringState === "complete") {
                                    if (call.successCallback) {
                                        logger.debug("createUpdate iceGatheringState completed " + peer.localDescription.sdp);
                                        call.successCallback(peer.localDescription.sdp);
                                    }
                                }
                            },
                            function crateUpdateCreateOfferSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createUpdate: createOffer setLocalDescription failed: " + e);
                                _utils.callFunctionIfExist(failureCallback);
                            });
                },
                function createUpdateCrateOfferFailureCallback(e) {
                    logger.debug("createUpdate: createOffer failed!!: " + e);
                    failureCallback();
                },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                }
        );
    };

    /*
     * Reverts RTC engine's state
     */
    self.revertRtcState = function(call, successCallback, failureCallback) {
        var peer = call.peer, obj, localSdp = call.stableLocalSdp,
                remoteSdp = call.stableRemoteSdp,
                rtcState = peer.signalingState;
        remoteSdp = _sdpParser.deleteGoogleIceFromSdp(remoteSdp);
        switch (rtcState) {
            case CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE:
            case CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.HAVE_LOCAL_OFFER:
                localSdp = _sdpParser.setTcpSetupAttributeToActpass(localSdp, self.isDtlsEnabled());
                obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, localSdp);
                peer.setLocalDescription(obj,
                        function revertRtcStateLocalDescriptionSuccessCallback() {
                            logger.debug("revertRtcState[stable|local_offer]: setLocalDescription success");
                            remoteSdp = _sdpParser.setTcpSetupAttributeTo(remoteSdp, call.remoteTcpSetupAttribute, self.isDtlsEnabled());
                            obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, remoteSdp);
                            peer.setRemoteDescription(obj,
                                    function revertRtcStateRemoteDescriptionSuccessCallback() {
                                        logger.debug("revertRtcState[stable|local_offer]: setRemoteDescription success");
                                        if (peer.iceGatheringState === "complete") {
                                            _utils.callFunctionIfExist(successCallback);
                                        }
                                    }, function revertRtcStateRemoteDescriptionFailureCallback(error) {
                                        logger.error("revertRtcState[stable|local_offer]: setRemoteDescription failed: " + error);
                                        _utils.callFunctionIfExist(failureCallback, call);
                            });
                        },
                        function revertRtcStateLocalDescriptionFailureCallback(error) {
                            logger.error("revertRtcState[stable|local_offer]: setLocalDescription failed: " + error);
                            _utils.callFunctionIfExist(failureCallback, call);
                        });
                break;
            case CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.HAVE_REMOTE_OFFER:
                remoteSdp = _sdpParser.setTcpSetupAttributeToActpass(remoteSdp, self.isDtlsEnabled());
                obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, remoteSdp);
                peer.setRemoteDescription(obj,
                        function revertRtcStateRemoteDescriptionSuccessCallback() {
                            logger.debug("revertRtcState[remote_offer]: setLocalDescription success");
                            localSdp = _sdpParser.setTcpSetupAttributeTo(localSdp, call.localTcpSetupAttribute, self.isDtlsEnabled());
                            obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, localSdp);
                            peer.setLocalDescription(obj,
                                    function revertRtcStateLocalDescriptionSuccessCallback() {
                                        logger.debug("revertRtcState[remote_offer]: setRemoteDescription success");
                                        if (peer.iceGatheringState === "complete") {
                                            _utils.callFunctionIfExist(successCallback);
                                        }
                                    }, function revertRtcStateLocalDescriptionFailureCallback(error) {
                                logger.error("revertRtcState[remote_offer]: setRemoteDescription failed: " + error);
                                _utils.callFunctionIfExist(failureCallback, call);
                            });
                        },
                        function revertRtcStateRemoteDescriptionFailureCallback(error) {
                            logger.error("revertRtcState[remote_offer]: setLocalDescription failed: " + error);
                            _utils.callFunctionIfExist(failureCallback, call);
                        });
                break;
            default:
                logger.debug("revertRtcState: not applicible for state: " + rtcState);
        }
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * createNativeHoldUpdate to be used when native webrtc is enabled
     */
    self.createHoldUpdate = function(call, hold, remote_hold_status, successCallback, failureCallback) {
        logger.debug("createHoldUpdate: local hold= " + hold + " remote hold= " + remote_hold_status + " state= " + call.peer.signalingState);
        var peer = call.peer,
                audioDirection,
                videoDirection,
                localDescObj,
                localSdp,
                data;

        localSdp = peer.localDescription.sdp;
        audioDirection = _sdpParser.getAudioSdpDirection(localSdp);
        videoDirection = _sdpParser.getVideoSdpDirection(localSdp);

        data = {
            call: call,
            mustCreatePeer: _sdpParser.isRemoteEndFirefox(call.sdp)
        };
        if (self.createNewPeerForCall(data)) {
            logger.debug("remote end is firefox");
            peer = call.peer;
        }

        peer.createOffer(function createHoldUpdateCreateOfferSuccessCallback(obj) {

            obj.sdp = _sdpParser.updateVersion(localSdp, obj.sdp);
            obj.sdp = _sdpParser.deleteCryptoZeroFromSdp(obj.sdp);
            obj.sdp = _sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
            obj = self.performSdpWorkaroundsAfterCreateOffer(call, obj);

            //two sdp-s are created here
            //one is to be used by rest-request (externalSdp)
            //one is to set the audio-video direction of the local call (localSdp)
            //this is needed in order to adapt to the rfc (needs sendrecv to sendonly transition)
            //and to the plugin (needs inactive to mute audio and video connection)

            if (hold || remote_hold_status) {
                if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                    obj.sdp = _sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                } else {
                    if (!hold && remote_hold_status) {
                        obj.sdp = _sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        obj.sdp = _sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                    }
                }
                if (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                    obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                } else {
                    if (!hold && remote_hold_status) {
                        obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        obj.sdp = _sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                    }
                }
            } else {
                obj.sdp = _sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                if (self.canOriginatorSendLocalVideo(call)) {
                    obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                } else {
                    obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                }
            }

            localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

            peer.setLocalDescription(localDescObj,
                    function createHoldUpdateSetLocalDescriptionSuccessCallback() {
                        logger.debug("createHoldUpdate setLocalDescription success. iceConnectionState: " + peer.iceConnectionState + " iceGatheringState: " + peer.iceGatheringState);
                        if (peer.iceGatheringState === "complete") {
                            if (call.successCallback) {
                                logger.debug("createHoldUpdate iceGatheringState completed " + peer.localDescription.sdp);
                                call.successCallback(peer.localDescription.sdp);
                            }
                        }
                    },
                    function createHoldUpdateSetLocalDescriptionFailureCallback(error) {
                        logger.error("createHoldUpdate: setLocalDescription failed: " + error.message);
                        _utils.callFunctionIfExist(failureCallback);
                    });
        }, function createHoldUpdateCreateOfferFailureCallback(error) {
            logger.error("createHoldUpdate: createOffer failed: " + error.message);
            _utils.callFunctionIfExist(failureCallback);
        }, {
            'mandatory': {
                'OfferToReceiveAudio': self.getMediaAudio(),
                'OfferToReceiveVideo': self.getMediaVideo()
            }
        });
    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativeHold
    self.processHold = function(call, hold, local_hold_status, successCallback, failureCallback) {
        logger.debug("processHold: local hold= " + local_hold_status + " remote hold= " + hold + " state= " + call.peer.signalingState);
        var peer = call.peer, updateSdp, audioDirection, videoDirection,
                peerRemoteSdp, peerLocalSdp, inactiveRemoteSdp, data;

        if (!local_hold_status && !hold) {
            self.muteOnHold(call, false);
        }

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        call.sdp = _sdpParser.performVideoPortZeroWorkaround(call.sdp);
        call.sdp = _sdpParser.checkAndRestoreICEParams(call.sdp, call.peer.localDescription.sdp);

        audioDirection = _sdpParser.getAudioSdpDirection(call.sdp);
        videoDirection = _sdpParser.getVideoSdpDirection(call.sdp);

        peerRemoteSdp = call.prevRemoteSdp;
        peerLocalSdp = peer.localDescription.sdp;
        updateSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);
        inactiveRemoteSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, updateSdp.sdp);

        // chrome38 fix
        inactiveRemoteSdp.sdp = _sdpParser.updateAudioSdpDirectionToInactive(inactiveRemoteSdp.sdp);
        inactiveRemoteSdp.sdp = _sdpParser.updateVideoSdpDirectionToInactive(inactiveRemoteSdp.sdp);

        data = {
            call: call,
            oldSdp: call.prevRemoteSdp,
            newSdp: call.sdp
        };
        if (self.createNewPeerForCall(data)) {
            peer = call.peer;
        }
        inactiveRemoteSdp.sdp = _sdpParser.deleteSsrcFromSdp(inactiveRemoteSdp.sdp);

        // 1st setRemoteDescription to make webrtc remove the audio and/or video streams
        // 2nd setRemote will add the audio stream back so that services like MOH can work
        // This code will also run in UnHold scenario, and it will remove & add video stream
        peer.setRemoteDescription(
                inactiveRemoteSdp,
                function processHoldSetFirstRemoteDescriptionSuccessCallback() {
                    updateSdp.sdp = _sdpParser.updateAudioSdpDirection(updateSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    //updateSdp.sdp = updateSdpDirection(updateSdp.sdp, video, videoDirection);

                    if (_sdpParser.getVideoSdpDirection(updateSdp.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                            _sdpParser.getVideoSdpDirection(updateSdp.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
                    {
                        updateSdp.sdp = _sdpParser.deleteInactiveVideoSsrc(updateSdp.sdp);
                    }
                    peer.setRemoteDescription(
                            updateSdp,
                            function processHoldSetSecondRemoteDescriptionSuccessCallback() {
                                if (!hold && !local_hold_status && (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE)) {
                                    call.remoteVideoState = CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
                                } else{
                                    call.remoteVideoState = _sdpParser.getVideoSdpDirection(updateSdp.sdp);
                                }
                                peer.createAnswer(
                                    function processHoldCreateAnswerSuccessCallback(obj){
                                            logger.debug("processHold: isSdpEnabled audio= " + _sdpParser.isAudioSdpEnabled(obj.sdp));
                                            logger.debug("processHold: isSdpEnabled video= " + _sdpParser.isVideoSdpEnabled(obj.sdp));

                                            if (hold) {
                                                logger.debug("processHold: Remote HOLD");
                                                obj.sdp = _sdpParser.respondToRemoteSdpDirections(obj.sdp, call.sdp);
                                            } else if (!local_hold_status) {
                                                logger.debug("processHold: Remote UNHOLD: direction left as it is");

                                                if (_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                                    if (self.canOriginatorSendLocalVideo(call)) {
                                                        obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                                    } else {
                                                        obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                                    }
                                                } else {
                                                    if (self.canOriginatorSendLocalVideo(call) && !_sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                                        obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                    } else {
                                                        obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                                    }
                                                }
                                                //change audio's direction to sendrecv for ssl attendees in a 3wc
                                                obj.sdp = _sdpParser.changeDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
                                            } else if (local_hold_status && !hold) {
                                                logger.debug("processHold: Remote UNHOLD on local hold");

                                                if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                                    obj.sdp = _sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                                                } else {
                                                    obj.sdp = _sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                }

                                                if (self.canOriginatorSendLocalVideo(call)) {
                                                    obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                } else {
                                                    obj.sdp = _sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                                                }
                                            }

                                            obj.sdp = _sdpParser.updateVersion(peerLocalSdp, obj.sdp);
                                            obj.sdp = _sdpParser.checkIceParamsLengths(obj.sdp, updateSdp.sdp);

                                            obj.sdp = _sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                            peer.setLocalDescription(
                                                    obj,
                                                    function processHoldSetLocalDescriptionSuccessCallback() {
                                                        logger.debug("processHold: setLocalDescription success!! " + "iceConnectionState: " + peer.iceConnectionState + " iceGatheringState: " + peer.iceGatheringState);
                                                        if (peer.iceGatheringState === "complete") {
                                                            if (call.successCallback) {
                                                                logger.debug("processHold iceGatheringState completed " + peer.localDescription.sdp);
                                                                call.successCallback(peer.localDescription.sdp);
                                                            }
                                                        }
                                                    },
                                                    function processHoldSetLocalDescriptionFailureCallback(e) {
                                                        logger.error("processHold: setLocalDescription failed!! " + e);
                                                        _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                                    });
                                        },
                                        function processHoldCreateAnswerFailureCallback(e){
                                            logger.error("processHold: createAnswer failed!!: " + e);
                                            _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                        },
                                        {
                                            'mandatory': {
                                                'OfferToReceiveAudio': self.getMediaAudio(),
                                                'OfferToReceiveVideo': self.getMediaVideo()
                                            }
                                        });
                            },
                            function processHoldSetSecondRemoteDescriptionFailureCallback(e) {
                                logger.error("processHold: second setRemoteDescription failed!! " + e);
                                _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                            });
                },
                function processHoldSetFirstRemoteDescriptionFailureCallback(e) {
                    logger.debug("processHold: first setRemoteDescription failed!! " + e);
                    _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                });
    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativeUpdate
    self.processUpdate = function(call, successCallback, failureCallback, local_hold_status) {
        logger.debug("processUpdate: state= " + call.peer.signalingState);
        var peer = call.peer, remoteAudioState, remoteVideoState, remoteVideoDirection, localVideoDirection, callSdpWithNoSsrc,
                remoteDescObj, localDescObj, peerRemoteSdp, peerLocalSdp, remoteDescriptionMainProcess, data;

        // Meetme workaround
        call.sdp = _sdpParser.addSdpMissingCryptoLine(call.sdp);

        call.sdp = _sdpParser.checkAndRestoreICEParams(call.sdp, call.peer.localDescription.sdp);

        remoteVideoDirection = _sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = _sdpParser.getVideoSdpDirection(peer.localDescription.sdp);

        self.setMediaVideo(_sdpParser.isSdpHasVideo(call.sdp));
        if (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE &&
                call.currentState === "COMPLETED")
        {
            switch(call.remoteVideoState){
                case CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE:
                case CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY:
                    call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    break;
                case CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE:
                    call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
            }
        }

        call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.VIDEO);

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        //this part is a work-around for webrtc bug
        //set remote description with inactive media lines first.
        //then set remote description with original media lines.

        //keep original values of remote audio and video states
        remoteAudioState = _sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);

        //This is highly required for meetme on DTLS
        call.sdp = _sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());

        // delete all ssrc lines from the sdp before setting first remote description
        // set second remote description with all ssrc lines included
        if (remoteVideoState === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                remoteVideoState === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = _sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        peerRemoteSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.prevRemoteSdp);
        peerLocalSdp = peer.localDescription.sdp;

        data = {
            call: call,
            oldSdp: call.prevRemoteSdp,
            newSdp: call.sdp
        };
        if (self.createNewPeerForCall(data)) {
            peer = call.peer;
        }

        remoteDescriptionMainProcess = function() {
            remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);

            peer.setRemoteDescription(
                    remoteDescObj,
                    function processUpdateSetRemoteDescriptionSuccessCallback() {
                        logger.debug("processUpdate: setRemoteDescription success");
                        call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);

                        peer.createAnswer(
                                function processUpdateCreateAnswerSuccessCallback(obj) {
                                    logger.debug("processUpdate: isSdpEnabled audio= " + _sdpParser.isAudioSdpEnabled(obj.sdp));
                                    logger.debug("processUpdate: isSdpEnabled video= " + _sdpParser.isVideoSdpEnabled(obj.sdp));

                                    if (_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        if (self.canOriginatorSendLocalVideo(call)) {
                                            obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                        } else {
                                            obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                        }
                                    } else {
                                        if (self.canOriginatorSendLocalVideo(call) && !_sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                            obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                        } else {
                                            obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                        }
                                    }
                                    obj.sdp = _sdpParser.updateVersion(peerLocalSdp, obj.sdp);
                                    obj.sdp = _sdpParser.checkIceParamsLengths(obj.sdp, remoteDescObj.sdp);
                                    obj.sdp = _sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                    localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, obj.sdp);
                                    peer.setLocalDescription(
                                            localDescObj,
                                            function processUpdateSetLocalDescriptionSuccessCallback() {
                                                logger.debug("processUpdate setLocalDescription success. iceConnectionState: " + peer.iceConnectionState + " iceGatheringState: " + peer.iceGatheringState);
                                                if (peer.iceGatheringState === "complete") {
                                                    if (call.successCallback) {
                                                        logger.debug("processUpdate iceGatheringState completed " + peer.localDescription.sdp);
                                                        call.successCallback(peer.localDescription.sdp);
                                                    }
                                                }
                                            },
                                            function processUpdateSetLocalDescriptionSuccessCallback(e) {
                                                logger.debug("processUpdate: setlocalDescription failed!!" + e);
                                                _utils.callFunctionIfExist(failureCallback, "processUpdate: setlocalDescription failed!!");
                                            });
                                },
                                function processUpdateCreateAnswerFailureCallback(e) {
                                    logger.debug("processUpdate: createAnswer failed!! " + e);
                                    _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                },
                                {
                                    'mandatory': {
                                        'OfferToReceiveAudio': self.getMediaAudio(),
                                        'OfferToReceiveVideo': self.getMediaVideo()
                                    }
                                });
                    },
                    function processUpdateSetRemoteDescriptionSuccessCallback(e) {
                        logger.debug("processUpdate: setRemoteDescription failed!!" + e);
                        _utils.callFunctionIfExist(failureCallback, "processUpdate: setRemoteDescription failed!!");
                    });
        };

        if (_sdpParser.isSdpHasVideo(call.prevRemoteSdp) || _sdpParser.isIceLite(call.sdp) || local_hold_status)
        {
            //set media lines with inactive state for workaround
            call.sdp = _sdpParser.updateAudioSdpDirectionToInactive(call.sdp);
            call.sdp = _sdpParser.updateVideoSdpDirectionToInactive(call.sdp);

            callSdpWithNoSsrc = _sdpParser.deleteSsrcFromSdp(call.sdp);
            remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, callSdpWithNoSsrc);

            peer.setRemoteDescription(
                    remoteDescObj,
                    function processUpdateWorkaroundSetRemoteDescriptionSuccessCallback() {
                        logger.debug("processUpdate: workaround setRemoteDescription success");

                        //restore original values
                        call.sdp = _sdpParser.updateAudioSdpDirection(call.sdp, remoteAudioState);
                        call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, remoteVideoState);

                        remoteDescriptionMainProcess();
                    },
                    function processUpdateWorkaroundSetRemoteDescriptionSuccessCallback(e) {
                        logger.debug("processUpdate: workaround setRemoteDescription failed!!" + e);
                        _utils.callFunctionIfExist(failureCallback, "processUpdate: workaround setRemoteDescription failed!!");
                    });
        }
        else {
            remoteDescriptionMainProcess();
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativeAnswer
    self.processAnswer = function(call, onSuccess, onFail) {
        logger.debug("processAnswer: state= " + call.peer.signalingState);
        var onSuccessAfterWorkarounds, setRemoteDescription,
                remoteVideoDirection, localVideoDirection,
                peer = call.peer, origSdp;

        onSuccessAfterWorkarounds = function() {
            call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);
            call.videoOfferSent = _sdpParser.isSdpHasVideo(call.sdp);
            _utils.callFunctionIfExist(onSuccess);
        };

        setRemoteDescription = function(call, onSuccess, onFailure) {
            call.peer.setRemoteDescription(
                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp),
                    function() {
                        logger.debug("processAnswer: setRemoteDescription success");
                        onSuccess();
                    },
                    function(e) {
                        logger.error("processAnswer: setRemoteDescription failed: " + e);
                        onFailure();
                    });
        };

        self.setTcpSetupAttiributesOnProcessAnswer(call, call.sdp);
        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, peer.localDescription.sdp, self.isH264Enabled());
        call.sdp = _sdpParser.performVideoPortZeroWorkaround(call.sdp);

        if (peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.HAVE_REMOTE_PRANSWER) {

            if (_sdpParser.isIceLite(call.prevRemoteSdp) !== _sdpParser.isIceLite(call.sdp)) {
                logger.debug("ice - ice-lite change.");
                onFail(CONSTANTS.WEBRTC.ERROR.ICE_ICELITE);
                return;
            }

            origSdp = call.sdp;
            call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            call.sdp = _sdpParser.updateAudioSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            logger.debug("call processPrAnswer again to trigger on remote stream added with updated sdp.");
            self.processPreAnswer(call,
                    function () {
                        call.sdp = origSdp;
                        logger.debug("processPrAnswer success callback. Restore original sdp.");
                        setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);
                    },
                    function () {
                        call.sdp = origSdp;
                        logger.debug("processPrAnswer failure callback. Restore original sdp.");
                        setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);
                    }
            );
            return;
        }

        remoteVideoDirection = _sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = _sdpParser.getVideoSdpDirection(call.peer.localDescription.sdp);

        // this is needed for buggy webrtc api. when term answers with video to audio only call
        // this scenario does not work without converting to sendrecv
        logger.debug("processAnswer: ice-lite: do remote video escalation");
        call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);

        if ((localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY || localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)) {

            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = _sdpParser.deleteInactiveVideoSsrc(call.sdp);

            // Audio <--> Audio : apply workaround step 1

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);

        } else if (localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE)) {

            // Audio  <--> Audio-Video

            setRemoteDescription(call, function() {
                        self.performVideoStartWorkaround(call, onSuccessAfterWorkarounds, onFail);
            }, onFail);

        } else {

            // Audio-Video <--> Audio-Video
            // there is remote video, no need for orig side workaround

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);
        }

    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativePreAnswer
    self.processPreAnswer = function(call, onSuccess, onFailure) {
        logger.debug("processPreAnswer: state= " + call.peer.signalingState);
        var peer = call.peer, remoteDesc;

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, call.peer.localDescription.sdp, self.isH264Enabled());

        remoteDesc = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.PRANSWER, call.sdp);
        peer.setRemoteDescription(
                remoteDesc,
                function processPreAnswerSetRemoteDescriptionSuccessCallback() {
                    self.setOriginatorReceiveRemoteVideo(call);
                    call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);
                    onSuccess();
                    logger.debug("processPreAnswer: setRemoteDescription success");
                },
                function processPreAnswerSetRemoteDescriptionFailureCallback(e) {
                    logger.error("processPreAnswer: setRemoteDescription failed: " + e );
                    onFailure(e);
                });
    };

    // Native implementation lies on webRtcAdaptor.js
    // processNativeRespond
    self.processRespond = function(call, onSuccess, onFail, isJoin) {
        var remoteVideoDirection, callSdpWithNoSsrc, remoteDescObj,
                peer = call.peer;
        logger.debug("processRespond: state= " + call.peer.signalingState);

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, peer.localDescription.sdp, self.isH264Enabled());

        remoteVideoDirection = _sdpParser.getVideoSdpDirection(call.sdp);

        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) && (call.currentState === "COMPLETED"))
        {
            switch(call.remoteVideoState){
                case CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE:
                case CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY:
                    call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
            }
        }
        call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.VIDEO);

        if (isJoin) {
            call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            _utils.callFunctionIfExist(onSuccess);
            return;
        }

        // delete all ssrc lines from the sdp before setting first remote description
        // set second remote description with all ssrc lines included

        if (_sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                _sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = _sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }
        callSdpWithNoSsrc = _sdpParser.deleteSsrcFromSdp(call.sdp);
        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, callSdpWithNoSsrc);

        peer.setRemoteDescription(
                remoteDescObj,
                function processRespondSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processRespond: setRemoteDescription success");
                    var onSuccessAfterWorkarounds = function() {
                        call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);
                        call.videoOfferSent = true;
                        _utils.callFunctionIfExist(onSuccess);
                    };
                    self.performVideoStartWorkaround(call, onSuccessAfterWorkarounds, onFail);
                },
                function processRespondSetRemoteDescriptionSuccessCallback(e) {
                    logger.debug("processRespond: setRemoteDescription failed: " + e);
                    _utils.callFunctionIfExist(onFail);
                });
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * processNativeHoldRespond
     */
    self.processHoldRespond = function(call, onSuccess, onFailure, isJoin) {
        var remoteAudioDirection,
            remoteVideoDirection,
            localVideoDirection,
            onSuccessAfterWorkaround,
            localHoldFlag = false,
            remoteHoldFlag = false,
            obj;

        onSuccessAfterWorkaround = function() {
            //call.remoteVideoState = getSdpDirection(call.sdp, video);
            _utils.callFunctionIfExist(onSuccess);
        };

        logger.debug("processHoldRespond: state= " + call.peer.signalingState + " call.currentState= " + call.currentState);

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, call.peer.localDescription.sdp, self.isH264Enabled());

        _sdpParser.init(call.sdp);
        remoteHoldFlag = _sdpParser.isRemoteHold();

        localHoldFlag = (call.currentState === "LOCAL_HOLD");

        if(!localHoldFlag){
            self.addCallIdInPluginContainer(call);
        }

        remoteAudioDirection = _sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoDirection = _sdpParser.getVideoSdpDirection(call.sdp);

        call.remoteVideoState = remoteVideoDirection;

        localVideoDirection = _sdpParser.getVideoSdpDirection(call.peer.localDescription.sdp);

        logger.debug("processHoldRespond: localHold= " + localHoldFlag + " remoteHold= " + remoteHoldFlag);

        /* Required for MOH - start */
        if (remoteHoldFlag === false) {
            if ((remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) && (call.currentState === "REMOTE_HOLD")) {
                logger.debug("set current web state to COMPLETED");
                call.previousState = call.currentState;
                call.currentState = "COMPLETED";
            }
        } else {
            if (call.currentState === "COMPLETED") {
                logger.debug("set current web state to REMOTE_HOLD");
                call.previousState = call.currentState;
                call.currentState = "REMOTE_HOLD";
            }
        }

        if (localHoldFlag || remoteHoldFlag) {
            logger.debug("processHoldRespond: " + call.currentState + " : video -> inactive");
            call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        }

        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) && (call.currentState === "COMPLETED")) {
            logger.debug("processHoldRespond: video inactive -> recvonly");
            call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }
        /* Required for MOH - end */

        if (isJoin) {
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            _utils.callFunctionIfExist(onSuccess);
            return;
        }

        // this is required for displaying remote video when direction is send only
        call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
        if (_sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                _sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = _sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        if (localHoldFlag && remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
            logger.debug("processHoldRespond: Mute Remote Audio");
            call.sdp = _sdpParser.updateAudioSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }

        if (localHoldFlag && remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
            logger.debug("processHoldRespond: Mute Remote Video");
            call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }

        obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp);

        call.peer.setRemoteDescription(obj,
                function processHoldRespondSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processHoldRespond: setRemoteDescription typeAns success");
                    if (remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                        remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY) {
                        onSuccessAfterWorkaround();
                    } else {
                        self.performVideoStartWorkaround(call, onSuccessAfterWorkaround, onFailure);
                    }
                },
                function processHoldRespondSetRemoteDescriptionFailureCallback(e) {
                    logger.debug("processHoldRespond: setRemoteDescription typeAns failed: " + e);
                    _utils.callFunctionIfExist(onFailure);
                });
    };

    // Native implementation lies on webRtcAdaptor.js
    self.processRemoteOfferOnLocalHold = function(call, successCallback, failureCallback) {
        logger.info("processRemoteOfferOnLocalHold");
        if (call.peer) {
            _utils.callFunctionIfExist(successCallback, call.peer.localDescription.sdp);
        }
        else {
            _utils.callFunctionIfExist(failureCallback, "we dont have a peer object somehow");
        }
    };

    self.removeJslIdFromContainer = function () {
        if (self.getDefaultVideoContainer()) {
            self.getDefaultVideoContainer().removeAttribute('jsl-id');
            self.disposeStreamRenderer(self.getDefaultVideoContainer().lastElementChild);
        } else if (self.getLocalVideoContainer()) {
            self.getLocalVideoContainer().removeAttribute('jsl-id');
            self.disposeStreamRenderer(self.getLocalVideoContainer());
        }
    };

    self.clearLocalMediaProperties = function (localMedia) {
        localMedia.stream = null;
        localMedia.originalStream = null;
        localMedia.audioContext = null;
        localMedia.mediaStreamDestination = null;
    };

    self.endLocalMedia = function (localMedia) {
        if (localMedia.stream && !localMedia.privateStream) {
            logger.info("stopping local media " + localMedia.stream.id);
            self.getLocalStreamMap().remove(localMedia.stream.id);
            self.getRtcLibrary().detachWebAudioContextFromLocalMedia(localMedia);
            self.getRtcLibrary().stopLocalMedia(localMedia);
            self.clearLocalMediaProperties(localMedia);
        }
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     * process the end call that was received
     *
     * @ignore
     * @name rtc.processEnd.stop
     */
    self.processEnd = function (call) {
        var id, localStreamEntries;
        self.clearIceCandidateCollectionTimer(call);
        self.clearWebrtcLogCollectionInterval(call);
        if (call.peer) {
            logger.info("close peer connection " + call.id);

            call.peer.close();
            self.endLocalMedia(call.localMedia);

            self.setPeerCount(self.getPeerCount() - 1);
            if (self.getPeerCount() <= 0) {
                self.removeJslIdFromContainer();

                localStreamEntries = self.getLocalStreamMap().entries();
                for (id in localStreamEntries) {
                    if (localStreamEntries.hasOwnProperty(id)) {
                        self.endLocalMedia(self.getLocalStreamMap().get(id));
                    }
                }
            }
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onSessionConnecting = function() {
        logger.debug("onSessionConnecting");
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onSessionOpened = function() {
        logger.debug("onSessionOpened");
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onSignalingStateChange = function(call) {
        //TODO may need to move the state changes for webrtc here
        logger.debug("Signalling state changed: state= " + call.peer.signalingState);
    };

    // Native implementation lies on webRtcAdaptor.js
    self.useDefaultRenderer = function(streamUrl, local, isVideoTrackAvailable) {
        var videoContainer;

        if (self.getDefaultVideoContainer() && self.getDefaultVideoContainer().children.length === 0) {
            // Create divs for the remote and local
            self.getDefaultVideoContainer().innerHTML = "<div style='height:100%;width:100%'></div><div style='position:absolute;bottom:10px;right:10px;height:30%; width:30%;'></div>";
        }

        if (local) {
            videoContainer = self.getDefaultVideoContainer().lastElementChild;
        } else {
            videoContainer = self.getDefaultVideoContainer().firstElementChild;

            if (!isVideoTrackAvailable) {
                videoContainer.style.width = "0%";
            } else {
                videoContainer.style.width = "100%";
            }
        }
        return self.createStreamRenderer(streamUrl, videoContainer, {
            muted: local
        });
    };

    // Native implementation lies on webRtcAdaptor.js
    self.createStreamRenderer = function(streamUrl, container, options){
        var renderer;

        if(!streamUrl || !container){
            return;
        }

        container.innerHTML = "";
        renderer = document.createElement('video');
        renderer.src = streamUrl;

        renderer.style.width = "100%";
        renderer.style.height = "100%";

        renderer.autoplay = "true";

        if (options) {
            if (options.muted) {
                renderer.muted = "true";
            }
        }

        container.appendChild(renderer);
        return renderer;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.addCallIdInPluginContainer = function(call){
        logger.info("addCallIdInPluginContainer Call ID= " + call.id);
        if (self.getDefaultVideoContainer()) {
            self.getDefaultVideoContainer().setAttribute('jsl-id', call.id);
        } else if (self.getRemoteVideoContainer()) {
            self.getRemoteVideoContainer().setAttribute('jsl-id', call.id);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.isActiveCallInVideoContainer = function(container, call){
        logger.info("isActiveCallInVideoContainer Call ID= " + call.id);
        if(container.getAttribute('jsl-id') !== 'undefined'){
            logger.info("isActiveCallInVideoContainer Jsl Id= " + container.getAttribute('jsl-id'));
            if (call.id !== container.getAttribute('jsl-id')) {
                return false;
            }
        }
        return true;
    };

    // nativeOnRemoteStreamAdded
    self.onRemoteStreamAdded = function(call, event) {
        var streamUrl, fireEvent,
                remoteVideoTracks = [],
                isVideoTrackAvailable = false;

        if (self.getDefaultVideoContainer()) {
            if(!self.isActiveCallInVideoContainer(self.getDefaultVideoContainer(), call)){
                logger.debug("onRemoteStreamAdded: It is not active call. Call Id: " + call.id);
                return;
            }
        } else if (self.getRemoteVideoContainer()) {
            if(!self.isActiveCallInVideoContainer(self.getRemoteVideoContainer(), call)){
                logger.debug("onRemoteStreamAdded: It is not active call. Call Id: " + call.id);
                return;
            }
        }

        if (event.stream) {
            streamUrl = self.getRtcLibrary().getURLFromStream(event.stream);
            if (streamUrl) {

                remoteVideoTracks = event.stream.getVideoTracks();
                if (remoteVideoTracks) {
                    if (remoteVideoTracks.length > 0) {
                        isVideoTrackAvailable = true;
                    }
                }

                if (self.getDefaultVideoContainer()) {
                    fireEvent = self.useDefaultRenderer(streamUrl, false, isVideoTrackAvailable);
                } else if (self.getRemoteVideoContainer()) {
                    fireEvent = self.createStreamRenderer(streamUrl, self.getRemoteVideoContainer());
                } else {
                    fireEvent = true;
                }
            }

            logger.debug("onRemoteStreamAdded: " + streamUrl);
            if (fireEvent) {
                self.fireOnStreamAddedEvent(call, streamUrl);
            }
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.fireOnStreamAddedEvent = function(call, streamUrl) {
        if (call && call.call && call.call.onStreamAdded) {
            self.setOriginatorReceiveRemoteVideo(call);
            _utils.callFunctionIfExist(call.call.onStreamAdded, streamUrl);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onRemoteStreamRemoved = function() {
        logger.debug("onRemoteStreamRemoved");
    };

    // Native implementation lies on webRtcAdaptor.js
    self.clearIceCandidateCollectionTimer = function(call) {
        //This method wasn't implemented in webrtc.js
        clearTimeout(call.iceCandidateCollectionTimer);
        call.iceCandidateCollectionTimer = null;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onIceCandidate = function(call, event) {
        var sdp;
        if(event.candidate === null) {
            logger.debug("Null candidate received.");
            if(call.successCallback) {
                sdp = call.peer.localDescription.sdp;

                if (_sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
                    self.clearIceCandidateCollectionTimer(call);
                    logger.debug("Candidates received, invoking successCallback.");

                    call.successCallback(sdp);
                }
                else {
                    logger.trace("Sdp does not have candidates.");
                }
            }
        } else {
            logger.debug("ICE candidate received: sdpMLineIndex = " + event.candidate.sdpMLineIndex +
                    ", candidate = " + event.candidate.candidate + " for call : " + call.id);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.onIceComplete = function(call) {
        var  sdp;
        logger.debug("All ICE candidates received for call : " + call.id);
        self.clearIceCandidateCollectionTimer(call);

        if(call.successCallback) {
            sdp = call.peer.localDescription.sdp;

            logger.debug("onIceComplete sdp : " + sdp);

            call.successCallback(sdp);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.iceCandidateCollectionTimeoutHandler = function(call) {
        var sdp = call.peer.localDescription.sdp;
        self.clearIceCandidateCollectionTimer(call);
        if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
            call.relayCandidateCycle ++;
        }
        // set timeout if there is no ice candidate available or
        // when audio, video port assignment isn't complete
        if (!_sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
            logger.debug("Re-setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
            call.iceCandidateCollectionTimer = setTimeout(function() {
                self.iceCandidateCollectionTimeoutHandler(call);
            }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            return;
        }

        if (call.successCallback) {
            logger.debug("Ice candidate collection interrupted after given timeout, invoking successCallback.");
            call.successCallback(sdp);
        }
    };

    // Native implementation lies on webRtcAdaptor.js
    self.setupIceCandidateCollectionTimer = function(call) {
        if (fcsConfig.iceCandidateCollectionTimeoutInterval) {
            if (!call.iceCandidateCollectionTimer) {
                logger.debug("Setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
                if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
                    call.relayCandidateCycle = 1;
                }
                call.iceCandidateCollectionTimer = setTimeout(function() {
                    self.iceCandidateCollectionTimeoutHandler(call);
                }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            } else {
                logger.trace("Ice candidate collection timer exists.");
            }
        }
    };

    self.clearWebrtcLogCollectionInterval = function(call) {
        //This method wasn't implemented in webrtc.js
        clearInterval(call.webrtcLogCollectionInterval);
        call.webrtcLogCollectionInterval = null;
    };

    self.webrtcLogCollectionTimeoutHandler = function(call) {
        if (call && call.peer && call.peer.signalingState !== "closed") {
            call.peer.getStats(function(stats) {
                var results = stats.result(), i, j, res, names, statObj,
                        resultLength, namesLength;
                resultLength = results.length;
                for (i = 0; i < resultLength; ++i) {
                    res = results[i];
                    if (!res.local || res.local === res) {
                        statObj = {};
                        statObj.timestamp = res.timestamp;
                        if (res.id) {
                            statObj.id = res.id;
                        }
                        if (res.type) {
                            statObj.type = res.type;
                        }

                        if (res.names) {
                            names = res.names();
                            namesLength = names.length;
                            for (j = 0; j < namesLength; ++j) {
                                statObj[names[j]] = res.stat(names[j]);
                            }
                        } else {
                            if (res.stat('audioOutputLevel')) {
                                statObj.audioOutputLevel = res.stat('audioOutputLevel');
                            }
                        }
                        logger.trace("Peer connection stats, report[" + i + "]: ", statObj);
                    }
                }
            });
        }
        else {
            self.clearWebrtcLogCollectionInterval(call);
        }
    };

    self.setupWebrtcLogCollectionTimer = function(call) {
        if (fcsConfig.webrtcLogCollectionInterval) {
            self.clearWebrtcLogCollectionInterval(call);
            var logCollectionInterval = fcsConfig.webrtcLogCollectionInterval * 1000;
            logger.debug("Setting webrtc log collection interval: " + logCollectionInterval);
            call.webrtcLogCollectionInterval = setInterval(function() {
                self.webrtcLogCollectionTimeoutHandler(call);
            }, logCollectionInterval);
        }
    };

    self.oniceconnectionstatechange = function(call) {
        logger.debug("ICE connection state change : " + call.peer.iceConnectionState);
    };

    // Native implementation lies on webRtcAdaptor.js
    self.createPeer = function(call, onSuccess, onFailure) {
        try {
            var pc, constraints, i, servers = [], iceServerUrl = self.getIceServerUrl(), stunturn;
            if (iceServerUrl instanceof Array) {
                for(i = 0; i<iceServerUrl.length; i++) {
                    servers[i] = iceServerUrl[i];
                }
            } else if (iceServerUrl === null ||  iceServerUrl === ""){
                servers = [];
            } else {
                servers[0] = iceServerUrl;
            }
            stunturn = {iceServers:servers};

            constraints = {"optional": [{"DtlsSrtpKeyAgreement": self.isDtlsEnabled()}]};
            pc = self.getRtcLibrary().createRTCPeerConnection(stunturn, constraints);

            self.setPeerCount(self.getPeerCount() + 1);
            call.peer = pc;

            pc.onconnecting = function(event){
                self.onSessionConnecting(call, event);
            };
            pc.onopen = function(event){
                self.onSessionOpened(call, event);
            };
            pc.onsignalingstatechange = function(event){
                self.onSignalingStateChange(call, event);
            };
            pc.onaddstream = function(event){
                self.onRemoteStreamAdded(call, event);
            };
            pc.onremovestream = function(event){
                self.onRemoteStreamRemoved(call, event);
            };
            pc.onicecandidate = function (event) {
                if (event.currentTarget.iceGatheringState === "complete") {
                    logger.debug("ice gathering complete");
                    self.onIceComplete(call);
                }
                else {
                    self.setupIceCandidateCollectionTimer(call);
                    self.onIceCandidate(call, event);
                }
            };
            pc.onicecomplete = function(){
                self.onIceComplete(call);
            };
            pc.oniceconnectionstatechange = function (event) {
                self.oniceconnectionstatechange(call, event);
            };
            logger.info("create PeerConnection successfully.");

            self.setupWebrtcLogCollectionTimer(call);

            onSuccess(call);
        } catch(err) {
            logger.error("Failed to create PeerConnection, exception: " + err.message);
            onFailure();
        }
    };

    self.createNewPeerForCall = function(data) {
        var call = data.call,
            mustCreatePeer = data.mustCreatePeer,
            oldSessionId = _sdpParser.getSessionIdFromSdp(data.oldSdp),
            newSessionId = _sdpParser.getSessionIdFromSdp(data.newSdp),
            isNewPeerCreated = false,
            peerCount = self.getPeerCount(),
            telephoneEventPayloadChanged = _sdpParser.hasCodecPayloadChanged(data.oldSdp, data.newSdp);

        if (mustCreatePeer || telephoneEventPayloadChanged || oldSessionId !== newSessionId) {
            if (call.peer) {
                call.peer.close();
                self.setPeerCount(peerCount - 1);
                call.dtmfSender = null;
            }

            logger.trace("Creating new peer for call: " + call.id);
            self.createPeer(call, function createPeerSuccessCallback() {
                logger.trace("New peer has created for call: " + call.id);
                call.peer.addStream(call.localMedia.stream);
                isNewPeerCreated = true;
            }, function createPeerFailureCallback() {
                logger.error("New peer creation has failed!: " + call.id);
            });
        }
        return isNewPeerCreated;
    };

    /*
     * Gets remote video resolutions with the order below
     * remoteVideoHeight-remoteVideoWidth
     *
     * Native implementation lies on webRtcAdaptor.js
     */
    self.getRemoteVideoResolutions = function() {
        var remoteResolution = [],
            remoteVideoHeight,
            remoteVideoWidth;

        if (self.getRemoteVideoContainer()) {
            if (!self.getRemoteVideoContainer().firstChild) {
                return remoteResolution;
            }

            remoteVideoHeight = self.getRemoteVideoContainer().firstChild.videoHeight;
            remoteVideoWidth = self.getRemoteVideoContainer().firstChild.videoWidth;

        } else {
            if (!self.getDefaultVideoContainer().firstElementChild.firstChild) {
                return remoteResolution;
            }

            remoteVideoHeight = self.getDefaultVideoContainer().firstElementChild.firstChild.videoHeight;
            remoteVideoWidth = self.getDefaultVideoContainer().firstElementChild.firstChild.videoWidth;
        }

        logger.debug("remote video resolutions of plugin webrtc...");
        logger.debug("remoteVideoWidth  : " + remoteVideoWidth);
        logger.debug("remoteVideoHeight : " + remoteVideoHeight);

        remoteResolution.push(remoteVideoHeight);
        remoteResolution.push(remoteVideoWidth);

        self.getLocalVideoResolutions();

        return remoteResolution;
    };

    /*
     * Gets local video resolutions with the order below
     * localVideoHeight-localVideoWidth
     *
     * Native implementation lies on webRtcAdaptor.js
     */
    self.getLocalVideoResolutions = function() {
        var localResolution = [],
            localVideoHeight,
            localVideoWidth;

        if (self.getLocalVideoContainer()) {
            if (!self.getLocalVideoContainer().firstChild) {
                return localResolution;
            }

            localVideoHeight = self.getLocalVideoContainer().firstChild.videoHeight;
            localVideoWidth = self.getLocalVideoContainer().firstChild.videoWidth;

        } else {
            if (!self.getDefaultVideoContainer().lastElementChild.firstChild) {
                return localResolution;
            }

            localVideoHeight = self.getDefaultVideoContainer().lastElementChild.firstChild.videoHeight;
            localVideoWidth = self.getDefaultVideoContainer().lastElementChild.firstChild.videoWidth;
        }

        logger.debug("local video resolutions of plugin webrtc...");
        logger.debug("localVideoWidth  : " + localVideoWidth);
        logger.debug("localVideoHeight : " + localVideoHeight);

        localResolution.push(localVideoHeight);
        localResolution.push(localVideoWidth);

        return localResolution;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.refreshVideoRenderer = function() {
        return;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.sendIntraFrame = function() {
        return;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.sendBlackFrame = function() {
        return;
    };

    // Native implementation lies on webRtcAdaptor.js
    self.disposeStreamRenderer = function(container){
        if(container){
            container.innerHTML = "";
        }
    };

    self.sendInbandDTMF = function(call, tone, audioContext){
       var oscillator1, oscillator2, freq1, freq2, gainNode, mediaStreamDestination;

       logger.info("sending inband DTMF tone: " + tone);
            if(tone === "1"){ freq1 = "697"; freq2 = "1209";}
            if(tone === "2"){ freq1 = "697"; freq2 = "1336";}
            if(tone === "3"){ freq1 = "697"; freq2 = "1477";}
            if(tone === "4"){ freq1 = "770"; freq2 = "1209";}
            if(tone === "5"){ freq1 = "770"; freq2 = "1336";}
            if(tone === "6"){ freq1 = "770"; freq2 = "1477";}
            if(tone === "7"){ freq1 = "852"; freq2 = "1209";}
            if(tone === "8"){ freq1 = "852"; freq2 = "1336";}
            if(tone === "9"){ freq1 = "852"; freq2 = "1477";}
            if(tone === "*"){ freq1 = "941"; freq2 = "1209";}
            if(tone === "0"){ freq1 = "941"; freq2 = "1336";}
            if(tone === "#"){ freq1 = "941"; freq2 = "1477";}

            mediaStreamDestination = call.localMedia.mediaStreamDestination;

            oscillator1 = audioContext.createOscillator();
            oscillator1.type = 'sine';
            oscillator1.frequency.value = freq1;
            gainNode = audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode();
            oscillator1.connect(gainNode,0,0);
            gainNode.connect(mediaStreamDestination);
            gainNode.gain.value = 0.1;
            oscillator1.start();

            oscillator2 = audioContext.createOscillator();
            oscillator2.type = 'sine';
            oscillator2.frequency.value = freq2;
            gainNode = audioContext.createGain ? audioContext.createGain() : audioContext.createGainNode();
            oscillator2.connect(gainNode);
            gainNode.connect(mediaStreamDestination);
            gainNode.gain.value = 0.1;
            oscillator2.start();

            setTimeout(function(){
                oscillator1.disconnect();
                oscillator2.disconnect();
            }, 100);
    };

    /**
     * Send DTMF tone
     * Native implementation lies on webRtcAdaptor.js
     *
     * @ignore
     * @name rtc.sendDTMF
     * @function
     * @param {Object} call internalCall
     * @param {String} tone DTMF tone
     */
    self.sendDTMF = function (call, tone) {
        var audioContext, localAudioTrack;

        if(!_sdpParser.isSdpHasTelephoneEvent(call.peer.remoteDescription.sdp)){
            audioContext = call.localMedia.audioContext;
            self.sendInbandDTMF(call,tone,audioContext);
        } else {
            logger.info("sending outband DTMF tone: " + tone);
            if(!call.dtmfSender) {
                localAudioTrack = self.getLocalAudioTrack(call.peer);
                if(!localAudioTrack) {
                    return;
                }
                call.dtmfSender = call.peer.createDTMFSender(localAudioTrack);
                if(!call.dtmfSender) {
                    return;
                }
            }

            if (call.dtmfSender.canInsertDTMF === true) {
                call.dtmfSender.insertDTMF(tone, 400);
            }
            else {
                logger.error("Failed to execute 'insertDTMF' on 'RTCDTMFSender': The 'canInsertDTMF' attribute is false: this sender cannot send DTMF");
            }
        }
    };

    self.showSettingsWindow = function(){
        self.getRtcLibrary().showSettingsWindow();
    };

    self.set_logSeverityLevel = function(level){
        self.getRtcLibrary().set_logSeverityLevel(level);
    };

    self.enable_logCallback = function() {
        var pluginLogger = _logManager.getLogger("rtcPlugin");
        self.getRtcLibrary().enable_logCallback(pluginLogger);
    };

    self.disable_logCallback = function(){
        self.getRtcLibrary().disable_logCallback();
    };

    self.get_audioInDeviceCount = function(){
        return self.getRtcLibrary().get_audioInDeviceCount();
    };

    self.get_audioOutDeviceCount = function(){
        return self.getRtcLibrary().get_audioOutDeviceCount();
    };

    self.get_videoDeviceCount = function(){
        return self.getRtcLibrary().get_videoDeviceCount();
    };

    // set local client's video send status
    self.setOriginatorSendLocalVideo = function(call, status) {
        var videoSendEnabled = _sdpParser.isVideoSdpEnabled(call.peer.localDescription.sdp);
        call.canOrigSendVideo = status && videoSendEnabled;
    };

    // check if local client sends video
    self.canOriginatorSendLocalVideo = function(call) {
        return call.canOrigSendVideo;
    };

    // set local client's video receive status
    self.setOriginatorReceiveRemoteVideo = function(call) {
        call.canOrigReceiveVideo = _sdpParser.isVideoSdpEnabled(call.sdp);
    };

    // check if local client receives video
    self.canOriginatorReceiveRemoteVideo = function(call) {
        return call.canOrigReceiveVideo;
    };

    self.setTcpSetupAttiributesOnProcessAnswer = function(call, sdp) {
        call.remoteTcpSetupAttribute = _sdpParser.getTcpSetupAttribute(sdp);
        if (call.remoteTcpSetupAttribute === CONSTANTS.SDP.SETUP_ACTIVE) {
            call.localTcpSetupAttribute = CONSTANTS.SDP.SETUP_PASSIVE;
        }
        else if (call.remoteTcpSetupAttribute === CONSTANTS.SDP.SETUP_PASSIVE) {
            call.localTcpSetupAttribute = CONSTANTS.SDP.SETUP_ACTIVE;
        }
        else {
            logger.debug("Not handling remote TCP setup attribute: " + call.remoteTcpSetupAttribute);
        }
    };

    self.setTcpSetupAttiributesOnCreateAnswer = function(call, sdp) {
        call.localTcpSetupAttribute = _sdpParser.getTcpSetupAttribute(sdp);
        if (call.localTcpSetupAttribute === CONSTANTS.SDP.SETUP_ACTIVE) {
            call.remoteTcpSetupAttribute = CONSTANTS.SDP.SETUP_PASSIVE;
        }
        else if (call.localTcpSetupAttribute === CONSTANTS.SDP.SETUP_PASSIVE) {
            call.remoteTcpSetupAttribute = CONSTANTS.SDP.SETUP_ACTIVE;
        }
        else {
            logger.debug("Not handling remote TCP setup attribute: " + call.remoteTcpSetupAttribute);
        }
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     */
    self.privateGetUserMedia = function(params) {
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback() {
            var mediaInfo, privateMedia,
                constraints = {
                    audio: params.options.audioConstraints,
                    video: params.options.videoConstraints
                };

            self.getRtcLibrary().getUserMedia(constraints, function privateGetUserMediaSuccessCallback(stream) {
                privateMedia = {
                    stream: stream,
                    privateStream: params.options.privateStream
                };
                self.getPrivateStreamMap().add(stream.id, privateMedia);

                mediaInfo = {
                    id: stream.id,
                    stream: stream,
                    streamURL: self.getRtcLibrary().getURLFromStream(stream)
                };
                _utils.callFunctionIfExist(params.onSuccess, mediaInfo);
            }, function privateGetUserMediaFailureCallback() {
                _utils.callFunctionIfExist(params.onFailure, _mediaErrors.NOT_ALLOWED);
            });
        });
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     */
    self.getCameraList = function(onSuccess) {
        var index, cameraList = [], sourceList = [];
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            sourceList = mediaSourceInfo.sourceList;
            for (index = 0; index < sourceList.length; index++) {
                if (sourceList[index].kind === "video" || sourceList[index].kind === "videoinput") {
                    cameraList.push(sourceList[index]);
                }
            }
            _utils.callFunctionIfExist(onSuccess, cameraList);
        });
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     */
    self.getMicrophoneList = function(onSuccess) {
        var index, microphoneList = [], sourceList = [];
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            sourceList = mediaSourceInfo.sourceList;
            for (index = 0; index < sourceList.length; index++) {
                if (sourceList[index].kind === "audio" || sourceList[index].kind === "audioinput") {
                    microphoneList.push(sourceList[index]);
                }
            }
            _utils.callFunctionIfExist(onSuccess, microphoneList);
        });
    };

    /*
     * Native implementation lies on webRtcAdaptor.js
     */
    self.getSpeakerList = function(onSuccess) {
        var index, speakerList = [], sourceList = [];
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            sourceList = mediaSourceInfo.sourceList;
            for (index = 0; index < sourceList.length; index++) {
                if (sourceList[index].kind === "audiooutput") {
                    speakerList.push(sourceList[index]);
                }
            }
            _utils.callFunctionIfExist(onSuccess, speakerList);
        });
    };

    self.removeStreamById = function(id) {
        var localStream = self.getStreamById(id);
        if (localStream) {
            self.getRtcLibrary().stopStream(localStream.stream);
            self.removeStreamFromMap(id);
        }
    };

    logger.debug('WebRtcAdaptor initialized');
};

//@{fcs-jsl-prod}
var WebRtcAdaptor = function(_super, _decorator, _model) {
    return new WebRtcAdaptorImpl(_super, _decorator, _model, logManager, utils, sdpParser, fcs.call.MediaErrors);
};

if (__testonly__) { __testonly__.WebRtcAdaptor = WebRtcAdaptor; }
//@{fcs-jsl-prod}


var WebRtcPluginAdaptorImpl = function(_super, _decorator, _model, _logManager, _utils, _sdpParser, _mediaErrors) {
    var self = this,
            logger = _logManager.getLogger("WebRtcPluginAdaptorImpl");

    logger.debug('WebRtcPluginAdaptor initializing');

    _utils.compose(_super, self);
    _utils.compose(_model, self);

    self.setPluginEnabled(true);

    /*
     * Sdp workarounds performed before createOffer
     * TODO all workarounds should be detected and filled in here
     */
    self.performSdpWorkaroundsAfterCreateOffer = function(call, oSdp) {
        oSdp = _sdpParser.replaceCodecs(oSdp, call.codecsToReplace ? call.codecsToReplace : fcsConfig.codecsToReplace);
        return oSdp;
    };

    //This function is called internally when we make a new call or hold/unhold scenario
    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.addLocalStream = function(internalCall) {
        var streamUrl, fireEvent = false,
                isSendingLocalVideo = self.canOriginatorSendLocalVideo(internalCall);

        if (internalCall.localMedia.stream) {
            if (isSendingLocalVideo) {
                streamUrl = self.getRtcLibrary().getURLFromStream(internalCall.localMedia.stream);

                if (streamUrl) {
                    if (self.getDefaultVideoContainer()) {
                        fireEvent = self.useDefaultRenderer(streamUrl, true);
                    } else if (self.getLocalVideoContainer()) {
                        fireEvent = self.createStreamRenderer(streamUrl, self.getLocalVideoContainer(), {
                            muted: true});
                    } else {
                        internalCall.call.localStreamURL = streamUrl;
                        fireEvent = true;
                    }
                }
            } else {
                if (self.getDefaultVideoContainer()) {
                    if (self.getDefaultVideoContainer().lastElementChild) {
                        self.disposeStreamRenderer(self.getDefaultVideoContainer().lastElementChild);
                    }
                } else if (self.getLocalVideoContainer()) {
                    self.disposeStreamRenderer(self.getLocalVideoContainer());
                }
            }

            logger.debug("onLocalStreamAdded: " + streamUrl);
            if (fireEvent) {
                self.fireOnLocalStreamAddedEvent(internalCall, streamUrl);
            }
        }
    };

    self.performSdpWorkaroundsBeforeProcessingIncomingSdp = function(call) {
        call.sdp = _sdpParser.deleteBandwidthLineFromSdp(call.sdp);
        call.sdp = _sdpParser.removeRTXCodec(call.sdp);
        call.sdp = _sdpParser.removeG722Codec(call.sdp);
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    // initEnablerMedia
    self.initMedia = function(onSuccess, onFailure, options) {
        var mainContainer = document.body,
                rtcPlugin = {},
                verifyPlugin = true,
                mediaErrors = _mediaErrors,
                onloadParam,
                size = "1px",
                pluginid = "fcsPlugin",
                applicationType = "application/x-gcfwenabler",
                configuredPluginVersion = self.getPluginVersion(),
                currentPluginVersion,
                currentPluginVersionString;

        logger.debug("Configured plugin version: " + configuredPluginVersion.major + "." + configuredPluginVersion.minor + "." + configuredPluginVersion.current_revision);

        if(options) {
            if (options.pluginLogLevel) {
                self.setLogLevel(options.pluginLogLevel);
            }

            if (options.language) {
                self.setLanguage(options.language);
            }
        }
        //Callback for when the plugin is loaded
        self.onFCSPLoaded = function() {

            self.setRtcLibrary(_decorator(rtcPlugin));
            if(self.isH264Enabled()){
                self.getRtcLibrary().enableH264();
            }
            self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
                self.setMediaSources(mediaSourceInfo);
            });
            self.getRtcLibrary().setH264CodecStateChangeHandler(function onH264CodecStateChangeHandler(event) {
                self.setH264Enabled(event.state);
            });

            currentPluginVersion = self.getRtcLibrary().getCurrentPluginVersionObject();
            currentPluginVersionString = self.getRtcLibrary().getVersion();
            // prevent multiple init calls
            if (self.isInitialized() || !verifyPlugin) {
                return;
            }
            verifyPlugin = false;
            logger.debug("Plugin callback");

            fcs.setPluginVersion(currentPluginVersionString);
            logger.debug("Installed plugin version: " + currentPluginVersionString);

            if ((currentPluginVersionString.length < 1) ||
                    (currentPluginVersion.major !== configuredPluginVersion.major ||
                            currentPluginVersion.minor !== configuredPluginVersion.minor) ||
                    (currentPluginVersion.revision < configuredPluginVersion.min_revision) ||
                    (currentPluginVersion.revision === configuredPluginVersion.min_revision &&
                 currentPluginVersion.build < configuredPluginVersion.min_build) ) {

                logger.debug("Plugin version not supported");
                _utils.callFunctionIfExist(onFailure, mediaErrors.WRONG_VERSION);
            } else {
                self.setInitialized(true);
                if ((currentPluginVersion.revision < configuredPluginVersion.current_revision) ||
                        (currentPluginVersion.revision === configuredPluginVersion.current_revision &&
                     currentPluginVersion.build < configuredPluginVersion.current_build) ) {

                    logger.debug("New plugin version warning");
                    _utils.callFunctionIfExist(onFailure, mediaErrors.NEW_VERSION_WARNING);
                } else {
                    _utils.callFunctionIfExist(onSuccess,
                                               { "pluginVersion": rtcPlugin.version } );
                }

                self.getRtcLibrary().setLang(self.getLanguage());
            }

            self.getRtcLibrary().checkMediaSourceAvailability();
        };

        // only check if the function exists, not its type, because in IE it is "object" (host object)
        if (typeof mainContainer.appendChild === 'undefined') {
            logger.debug("Could not inject plugin in container");
            _utils.callFunctionIfExist(onFailure, mediaErrors.OPTIONS);
            return;
        }

        rtcPlugin = document.createElement('object');
        onloadParam = document.createElement('param');
        onloadParam.setAttribute("name", "onload");
        onloadParam.setAttribute("value", "onFCSPLoaded");
        rtcPlugin.appendChild(onloadParam);

        rtcPlugin.id = pluginid;
        rtcPlugin.width = rtcPlugin.height = size;

        // Order matters for the following:
        // For IE you need to append first so the dom is available when IE loads the plugin, which happens when the type is set.
        // For FF you need to set the type and then append or the plugin won't load.
        // Chrome seems happy either way.
        try {
            if (navigator.appName === 'Microsoft Internet Explorer') {
                mainContainer.appendChild(rtcPlugin);
                rtcPlugin.type = applicationType;
            } else {
                rtcPlugin.type = applicationType;
                mainContainer.appendChild(rtcPlugin);
            }
        } catch (e) {
            verifyPlugin = false;
            _utils.callFunctionIfExist(onFailure, mediaErrors.NOT_FOUND);
        }

        if (verifyPlugin) {
            if (typeof document.getElementById(pluginid).createPeerConnection !== 'undefined') {
                self.onFCSPLoaded();
            } else {
                //if the plugin is not initialized within 7 sec fail
                setTimeout(function() {
                    // for createPeerConnection, only check if it exists. It is "function" in FireFox and "object" in Chrome and IE
                    if (!self.isInitialized()) {
                        if (typeof document.getElementById(pluginid).createPeerConnection === 'undefined') {
                            _utils.callFunctionIfExist(onFailure, mediaErrors.NOT_FOUND);
                        } else {
                            self.onFCSPLoaded();
                        }
                    }
                }, 7000);
            }
        }
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.getUserMedia = function(params) {
        self.getRtcLibrary().checkMediaSourceAvailability(function getUserMediaCallback(mediaSourceInfo) {
            var mediaInfo, constraints = {audio: false, video: false}, localMedia;
            self.setMediaSources(mediaSourceInfo);

            if (mediaSourceInfo) {
                if(!mediaSourceInfo.audioSourceAvailable) {
                    logger.debug("Failed to get access to local media.");
                    _utils.callFunctionIfExist(params.onFailure, _mediaErrors.NOT_FOUND);
                    return;
                }
            }

            if (self.getMediaVideo() && self.getVideoSourceAvailable()) {
                constraints.video = params.options.videoConstraints;
            }
            if (self.getMediaAudio() && self.getAudioSourceAvailable()) {
                constraints.audio = params.options.audioConstraints;
            }
            logger.debug("Plugin version:" + self.getRtcLibrary().version);
            logger.debug("getUserMedia - constraints: ", constraints);
            self.getRtcLibrary().getUserMedia(constraints, function getUserMediaSuccessCallback(stream) {
                localMedia = {
                    audioContext: {close: function(){}},
                    mediaStreamDestination: {disconnect: function(){}},
                    stream: stream,
                    originalStream: stream
                };
                self.setLocalMedia(localMedia);
                self.getLocalStreamMap().add(localMedia.stream.label, localMedia);
                self.setInitialized(true);

                mediaInfo = {
                    audio: self.getMediaAudio(),
                    video: self.getMediaVideo(),
                    id: localMedia.stream.label,
                    originalStream: stream,
                    streamURL: self.getRtcLibrary().getURLFromStream(stream)
                };

                logger.debug("user has granted access to local media: ", localMedia);
                _utils.callFunctionIfExist(params.onSuccess, mediaInfo);
            }, function getUserMediaFailureCallback(error) {
                logger.debug("Failed to get access to local media. Error code was " + error.code);
                _utils.callFunctionIfExist(params.onFailure, _mediaErrors.NOT_ALLOWED);
            });
        });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * createEnablerOffer to be used when the enabler plugin is enabled.
     */
    self.createOffer = function(call, successCallback, failureCallback, sendInitialVideo) {
        logger.debug("createOffer: sendInitialVideo= " + sendInitialVideo + " state= " + call.peer.signalingState);
        var peer = call.peer, newSdp;

        call.peer.addStream(call.localMedia.stream);

        self.addCallIdInPluginContainer(call);

        peer.createOffer(function createOfferSuccessCallback(oSdp) {
            sendInitialVideo = sendInitialVideo && self.getVideoSourceAvailable();
            newSdp = _sdpParser.getSdpFromObject(oSdp);
            oSdp = null;
            if(sendInitialVideo){
                newSdp = _sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
            } else {
                newSdp = _sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            }

            newSdp = _sdpParser.deleteCryptoZeroFromSdp(newSdp);
            newSdp = _sdpParser.updateAudioCodec(newSdp);
            newSdp = _sdpParser.removeG722Codec(newSdp);

            newSdp = _sdpParser.deleteCryptoFromSdp(newSdp, self.isDtlsEnabled());
            newSdp = _sdpParser.setTcpSetupAttributeToActpass(newSdp, self.isDtlsEnabled());

            newSdp = self.performSdpWorkaroundsAfterCreateOffer(call, newSdp);

            self.muteOnHold(call,false);
            peer.setLocalDescription(
                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, newSdp),
                function createOfferSetLocalDescriptionSuccessCallback(){
                        //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                    },
                    function createOfferSetLocalDescriptionFailureCallback(error) {
                        logger.error("createOffer: setLocalDescription failed : " + error);
                        _utils.callFunctionIfExist(failureCallback, "createOffer: setLocalDescription failed");
                    }
            );

        },function createOfferFailureCallback(error){
            logger.error("createOffer: createOffer failed!! " + error);
            _utils.callFunctionIfExist(failureCallback);
        },
                {
                    'mandatory': {
                'OfferToReceiveAudio':self.getMediaAudio(),
                'OfferToReceiveVideo':self.getMediaVideo()
                    }
                });
    };

    /*
     * createEnablerAnswer to be used when the enabler plugin is enabled
     * Enabler implementation lies on webRtcPluginAdaptor.js
     */
    self.createAnswer = function (call, successCallback, failureCallback, isVideoEnabled) {
        logger.debug("createAnswer: isVideoEnabled= " + isVideoEnabled + " state= " + call.peer.signalingState);
        var peer = call.peer, newSdp;

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
        call.sdp = _sdpParser.deleteFingerprintOrCrypto(call.sdp, self.isDtlsEnabled());

        if (!_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = _sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        self.addCallIdInPluginContainer(call);

        peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp),
                function createAnswerSetRemoteDescriptionSuccessCallback() {
                    call.peer.addStream(call.localMedia.stream);
                    call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);

                    // set answer SDP to localDescriptor for the offer
                    peer.createAnswer(peer.remoteDescription,
                            function createAnswerSuccessCallback(oSdp) {
                                newSdp = _sdpParser.getSdpFromObject(oSdp);
                                oSdp = null;
                                isVideoEnabled = isVideoEnabled && self.getVideoSourceAvailable() && _sdpParser.isSdpHasVideo(call.sdp);

                                if (isVideoEnabled) {
                                    if (_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        newSdp = _sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                    } else {
                                        if (_sdpParser.getVideoSdpDirection(call.sdp) !== CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                            newSdp = _sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                        }
                                        else {
                                            newSdp = _sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                        }
                                    }
                                } else {
                                    if (_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                        newSdp = _sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                    } else {
                                        newSdp = _sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                    }
                                }

                                logger.debug("doAnswer(plugin) - isSdpEnabled audio : " + _sdpParser.isAudioSdpEnabled(newSdp));
                                logger.debug("doAnswer(plugin) - isSdpEnabled video : " + _sdpParser.isVideoSdpEnabled(newSdp));

                                if (_sdpParser.isSdpHasAudio(newSdp) || _sdpParser.isSdpHasVideo(newSdp)) {

                                    // createAnswer generates an sdp without ice params
                                    // copy ice params to the local sdp
                                    // scenario: incoming video call from pcc in brokeronly config
                                    newSdp = _sdpParser.checkAndRestoreICEParams(newSdp, call.sdp);

                                    self.muteOnHold(call, false);
                                    peer.setLocalDescription(
                                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, newSdp),
                                            function createAnswerSetLocalDescriptionSuccessCallback() {
                                                //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                                                call.videoOfferSent = _sdpParser.isSdpHasVideo(newSdp);
                                                self.setTcpSetupAttiributesOnCreateAnswer(call, newSdp);
                                            },
                                            function createAnswerSetLocalDescriptionFailureCallback(e) {
                                                logger.error("createAnswer: setLocalDescription failed : " + e);
                                                _utils.callFunctionIfExist(failureCallback, "createAnswer setLocalDescription failed");
                                            });
                                } else {
                                    logger.error("createrAnswer: createAnswer failed!!");
                                    _utils.callFunctionIfExist(failureCallback, "No codec negotiation");
                                }
                            }, function createAnswerFailureCallback(e) {
                        logger.error("createAnswer: failed!!" + e);
                        _utils.callFunctionIfExist(failureCallback, "Session cannot be created ");
                    },
                            {
                                'mandatory': {
                                    'OfferToReceiveAudio': self.getMediaAudio(),
                                    'OfferToReceiveVideo': self.getMediaVideo()
                                }
                            });
                }, function createAnswerSetRemoteDescriptionFailureCallback(e) {
            logger.error("createAnswer setRemoteDescription failed : " + e);
        });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * createEnablerUpdate to be used when the video start or stop
     */
    self.createUpdate = function(call, successCallback, failureCallback, isVideoStart) {
        logger.debug("createEnablerUpdate: isVideoStart= " + isVideoStart + " state= " + call.peer.signalingState);
        var localSdp, newSdp, peer = call.peer, data, newPeerNeeded;

        newPeerNeeded = (fcsConfig.iceLiteVideoWorkaround && _sdpParser.isIceLite(call.sdp) && isVideoStart) || _sdpParser.isRemoteEndFirefox(call.sdp);
        localSdp = _sdpParser.getSdpFromObject(call.peer.localDescription);
        localSdp = _sdpParser.deleteCryptoFromSdp(localSdp, self.isDtlsEnabled());

        logger.debug("create new offer to start the video");

        data = {
            call: call,
            mustCreatePeer: newPeerNeeded
        };
        if (self.createNewPeerForCall(data)) {
            logger.debug("remote end is firefox");
            peer = call.peer;
        }

        // quotation is needed for safari
        peer.removeStream(peer.localStreams["0"]);
        peer.addStream(call.localMedia.stream);

        self.setMediaVideo(true);
        peer.createOffer(
                function createUpdateCreateOfferSuccessCallback(obj) {
                    isVideoStart = isVideoStart && self.getVideoSourceAvailable();
                    if (isVideoStart) {
                        obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        if (_sdpParser.isVideoSdpDirectionInactive(call.stableRemoteSdp)) {
                            obj.sdp = _sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                        } else {
                            obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                        }
                    }

                    newSdp = obj.sdp;
                    obj = null;
                    newSdp = _sdpParser.updateVersion(localSdp, newSdp);
                    newSdp = _sdpParser.updateH264Level(newSdp);
                    newSdp = _sdpParser.deleteCryptoZeroFromSdp(newSdp);
                    newSdp = _sdpParser.updateAudioCodec(newSdp);
                    newSdp = _sdpParser.removeG722Codec(newSdp);
                    newSdp = _sdpParser.deleteCryptoFromSdp(newSdp, self.isDtlsEnabled());
                    newSdp = _sdpParser.setTcpSetupAttributeToActpass(newSdp, self.isDtlsEnabled());
                    newSdp = self.performSdpWorkaroundsAfterCreateOffer(call, newSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, newSdp),
                            function createUpdateCreateOfferSetLocalDescriptionSuccessCallback() {
                                logger.debug("createUpdate setLocalDescription success. iceConnectionState: " + peer.iceConnectionState + " iceGatheringState: " + peer.iceGatheringState);
                                if (peer.iceGatheringState === "complete") {
                                    if (call.successCallback) {
                                        logger.debug("createUpdate iceGatheringState completed " + peer.localDescription.sdp);
                                        call.successCallback(peer.localDescription.sdp);
                                    }
                                }
                            },
                            function crateUpdateCreateOfferSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createUpdate: createOffer setLocalDescription failed: " + e);
                                _utils.callFunctionIfExist(failureCallback);
                            });
                },
                function createUpdateCrateOfferFailureCallback(e) {
                    logger.debug("createUpdate: createOffer failed!!: " + e);
                    failureCallback();
                },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                }
        );
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * createEnablerHoldUpdate to be used when the enabler plugin is enabled
     */
    self.createHoldUpdate = function(call, hold, remote_hold_status, successCallback, failureCallback) {
        logger.debug("createHoldUpdate: local hold= " + hold + " remote hold= " + remote_hold_status + " state= " + call.peer.signalingState);
        var peer = call.peer,
                audioDirection,
                videoDirection,
                localDescObj,
                localSdp,
                data;

        localSdp = peer.localDescription.sdp;
        audioDirection = _sdpParser.getAudioSdpDirection(localSdp);
        videoDirection = _sdpParser.getVideoSdpDirection(localSdp);

        data = {
            call: call,
            mustCreatePeer: _sdpParser.isRemoteEndFirefox(call.sdp)
        };
        if (self.createNewPeerForCall(data)) {
            logger.debug("remote end is firefox");
            peer = call.peer;
        }

        peer.createOffer(function createHoldUpdateCreateOfferSuccessCallback(obj) {

            obj.sdp = _sdpParser.updateVersion(localSdp, obj.sdp);
            obj.sdp = _sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
            obj.sdp = self.performSdpWorkaroundsAfterCreateOffer(call, obj.sdp);

            //two sdp-s are created here
            //one is to be used by rest-request (externalSdp)
            //one is to set the audio-video direction of the local call (localSdp)
            //this is needed in order to adapt to the rfc (needs sendrecv to sendonly transition)
            //and to the plugin (needs inactive to mute audio and video connection)

            if (hold || remote_hold_status) {
                if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                    obj.sdp = _sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                } else {
                    if (!hold && remote_hold_status) {
                        obj.sdp = _sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        obj.sdp = _sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                    }
                }
                if (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                    obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                } else {
                    if (!hold && remote_hold_status) {
                        obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        obj.sdp = _sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                    }
                }
            } else {
                obj.sdp = _sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                if (self.canOriginatorSendLocalVideo(call)) {
                    obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                } else {
                    obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                }
            }

            localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

            peer.setLocalDescription(localDescObj,
                    function createHoldUpdateSetLocalDescriptionSuccessCallback() {
                        logger.debug("createHoldUpdate setLocalDescription success. iceConnectionState: " + peer.iceConnectionState + " iceGatheringState: " + peer.iceGatheringState);
                        if (peer.iceGatheringState === "complete") {
                            if (call.successCallback) {
                                logger.debug("createHoldUpdate iceGatheringState completed " + peer.localDescription.sdp);
                                call.successCallback(peer.localDescription.sdp);
                            }
                        }
                    },
                    function createHoldUpdateSetLocalDescriptionFailureCallback(error) {
                        logger.error("createHoldUpdate: setLocalDescription failed: " + error.message);
                        _utils.callFunctionIfExist(failureCallback);
                    });
        }, function createHoldUpdateCreateOfferFailureCallback(error) {
            logger.error("createHoldUpdate: createOffer failed: " + error.message);
            _utils.callFunctionIfExist(failureCallback);
        }, {
            'mandatory': {
                'OfferToReceiveAudio': self.getMediaAudio(),
                'OfferToReceiveVideo': self.getMediaVideo()
            }
        });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processEnabler30Update to be used when the enabler plugin is enabled. (based on processEnabler30Update)
     */
    self.processUpdate = function(call, successCallback, failureCallback, local_hold_status) {
        logger.debug("processUpdate: state= " + call.peer.signalingState);
        var peer = call.peer, localSdp, remoteAudioState, remoteVideoState, peerRemoteSdp,
                remoteDescObj, peerLocalSdp, remoteVideoDirection, callSdpWithNoSsrc, remoteDescriptionMainProcess, data;

        // Meetme workaround. This workaround is added into native function
        call.sdp = _sdpParser.addSdpMissingCryptoLine(call.sdp);
        call.sdp = _sdpParser.checkAndRestoreICEParams(call.sdp, call.peer.localDescription.sdp);

        remoteVideoDirection = _sdpParser.getVideoSdpDirection(call.sdp);

        self.setMediaVideo(_sdpParser.isSdpHasVideo(call.sdp));
        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) &&
                (call.currentState === "COMPLETED"))
        {
            switch (call.remoteVideoState) {
                case CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE:
                case CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY:
                    call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    break;
                case CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE:
                    call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
            }
        }

        call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.VIDEO);

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        //this part is a work-around for webrtc bug
        //set remote description with inactive media lines first.
        //then set remote description with original media lines.

        //keep original values of remote audio and video states
        remoteAudioState = _sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);

        if (_sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                _sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = _sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        call.sdp = _sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());
        // delete all ssrc lines from the sdp before setting first remote description
        // set second remote description with all ssrc lines included
        peerRemoteSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.prevRemoteSdp);
        peerLocalSdp = peer.localDescription.sdp;

        data = {
            call: call,
            oldSdp: call.prevRemoteSdp,
            newSdp: call.sdp
        };
        if (self.createNewPeerForCall(data)) {
            peer = call.peer;
        }

        remoteDescriptionMainProcess = function() {
            remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);

            peer.setRemoteDescription(remoteDescObj,
                    function processUpdateSetRemoteDescriptionSuccessCallback() {
                        logger.debug("processUpdate: setRemoteDescription success");
                        call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);

                        peer.createAnswer(peer.remoteDescription,
                                function processUpdateCreateAnswerSuccessCallback(obj) {
                                    logger.debug("processUpdate: isSdpEnabled audio= " + _sdpParser.isAudioSdpEnabled(obj.sdp));
                                    logger.debug("processUpdate: isSdpEnabled video= " + _sdpParser.isVideoSdpEnabled(obj.sdp));

                                    if (_sdpParser.isAudioSdpEnabled(obj.sdp) || _sdpParser.isVideoSdpEnabled(obj.sdp)) {
                                        if (_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                            if (self.canOriginatorSendLocalVideo(call)) {
                                                obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                            } else {
                                                obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                            }
                                        } else {
                                            if (self.canOriginatorSendLocalVideo(call) && !_sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                                obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                            } else {
                                                obj.sdp = _sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                            }
                                        }

                                        //TODO: Since there is no setter method for obj.sdp from the plugin side,
                                        //      we create a temporary local variable and pass obj.sdp's value into it.
                                        //      Rewrite the below part of code when the setter method is applied to the plugin side
                                        localSdp = _sdpParser.getSdpFromObject(obj);
                                        obj = null;
                                        localSdp = _sdpParser.updateVersion(peerLocalSdp, localSdp);

                                        localSdp = _sdpParser.checkIceParamsLengths(localSdp, call.sdp);
                                        localSdp = _sdpParser.setTcpSetupAttributeTo(localSdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                        peer.setLocalDescription(
                                                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, localSdp),
                                                function processUpdateSetLocalDescriptionSuccessCallback() {
                                                    logger.debug("processUpdate setLocalDescription success. iceConnectionState: " + peer.iceConnectionState + " iceGatheringState: " + peer.iceGatheringState);
                                                    if (peer.iceGatheringState === "complete") {
                                                        if (call.successCallback) {
                                                            logger.debug("processUpdate iceGatheringState completed " + peer.localDescription.sdp);
                                                            call.successCallback(peer.localDescription.sdp);
                                                        }
                                                    }
                                                },
                                                function processUpdateSetLocalDescriptionFailureCallback(e) {
                                                    logger.debug("processUpdate: setLocalDescription failed: " + e);
                                                    _utils.callFunctionIfExist(failureCallback, "processUpdate: setlocalDescription failed!!");
                                                });
                                    } else {
                                        logger.debug("processUpdate: createAnswer failed!!");
                                        _utils.callFunctionIfExist(failureCallback, "No codec negotiation");
                                    }
                                },
                                function processUpdateCreateAnswerFailureCallback(e) {
                                    logger.debug("processUpdate: createAnswer failed!! " + e);
                                    _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                },
                                {
                                    'mandatory': {
                                        'OfferToReceiveAudio': self.getMediaAudio(),
                                        'OfferToReceiveVideo': self.getMediaVideo()
                                    }
                                }
                        );
                    },
                    function processUpdateSetRemoteDescriptionSuccessCallback(e) {
                        logger.debug("processUpdate: setRemoteDescription failed: " + e);
                        _utils.callFunctionIfExist(failureCallback, "processUpdate: setRemoteDescription failed!!");
                    });
        };

        if (_sdpParser.isSdpHasVideo(call.prevRemoteSdp) || _sdpParser.isIceLite(call.sdp) || local_hold_status) {
            //set media lines with sendonly state for work-around
            call.sdp = _sdpParser.updateAudioSdpDirectionToInactive(call.sdp);
            call.sdp = _sdpParser.updateVideoSdpDirectionToInactive(call.sdp);

            callSdpWithNoSsrc = _sdpParser.deleteSsrcFromSdp(call.sdp);

            remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, callSdpWithNoSsrc);
            peer.setRemoteDescription(remoteDescObj,
                    function processUpdateWorkaroundSetRemoteDescriptionSuccessCallback() {
                        logger.debug("processUpdate: workaround setRemoteDescription success");

                        //restore original values
                        call.sdp = _sdpParser.updateAudioSdpDirection(call.sdp, remoteAudioState);
                        call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, remoteVideoState);

                        remoteDescriptionMainProcess();
                    },
                    function processUpdateWorkaroundSetRemoteDescriptionFailureCallback(e) {
                        logger.debug("processUpdate: workaround setRemoteDescription failed!!" + e);
                        _utils.callFunctionIfExist(failureCallback, "processUpdate: workaround setRemoteDescription failed!!");
                    }
            );
        }
        else {
            remoteDescriptionMainProcess();
        }
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processEnabler30Answer to be used when the enabler plugin is enabled
     */
    self.processAnswer = function(call, onSuccess, onFail) {
        logger.debug("processAnswer: state= " + call.peer.signalingState);

        var onSuccessAfterWorkarounds, setRemoteDescription,
                remoteVideoDirection, localVideoDirection, peer = call.peer,
                origSdp;

        onSuccessAfterWorkarounds = function() {
            call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);
            call.videoOfferSent = _sdpParser.isSdpHasVideo(call.sdp);
            _utils.callFunctionIfExist(onSuccess);
        };

        setRemoteDescription = function(call, onSuccess, onFailure) {
            call.peer.setRemoteDescription(
                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp),
                    function() {
                        logger.debug("processAnswer: setRemoteDescription success");
                        onSuccess();
                    },
                    function(e) {
                        logger.error("processAnswer: setRemoteDescription failed: " + e);
                        onFailure();
                    });
        };

        self.setTcpSetupAttiributesOnProcessAnswer(call, call.sdp);

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, _sdpParser.getSdpFromObject(call.peer.localDescription), self.isH264Enabled());
        call.sdp = _sdpParser.performVideoPortZeroWorkaround(call.sdp);

        if (peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.HAVE_REMOTE_PRANSWER) {

            if (_sdpParser.isIceLite(call.prevRemoteSdp) !== _sdpParser.isIceLite(call.sdp)) {
                logger.debug("ice - ice-lite change.");
                onFail(CONSTANTS.WEBRTC.ERROR.ICE_ICELITE);
                return;
            }

            origSdp = call.sdp;
            call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            call.sdp = _sdpParser.updateAudioSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
            logger.debug("call processPrAnswer again to trigger on remote stream added with updated sdp.");
            self.processPreAnswer(call,
                    function () {
                        call.sdp = origSdp;
                        logger.debug("processPrAnswer sucess callback. Restore original sdp.");
                        setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);
                    },
                    function () {
                        call.sdp = origSdp;
                        logger.debug("processPrAnswer failure callback. Restore original sdp.");
                        setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);
                    }
            );
            return;
        }


        remoteVideoDirection = _sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = _sdpParser.getVideoSdpDirection(_sdpParser.getSdpFromObject(call.peer.localDescription));

        // this is needed for buggy webrtc api. when term answers with video to audio only call
        // this scenario does not work without converting to sendrecv
        logger.debug("processAnswer: ice-lite: do remote video escalation");
        call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);

        if ((localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY || localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)) {

            // Audio <--> Audio : apply workaround step 1

            // delete ssrc only from video, keep audio ssrc to hear audio
            call.sdp = _sdpParser.deleteInactiveVideoSsrc(call.sdp);

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);

        } else if (localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY &&
                (remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY || remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE)) {

            // Audio  <--> Audio-Video

            setRemoteDescription(call, function() {
                self.performVideoStartWorkaround(call, onSuccessAfterWorkarounds, onFail);
            }, onFail);

        } else {

            // Audio-Video <--> Audio-Video
            // there is remote video, no need for orig side workaround

            setRemoteDescription(call, onSuccessAfterWorkarounds, onFail);
        }
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * performEnablerVideoStartWorkaround - term side cannot see orig's video
     */
    self.performVideoStartWorkaround = function(call, onSuccess, onFail) {
        var peer = call.peer, remoteAudioState, remoteVideoState,
                callSdpWithNoSsrc, peerLocalSdp;

        logger.debug("Workaround to play video");

        peerLocalSdp = call.peer.localDescription.sdp;

        call.sdp = _sdpParser.addSdpMissingCryptoLine(call.sdp);

        remoteAudioState = _sdpParser.getSdpDirectionLogging(call.sdp, CONSTANTS.STRING.AUDIO, false);
        remoteVideoState = _sdpParser.getSdpDirectionLogging(call.sdp, CONSTANTS.STRING.VIDEO, false);

        call.sdp = _sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.AUDIO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        call.sdp = _sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);

        call.sdp = _sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());

        callSdpWithNoSsrc = _sdpParser.deleteSsrcFromSdp(call.sdp);

        peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, callSdpWithNoSsrc), function() {
            logger.debug("performVideoStartWorkaround: first setRemoteDescription success");

            // restore original values
            call.sdp = _sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.AUDIO, remoteAudioState);
            call.sdp = _sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, remoteVideoState);

            peer.setRemoteDescription(
                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp), function() {
                logger.debug("performVideoStartWorkaround: second setRemoteDescription success");
                peer.createAnswer(peer.remoteDescription, function(obj) {
                    var localSdp = _sdpParser.getSdpFromObject(obj);

                    if (_sdpParser.getSdpDirectionLogging(call.sdp, CONSTANTS.STRING.AUDIO, false) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                        localSdp = _sdpParser.updateSdpDirection(localSdp, CONSTANTS.STRING.AUDIO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                    }

                    if (call.remoteVideoState === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                        localSdp = _sdpParser.updateSdpDirection(localSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                    } else if (self.canOriginatorSendLocalVideo(call)) {
                        localSdp = _sdpParser.updateSdpDirection(localSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        localSdp = _sdpParser.updateSdpDirection(localSdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    }

                    localSdp = _sdpParser.checkAndRestoreICEParams(localSdp, call.sdp);

                    localSdp = _sdpParser.setTcpSetupAttributeTo(localSdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                    localSdp = _sdpParser.updateVersion(peerLocalSdp, localSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, localSdp), function() {
                        logger.debug("performVideoStartWorkaround: setlocalDescription success");
                        _utils.callFunctionIfExist(onSuccess);
                    }, function(e) {
                        logger.debug("performVideoStartWorkaround: setlocalDescription failed!!" + e);
                        _utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: setlocalDescription failed!!");
                    });
                }, function(e) {
                    logger.debug("performVideoStartWorkaround: createAnswer failed!! " + e);
                    _utils.callFunctionIfExist(onFail, "Session cannot be created");
                }, {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
            }, function(e) {
                logger.debug("performVideoStartWorkaround: second setRemoteDescription failed!!" + e);
                _utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: second setRemoteDescription failed!!");
            });
        }, function(e) {
            logger.debug("performVideoStartWorkaround: first setRemoteDescription failed!!" + e);
            _utils.callFunctionIfExist(onFail, "performVideoStartWorkaround: first setRemoteDescription failed!!");
        });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processPreAnswer to be used when the enabler plugin is enabled
     */
    self.processPreAnswer = function(call, onSuccess, onFailure) {
        var ans;

        logger.debug("processPreAnswer: state= " + call.peer.signalingState);

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, _sdpParser.getSdpFromObject(call.peer.localDescription), self.isH264Enabled());

        ans = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.PRANSWER, call.sdp);

        call.peer.setRemoteDescription(ans,
                function processPreAnswerSetRemoteDescriptionSuccessCallback() {
                    self.setOriginatorReceiveRemoteVideo(call);
                    call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);
                    onSuccess();
                    logger.debug("processPreAnswer: setRemoteDescription success");
                },
                function processPreAnswerSetRemoteDescriptionFailureCallback(e) {
                    logger.error("processPreAnswer: setRemoteDescription failed: " + e);
                    onFailure(e);
                });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processEnablerRespond
     */
    self.processRespond = function(call, onSuccess, onFailure, isJoin) {
        var remoteVideoDirection;

        logger.debug("processRespond: state= " + call.peer.signalingState);

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, _sdpParser.getSdpFromObject(call.peer.localDescription), self.isH264Enabled());

        remoteVideoDirection = _sdpParser.getVideoSdpDirection(call.sdp);

        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) && (call.currentState === "COMPLETED"))
        {
            switch (call.remoteVideoState) {
                case CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE:
                case CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY:
                    call.sdp = _sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    break;
            }
        }

        call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);
        call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.VIDEO);
        if (isJoin) {
            call.sdp = _sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            _utils.callFunctionIfExist(onSuccess);
            return;
        }

        if (_sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                _sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = _sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        call.peer.setRemoteDescription(
                self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp),
                function() {
                    logger.debug("processRespond: setRemoteDescription success");
                    var onSuccessAfterWorkaround = function() {
                        call.remoteVideoState = _sdpParser.getVideoSdpDirection(call.sdp);
                        call.videoOfferSent = true;
                        _utils.callFunctionIfExist(onSuccess);
                    };
                    // _utils.callFunctionIfExist(onSuccessAfterWorkaround);
                    self.performVideoStartWorkaround(call, onSuccessAfterWorkaround, onFailure);
                },
                function(e) {
                    logger.debug("processRespond: setRemoteDescription failed: " + e);
                    _utils.callFunctionIfExist(onFailure);
                });
    };

    /*
     * createPluginReOffer
     */
    self.createReOffer = function(call, successCallback, failureCallback, usePreviousMediaDirection) {
        var peer = call.peer, newSdp,
                localAudioDirection, localVideoDirection, newVideoDirection,
                prevLocalSdp = call.peer.localDescription.sdp, data;

         logger.debug("createReOffer:" + call.id);

        data = {
            call: call,
            mustCreatePeer: true
        };
        if (self.createNewPeerForCall(data)) {
            peer = call.peer;
        }

        peer.createOffer(
                function processSlowStartCreateOfferSuccessCallback(oSdp) {
                    newSdp = _sdpParser.getSdpFromObject(oSdp);
                    oSdp = null;

                    if (usePreviousMediaDirection) {
                        localAudioDirection = _sdpParser.getAudioSdpDirection(prevLocalSdp);
                        newSdp = _sdpParser.updateAudioSdpDirection(newSdp, localAudioDirection);
                        localVideoDirection = _sdpParser.getVideoSdpDirection(prevLocalSdp);
                        newSdp = _sdpParser.updateVideoSdpDirection(newSdp, localVideoDirection);
                    }else{
                        localVideoDirection = _sdpParser.getVideoSdpDirection(prevLocalSdp);
                        newVideoDirection = _sdpParser.getVideoSdpDirection(newSdp);
                        if(localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE &&
                            newVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE){
                            newSdp = _sdpParser.updateVideoSdpDirection(newSdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                        }
                    }

                    newSdp = _sdpParser.deleteCryptoZeroFromSdp(newSdp);
                    newSdp = _sdpParser.updateAudioCodec(newSdp);
                    newSdp = _sdpParser.removeG722Codec(newSdp);
                    newSdp = _sdpParser.deleteCryptoFromSdp(newSdp, self.isDtlsEnabled());
                    newSdp = _sdpParser.setTcpSetupAttributeToActpass(newSdp, self.isDtlsEnabled());
                    newSdp = self.performSdpWorkaroundsAfterCreateOffer(call, newSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, newSdp),
                            function processSlowStartSetLocalDescriptionSuccessCallback() {
                                logger.debug("createReOffer: setLocalDescription success" + call.id);
                            },
                            function processSlowStartSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createReOffer: setLocalDescription failed!!" + e + call.id);
                                _utils.callFunctionIfExist(failureCallback);
                            });
                },
                function processSlowStartCreateOfferFailureCallback(e) {
                    logger.error("createReOffer: createOffer failed!! " + e);
                    _utils.callFunctionIfExist(failureCallback);
                },
                {
                    'mandatory': {
                        'OfferToReceiveAudio': self.getMediaAudio(),
                        'OfferToReceiveVideo': self.getMediaVideo()
                    }
                });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processEnablerHold to be used when the enabler plugin 30 is enabled.
     */
    self.processHold = function(call, hold, local_hold_status, successCallback, failureCallback) {
        logger.debug("processHold: local hold= " + local_hold_status + " remote hold= " + hold + " state= " + call.peer.signalingState);
        var peer = call.peer, updateSdp, audioDirection, videoDirection, peerRemoteSdp, inactiveRemoteSdp,
                peerLocalSdp, localSdp, data;

        if (!local_hold_status && !hold) {
            self.muteOnHold(call, false);
        }

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());
        call.sdp = _sdpParser.performVideoPortZeroWorkaround(call.sdp);
        call.sdp = _sdpParser.checkAndRestoreICEParams(call.sdp, _sdpParser.getSdpFromObject(call.peer.localDescription));

        audioDirection = _sdpParser.getAudioSdpDirection(call.sdp);
        videoDirection = _sdpParser.getVideoSdpDirection(call.sdp);

        peerRemoteSdp = call.prevRemoteSdp;
        peerLocalSdp = peer.localDescription.sdp;
        updateSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);
        inactiveRemoteSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, updateSdp.sdp);

        // chrome38 fix
        inactiveRemoteSdp.sdp = _sdpParser.updateAudioSdpDirectionToInactive(inactiveRemoteSdp.sdp);
        inactiveRemoteSdp.sdp = _sdpParser.updateVideoSdpDirectionToInactive(inactiveRemoteSdp.sdp);

        data = {
            call: call,
            oldSdp: call.prevRemoteSdp,
            newSdp: call.sdp
        };
        if (self.createNewPeerForCall(data)) {
            peer = call.peer;
        }
        inactiveRemoteSdp.sdp = _sdpParser.deleteSsrcFromSdp(inactiveRemoteSdp.sdp);

        // 1st setRemoteDescription to make webrtc remove the audio and/or video streams
        // 2nd setRemote will add the audio stream back so that services like MOH can work
        // This code will also run in UnHold scenario, and it will remove & add video stream
        peer.setRemoteDescription(
                inactiveRemoteSdp,
                function processHoldSetFirstRemoteDescriptionSuccessCallback() {
                    updateSdp.sdp = _sdpParser.updateAudioSdpDirection(updateSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);

                    if (_sdpParser.getVideoSdpDirection(updateSdp.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                            _sdpParser.getVideoSdpDirection(updateSdp.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
                    {
                        updateSdp.sdp = _sdpParser.deleteInactiveVideoSsrc(updateSdp.sdp);
                    }
                    peer.setRemoteDescription(
                            updateSdp,
                            function processHoldSetSecondRemoteDescriptionSuccessCallback() {
                                if (!hold && !local_hold_status && (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE)) {
                                    call.remoteVideoState = CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY;
                                } else {
                                    call.remoteVideoState = _sdpParser.getVideoSdpDirection(updateSdp.sdp);
                                }
                                peer.createAnswer(
                                        peer.remoteDescription,
                                        function processHoldCreateAnswerSuccessCallback(obj) {
                                            localSdp = _sdpParser.getSdpFromObject(obj);
                                            logger.debug("processHold: isSdpEnabled audio= " + _sdpParser.isAudioSdpEnabled(obj.sdp));
                                            logger.debug("processHold: isSdpEnabled video= " + _sdpParser.isVideoSdpEnabled(obj.sdp));
                                            obj = null;

                                            if (hold) {
                                                logger.debug("processHold: Remote HOLD");
                                                localSdp = _sdpParser.respondToRemoteSdpDirections(localSdp, call.sdp);
                                            } else if (!local_hold_status) {
                                                logger.debug("processHold: Remote UNHOLD: direction left as it is");

                                                if (_sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                                    if (self.canOriginatorSendLocalVideo(call)) {
                                                        localSdp = _sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                                    } else {
                                                        localSdp = _sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                                    }
                                                } else {
                                                    if (self.canOriginatorSendLocalVideo(call) && !_sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                                        localSdp = _sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                    } else {
                                                        localSdp = _sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                                    }
                                                }
                                                //change audio's direction to sendrecv for ssl attendees in a 3wc
                                                localSdp = _sdpParser.changeDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
                                            } else if (local_hold_status && !hold) {
                                                logger.debug("processHold: Remote UNHOLD on local hold");

                                                if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                                    localSdp = _sdpParser.updateAudioSdpDirectionToInactive(localSdp);
                                                } else {
                                                    localSdp = _sdpParser.updateAudioSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                }

                                                if (self.canOriginatorSendLocalVideo(call)) {
                                                    localSdp = _sdpParser.updateVideoSdpDirection(localSdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                                } else {
                                                    localSdp = _sdpParser.updateVideoSdpDirectionToInactive(localSdp);
                                                }
                                            }

                                            localSdp = _sdpParser.updateVersion(peerLocalSdp, localSdp);
                                            localSdp = _sdpParser.checkIceParamsLengths(localSdp, updateSdp.sdp);

                                            localSdp = _sdpParser.setTcpSetupAttributeTo(localSdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                            localSdp = _sdpParser.updateH264Level(localSdp);

                                            peer.setLocalDescription(
                                                    self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, localSdp),
                                                    function processHoldSetLocalDescriptionSuccessCallback() {
                                                        logger.debug("processHold: setLocalDescription success!! " + "iceConnectionState: " + peer.iceConnectionState + " iceGatheringState: " + peer.iceGatheringState);
                                                        if (peer.iceGatheringState === "complete") {
                                                            if (call.successCallback) {
                                                                logger.debug("processHold iceGatheringState completed " + peer.localDescription.sdp);
                                                                call.successCallback(peer.localDescription.sdp);
                                                            }
                                                        }
                                                    },
                                                    function processHoldSetLocalDescriptionFailureCallback(e) {
                                                        logger.error("processHold: setLocalDescription failed!! " + e);
                                                        _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                                    });
                                        },
                                        function processHoldCreateAnswerFailureCallback(e) {
                                            logger.error("processHold: createAnswer failed!!: " + e);
                                            _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                        },
                                        {
                                            'mandatory': {
                                                'OfferToReceiveAudio': self.getMediaAudio(),
                                                'OfferToReceiveVideo': self.getMediaVideo()
                                            }
                                        });
                            },
                            function processHoldSetSecondRemoteDescriptionFailureCallback(e) {
                                logger.error("processHold: second setRemoteDescription failed!! " + e);
                                _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                            });
                },
                function processHoldSetFirstRemoteDescriptionFailureCallback(e) {
                    logger.debug("processHold: first setRemoteDescription failed!! " + e);
                    _utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                });
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * processHoldRespond to be used when the enabler plugin is enabled
     */
    self.processHoldRespond = function(call, onSuccess, onFailure, isJoin) {
        var remoteAudioDirection,
            remoteVideoDirection,
            localHoldFlag = false,
            remoteHoldFlag = false;

        logger.debug("processHoldRespond: state= " + call.peer.signalingState + " call.currentState= " + call.currentState);

        call.sdp = _sdpParser.checkSupportedVideoCodecs(call.sdp, _sdpParser.getSdpFromObject(call.peer.localDescription), self.isH264Enabled());

        _sdpParser.init(call.sdp);
        remoteHoldFlag = _sdpParser.isRemoteHold();

        localHoldFlag = (call.currentState === "LOCAL_HOLD");

        if(!localHoldFlag){
            self.addCallIdInPluginContainer(call);
        }

        remoteAudioDirection = _sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoDirection = _sdpParser.getVideoSdpDirection(call.sdp);

        logger.debug("processHoldRespond: localHold= " + localHoldFlag + " remoteHold= " + remoteHoldFlag);

        /* Required for MOH - start */
        if (remoteHoldFlag === false) {
            if ((remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) && (call.currentState === "REMOTE_HOLD")) {
                call.previousState = call.currentState;
                call.currentState = "COMPLETED";
            }
        } else {
            if (call.currentState === "COMPLETED") {
                call.previousState = call.currentState;
                call.currentState = "REMOTE_HOLD";
            }
        }

        if (localHoldFlag || remoteHoldFlag) {
            logger.debug("processHoldRespond: " + call.currentState + " : video -> inactive");
            call.sdp = _sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        }

        if ((remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) && (call.currentState === "COMPLETED")) {
            logger.debug("processHoldRespond: video inactive -> recvonly");
            call.sdp = _sdpParser.updateSdpDirection(call.sdp, CONSTANTS.STRING.VIDEO, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }
        /* Required for MOH - end */

        if (localHoldFlag && remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
            logger.debug("processHoldRespond: Mute Remote Audio");
            call.sdp = _sdpParser.updateAudioSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }

        if (localHoldFlag && remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
            logger.debug("processHoldRespond: Mute Remote Video");
            call.sdp = _sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }

        self.processRespond(call, onSuccess, onFailure, isJoin);
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.createPeer = function(call, onsuccess, onfailure) {
        try {
            var pc, constraints, i, servers = [], iceServerUrl = self.getIceServerUrl(), stunturn;
            if (iceServerUrl instanceof Array) {
                for (i = 0; i < iceServerUrl.length; i++) {
                    servers[i] = iceServerUrl[i];
                }
            } else if (iceServerUrl === null || iceServerUrl === "") {
                servers = [];
            } else {
                servers[0] = iceServerUrl;
            }
            stunturn = {iceServers: servers};

            constraints = {"optional": {"DtlsSrtpKeyAgreement": self.isDtlsEnabled()}};
            pc = self.getRtcLibrary().createRTCPeerConnection(stunturn, constraints);

            self.setPeerCount(self.getPeerCount() + 1);
            call.peer = pc;

            pc.onconnecting = function(event) {
                self.onSessionConnecting(call, event);
            };
            pc.onopen = function(event) {
                self.onSessionOpened(call, event);
            };
            pc.onsignalingstatechange = function(event) {
                self.onSignalingStateChange(call, event);
            };
            pc.onaddstream = function(event) {
                self.onRemoteStreamAdded(call, event);
            };
            pc.onremovestream = function(event) {
                self.onRemoteStreamRemoved(call, event);
            };
            pc.onicecandidate = function(event) {
                self.setupIceCandidateCollectionTimer(call);
                self.onIceCandidate(call, event);
            };
            pc.onicecomplete = function() {
                self.onIceComplete(call);
            };
            pc.oniceconnectionstatechange = function (event) {
                self.oniceconnectionstatechange(call, event);
            };

            logger.info("create PeerConnection successfully.");

            self.setupWebrtcLogCollectionTimer(call);

            _utils.callFunctionIfExist(onsuccess);
        } catch (err) {
            logger.error("Failed to create PeerConnection, exception: " + err.message);
            _utils.callFunctionIfExist(onfailure);
        }
    };

    self.createNewPeerForCall = function(data) {
        var call = data.call,
            mustCreatePeer = data.mustCreatePeer,
            oldSessionId = _sdpParser.getSessionIdFromSdp(data.oldSdp),
            newSessionId = _sdpParser.getSessionIdFromSdp(data.newSdp),
            isNewPeerCreated = false,
            peerCount = self.getPeerCount(),
            telephoneEventPayloadChanged = _sdpParser.hasCodecPayloadChanged(data.oldSdp, data.newSdp);

        if (mustCreatePeer || telephoneEventPayloadChanged || oldSessionId !== newSessionId) {
            if (call.peer) {
                call.peer.close();
                self.setPeerCount(peerCount - 1);
                call.dtmfSender = null;
            }

            logger.trace("Creating new peer for call: " + call.id);
            self.createPeer(call, function createPeerSuccessCallback() {
                logger.trace("New peer has created for call: " + call.id);
                call.peer.addStream(call.localMedia.stream);
                isNewPeerCreated = true;
            }, function createPeerFailureCallback() {
                logger.error("New peer creation has failed!: " + call.id);
            });
        }
        return isNewPeerCreated;
    };

    // pluginOnRemoteStreamAdded
    self.onRemoteStreamAdded = function(call, event) {
        var streamUrl, fireEvent,
                remoteVideoTracks = [],
                isVideoTrackAvailable = false;

        if (self.getDefaultVideoContainer()) {
            if(!self.isActiveCallInVideoContainer(self.getDefaultVideoContainer(), call)){
                logger.debug("onRemoteStreamAdded: It is not active call. Call Id: " + call.id);
                return;
            }
        } else if (self.getRemoteVideoContainer()) {
            if(!self.isActiveCallInVideoContainer(self.getRemoteVideoContainer(), call)){
                logger.debug("onRemoteStreamAdded: It is not active call. Call Id: " + call.id);
                return;
            }
        }

        if (event.stream) {
            streamUrl = self.getRtcLibrary().getURLFromStream(event.stream);

            if (streamUrl) {

                remoteVideoTracks = event.stream.getVideoTracks();
                if (remoteVideoTracks) {
                    if (remoteVideoTracks.length > 0) {
                        isVideoTrackAvailable = true;
                    }
                }

                if (self.getDefaultVideoContainer()) {
                    fireEvent = self.useDefaultRenderer(streamUrl, false, isVideoTrackAvailable);
                } else if (self.getRemoteVideoContainer()) {
                    fireEvent = self.createStreamRenderer(streamUrl, self.getRemoteVideoContainer());
                } else {
                    fireEvent = true;
                }
            }

            logger.debug("onRemoteStreamAdded: " + streamUrl);
            if (fireEvent) {
                self.fireOnStreamAddedEvent(call, streamUrl);
            }
        }
    };

    self.iceCandidateCollectionTimeoutHandler = function(call) {
        var sdp = call.peer.localDescription.sdp;
        self.clearIceCandidateCollectionTimer(call);
        if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
            call.relayCandidateCycle ++;
        }
        // set timeout if there is no ice candidate available or
        // when audio, video port assignment isn't complete
        if (!_sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
            logger.debug("Re-setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
            call.iceCandidateCollectionTimer = setTimeout(function() {
                self.iceCandidateCollectionTimeoutHandler(call);
            }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            return;
        }

        if (call.successCallback) {
            logger.debug("Ice candidate collection interrupted after given timeout, invoking successCallback.");

            sdp = _sdpParser.updateH264Level(sdp);

            call.successCallback(sdp);
        }
    };

    self.setupIceCandidateCollectionTimer = function(call) {
        if (fcsConfig.iceCandidateCollectionTimeoutInterval) {
            if (!call.iceCandidateCollectionTimer) {
                logger.debug("Setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
                if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
                    call.relayCandidateCycle = 1;
                }
                call.iceCandidateCollectionTimer = setTimeout(function() {
                    self.iceCandidateCollectionTimeoutHandler(call);
                }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            } else {
                logger.trace("Ice candidate collection timer exists.");
            }
        }
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * onIceCandidate to be called when the enabler plugin is enabled
     */
    self.onIceCandidate = function(call, event) {
        var sdp;
        if (event.candidate === null) {
            logger.debug("Null candidate received.");
            if (call.successCallback) {
                sdp = _sdpParser.getSdpFromObject(call.peer.localDescription);

                if (_sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
                    self.clearIceCandidateCollectionTimer(call);
                    logger.debug("Candidates received, invoking successCallback.");

                    sdp = _sdpParser.updateH264Level(sdp);
                    call.successCallback(sdp);
                }
                else {
                    logger.trace("Sdp does not have candidates.");
                }

            }
        } else {
            logger.debug("ICE candidate received : sdpMLineIndex = " + event.candidate.sdpMLineIndex +
                    ", candidate = " + event.candidate.candidate + " for call : " + call.id);
        }
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     * onIceComplete to be called when the enabler plugin is enabled
     */
    self.onIceComplete = function(call) {
        var  sdp;
        logger.debug("All ICE candidates received for call : " + call.id);
        self.clearIceCandidateCollectionTimer(call);

        if(call.successCallback) {
            sdp = call.peer.localDescription.sdp;
            sdp = _sdpParser.updateH264Level(sdp);
            logger.debug("onIceComplete sdp : " + sdp);

            call.successCallback(sdp);
        }
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.useDefaultRenderer = function(streamUrl, local, isVideoTrackAvailable) {
        var videoContainer;

        if (self.getDefaultVideoContainer() && self.getDefaultVideoContainer().children.length === 0) {
            // Create divs for the remote and local
            self.getDefaultVideoContainer().innerHTML = "<div style='height:100%;width:100%'></div><div style='position:absolute;bottom:10px;right:10px;height:30%; width:30%;'></div>";
        }

        if (local) {
            videoContainer = self.getDefaultVideoContainer().lastElementChild;
        } else {
            videoContainer = self.getDefaultVideoContainer().firstElementChild;

            if (!isVideoTrackAvailable) {
                videoContainer.style.width = "0%";
            } else {
                videoContainer.style.width = "100%";
            }
        }
        return self.createStreamRenderer(streamUrl, videoContainer, {
            muted: local
        });
    };


    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.createStreamRenderer = function(streamUrl, container) {
        if (!streamUrl || !container) {
            return;
        }

        container.innerHTML = "<object width='100%' height='100%' type='application/x-gcfwenabler-video'><param name='autoplay' value='true' /><param name='videosrc' value='" + streamUrl + "' /></object>";

        return true;
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.sendIntraFrame = function(call) {
        if (!call.peer) {
            return;
        }

        if (self.canOriginatorSendLocalVideo(call)) {
            call.peer.sendIntraFrame();
        } else {
            //call.peer.sendBlackFrame();
            //sendBlackFrame is removed from plugin
            return;
        }
    };

    // Enabler implementation lies on webRtcPluginAdaptor.js
    self.sendBlackFrame = function(call) {
        if (!call.peer) {
            return;
        }
        //call.peer.sendBlackFrame();
        //TODO: This function will be completely removed since sendBlackFrame is removed from plugin
        return;
    };

    /**
     * Send DTMF tone
     * Enabler implementation lies on webRtcPluginAdaptor.js
     *
     * @ignore
     * @name rtc.sendDTMF
     * @function
     * @param {Object} call internalCall
     * @param {String} tone DTMF tone
     */
    self.sendDTMF = function (call, tone) {
        var localAudioTrack;

        if (!call.dtmfSender) {
            localAudioTrack = self.getLocalAudioTrack(call.peer);
            if (!localAudioTrack) {
                return;
            }
            call.dtmfSender = call.peer.createDTMFSender(localAudioTrack);
            if (!call.dtmfSender) {
                return;
            }
        }

        if (call.dtmfSender.canInsertDTMF === true) {
            call.dtmfSender.insertDTMF(tone, 400);
            logger.info("sending outband DTMF tone: " + tone);
        }
        else {
            logger.error("Failed to execute 'insertDTMF' on 'RTCDTMFSender': The 'canInsertDTMF' attribute is false: this sender cannot send DTMF");
        }
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     */
    self.getCameraList = function () {
        return;
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     */
    self.getMicrophoneList = function() {
        return;
    };

    /*
     * Enabler implementation lies on webRtcPluginAdaptor.js
     */
    self.getSpeakerList = function() {
        return;
    };

    logger.debug('WebRtcPluginAdaptor initialized');
};

//@{fcs-jsl-prod}
var WebRtcPluginAdaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryDecorator,
            model = _model || new WebRtcPluginAdaptorModel();
    return new WebRtcPluginAdaptorImpl(_super ||
            new WebRtcAdaptor({}, decorator, model),
            decorator,
            model,
            logManager,
            utils,
            sdpParser,
            fcs.call.MediaErrors);
};

if (__testonly__) {
    __testonly__.WebRtcPluginAdaptor = WebRtcPluginAdaptor;
}
//@{fcs-jsl-prod}


var WebRtcPluginv22AdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this,
        webRtcPlugin22Version = {
            major: 2,
            minor: 2,

            min_revision: 477,
            min_build: 0,

            current_revision: 477,
            current_build: 0
        }, logger = _logManager.getLogger("WebRtcPluginv22AdaptorImpl");
    logger.debug('WebRtcPluginv22Adaptor initializing');

    utils.compose(_super, self);
    utils.compose(_model, self);

    self.setPluginVersion(webRtcPlugin22Version);
    logger.debug('WebRtcPluginv22Adaptor initialized');
};

//@{fcs-jsl-prod}
var WebRtcPluginv22Adaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryDecorator,
            model = _model || new WebRtcPluginAdaptorModel();
    return new WebRtcPluginv22AdaptorImpl(_super ||
            new WebRtcPluginAdaptor(undefined, decorator, model),
            decorator,
            model,
            logManager);
};

if (__testonly__) { __testonly__.WebRtcPluginv22Adaptor = WebRtcPluginv22Adaptor; }
//@{fcs-jsl-prod}

var WebRtcPluginv31AdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this,
        webRtcPlugin31Version = {
            major: 3,
            minor: 1,

            min_revision: 500,
            min_build: 0,

            current_revision: 509,
            current_build: 0
        }, logger = _logManager.getLogger("WebRtcPluginv31AdaptorImpl");
    logger.debug('WebRtcPluginv31Adaptor initializing');

    utils.compose(_super, self);
    utils.compose(_model, self);

    self.setPluginVersion(webRtcPlugin31Version);

    /**
     * Send DTMF tone
     * Enabler implementation lies on webRtcPluginv31Adaptor.js
     *
     * @ignore
     * @name rtc.sendDTMF
     * @function
     * @param {Object} call internalCall
     * @param {String} tone DTMF tone
     */
    self.sendDTMF = function (call, tone) {
        var localAudioTrack;

        if(!call.dtmfSender) {
            localAudioTrack = self.getLocalAudioTrack(call.peer);
            if(!localAudioTrack) {
                return;
            }
            call.dtmfSender = call.peer.createDTMFSender(localAudioTrack);
            if(!call.dtmfSender) {
                return;
            }
        }

        if(!sdpParser.isSdpHasTelephoneEvent(call.peer.remoteDescription.sdp)){
            call.dtmfSender.insertDTMF(tone, 400, 100, true);
            logger.info("sending inband DTMF tone: " + tone);
        } else {
            if (call.dtmfSender.canInsertDTMF === true) {
                call.dtmfSender.insertDTMF(tone, 400);
                logger.info("sending outband DTMF tone: " + tone);
            } else {
                logger.error("Failed to execute 'insertDTMF' on 'RTCDTMFSender': The 'canInsertDTMF' attribute is false: this sender cannot send DTMF");
            }
        }
    };

    logger.debug('WebRtcPluginv31Adaptor initialized');
};

//@{fcs-jsl-prod}
var WebRtcPluginv31Adaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryDecorator,
            model = _model || new WebRtcPluginAdaptorModel();
    return new WebRtcPluginv31AdaptorImpl(_super ||
            new WebRtcPluginAdaptor(undefined, decorator, model),
            decorator,
            model,
            logManager);
};

if (__testonly__) { __testonly__.WebRtcPluginv31Adaptor = WebRtcPluginv31Adaptor; }
//@{fcs-jsl-prod}

var WebRtcChromeAdaptorImpl = function(_super, _decorator, _model, _logManager, _utils) {
    var self = this, logger = _logManager.getLogger("WebRtcChromeAdaptorImpl");
    logger.debug('WebRtcChromeAdaptor initializing');

    _utils.compose(_super, self);
    _utils.compose(_model, self);

    logger.debug('WebRtcChromeAdaptor initialized');
};

//@{fcs-jsl-prod}
var WebRtcChromeAdaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryChromeDecorator,
            model = _model || new WebRtcChromeAdaptorModel();
    return new WebRtcChromeAdaptorImpl(_super ||
            new WebRtcAdaptor({}, decorator, model),
            decorator,
            model,
            logManager,
            utils);
};

if (__testonly__) { __testonly__.WebRtcChromeAdaptor = WebRtcChromeAdaptor; }
//@{fcs-jsl-prod}

var WebRtcFirefoxAdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this, logger = _logManager.getLogger("WebRtcFirefoxAdaptorImpl");
    logger.debug('WebRtcFirefoxAdaptor initializing');

    utils.compose(_super, self);
    utils.compose(_model, self);

    // firefoxPerformSdpWorkaroundsBeforeProcessingIncomingSdp
    self.performSdpWorkaroundsBeforeProcessingIncomingSdp = function(call) {
        call.sdp = sdpParser.updateH264LevelTo42E01F(call.sdp, self.isH264Enabled());
        call.sdp = sdpParser.deleteBandwidthLineFromSdp(call.sdp);
        call.sdp = sdpParser.addRtpmapForPCMU(call.sdp);
        call.sdp = sdpParser.addRtpmapForPCMA(call.sdp);
        call.sdp = sdpParser.removeG722Codec(call.sdp);
        call.sdp = sdpParser.setOpusCodecToLowerCase(call.sdp);
    };

    // firefoxGetUserMedia
    self.getUserMedia = function(params) {
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            var mediaInfo, mediaStreamSource, constraints = {audio: false, video: false}, localMedia;
            self.setMediaSources(mediaSourceInfo);

            if (mediaSourceInfo) {
                if(!mediaSourceInfo.audioSourceAvailable) {
                    logger.debug("Failed to get access to local media.");
                    utils.callFunctionIfExist(params.onFailure, fcs.call.MediaErrors.NOT_FOUND);
                    return;
                }
            }

            if (self.getMediaVideo() && self.getVideoSourceAvailable()) {
                constraints.video = params.options.videoConstraints;
            }
            if (self.getMediaAudio() && self.getAudioSourceAvailable()) {
                constraints.audio = params.options.audioConstraints;
            }

            logger.debug("getUserMedia - constraints: ", constraints);
            self.getRtcLibrary().getUserMedia(constraints, function getUserMediaSuccessCallback(stream) {
                if (constraints.video) {
                    localMedia = {
                    audioContext: {close: function(){}},
                    mediaStreamDestination: {disconnect: function(){}},
                    stream: stream,
                    originalStream: stream
                    };
                }
                else{
                    self.initAudioContext();
                    mediaStreamSource = self.getAudioContext().createMediaStreamSource(stream);
                    self.initMediaStreamDestination();
                    mediaStreamSource.connect(self.getMediaStreamDestination());

                    localMedia = {
                        audioContext: self.getAudioContext(),
                        mediaStreamDestination: self.getMediaStreamDestination(),
                        stream: self.getMediaStreamDestination().stream,
                        originalStream: stream
                    };
                }

                self.setLocalMedia(localMedia);
                self.getLocalStreamMap().add(localMedia.stream.id, localMedia);
                self.setInitialized(true);

                mediaInfo = {
                    audio: self.getMediaAudio(),
                    video: self.getMediaVideo(),
                    id: localMedia.stream.id,
                    originalStream: stream,
                    streamURL: self.getRtcLibrary().getURLFromStream(stream)
                };

                logger.debug("user has granted access to local media: ", localMedia);
                utils.callFunctionIfExist(params.onSuccess, mediaInfo);
            }, function getUserMediaFailureCallback(error) {
                logger.debug("Failed to get access to local media. Error code was " + error.code);
                utils.callFunctionIfExist(params.onFailure, fcs.call.MediaErrors.NOT_ALLOWED);
            });
        });
    };

    // firefoxCreateOffer
    self.createOffer = function (call, successCallback, failureCallback, sendInitialVideo) {
        logger.debug("createOffer: sendInitialVideo= " + sendInitialVideo + " state= " + call.peer.signalingState);
        var peer = call.peer;

        call.peer.addStream(call.localMedia.stream);

        self.addCallIdInPluginContainer(call);

        peer.createOffer(
                function createOfferSuccessCallback(oSdp) {
                    sendInitialVideo = sendInitialVideo && self.getVideoSourceAvailable();
                    if (sendInitialVideo) {
                        oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                    }

                    oSdp.sdp = sdpParser.deleteCryptoZeroFromSdp(oSdp.sdp);

                    oSdp.sdp = sdpParser.updateAudioCodec(oSdp.sdp);
                    oSdp.sdp = sdpParser.removeG722Codec(oSdp.sdp);

                    oSdp.sdp = sdpParser.deleteCryptoFromSdp(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = sdpParser.setTcpSetupAttributeToActpass(oSdp.sdp, self.isDtlsEnabled());

                    oSdp = self.performSdpWorkaroundsAfterCreateOffer(call, oSdp);

                    peer.setLocalDescription(
                            self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, oSdp.sdp),
                            function createOfferSetLocalDescriptionSuccessCallback() {
                                //Due to stun requests, successCallback will be called by onNativeIceCandidate()
                            }, function createOfferSetLocalDescriptionFailureCallback(error) {
                        logger.error("createOffer: setLocalDescription failed : " + error);
                        utils.callFunctionIfExist(failureCallback, "createOffer: setLocalDescription failed");
                    });
                }, function createOfferFailureCallback(e) {
            logger.error("createOffer: createOffer failed!! " + e);
            utils.callFunctionIfExist(failureCallback);
        },{
            'offerToReceiveAudio': self.getMediaAudio(),
            'offerToReceiveVideo': self.getMediaVideo()
        });
    };

    // firefoxCreateReOffer
    self.createReOffer = function(call, onSuccess, onFailure, usePreviousMediaDirection) {
        var peer = call.peer, localDescObj, localAudioDirection, localVideoDirection,
                newVideoDirection, prevLocalSdp = call.peer.localDescription.sdp;

        logger.debug("createReOffer:" + call.id);

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        peer.createOffer(
                function prwCreateOfferSuccessCallback(oSdp) {

                    if (usePreviousMediaDirection) {
                        localAudioDirection = sdpParser.getAudioSdpDirection(prevLocalSdp);
                        oSdp.sdp = sdpParser.updateAudioSdpDirection(oSdp.sdp, localAudioDirection);
                        localVideoDirection = sdpParser.getVideoSdpDirection(prevLocalSdp);
                        oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, localVideoDirection);
                    }else{
                        localVideoDirection = sdpParser.getVideoSdpDirection(prevLocalSdp);
                        newVideoDirection = sdpParser.getVideoSdpDirection(oSdp.sdp);
                        if(localVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE &&
                            newVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE){
                            oSdp.sdp = sdpParser.updateVideoSdpDirection(oSdp.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                        }
                    }

                    oSdp.sdp = sdpParser.deleteCryptoZeroFromSdp(oSdp.sdp);
                    oSdp.sdp = sdpParser.updateAudioCodec(oSdp.sdp);
                    oSdp.sdp = sdpParser.removeG722Codec(oSdp.sdp);
                    oSdp.sdp = sdpParser.deleteCryptoFromSdp(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = sdpParser.setTcpSetupAttributeToActpass(oSdp.sdp, self.isDtlsEnabled());
                    oSdp.sdp = sdpParser.updateVersion(prevLocalSdp, oSdp.sdp);
                    oSdp = self.performSdpWorkaroundsAfterCreateOffer(call, oSdp);

                    localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, oSdp.sdp);
                    peer.setLocalDescription(
                            localDescObj,
                            function prwSetLocalDescriptionSuccessCallback() {
                                logger.debug("createReOffer: setLocalDescription success" + call.id);
                            },
                            function prwSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createReOffer: setLocalDescription failed!!" + e + call.id);
                                utils.callFunctionIfExist(onFailure);
                            });
                },
                function prwCreateOfferFailureCallback(e) {
                    logger.error("createReOffer: createOffer failed!! " + e);
                    utils.callFunctionIfExist(onFailure);
        },{
            'offerToReceiveAudio': self.getMediaAudio(),
            'offerToReceiveVideo': self.getMediaVideo()
        });
    };

    // firefoxProcessAnswer
    self.processAnswer = function(call, successCallback, failureCallback) {
        var remoteVideoDirection, localVideoDirection, peer = call.peer, remoteDescObj;
        logger.debug("processAnswer: state= " + peer.signalingState);

        self.setTcpSetupAttiributesOnProcessAnswer(call, call.sdp);
        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, peer.localDescription.sdp, self.isH264Enabled());
        call.sdp = sdpParser.performVideoPortZeroWorkaround(call.sdp);

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = sdpParser.getVideoSdpDirection(call.peer.localDescription.sdp);

        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp);

        peer.setRemoteDescription(
                remoteDescObj,
                function processAnswerSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processAnswer: setRemoteDescription success");
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
                    call.videoOfferSent = sdpParser.isSdpHasVideo(call.sdp);
                    utils.callFunctionIfExist(successCallback);
                },
                function processAnswerSetRemoteDescriptionFailureCallback(e) {
                    logger.error("processAnswer: setRemoteDescription failed: " + e.message);
                    utils.callFunctionIfExist(failureCallback);
                });
    };

    // firefoxRevertRtcState
    self.revertRtcState = function(call, successCallback) {
        //no need to create new peer to handle revertRtc case. Peer will be handled after retryAfter period.

        // TODO: Setting timeout to 0 skips the problem of successive holds without glare condition
        // A real solution have to be found
        setTimeout(function(){
            utils.callFunctionIfExist(successCallback, call);
        },0);
    };

    // firefoxCreateHoldUpdate
    self.createHoldUpdate = function(call, hold, remote_hold_status, successCallback, failureCallback) {
        logger.debug("createHoldUpdate: local hold= " + hold + " remote hold= " + remote_hold_status + " state= " + call.peer.signalingState);
        var peer = call.peer,
                audioDirection,
                videoDirection,
                localDescObj,
                localSdp, createHoldUpdate, hasActiveVideo;

        createHoldUpdate = function() {
            localSdp = call.stableLocalSdp;
            audioDirection = sdpParser.getAudioSdpDirection(localSdp);
            videoDirection = sdpParser.getVideoSdpDirection(localSdp);

            if (self.createNewPeerForCall(call))
            {
                peer = call.peer;
            }

            peer.createOffer(
                function createHoldUpdateCreateOfferSuccessCallback(obj) {

                    obj.sdp = sdpParser.updateVersion(localSdp, obj.sdp);
                    obj.sdp = sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
                    obj = self.performSdpWorkaroundsAfterCreateOffer(call, obj);

                    if (hold || remote_hold_status) {
                        if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                            obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                        } else {
                            if (!hold && remote_hold_status) {
                                obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                            } else {
                                obj.sdp = sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                            }
                        }
                        if (videoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                        } else {
                            if (!hold && remote_hold_status) {
                                obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                            } else {
                                obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                            }
                        }
                    } else {
                        obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                        if (self.canOriginatorSendLocalVideo(call)) {
                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                        } else {
                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                        }
                    }

                    localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

                    peer.setLocalDescription(localDescObj,
                            function createHoldUpdateSetLocalDescriptionSuccessCallback() {
                                logger.debug("createHoldUpdate: setLocalDescription success");
                            },
                            function createHoldUpdateSetLocalDescriptionFailureCallback(error) {
                                logger.error("createHoldUpdate: setLocalDescription failed: " + error.message);
                                utils.callFunctionIfExist(failureCallback);
                            });
                }, function createHoldUpdateCreateOfferFailureCallback(error) {
                logger.error("createHoldUpdate: createOffer failed: " + error.message);
                utils.callFunctionIfExist(failureCallback);

            },{
                'offerToReceiveAudio': self.getMediaAudio(),
                'offerToReceiveVideo': self.getMediaVideo()
            });
        };

        hasActiveVideo = sdpParser.isSdpHasVideo(call.sdp) &&
                !sdpParser.isVideoSdpDirectionInactive(peer.localDescription.sdp);

        if (!call.isVideoSourceAllowed && hasActiveVideo) {
            self.setMediaAudio(true);
            self.setMediaVideo(true);

            // TODO: This should not be done here just for code consistency
            self.getUserMedia(function(mediaInfo) {
                self.storeLocalStreamToCall(call, mediaInfo.id);
                call.isVideoSourceAllowed = mediaInfo.video;
            createHoldUpdate();
            }, function() {
                utils.callFunctionIfExist(failureCallback);
            });
        }
        else{
            if(hasActiveVideo){
                call.isVideoSourceAllowed = true;
            }
            createHoldUpdate();
        }
    };

    // firefoxProcessHold
    self.processHold = function(call, hold, local_hold_status, successCallback, failureCallback) {
        logger.debug("processHold: local hold= " + local_hold_status + " remote hold= " + hold + " state= " + call.peer.signalingState);
        var peer = call.peer, updateSdp, peerRemoteSdp, audioDirection;

        if (!local_hold_status && !hold) {
            self.muteOnHold(call, false);
        }

        audioDirection = sdpParser.getAudioSdpDirection(call.sdp);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null);
        call.sdp = sdpParser.performVideoPortZeroWorkaround(call.sdp);

        call.sdp = sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());

        peerRemoteSdp = call.prevRemoteSdp;

        updateSdp = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        peer.setRemoteDescription(
                updateSdp,
                function processHoldSetRemoteDescriptionSuccessCallback() {
                    peer.createAnswer(function(obj) {
                        logger.debug("processHold: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                        logger.debug("processHold: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));

                        if (hold) {
                            logger.debug("processHold: Remote HOLD");
                            obj.sdp = sdpParser.respondToRemoteSdpDirections(obj.sdp, call.sdp);
                        } else if (!local_hold_status) {
                            logger.debug("processHold: Remote UNHOLD: direction left as it is");

                            if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                if (self.canOriginatorSendLocalVideo(call)) {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                } else {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                }
                            } else {
                                if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                } else {
                                    obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                }
                            }
                            //change audio's direction to sendrecv for ssl attendees in a 3wc
                            obj.sdp = sdpParser.changeDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
                        } else if (local_hold_status && !hold) {
                            logger.debug("processHold: Remote UNHOLD on local hold");

                            if (audioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE) {
                                obj.sdp = sdpParser.updateAudioSdpDirectionToInactive(obj.sdp);
                            } else {
                                obj.sdp = sdpParser.updateAudioSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                            }

                            if (self.canOriginatorSendLocalVideo(call)) {
                                obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                            } else {
                                obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                            }
                        }

                        obj.sdp = sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                        peer.setLocalDescription(
                                obj,
                                function processHoldSetLocalDescriptionSuccessCallback() {
                                    logger.debug("processHold: setLocalDescription succeeded");
                                },
                                function processHoldSetLocalDescriptionFailureCallback(e) {
                                    logger.error("processHold: setLocalDescription failed!! " + e);
                                    utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                                });
                    }, function() {
                        logger.debug("FAIL");
                    });
                }, function processHoldSetRemoteDescriptionFailureCallback(e) {
            logger.error("processHold: setRemoteDescription failed: " + e.message);
            utils.callFunctionIfExist(failureCallback, "Session cannot be created");
        });
    };

    // firefoxProcessHoldRespond
    self.processHoldRespond = function(call, onSuccess, onFailure, isJoin) {
        var remoteAudioDirection,
                remoteVideoDirection,
                localVideoDirection,
                localHoldFlag = false,
                remoteHoldFlag = false,
                obj;

        logger.debug("processHoldRespond: state= " + call.peer.signalingState + " call.currentState= " + call.currentState);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, call.peer.localDescription.sdp, self.isH264Enabled());

        sdpParser.init(call.sdp);
        remoteHoldFlag = sdpParser.isRemoteHold();

        localHoldFlag = (call.currentState === "LOCAL_HOLD");

        if(!localHoldFlag){
            self.addCallIdInPluginContainer(call);
        }

        remoteAudioDirection = sdpParser.getAudioSdpDirection(call.sdp);
        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        call.remoteVideoState = remoteVideoDirection;

        localVideoDirection = sdpParser.getVideoSdpDirection(call.peer.localDescription.sdp);

        logger.debug("processHoldRespond: localHold= " + localHoldFlag + " remoteHold= " + remoteHoldFlag);

        /* Required for MOH - start */
        if (remoteHoldFlag === false) {
            if ((remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) && (call.currentState === "REMOTE_HOLD")) {
                logger.debug("set current web state to COMPLETED");
                call.previousState = call.currentState;
                call.currentState = "COMPLETED";
            }
        } else {
            if (call.currentState === "COMPLETED") {
                logger.debug("set current web state to REMOTE_HOLD");
                call.previousState = call.currentState;
                call.currentState = "REMOTE_HOLD";
            }
        }

        if (localHoldFlag || remoteHoldFlag) {
            logger.debug("processHoldRespond: " + call.currentState + " : video -> inactive");
            call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
        }

        /* Required for MOH - end */

        if (isJoin) {
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            utils.callFunctionIfExist(onSuccess);
            return;
        }

        // this is required for displaying remote video when direction is send only
        // call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, video);
        if (sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE ||
                sdpParser.getVideoSdpDirection(call.sdp) === CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY)
        {
            call.sdp = sdpParser.deleteInactiveVideoSsrc(call.sdp);
        }

        if (localHoldFlag && remoteAudioDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
            logger.debug("processHoldRespond: Mute Remote Audio");
            call.sdp = sdpParser.updateAudioSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }

        if (localHoldFlag && remoteVideoDirection === CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE) {
            logger.debug("processHoldRespond: Mute Remote Video");
            call.sdp = sdpParser.updateVideoSdpDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
        }

        obj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp);

        call.peer.setRemoteDescription(obj,
                function processHoldRespondSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processHoldRespond: setRemoteDescription typeAns success");
                    utils.callFunctionIfExist(onSuccess);
                },
                function processHoldRespondSetRemoteDescriptionFailureCallback(e) {
                    logger.debug("processHoldRespond: setRemoteDescription typeAns failed: " + e);
                    utils.callFunctionIfExist(onFailure);
                });
    };

    // firefoxCreateUpdate
    self.createUpdate = function(call, successCallback, failureCallback, isVideoStart) {
        logger.debug("createUpdate: isVideoStart= " + isVideoStart + " state= " + call.peer.signalingState);
        var peer = call.peer, localSdp, localDesc;

        localSdp = call.peer.localDescription.sdp;

        logger.debug("create new offer to start the video");

        if (self.createNewPeerForCall(call))
        {
            peer = call.peer;
        }

        self.setMediaVideo(true);
        peer.createOffer(
                function createUpdateCreateOfferSuccessCallback(obj) {
                    isVideoStart = isVideoStart && self.getVideoSourceAvailable();
                    if (isVideoStart) {
                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                    } else {
                        if (sdpParser.isVideoSdpDirectionInactive(call.stableRemoteSdp)) {
                            obj.sdp = sdpParser.updateVideoSdpDirectionToInactive(obj.sdp);
                        } else {
                            obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                        }
                    }

                    obj.sdp = sdpParser.updateVersion(localSdp, obj.sdp);
                    obj.sdp = sdpParser.setTcpSetupAttributeToActpass(obj.sdp, self.isDtlsEnabled());
                    obj.sdp = sdpParser.deleteCryptoZeroFromSdp(obj.sdp);
                    obj.sdp = sdpParser.updateAudioCodec(obj.sdp);
                    obj.sdp = sdpParser.removeG722Codec(obj.sdp);
                    obj.sdp = sdpParser.deleteCryptoFromSdp(obj.sdp, self.isDtlsEnabled());
                    obj = self.performSdpWorkaroundsAfterCreateOffer(call, obj);

                    localDesc = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, obj.sdp);

                    peer.setLocalDescription(localDesc,
                            function createUpdateCreateOfferSetLocalDescriptionSuccessCallback() {
                                //since the candidates have changed we will call the successCallback at onNativeIceCandidate
                                //utils.callFunctionIfExist(successCallback);
                                logger.debug("createUpdate: createOffer setLocalDescription success ");
                            },
                            function crateUpdateCreateOfferSetLocalDescriptionFailureCallback(e) {
                                logger.debug("createUpdate: createOffer setLocalDescription failed: " + e);
                                utils.callFunctionIfExist(failureCallback);
                            });
                },
                function createUpdateCrateOfferFailureCallback(e) {
                    logger.debug("createUpdate: createOffer failed!!: " + e);
                    failureCallback();
                },{
                    'offerToReceiveAudio': self.getMediaAudio(),
                    'offerToReceiveVideo': self.getMediaVideo()
                });
    };

    // firefoxProcessUpdate
    self.processUpdate = function(call, successCallback, failureCallback) {
        logger.debug("processUpdate: state= " + call.peer.signalingState);
        var peer = call.peer,
                remoteVideoDirection,localVideoDirection,
                remoteDescObj, localDescObj, peerLocalSdp;

        // Meetme workaround
        call.sdp = sdpParser.addSdpMissingCryptoLine(call.sdp);

        call.sdp = sdpParser.checkAndRestoreICEParams(call.sdp, call.stableLocalSdp);

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);
        localVideoDirection = sdpParser.getVideoSdpDirection(call.stableLocalSdp);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, null, self.isH264Enabled());

        //This is highly required for meetme on DTLS
        call.sdp = sdpParser.setTcpSetupAttributeToActpass(call.sdp, self.isDtlsEnabled());


        peerLocalSdp = call.stableLocalSdp;

        if (self.createNewPeerForCall(call)) {
            peer = call.peer;
        }

        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.OFFER, call.sdp);
        peer.setRemoteDescription(
                remoteDescObj,
                function processUpdateSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processUpdate: setRemoteDescription success");
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

                    peer.createAnswer(
                            function processUpdateCreateAnswerSuccessCallback(obj) {
                                logger.debug("processUpdate: isSdpEnabled audio= " + sdpParser.isAudioSdpEnabled(obj.sdp));
                                logger.debug("processUpdate: isSdpEnabled video= " + sdpParser.isVideoSdpEnabled(obj.sdp));
                                if (sdpParser.isSdpVideoSendEnabled(call.sdp)) {
                                    if (self.canOriginatorSendLocalVideo(call)) {
                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE);
                                    } else {
                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY);
                                    }
                                } else {
                                    if (self.canOriginatorSendLocalVideo(call) && !sdpParser.isVideoSdpDirectionInactive(call.sdp)) {
                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_ONLY);
                                    } else {
                                        obj.sdp = sdpParser.updateVideoSdpDirection(obj.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.INACTIVE);
                                    }
                                }

                                obj.sdp = sdpParser.updateVersion(peerLocalSdp, obj.sdp);
                                obj.sdp = sdpParser.checkIceParamsLengths(obj.sdp, remoteDescObj.sdp);
                                obj.sdp = sdpParser.setTcpSetupAttributeTo(obj.sdp, call.localTcpSetupAttribute, self.isDtlsEnabled());

                                localDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, obj.sdp);
                                peer.setLocalDescription(
                                        localDescObj,
                                        function processUpdateSetLocalDescriptionSuccessCallback() {
                                            logger.debug("processUpdate: setlocalDescription success");
                                        },
                                        function processUpdateSetLocalDescriptionSuccessCallback(e) {
                                            logger.debug("processUpdate: setlocalDescription failed!!" + e);
                                            utils.callFunctionIfExist(failureCallback, "processUpdate: setlocalDescription failed!!");
                                        });
                            },
                            function processUpdateCreateAnswerFailureCallback(e) {
                                logger.debug("processUpdate: createAnswer failed!! " + e);
                                utils.callFunctionIfExist(failureCallback, "Session cannot be created");
                            },{
                                'offerToReceiveAudio': self.getMediaAudio(),
                                'offerToReceiveVideo': self.getMediaVideo()
                            });
                },
                function processUpdateSetRemoteDescriptionSuccessCallback(e) {
                    logger.debug("processUpdate: setRemoteDescription failed!!" + e);
                    utils.callFunctionIfExist(failureCallback, "processUpdate: setRemoteDescription failed!!");
                });
    };

    // firefoxProcessRespond
    self.processRespond = function(call, onSuccess, onFail, isJoin) {
        var remoteVideoDirection, remoteDescObj,
                peer = call.peer;
        logger.debug("processRespond: state= " + call.peer.signalingState);

        call.sdp = sdpParser.checkSupportedVideoCodecs(call.sdp, peer.localDescription.sdp, self.isH264Enabled());

        remoteVideoDirection = sdpParser.getVideoSdpDirection(call.sdp);

        call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);

        if (isJoin) {
            call.sdp = sdpParser.changeDirection(call.sdp, CONSTANTS.WEBRTC.MEDIA_STATE.RECEIVE_ONLY, CONSTANTS.WEBRTC.MEDIA_STATE.SEND_RECEIVE, CONSTANTS.STRING.AUDIO);
            self.muteOnHold(call, false);
        }

        if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
            //if we are in stable state we should not change remotedescription
            utils.callFunctionIfExist(onSuccess);
            return;
        }

        remoteDescObj = self.getRtcLibrary().createRTCSessionDescription(CONSTANTS.WEBRTC.RTC_SDP_TYPE.ANSWER, call.sdp);
        peer.setRemoteDescription(
                remoteDescObj,
                function processRespondSetRemoteDescriptionSuccessCallback() {
                    logger.debug("processRespond: setRemoteDescription success");
                    call.remoteVideoState = sdpParser.getVideoSdpDirection(call.sdp);
                    call.videoOfferSent = true;
                    utils.callFunctionIfExist(onSuccess);
                },
                function processRespondSetRemoteDescriptionSuccessCallback(e) {
                    logger.debug("processRespond: setRemoteDescription failed: " + e);
                    utils.callFunctionIfExist(onFail);
                });
    };

    // firefoxSendDTMF
    self.sendDTMF = function (call,tone) {
        var audioContext;

        audioContext = call.localMedia.audioContext;
        if (audioContext.createOscillator) {
            self.sendInbandDTMF(call, tone, audioContext);
        }
        else{
            logger.debug("DMTF IS NOT SUPPORTED FOR VIDEO CALL ON FIREFOX");
        }
    };

    // firefoxIceCandidateCollectionTimeoutHandler
    self.iceCandidateCollectionTimeoutHandler = function(call) {
        var sdp = call.peer.localDescription.sdp;
        self.clearIceCandidateCollectionTimer(call);
        if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
            call.relayCandidateCycle ++;
        }
        sdp = sdpParser.findZeroConnectionIPandModify(sdp);

        // set timeout if there is no ice candidate available or
        // when audio, video port assignment isn't complete
        if (!sdpParser.hasCandidates(sdp, call.relayCandidateCycle, fcsConfig.relayCandidateCollectionTimeoutCycle)) {
            logger.debug("Re-setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
            call.iceCandidateCollectionTimer = setTimeout(function() {
                self.iceCandidateCollectionTimeoutHandler(call);
            }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            return;
        }

        if (call.successCallback) {
            logger.debug("Ice candidate collection interrupted after given timeout, invoking successCallback.");
            sdp = sdpParser.deleteCurlyBracketsSDP(sdp);
            if (!self.isH264Enabled()) {
                sdp = sdpParser.removeH264Codec(sdp);
            }
            if (!sdpParser.isSdpHasUfrag(sdp)) {
                sdp = sdpParser.checkAndRestoreICEParams(sdp, call.stableLocalSdp);
                logger.debug("Absent ufrag due to inactive video direction is restored from that in stable local sdp");
            }
            call.successCallback(sdp);
        }
    };

    // firefoxSetupIceCandidateCollectionTimer
    self.setupIceCandidateCollectionTimer = function(call) {
        if (fcsConfig.iceCandidateCollectionTimeoutInterval) {
            if (!call.iceCandidateCollectionTimer) {
                logger.debug("Setting ice candidate collection timeout: " + fcsConfig.iceCandidateCollectionTimeoutInterval);
                if(fcsConfig.relayCandidateCollectionTimeoutCycle) {
                    call.relayCandidateCycle = 1;
                }
                call.iceCandidateCollectionTimer = setTimeout(function() {
                    self.iceCandidateCollectionTimeoutHandler(call);
                }, fcsConfig.iceCandidateCollectionTimeoutInterval);
            } else {
                logger.trace("Ice candidate collection timer exists.");
            }
        }
    };

    // firefoxOnIceCandidate
    self.onIceCandidate = function(call, event) {
        var sdp;
        if (event.candidate === null) {
            logger.debug("Null candidate received.");
            if (call.successCallback) {
                sdp = call.peer.localDescription.sdp;
                self.clearIceCandidateCollectionTimer(call);
                logger.debug("Candidates received, invoking successCallback.");

                sdp = sdpParser.deleteCurlyBracketsSDP(sdp);
                if (!self.isH264Enabled()) {
                    sdp = sdpParser.removeH264Codec(sdp);
                }
                if (!sdpParser.isSdpHasUfrag(sdp)) {
                    sdp = sdpParser.checkAndRestoreICEParams(sdp, call.stableLocalSdp);
                    logger.debug("Absent ufrag due to inactive video direction is restored from that in stable local sdp");
            }
                call.successCallback(sdp);
            }
        } else {
            logger.debug("ICE candidate received: sdpMLineIndex = " + event.candidate.sdpMLineIndex +
                    ", candidate = " + event.candidate.candidate + " for call : " + call.id);
        }
    };

    // firefoxOnIceComplete
    self.onIceComplete = function(call) {
        var sdp;
        logger.debug("All ICE candidates received for call : " + call.id);
        self.clearIceCandidateCollectionTimer(call);

        if (call.successCallback) {
            sdp = call.peer.localDescription.sdp;
            sdp = sdpParser.deleteCurlyBracketsSDP(sdp);
            if (!self.isH264Enabled()) {
                sdp = sdpParser.removeH264Codec(sdp);
            }
            if (!sdpParser.isSdpHasUfrag(sdp)) {
                sdp = sdpParser.checkAndRestoreICEParams(sdp, call.stableLocalSdp);
                logger.debug("Absent ufrag due to inactive video direction is restored from that in stable local sdp");
            }

            logger.debug("onIceComplete sdp : " + sdp);

            call.successCallback(sdp);
        }
    };

    // firefoxCreateNewPeerForCall
    self.createNewPeerForCall = function(call) {
        var isNewPeerCreated = false, peerCount = self.getPeerCount();
        if (call.peer) {
            call.peer.close();
            self.setPeerCount(peerCount - 1);
            call.dtmfSender = null;
        }

        logger.trace("Creating new peer for call: " + call.id);
        self.createPeer(call, function createPeerSuccessCallback() {
            logger.trace("New peer has created for call: " + call.id);
            call.peer.addStream(call.localMedia.stream);
            isNewPeerCreated = true;
        }, function createPeerFailureCallback() {
            logger.error("New peer creation has failed!: " + call.id);
        });
        return isNewPeerCreated;
    };

    // firefoxCreatePeer
    self.createPeer = function(call, onSuccess, onFailure) {
        try {
            var pc, constraints, i, servers = [], iceServerUrl = self.getIceServerUrl(), stunturn, serverType;
            if (iceServerUrl instanceof Array) {
                for(i = 0; i<iceServerUrl.length; i++) {
                    serverType = iceServerUrl[i].url.substring(0, iceServerUrl[i].url.indexOf(':'));
                    if (serverType === 'turns') {
                        iceServerUrl[i].url = iceServerUrl[i].url.replace('turns', 'turn');
                    }
                    servers[i] = iceServerUrl[i];
                }
            } else if (iceServerUrl === null ||  iceServerUrl === ""){
                servers = [];
            } else {
                servers[0] = iceServerUrl;
            }
            stunturn = {iceServers:servers};

            constraints = {"optional": [{"DtlsSrtpKeyAgreement": self.isDtlsEnabled()}]};
            pc = self.getRtcLibrary().createRTCPeerConnection(stunturn, constraints);

            self.setPeerCount(self.getPeerCount() + 1);
            call.peer = pc;

            pc.onconnecting = function(event){
                self.onSessionConnecting(call, event);
            };
            pc.onopen = function(event){
                self.onSessionOpened(call, event);
            };
            pc.onsignalingstatechange = function(event){
                self.onSignalingStateChange(call, event);
            };
            pc.onaddstream = function(event){
                self.onRemoteStreamAdded(call, event);
            };
            pc.onremovestream = function(event){
                self.onRemoteStreamRemoved(call, event);
            };
            pc.onicecandidate = function (event) {
                if (event.currentTarget.iceGatheringState === "complete") {
                    logger.debug("ice gathering complete");
                    self.onIceComplete(call);
                }
                else {
                    self.setupIceCandidateCollectionTimer(call);
                    self.onIceCandidate(call, event);
                }
            };
            pc.onicecomplete = function(){
                self.onIceComplete(call);
            };
            pc.oniceconnectionstatechange = function (event) {
                self.oniceconnectionstatechange(call, event);
            };
            logger.info("create PeerConnection successfully.");

            // Will be commented-in after decision of necessary stats
            // self.setupWebrtcLogCollectionTimer(call);

            onSuccess(call);
        } catch(err) {
            logger.error("Failed to create PeerConnection, exception: " + err.message);
            onFailure();
        }
    };

    // firefoxgetCameraList
    self.getCameraList = function () {
        return;
    };

    // firefoxgetMicrophoneList
    self.getMicrophoneList = function() {
        return;
    };

    // firefoxgetSpeakerList
    self.getSpeakerList = function() {
        return;
    };

    logger.debug('WebRtcFirefoxAdaptor initialized');
};

//@{fcs-jsl-prod}
var WebRtcFirefoxAdaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryFirefoxDecorator,
            model = _model || new WebRtcFirefoxAdaptorModel();
    return new WebRtcFirefoxAdaptorImpl(_super ||
            new WebRtcAdaptor({}, decorator, model),
            decorator,
            model,
            logManager);
};

if (__testonly__) {__testonly__.WebRtcFirefoxAdaptor = WebRtcFirefoxAdaptor;}
//@{fcs-jsl-prod}


var WebRtcFirefoxEsrAdaptorImpl = function(_super, _decorator, _model, _logManager) {
    var self = this, logger = _logManager.getLogger("WebRtcFirefoxEsrAdaptorImpl");
    logger.debug('WebRtcFirefoxEsrAdaptor initializing');

    utils.compose(_super, self);
    utils.compose(_model, self);

    // firefoxEsrGetUserMedia
    self.getUserMedia = function(params) {
        self.getRtcLibrary().checkMediaSourceAvailability(function mediaSourceCallback(mediaSourceInfo) {
            var mediaInfo, constraints = {audio: false, video: false}, localMedia;
            self.setMediaSources(mediaSourceInfo);

            if (mediaSourceInfo) {
                if(!mediaSourceInfo.audioSourceAvailable) {
                    logger.debug("Failed to get access to local media.");
                    utils.callFunctionIfExist(params.onFailure, fcs.call.MediaErrors.NOT_FOUND);
                    return;
                }
            }

            if (self.getMediaVideo() && self.getVideoSourceAvailable()) {
                constraints.video = params.options.videoConstraints;
            }
            if (self.getMediaAudio() && self.getAudioSourceAvailable()) {
                constraints.audio = params.options.audioConstraints;
            }

            logger.debug("getUserMedia - constraints: ", constraints);
            self.getRtcLibrary().getUserMedia(constraints, function getUserMediaSuccessCallback(stream) {

            localMedia = {
            audioContext: {close: function(){}},
            mediaStreamDestination: {disconnect: function(){}},
            stream: stream,
            originalStream: stream
            };

            self.setLocalMedia(localMedia);
            self.getLocalStreamMap().add(localMedia.stream.id, localMedia);
            self.setInitialized(true);

            mediaInfo = {
                audio: self.getMediaAudio(),
                video: self.getMediaVideo(),
                id: localMedia.stream.id,
                originalStream: stream,
                streamURL: self.getRtcLibrary().getURLFromStream(stream)
            };

            logger.debug("user has granted access to local media: ", localMedia);
            utils.callFunctionIfExist(params.onSuccess, mediaInfo);
            }, function getUserMediaFailureCallback(error) {
                logger.debug("Failed to get access to local media. Error code was " + error.code);
                utils.callFunctionIfExist(params.onFailure, fcs.call.MediaErrors.NOT_ALLOWED);
            });
        });
    };


    // firefoxEsrSendDTMF
    self.sendDTMF = function (call, tone) {
        logger.debug("DMTF IS ONLY SUPPORTED FOR  FIREFOX 40 AND NEWER VERSIONS");
    };

    logger.debug('WebRtcFirefoxEsrAdaptor initialized');
};

//@{fcs-jsl-prod}
var WebRtcFirefoxEsrAdaptor = function(_super, _decorator, _model) {
    var decorator = _decorator || webRtcLibraryFirefoxDecorator,
            model = _model || new WebRtcFirefoxAdaptorModel();
    return new WebRtcFirefoxEsrAdaptorImpl(_super ||
            new WebRtcFirefoxAdaptor(null, decorator, model),
            decorator,
            model,
            logManager);
};
//@{fcs-jsl-prod}


var WebRtcAdaptorFactory = function(_window, _navigator, _logManager, _WebRtcPluginv22Adaptor, _WebRtcPluginv31Adaptor, _WebRtcChromeAdaptor, _WebRtcFirefoxAdaptor, _WebRtcFirefoxEsrAdaptor) {
    var logger = _logManager.getLogger("WebRtcAdaptorFactory"),
    NAVIGATOR_TYPES = {CHROME: "chrome", FIREFOX: "firefox", "PLUGIN": "plugin"},
    PLUGIN_MODES = {
        // 3.0 Enabler Plugin
        WEBRTCH264: "webrtch264",
        // 2.2 Enabler Plugin
        WEBRTC22: "webrtc22",
        // Default Enabler Plugin
        WEBRTC: "webrtc",
        // Native For Chrome Browser and Default Enabler Plugin for other Browsers
        AUTO: "auto",
        // Native For Chrome Browser and Default Enabler Plugin for other Browsers
        AUTO22: "auto22",
        // Native For Chrome Browser and 3.0 Enabler Plugin for other Browsers
        AUTOH264: "autoh264",
        // Native For Chrome AND Firefox Browser and Enabler Plugin for other Browsers
        AUTOFIREFOX: "autofirefox"
    },
    DEFAULT_RTC_PLUGIN_MODE = PLUGIN_MODES.WEBRTCH264,
    DEFAULT_RTC_ADAPTOR = _WebRtcPluginv31Adaptor,
    PLUGIN_MODE_LOOKUP_TABLE = {
        chrome: {webrtc: DEFAULT_RTC_PLUGIN_MODE,
                autofirefox: PLUGIN_MODES.AUTO,
                autoh264: PLUGIN_MODES.AUTO,
                webrtch264: PLUGIN_MODES.WEBRTCH264},
        firefox: {webrtc: DEFAULT_RTC_PLUGIN_MODE,
                auto: DEFAULT_RTC_PLUGIN_MODE,
                auto22: PLUGIN_MODES.WEBRTC22,
                autoh264: PLUGIN_MODES.WEBRTCH264,
                autofirefox: PLUGIN_MODES.AUTO
                },
        plugin: {auto: DEFAULT_RTC_PLUGIN_MODE,
            auto22: PLUGIN_MODES.WEBRTC22,
            autoh264: PLUGIN_MODES.WEBRTCH264,
            autofirefox: DEFAULT_RTC_PLUGIN_MODE,
            webrtc: DEFAULT_RTC_PLUGIN_MODE}},
    ADAPTOR_LOOKUP_TABLE = {
        chrome: {auto: _WebRtcChromeAdaptor,
            autoh264: _WebRtcChromeAdaptor,
            webrtc22: _WebRtcPluginv22Adaptor,
            webrtch264: _WebRtcPluginv31Adaptor},
        firefox: {auto: _WebRtcFirefoxAdaptor,
            autoesr: _WebRtcFirefoxEsrAdaptor,
            webrtc22: _WebRtcPluginv22Adaptor,
            webrtch264: _WebRtcPluginv31Adaptor},
        plugin: {webrtc22: _WebRtcPluginv22Adaptor,
            webrtch264: _WebRtcPluginv31Adaptor}
    },
    COMPOSIT_PLUGIN_MODES = {
        // Default Enabler Plugin
        WEBRTC: "webrtc",
        // Native For Chrome And Firefox Browser and Default Enabler Plugin for other Browsers
        AUTO: "auto"
    },
    COMPOSIT_ADAPTOR_LOOKUP_TABLE = {
        chrome: {auto: _WebRtcChromeAdaptor,
            webrtc: DEFAULT_RTC_ADAPTOR},
        firefox: {auto: _WebRtcFirefoxAdaptor,
            autoesr: _WebRtcFirefoxEsrAdaptor,
            webrtc: DEFAULT_RTC_ADAPTOR},
        plugin: {auto: DEFAULT_RTC_ADAPTOR,
            webrtc: DEFAULT_RTC_ADAPTOR}
    },pluginMode;

    function getNavigatorType() {
        var type, version, regex;
        if (_navigator.userAgent && _navigator.userAgent.indexOf("GENBANDOmni") !== -1) {
            type = NAVIGATOR_TYPES.CHROME;
        }
        else if (_navigator.webkitGetUserMedia) {
            type= NAVIGATOR_TYPES.CHROME;
            regex = new RegExp(/\Chrome\/(\d*)/);
        }
        else if (_navigator.mozGetUserMedia) {
            type= NAVIGATOR_TYPES.FIREFOX;
            regex = new RegExp(/\Firefox\/(\d*)/);
        }
        else {
            type= NAVIGATOR_TYPES.PLUGIN;
        }
        if (regex && _navigator.userAgent) {
            version = parseInt(_navigator.userAgent.match(regex).pop(), 10);
        }
        return {type : type, version: version};
    }

    function identifyPluginMode(options) {
        var i;

        if (!options || !options.pluginMode) {
            return PLUGIN_MODES.AUTO;
        }

        for(i in PLUGIN_MODES) {
            if (PLUGIN_MODES[i] === options.pluginMode) {
                return PLUGIN_MODES[i];
            }
        }

        return PLUGIN_MODES.AUTO;
    }

    function getPluginModeForComposition(navigatorType) {
        var pluginMode = PLUGIN_MODES.AUTO, validPluginMode=false,
                h264Enabled,
                pluginModeBrowser = fcsConfig.pluginMode[navigatorType.type],
                pluginModeBrowserVersion,
                browserVersion,i,regex;

        if (pluginModeBrowser) {
            regex = new RegExp(/^\d+\+$/);
            if(pluginModeBrowser.version && regex.test(pluginModeBrowser.version)){
                pluginModeBrowserVersion = parseInt(pluginModeBrowser.version.replace(/\+/, ''), 10);
            }
            browserVersion = navigatorType.version;
            if (pluginModeBrowser.mode && (!pluginModeBrowserVersion || browserVersion >= pluginModeBrowserVersion)) {
                pluginMode = pluginModeBrowser.mode;
            }
            else if(fcsConfig.pluginMode.mode){
                pluginMode = fcsConfig.pluginMode.mode;
            }

            if (typeof pluginModeBrowser.h264 !== 'undefined' && (!pluginModeBrowserVersion || browserVersion >= pluginModeBrowserVersion)) {
                h264Enabled = pluginModeBrowser.h264;
            }
            else {
                h264Enabled = fcsConfig.pluginMode.h264;
            }
        }
        else {
            pluginMode = fcsConfig.pluginMode.mode;
            h264Enabled = fcsConfig.pluginMode.h264;
        }

        // plugin mode validity check
        for(i in COMPOSIT_PLUGIN_MODES) {
            if (COMPOSIT_PLUGIN_MODES[i] === pluginMode) {
                validPluginMode = true;
            }
        }
        if(!validPluginMode){
            pluginMode = PLUGIN_MODES.AUTO;
        }

        // h264 validity check
        if(h264Enabled !== true && h264Enabled !== false){
            h264Enabled = undefined;
        }

        return {pluginMode: pluginMode, h264Enabled: h264Enabled};
    }

    function getPluginMode(options, navigatorType) {
        var pluginMode = identifyPluginMode(options);

        return PLUGIN_MODE_LOOKUP_TABLE[navigatorType.type][pluginMode] || pluginMode;
    }

    this.getWebRtcAdaptor = function(options) {
        var Adaptor, navigatorType = getNavigatorType(),
        adaptor, pluginModeAndH264Bundle, h264Enabled;

        if (fcsConfig.pluginMode) {
            pluginModeAndH264Bundle = getPluginModeForComposition(navigatorType);
            pluginMode = pluginModeAndH264Bundle.pluginMode;
            h264Enabled = pluginModeAndH264Bundle.h264Enabled;
            if (pluginMode === "auto" && navigatorType.type === "firefox" && navigatorType.version < 40) {
                pluginMode = "autoesr";
            }
            Adaptor = COMPOSIT_ADAPTOR_LOOKUP_TABLE[navigatorType.type][pluginMode];
        }
        else {
            pluginMode = getPluginMode(options, navigatorType);
            if (pluginMode === "auto" && navigatorType.type === "firefox" && navigatorType.version < 40) {
                pluginMode = "autoesr";
            }
            Adaptor = ADAPTOR_LOOKUP_TABLE[navigatorType.type][pluginMode];
        }

        if (!Adaptor) {
            // This seems unnecessary, still keeping it just in case of a weird
            // condition
            logger.debug("Invalid Plugin Mode Detected, Treated as WEBRTC");
            pluginMode = DEFAULT_RTC_PLUGIN_MODE;
            Adaptor = DEFAULT_RTC_ADAPTOR;
        }

        logger.debug("Adaptor initializing from " + navigatorType + " browser and " + pluginMode + " plugIn mode");
        _window.pluginMode = pluginMode;
        adaptor = new Adaptor();
        //TODO: set h264Enabled for adaptor
        if (typeof h264Enabled !== 'undefined' ) {
            adaptor.setH264Enabled(h264Enabled);
        }
        return adaptor;
    };

    this.getPluginModes = function() {
        return PLUGIN_MODES;
    };

    this.getDefaultRtcPluginMode = function() {
        return DEFAULT_RTC_PLUGIN_MODE;
    };

    this.getDefaultRtcAdaptor = function() {
        return DEFAULT_RTC_ADAPTOR;
    };


};

//@{fcs-jsl-prod}
var webRtcAdaptorFactory = new WebRtcAdaptorFactory(window,
        navigator,
        logManager,
        WebRtcPluginv22Adaptor,
        WebRtcPluginv31Adaptor,
        WebRtcChromeAdaptor,
        WebRtcFirefoxAdaptor,
        WebRtcFirefoxEsrAdaptor);
if (__testonly__) { __testonly__.WebRtcAdaptorFactory = WebRtcAdaptorFactory; }
//@{fcs-jsl-prod}

var WebRtcManager = function(_webRtcAdaptorFactory, _logManager, _turnCredentialsManager, _navigator, _utils, _fcs, _globalBroadcaster) {
    var self = this, rtcAdaptor,
            logger = _logManager.getLogger("WebRtcManager");

    function setSuccessCallbacktoCall(call, successCallback) {
        call.successCallback = successCallback;
    }

    function clearSuccessParametersFromCall(call) {
        call.successCallback = null;
    }

    self.onCredentialsReceived = function () {
        if (rtcAdaptor) {
            rtcAdaptor.setIceServerUrl(self.addTurnCredentialsToUrl());
        }
    };

    _turnCredentialsManager.onCredentialsReceived = self.onCredentialsReceived;

    self.addTurnCredentialsToUrl = function () {
        var i, serverType,
            iceServerUrl = rtcAdaptor.getIceServerUrl(),
            turnCredentials = _turnCredentialsManager.get();
        if (turnCredentials) {
            logger.info("Turn credentials are avaliable.");
            if (iceServerUrl instanceof Array) {
                for (i = 0; i < iceServerUrl.length; i++) {
                    serverType = iceServerUrl[i].url.substring(0, iceServerUrl[i].url.indexOf(':'));
                    if (serverType === 'turn' || serverType === 'turns') {
                        iceServerUrl[i].credential = turnCredentials.credential;
                        iceServerUrl[i].username = turnCredentials.username;
                    }
                }
            }
        }
        return iceServerUrl;
    };

    self.canOriginatorSendLocalVideo = function(call) {
        return rtcAdaptor.canOriginatorSendLocalVideo(call);
    };

    self.canOriginatorReceiveRemoteVideo = function(call) {
        return rtcAdaptor.canOriginatorReceiveRemoteVideo(call);
    };

    self.onFcsSetupCompleted = function(fcsConfig) {
        self.initMedia(null, null, fcsConfig);
    };

    self.initMedia = function (onSuccess, onFailure, options) {
        logger.info("Initializing media for call");

        if (!rtcAdaptor) {
            rtcAdaptor = _webRtcAdaptorFactory.getWebRtcAdaptor(options);
        }

        if (options) {
            if (options.iceserver) {
                // Adding raw iceserver config to adaptor
                // to make addTurnCredentialsToUrl method work properly
                rtcAdaptor.setIceServerUrl(options.iceserver);
                rtcAdaptor.setIceServerUrl(self.addTurnCredentialsToUrl(options.iceserver));
            }
            if (options.webrtcdtls) {
                rtcAdaptor.setDtlsEnabled(options.webrtcdtls);
            }

            if (options.localVideoContainer) {
                rtcAdaptor.setLocalVideoContainer(options.localVideoContainer);
            }

            if (options.remoteVideoContainer) {
                rtcAdaptor.setRemoteVideoContainer(options.remoteVideoContainer);
            }

            if (options.videoContainer) {
                rtcAdaptor.setDefaultVideoContainer(options.videoContainer);
            }
        }

        if (rtcAdaptor.isInitialized()) {
            onSuccess();
        }
        else {
            rtcAdaptor.initMedia(onSuccess, onFailure, options);
        }
    };

    self.privateGetUserMedia = function (onSuccess, onFailure, options) {
        var returnParams = {
            onSuccess: onSuccess,
            onFailure: onFailure,
            options: {
                audioConstraints: options.audio,
                videoConstraints: options.video,
                privateStream: options.privateStream
            }};

        if (!options.audio && !options.video) {
            _utils.callFunctionIfExist(onFailure, _fcs.call.MediaErrors.INVALID_PARAMETER);
            return;
        }
        rtcAdaptor.privateGetUserMedia(returnParams);
    };

    self.getUserMedia = function (onSuccess, onFailure, options) {
        var audioConstraints = false, videoConstraints = false,
            returnParams = {
                onSuccess: onSuccess,
                onFailure: onFailure
            };

        if (options) {
            rtcAdaptor.setMediaAudio(options.audio);
            audioConstraints = options.audio;

            rtcAdaptor.setMediaVideo(options.video);
            videoConstraints = options.video;
        }

        if (!audioConstraints && !videoConstraints) {
            _utils.callFunctionIfExist(onFailure, _fcs.call.MediaErrors.INVALID_PARAMETER);
            return;
        }

        returnParams.options = {
            audioConstraints: audioConstraints,
            videoConstraints: videoConstraints
        };

        logger.info("getting user media - userAgent: " + _navigator.userAgent +
                " constraints: ", {audio: audioConstraints, video: videoConstraints});

        rtcAdaptor.getUserMedia(returnParams);
    };

    self.createOffer = function(call, successCallback, failureCallback, sendInitialVideo) {
        logger.info("create offer SDP: sendInitialVideo= " + sendInitialVideo);

        var successCallbackWrapper = function (sdp) {
            clearSuccessParametersFromCall(call);
            rtcAdaptor.restoreMuteStateOfCall(call);
            rtcAdaptor.setOriginatorSendLocalVideo(call, sendInitialVideo);
            if (typeof (successCallback) === 'function') {
                successCallback(sdp);
            }
        };

        setSuccessCallbacktoCall(call, successCallbackWrapper);

        if (!call.peer) {
            rtcAdaptor.createPeer(
                    call,
                    function createPeerSuccessCallback() {
                        rtcAdaptor.createOffer(call, successCallbackWrapper, function(err) {
                            clearSuccessParametersFromCall(call);
                            if (typeof (failureCallback) === 'function') {
                                failureCallback(err);
                            }
                        }, sendInitialVideo);
                    },
                    function createPeerFailureCallback() {
                        _utils.callFunctionIfExist(failureCallback, 2);
                    }
            );
        }
    };

    self.createAnswer = function(call, successCallback, failureCallback, isVideoEnabled) {
        logger.info("creating answer SDP: callid= " + call.id);
        logger.info("creating answer SDP: isVideoEnabled= " + isVideoEnabled);

        var successCallbackWrapper = function (sdp) {
            clearSuccessParametersFromCall(call);
            rtcAdaptor.setOriginatorSendLocalVideo(call, isVideoEnabled);
            rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
            if (typeof (successCallback) === 'function') {
                successCallback(sdp);
            }
        };

        setSuccessCallbacktoCall(call, successCallbackWrapper);

        if (!call.peer) {
            rtcAdaptor.createPeer(
                    call,
                    function createPeerSuccessCallback() {
                        rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
                        rtcAdaptor.createAnswer(call, successCallbackWrapper, function(err) {
                            clearSuccessParametersFromCall(call);
                            if (typeof (failureCallback) === 'function') {
                                failureCallback(err);
                            }
                        }, isVideoEnabled);
                    },
                    function createPeerFailureCallback() {
                        _utils.callFunctionIfExist(failureCallback, 2);
                    }
            );
        }
    };

    self.processAnswer = function(call, successCallback, failureCallback) {
        if (call.peer) {

            var successCallbackWrapper = function () {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.restoreMuteStateOfCall(call);
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback();
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.processAnswer(call, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        });
        }
    };

    self.processRespond = function(call, successCallback, failureCallback, isJoin) {
        if (call.peer) {

            var successCallbackWrapper = function () {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback();
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.processRespond(call, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        }, isJoin);
        }
    };

    self.createUpdate = function(call, successCallback, failureCallback, isVideoStart){
        logger.info("createUpdate: isVideoStart= " + isVideoStart);

        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.restoreMuteStateOfCall(call);
                rtcAdaptor.setOriginatorSendLocalVideo(call, isVideoStart);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.storeStableRemoteAndLocalSdpInCall(call);

            rtcAdaptor.createUpdate(call, successCallbackWrapper, failureCallback, isVideoStart);
        }
    };

    self.processUpdate = function(call, successCallback, failureCallback, local_hold_status) {
        logger.info("processUpdate: local_hold_status:" + local_hold_status);

        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.restoreMuteStateOfCall(call);
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.storeStableRemoteAndLocalSdpInCall(call);

            rtcAdaptor.processUpdate(call, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        }, local_hold_status);
        }
    };

    self.createReOffer = function(call, successCallback, failureCallback, usePreviousMediaDirection) {
        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.restoreMuteStateOfCall(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.createReOffer(call, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        }, usePreviousMediaDirection);
        }
    };

    self.createHoldUpdate = function(call, hold, remote_hold_status, successCallback, failureCallback) {
        logger.info("create hold update local hold= " + hold + " remote hold= " + remote_hold_status);

        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                if (hold || remote_hold_status) {
                    rtcAdaptor.muteOnHold(call, true);
                } else {
                    rtcAdaptor.setFcsUserMuteState(call, false);
                    rtcAdaptor.restoreMuteStateOfCall(call);
                }
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.storeStableRemoteAndLocalSdpInCall(call);

            rtcAdaptor.createHoldUpdate(call, hold, remote_hold_status, successCallbackWrapper,
                    function (err) {
                        clearSuccessParametersFromCall(call);
                        if (typeof (failureCallback) === 'function') {
                            failureCallback(err);
                        }
                    });
        }
    };

    self.processRemoteOfferOnLocalHold = function(call, successCallback, failureCallback) {
        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.restoreMuteStateOfCall(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.processRemoteOfferOnLocalHold(call, successCallbackWrapper,
                    function (err) {
                        clearSuccessParametersFromCall(call);
                        if (typeof (failureCallback) === 'function') {
                            failureCallback(err);
                        }
                    });
        }
    };

    self.processEnd = function(call){
        if(call.peer){
            rtcAdaptor.processEnd(call);
        }
    };

    self.processHold = function(call, hold, local_hold_status, successCallback, failureCallback) {
        logger.info("processHold: local hold= " + local_hold_status + " remote hold= " + hold);

        if (call.peer) {

            var successCallbackWrapper = function (sdp) {
                clearSuccessParametersFromCall(call);
                if(!local_hold_status) {
                    rtcAdaptor.restoreMuteStateOfCall(call);
                }
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(sdp);
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.storeStableRemoteAndLocalSdpInCall(call);

            rtcAdaptor.processHold(call, hold, local_hold_status, successCallbackWrapper, function(err){
            clearSuccessParametersFromCall(call);
            if (typeof (failureCallback) === 'function') {
                failureCallback(err);
            }
        });
        }
    };

    self.processHoldRespond = function(call, successCallback, failureCallback, isJoin) {
        logger.info("Processing response to hold offer sent");

        if (call.peer) {

            var successCallbackWrapper = function() {
                clearSuccessParametersFromCall(call);
                rtcAdaptor.setOriginatorReceiveRemoteVideo(call);
                if (typeof (successCallback) === 'function') {
                    successCallback();
                }
            };

            setSuccessCallbacktoCall(call, successCallbackWrapper);

            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.processHoldRespond(call, successCallbackWrapper, function(err) {
                clearSuccessParametersFromCall(call);
                if (typeof (failureCallback) === 'function') {
                    failureCallback(err);
                }
            }, isJoin);
        }
    };

    self.processPreAnswer = function (call, successCallback, failureCallback) {
        logger.info("processing preanswer from the offer we sent");

        if (call.peer) {
            rtcAdaptor.performSdpWorkaroundsBeforeProcessingIncomingSdp(call);
            rtcAdaptor.processPreAnswer(call, function () {
                if (typeof (successCallback) === 'function') {
                    successCallback();
                }
            }, function (err) {
                if (typeof (failureCallback) === 'function') {
                    failureCallback(err);
                }
            });

        }

    };

    self.isDtlsEnabled = function() {
        return rtcAdaptor.isDtlsEnabled();
    };

    self.revertRtcState = function(call, successCallback, failureCallback) {

        var successCallbackWrapper = function() {
                clearSuccessParametersFromCall(call);
                if (typeof (successCallback) === 'function') {
                    successCallback(call);
                }
            };

        setSuccessCallbacktoCall(call, successCallbackWrapper);

        rtcAdaptor.revertRtcState(call, successCallbackWrapper, failureCallback);
    };

    self.getRemoteVideoResolutions = function() {
        return rtcAdaptor.getRemoteVideoResolutions();
    };

    self.getLocalVideoResolutions = function() {
        return rtcAdaptor.getLocalVideoResolutions();
    };

    self.isAudioSourceAvailable = function() {
        return rtcAdaptor.getAudioSourceAvailable();
    };

    self.isVideoSourceAvailable = function() {
        return rtcAdaptor.getVideoSourceAvailable();
    };

    self.refreshVideoRenderer = function() {
        rtcAdaptor.refreshVideoRenderer();
    };

    self.sendIntraFrame = function(internalCall) {
        rtcAdaptor.sendIntraFrame(internalCall);
    };

    self.sendBlackFrame = function(internalCall) {
        rtcAdaptor.sendBlackFrame(internalCall);
    };

    self.muteAudioTrack = function(call, mute) {
        rtcAdaptor.setFcsUserMuteState(call, mute);
        return rtcAdaptor.muteAudioTrack(call, mute);
    };

    self.isAudioMuted = function(call) {
        return rtcAdaptor.isAudioMuted(call);
    };

    self.addLocalStream = function(call) {
        rtcAdaptor.addLocalStream(call);
    };

    self.isPluginEnabled = function() {
        return rtcAdaptor.isPluginEnabled();
    };

    self.sendDTMF = function(call, tone){
        rtcAdaptor.sendDTMF(call, tone);
    };

    self.showSettingsWindow = function(){
        rtcAdaptor.showSettingsWindow();
    };

    self.createStreamRenderer = function(streamId, container, options){
        return rtcAdaptor.createStreamRenderer(streamId, container, options);
    };

    self.disposeStreamRenderer = function(container){
        rtcAdaptor.disposeStreamRenderer(container);
    };

    self.set_logSeverityLevel = function(level){
        rtcAdaptor.set_logSeverityLevel(level);
    };

    self.enable_logCallback = function(){
        rtcAdaptor.enable_logCallback();
    };

    self.disable_logCallback = function(){
        rtcAdaptor.disable_logCallback();
    };

    self.get_audioInDeviceCount = function(){
        return rtcAdaptor.get_audioInDeviceCount();
    };

    self.get_audioOutDeviceCount = function(){
        return rtcAdaptor.get_audioOutDeviceCount();
    };

    self.get_videoDeviceCount = function(){
        return rtcAdaptor.get_videoDeviceCount();
    };

    self.storeLocalStreamToCall = function(call, localStreamId) {
      rtcAdaptor.storeLocalStreamToCall(call, localStreamId);
    };

    self.getStreamById = function(id) {
        return rtcAdaptor.getStreamById(id);
    };

    self.removeStreamById = function(id) {
         rtcAdaptor.removeStreamById(id);
    };

    self.setSelectedMicrophoneId = function(_selectedMicrophoneId){
        rtcAdaptor.setSelectedMicrophoneId(_selectedMicrophoneId);
    };

    self.setSelectedSpeakerId = function(_selectedSpeakerId){
        rtcAdaptor.setSelectedSpeakerId(_selectedSpeakerId);
    };

    self.setSelectedCameraId = function(_selectedCameraId){
        rtcAdaptor.setSelectedCameraId(_selectedCameraId);
    };

    self.getSelectedMicrophoneId = function() {
        return rtcAdaptor.getSelectedMicrophoneId();
    };

    self.getSelectedSpeakerId = function() {
        return rtcAdaptor.getSelectedSpeakerId();
    };

    self.getSelectedCameraId = function() {
        return rtcAdaptor.getSelectedCameraId();
    };

    self.getCameraList = function(onSuccess){
        rtcAdaptor.getCameraList(function(cameraList){
            _utils.callFunctionIfExist(onSuccess, cameraList);
        });
    };

    self.getMicrophoneList = function(onSuccess){
        rtcAdaptor.getMicrophoneList(function(microphoneList){
            _utils.callFunctionIfExist(onSuccess, microphoneList);
        });
    };

    self.getSpeakerList = function(onSuccess){
        rtcAdaptor.getSpeakerList(function(speakerList){
            _utils.callFunctionIfExist(onSuccess, speakerList);
        });
    };

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.FCS_SETUP_COMPLETED, self.onFcsSetupCompleted);


};

//@{fcs-jsl-prod}
var webRtcManager = new WebRtcManager(webRtcAdaptorFactory, logManager, turnCredentialsManager, navigator, utils, fcs, globalBroadcaster);
//@{fcs-jsl-prod}


var SubscriptionServiceImpl = function(_server, _fcsConfig,_fcs,_window,_getWAMUrl,_getUrl, _turnCredentialsManager) {

    var SUBSCRIPTION_URL = "/subscription",
    SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES = {
        "CallControl": "call",
        "call" : "call",
        "IM": "IM",
        "Presence": "Presence",
        "custom": "custom",
        "callMe": "callMe",
        "RCC" : "RCC"
    },
    DEFAULT_SERVICES = [SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.IM,
                        SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.Presence,
                        SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.CallControl],
    DEFAULT_ANONYMOUS_SERVICES = [SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.callMe],
    DEFAULT_SUBSCRIPTION_EXPIRY_VALUE = 3600;

    function getNotificationType() {
        // if SNMP is set return specific data to be sent to the server
        if(_fcsConfig.currentNotificationType === _fcs.notification.NotificationTypes.WEBSOCKET && _window.WebSocket){
            return {
                notificationType: "WebSocket",
                clientIp: _fcsConfig.clientIp
            };
        }
        else {
            return {
                notificationType: "LongPolling",
                pollingTimer: _fcsConfig.polling
            };
        }
    }

    function composeServicesToSubscribeFromAssignedServices(assignedServices) {
        var i, services = [];
        for (i in SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES) {
            if (SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES.hasOwnProperty(i)) {
                if (assignedServices.indexOf(i) !== -1) {
                    services.push(SUBSCRITION_KEYS_FOR_ASSIGNED_SERVICES[i]);
                }
            }
        }

        return services;
    }

    function composeSubscribeRequestData(forceLogout, isSubscribe) {
        var notificationTypeData = getNotificationType(),
        i,
        subscribeRequest;

        subscribeRequest = {
            "expires": Math.floor(_fcsConfig.expires),
            "service": _fcs.notification.isAnonymous() ? composeServicesToSubscribeFromAssignedServices(_fcsConfig.anonymousServices ? _fcsConfig.anonymousServices : DEFAULT_ANONYMOUS_SERVICES) : composeServicesToSubscribeFromAssignedServices(_fcsConfig.services ? _fcsConfig.services : DEFAULT_SERVICES),
            "localization": "English_US"
        };

        if (isSubscribe && _fcsConfig.serverProvidedTurnCredentials) {
            subscribeRequest.useTurn = (_fcsConfig.serverProvidedTurnCredentials === true ? true : false);
        }

        if (forceLogout === true) {
            subscribeRequest.forceLogOut = "true";
        }

        for (i in notificationTypeData) {
            if(notificationTypeData.hasOwnProperty(i)) {
                subscribeRequest[i] = notificationTypeData[i];
            }
        }

        return subscribeRequest;
    }

    this.extendSubscription = function(subscriptionURL, onSuccess, onFailure) {
        if (_fcsConfig.expires === 0) {
            _fcsConfig.expires = DEFAULT_SUBSCRIPTION_EXPIRY_VALUE;
        }

        _server.sendPutRequest(
            {
                url: _getUrl() + subscriptionURL,
                data: {"subscribeRequest": composeSubscribeRequestData()}
            },
            function(data) {
                var response = data.subscribeResponse, params = response.subscriptionParams;
                onSuccess(params.notificationChannel, params.assignedService, params.service);
            },
            onFailure
            );
    };

    this.subscribe = function(onSuccess, onFailure ,forceLogout, token) {
        var dummy;
        _fcsConfig.expires = DEFAULT_SUBSCRIPTION_EXPIRY_VALUE;
        _server.sendPostRequest(
        {
            url: _getWAMUrl(1, SUBSCRIPTION_URL),
            data: {"subscribeRequest": composeSubscribeRequestData(forceLogout, true)}
        },
        function(data) {
            var response = data.subscribeResponse, params = response.subscriptionParams, turnParams;
            if (params.turnActive === true) {
                if (params.turnCredentials && params.turnCredentials.username && params.turnCredentials.password) {
                    turnParams = {username : params.turnCredentials.username, credential : params.turnCredentials.password};
                    _turnCredentialsManager.save(turnParams);
                }
            }
            onSuccess(response.subscription,
                params.notificationChannel,
                params.expires,
                params.pollingTimer,
                params.assignedService,
                params.service,
                params.sessionId);
        },
        onFailure, dummy, dummy, dummy, dummy, token
        );
    };

    this.deleteSubscription = function(subscriptionURL, onSuccess, onFailure) {
        _turnCredentialsManager.remove();
        _server.sendDeleteRequest({
            url: _getUrl() + subscriptionURL
        },
        onSuccess,
        onFailure
        );
    };
};

//@{fcs-jsl-prod}
var subscriptionService = new SubscriptionServiceImpl(server,
        fcsConfig,
        fcs,
        window,
        getWAMUrl,
        getUrl,
        turnCredentialsManager);
//@{fcs-jsl-prod}


var LongpollingServiceImpl = function (_server, _getUrl) {

    this.retrieveNotification = function (retrieveData) {
        return _server.sendGetRequest(
                {
                    url: _getUrl() + retrieveData.notificationUrl
                },
        function (data) {
            var type = null, notificationMessage;
            if (data !== null) {
                notificationMessage = data.notificationMessage;
                if (notificationMessage) {
                    type = notificationMessage.eventType;
                }
            }
            retrieveData.notificationSuccess({type: type, data: notificationMessage, notificationURL: retrieveData.notificationUrl});
        }, function (status) {
            retrieveData.notificationFailure({error: status, notificationChannelURL: retrieveData.notificationUrl});
        });
    };
};

//@{fcs-jsl-prod}
var LongpollingService = function (_server, _getUrl) {
    return new LongpollingServiceImpl(_server || server,
            _getUrl || getUrl);
};
var longpollingService = new LongpollingService();

if (__testonly__) {__testonly__.LongpollingService = LongpollingService;}
//@{fcs-jsl-prod}


var ConnectivityServiceImpl = function (_server, _getUrl, _utils) {

    var CONNECTION_URL = "/rest/version/latest/isAlive";

    this.checkConnectivity = function (onSuccess, onFailure) {
        _server.sendGetRequest({
            url: _getUrl() + CONNECTION_URL + "?" + _utils.getTimestamp()
        }, onSuccess,onFailure);
    };

};

//@{fcs-jsl-prod}
var ConnectivityService = function (_server, _getUrl, _utils) {
    return new ConnectivityServiceImpl(_server || server,
            _getUrl || getUrl,
            _utils || utils);
};
var connectivityService = new ConnectivityService();

if (__testonly__) {__testonly__.ConnectivityService = ConnectivityService;}
//@{fcs-jsl-prod}


var LongpollingManagerImpl = function (_logManager,_service, _CONSTANTS) {
     var logger = _logManager.getLogger("longpollingManager"),
             triggeredFetch = false,
             lastLongpollingRequest = null,
             self = this;

    this.clearConnection = function () {
        if (lastLongpollingRequest) {
            logger.trace("aborting last long polling request.");
            lastLongpollingRequest.abort();
            lastLongpollingRequest = null;
        }
        else {
            logger.info("lastLongpollingRequest is undefined, cannot clear connection");
        }
    };

    this.connect = function (data) {
        if (data.notificationURL) {
            self.clearConnection();
            data.onSuccess(_CONSTANTS.LONG_POLLING.STATUS.TRIGGERED_CONNECT);
            lastLongpollingRequest = _service.retrieveNotification({notificationUrl:data.notificationURL, notificationSuccess : data.onNotificationReceived, notificationFailure : data.onFailure});
        }
        else {
            logger.error("notification URL is undefined, cannot fetch notification");
        }
    };

    this.trigger = function (data) {
        if (!triggeredFetch) {
            self.connect({notificationURL: data.notificationUrl,
                onSuccess: function () {
                    return;
                },
                onNotificationReceived: data.notificationSuccess,
                onFailure: data.notificationFailure});
            triggeredFetch = true;
        }
        else {
            logger.error("trigger could not fetch notification");
        }
    };

};

//@{fcs-jsl-prod}
var LongpollingManager = function (_logManager,_service, _CONSTANTS) {
    return new LongpollingManagerImpl(_logManager || logManager,
            _service || longpollingService,
            _CONSTANTS || CONSTANTS);
};
var longpollingManager = new LongpollingManager();


if (__testonly__) {__testonly__.LongpollingManager= LongpollingManager;}
//@{fcs-jsl-prod}



var WebsocketManagerImpl = function (_logManager, _window, _CONSTANTS, _fcsConfig, _globalBroadcaster) {
    var logger = _logManager.getLogger("websocketManager"),
            WEBSOCKET_CONSTANTS = _CONSTANTS.WEBSOCKET,
            webSocket = null,
            DEFAULT_INTERVAL_VALUE = 10000,
            connectivityTimerID,
            self = this;


    function isWebsocketOpened() {
        if (webSocket && webSocket.readyState === webSocket.OPEN) {
            return true;
        }
        return false;
    }

    this.websocketConnectionCheck = function () {
        if (isWebsocketOpened()) {
            try {
                webSocket.send("test");
            }
            catch (e) {
                logger.trace("Exception occured while executing connecitivy handler: ", e);
            }
        }
    };

    this.handleWebsocketTestIntervalValueValidation = function (time) {
        if (isNaN(time) || (time < 1000 && time !== 0) || time > 10000) {
            return DEFAULT_INTERVAL_VALUE;
        }
        else {
            return time;
        }
    };

    function stopWebSocketConnectivityCheck() {
        logger.debug("check web socket is stopped.");
        clearInterval(connectivityTimerID);
    }

    function startWebSocketConnectivityCheck() {
        var interval;
        stopWebSocketConnectivityCheck();
        interval = self.handleWebsocketTestIntervalValueValidation(parseInt(_fcsConfig.websocketInterval, 10));
        if (interval !== 0) {
            logger.debug("check web socket is started." + interval);
            connectivityTimerID = setInterval(self.websocketConnectionCheck, interval);
        }
        else {
            logger.debug("check web socket is not started." + interval);
        }
    }

    this.clearConnection = function() {
        if (webSocket) {
            webSocket.onmessage = null;
            webSocket.onopen = null;
            webSocket.onclose = null;
            webSocket.onerror = null;
            if (webSocket.close) {
                webSocket.close();
            }
            webSocket = null;
        }
        stopWebSocketConnectivityCheck();
    };

    this.connect = function (connectionData) {
        var protocolValue = WEBSOCKET_CONSTANTS.PROTOCOL.NONSECURE;

        function callOnSuccess(successData) {
            logger.trace("websocket connection created successfully: " + successData.status);

            // Make sure to set our internal state to connected
            _globalBroadcaster.publish(_CONSTANTS.EVENT.WEBSOCKET_CONNECTED);

            if (typeof connectionData.onSuccess === 'function') {
                connectionData.onSuccess(successData.status);
            }
        }

        function callOnFailure(failureData) {
            logger.trace("websocket connection failed: " + failureData.status);
            self.clearConnection();

            // Make sure to set our internal state to disconnected
            _globalBroadcaster.publish(_CONSTANTS.EVENT.WEBSOCKET_DISCONNECTED);

            if (typeof connectionData.onFailure === 'function') {
                connectionData.onFailure(failureData.status);
            }
        }

        // Always cleanup in case there is already a websocket
        self.clearConnection();

        try {
            if (_fcsConfig.websocketProtocol) {
                if (_fcsConfig.websocketProtocol === WEBSOCKET_CONSTANTS.PROTOCOL.SECURE) {
                    protocolValue = WEBSOCKET_CONSTANTS.PROTOCOL.SECURE;
                }
            }
            webSocket = new _window.WebSocket(protocolValue + "://" + (_fcsConfig.websocketIP ? _fcsConfig.websocketIP : _window.location.hostname) + ":" + (_fcsConfig.websocketPort ? _fcsConfig.websocketPort : WEBSOCKET_CONSTANTS.DEFAULT_PORT) + connectionData.notificationURL);
        }
        catch (exception) {
            logger.error("WebSocket create error: ", exception);
            callOnFailure({status:WEBSOCKET_CONSTANTS.STATUS.CREATE_ERROR});
            return;
        }

        if (webSocket !== null) {
            webSocket.onmessage = function (event) {
                var data = JSON.parse(event.data), notificationMessage, type;
                if (data) {
                    notificationMessage = data.notificationMessage;
                    if (notificationMessage) {
                        type = notificationMessage.eventType;
                        connectionData.onNotificationReceived({type:type, data:notificationMessage, notificationURL:connectionData.notificationURL});
                    }
                }
            };
            webSocket.onopen = function () {
                logger.info("WebSocket opened");
                startWebSocketConnectivityCheck();
                callOnSuccess({status:WEBSOCKET_CONSTANTS.STATUS.OPENED});
            };
            webSocket.onclose = function () {
                logger.info("WebSocket closed");
                callOnFailure({status:WEBSOCKET_CONSTANTS.STATUS.CONNECTION_CLOSED});
            };
            webSocket.onerror = function () {
                logger.error("Error on Web Socket connection.");
                callOnFailure({status:WEBSOCKET_CONSTANTS.STATUS.CONNECTION_ERROR});
            };
        }
        else {
            callOnFailure({status:WEBSOCKET_CONSTANTS.STATUS.NOT_FOUND});

        }
    };


};

//@{fcs-jsl-prod}
var WebsocketManager = function (_logManager, _window, _CONSTANTS, _fcsConfig, _globalBroadcaster) {
    return new WebsocketManagerImpl(_logManager || logManager,
            _window || window,
            _CONSTANTS || CONSTANTS,
            _fcsConfig || fcsConfig,
            _globalBroadcaster || globalBroadcaster);
};
var websocketManager = new WebsocketManager();
if (__testonly__) { __testonly__.WebsocketManager = WebsocketManager; }
//@{fcs-jsl-prod}


var ConnectivityManagerImpl = function(_service, _logManager, _window, _globalBroadcaster,_CONSTANTS,_setConnected, _fcsConfig) {
    var logger = _logManager.getLogger("connectivityManager"),
            PRIORITY = 1,
            isConnected = true,
            connectivityTimer;

    function stopCheckConnectivityTimer(params) {
        logger.info("check connectivity timer is stopped.");
        clearInterval(connectivityTimer);
        if (params && params.resetConnectivity) {
            isConnected = true;
            _setConnected(isConnected);
        }
    }

    function onCheckConnectivitySuccess() {
        if (!isConnected) {
            isConnected = true;
            _setConnected(isConnected);
            logger.trace("Connectivity re-established...");
            _globalBroadcaster.publish(_CONSTANTS.EVENT.CONNECTION_REESTABLISHED);
        }
    }

    function onCheckConnectivityFailure() {
        if (isConnected) {
            isConnected = false;
            _setConnected(isConnected);
            logger.trace("Connectivity is lost...");
            _globalBroadcaster.publish(_CONSTANTS.EVENT.CONNECTION_LOST);
        }
    }

    function checkConnectivity() {
        _service.checkConnectivity(onCheckConnectivitySuccess, onCheckConnectivityFailure);
    }

    function isPositiveNumber(str) {
        var pattern = /^(?:0|[1-9][0-9]*)$/;
        // returns a boolean
        return pattern.test(str);
    }

    function checkConnectivityViaContainer() {
        logger.info("connectivity check via Container");
        checkConnectivity();
    }

    function initConnectivityCheck() {
        var interval = isPositiveNumber(_fcsConfig.connectivityInterval) ? _fcsConfig.connectivityInterval : _CONSTANTS.TIMEOUT.DEFAULT_CONNECTIVITY_CHECK_INTERVAL;

        stopCheckConnectivityTimer();
        if (interval !== "0") {
            connectivityTimer = setInterval(checkConnectivity, interval);
        }
        if(_window.registerNetworkInternetCallback){
            _window.registerNetworkInternetCallback(checkConnectivityViaContainer);
        }
    }

    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED, initConnectivityCheck, PRIORITY);
    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_ENDED, stopCheckConnectivityTimer, PRIORITY);
    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.XHR_REQUEST_NOT_INITIALIZED, onCheckConnectivityFailure, PRIORITY);
    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.WEBSOCKET_DISCONNECTED, onCheckConnectivityFailure, PRIORITY);
    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.WEBSOCKET_CONNECTED, onCheckConnectivitySuccess, PRIORITY);



};

//@{fcs-jsl-prod}
var ConnectivityManager = function(_service, _logManager, _window, _globalBroadcaster,_CONSTANTS,_setConnected, _fcsConfig) {
    return new ConnectivityManagerImpl(_service || connectivityService,
                               _logManager || logManager,
                               _window || window,
                               _globalBroadcaster || globalBroadcaster,
                               _CONSTANTS || CONSTANTS,
                               _setConnected || setConnected,
                               _fcsConfig || fcsConfig);
};

var connectivityManager = new ConnectivityManager();

if (__testonly__) { __testonly__.ConnectivityManager = ConnectivityManager; }
//@{fcs-jsl-prod}

var NotificationCallBacks = {};
var NotificationManagerImpl = function (_logManager, _globalBroadcaster,_websocketManager,_longpollingManager, _fcs, _utils, _CONSTANTS,_fcsConfig, _NotificationCallBacks) {
    var logger = _logManager.getLogger("notificationManager"),
            notificationEventIdQueue = [],
            isNotificationFailureDetected=false,
            notificationSuccess,
            notificationFailure,
            onNotificationSuccessAfterFailure,
            onNotificationFailure,
            webSocketRetryAuditTimer,
	    originalWebsocketRetry,
	    websocketRetry,
            websocketRetryTime,
	    websocketNotificationURL,
            self = this,
            DEFAULT_RETRY_TIME = 5000,
            DEFAULT_RETRY_NUMBER = 5,
            NOTIFICATION_EVENT_ID_QUEUE_MAX_LENGTH = 100,
            onLongPollingFailure;

    this.NotificationTypes = {
        LONGPOLLING: "longpolling",
        SNMP: "snmp",
        WEBSOCKET: "websocket",
        WEBSOCKET_ONLY: "websocketonly"
    };

    this.isWebSocketConnection = function (data) {
        if (data && data.notificationURL) {
            return data.notificationURL.indexOf("/websocket/") !== -1;
        }
    };

    this.isLongPollingConnection = function (data) {
        if (data && data.notificationURL) {
            return data.notificationURL.indexOf("/notification/") !== -1;
        }
    };

    function longPollingFailureHandler(failureData) {
        logger.debug("Long polling failure...");
        notificationFailure(failureData);
        // might not be set in trigger cases...
        _utils.callFunctionIfExist(onLongPollingFailure, failureData.error);
    }

    function lPConnectWorker(url, successCallback) {
        logger.debug("Connect long polling to: ", url);
        _longpollingManager.connect({notificationURL: url,
            onSuccess: successCallback,
            onFailure: longPollingFailureHandler,
            onNotificationReceived: notificationSuccess});
    }

    function wsConnectWorker(url, successCallback, failureCallback) {
        logger.debug("Connect web socket to: ", url);
        _websocketManager.connect({notificationURL: url,
            onSuccess: successCallback,
            onFailure: failureCallback,
            onNotificationReceived: notificationSuccess});
    }

    this.handleWebsocketRetry = function (data) {
        logger.debug("WebSocket Connection Retry..." + " retry : " + websocketRetry);
        if (websocketRetry && websocketRetry > 0) {
            websocketRetry = websocketRetry - 1;

            webSocketRetryAuditTimer = setTimeout(
                    function () {
                        wsConnectWorker(websocketNotificationURL,
                                function (status) {
                                    logger.debug("WebSocket re-connection success.");
                                    websocketRetry = originalWebsocketRetry;
                                    data.successCallback(status);
                                },
                                function (status) {
                                    logger.debug("WebSocket re-connection failure.The left trial : " + websocketRetry);
                                    self.handleWebsocketRetry({message: status, successCallback: data.successCallback, failureCallback: data.failureCallback});
                                });
                    }, websocketRetryTime);
        } else {
            logger.debug("WebSocket re-connection failure.WebSocket URL out of use !");
            data.failureCallback(data.message);
        }
    };

    this.handleWebsocketRetryValueValidation = function (retry) {
        if (isNaN(retry) || retry < 0 || retry > 10) {
            return DEFAULT_RETRY_NUMBER;
        }
        else {
            return retry;
        }
    };

    this.handleWebsocketRetryTimeValidation = function (time){
        if (isNaN(time) || time < 1000 || time > 10000) {
            return DEFAULT_RETRY_TIME;
        }
        else {
            return time;
        }
    };

    this.setNotificationSuccessAfterFailureCallback = function(data){
        onNotificationSuccessAfterFailure = data.callback;
    };

    this.setNotificationFailureCallback = function(data) {
        onNotificationFailure = data.callback;
    };

    // Handles successfully fetched notification
    notificationSuccess = function (successData) {
        var data = successData.data, type = successData.type;
        if (data && type) {
            if (notificationEventIdQueue.indexOf(data.eventId) !== -1) {
                logger.info("event received previously: " + data.eventId);
            }
            else {
                notificationEventIdQueue.push(data.eventId);
                if (notificationEventIdQueue.length === NOTIFICATION_EVENT_ID_QUEUE_MAX_LENGTH) {
                    notificationEventIdQueue.splice(0, 50);
                }
                _utils.callFunctionIfExist(_NotificationCallBacks[type], data);
            }
        }

        if (self.isLongPollingConnection({notificationURL: successData.notificationURL})) {
            lPConnectWorker(successData.notificationURL, function () {
                return;
            });
        }
    };

    notificationFailure = function (failuredata) {
        logger.error("received notification error:" + failuredata.error);
        _globalBroadcaster.publish(_CONSTANTS.EVENT.NOTIFICATION_CHANNEL_LOST);
        if (!_fcs.isConnected()) {
            logger.debug("Connection is lost, no need to handle notification failure...");
            return;
        }
        logger.trace("It was set isNotificationFailureDetected parameter as true");
        isNotificationFailureDetected = true;
        onNotificationFailure(failuredata.error);
    };

    this.trigger = function (data) {
        _longpollingManager.trigger({notificationUrl:data.notificationUrl, notificationSuccess:notificationSuccess, notificationFailure:longPollingFailureHandler});
    };

    this.connect = function (data) {
        logger.trace("Clear web socket timer");
        clearTimeout(webSocketRetryAuditTimer);

        function handleConnectSuccess(status) {
            if (isNotificationFailureDetected) {
                logger.trace("It was set isNotificationFailureDetected parameter as false");
                isNotificationFailureDetected = false;
                if (typeof onNotificationSuccessAfterFailure === 'function') {
                    onNotificationSuccessAfterFailure(status);
                }
            }
            if (typeof data.onSuccess === 'function') {
                data.onSuccess(status);
            }
        }

        if (self.isWebSocketConnection({notificationURL: data.notificationURL})) {
            originalWebsocketRetry = self.handleWebsocketRetryValueValidation(parseInt(_fcsConfig.serverRetryNumber, 10));
            websocketRetry = self.handleWebsocketRetryValueValidation(parseInt(_fcsConfig.serverRetryNumber, 10));
            websocketRetryTime = self.handleWebsocketRetryTimeValidation(parseInt(_fcsConfig.serverRetryInterval, 10));
            websocketNotificationURL = data.notificationURL;

            wsConnectWorker(data.notificationURL,
                    handleConnectSuccess,
                    function (status) {
                        logger.debug("WebSocket Connection Failed...");
                        notificationFailure(status);
                        self.handleWebsocketRetry({message: status,
                            successCallback: handleConnectSuccess,
                            failureCallback: data.onFailure});
                    });
        }
        else {
            // We need to keep this function to call connect in each
            // notification success.
            onLongPollingFailure = data.onFailure;
            lPConnectWorker(data.notificationURL, handleConnectSuccess);
        }
    };

    this.clearConnection = function (data) {
        if (data && data.notificationType === self.NotificationTypes.LONGPOLLING) {
            _longpollingManager.clearConnection();
        } else if (data && data.notificationType === self.NotificationTypes.WEBSOCKET) {
            _websocketManager.clearConnection();
        } else {
            _longpollingManager.clearConnection();
            _websocketManager.clearConnection();
        }

        if (data && data.withNotificationFailure) {
            logger.trace("It was set isNotificationFailureDetected parameter as true");
            isNotificationFailureDetected = true;
        }
        logger.trace("Clear web socket timer");
        clearTimeout(webSocketRetryAuditTimer);
    };


};

//@{fcs-jsl-prod}
var NotificationManager = function (_logManager, _globalBroadcaster,_websocketManager,_longpollingManager, _fcs, _utils, _CONSTANTS,_fcsConfig, _NotificationCallBacks) {
    return new NotificationManagerImpl(
            _logManager || logManager,
            _globalBroadcaster || globalBroadcaster,
            _websocketManager || websocketManager,
            _longpollingManager || longpollingManager,
            _fcs || fcs,
            _utils || utils,
            _CONSTANTS || CONSTANTS,
            _fcsConfig || fcsConfig,
            _NotificationCallBacks || NotificationCallBacks);
};

var notificationManager = new NotificationManager();

if (__testonly__) { __testonly__.NotificationManager = NotificationManager; }
if (__testonly__) { fcs.NotificationManager = notificationManager; }
//@{fcs-jsl-prod}


var SubscriptionManagerImpl = function(_fcsConfig, _fcs, _service, _logManager, _globalBroadcaster, _cache, _notificationManager, _utils, _CONSTANTS, _notificationCallBacks) {
var
    logger = _logManager.getLogger("subscriptionManager"),
            CACHEIDS = _CONSTANTS.CACHE,
            isAnonymous = false,
            extendNotificationSubscription,
            extendNotificationSubscriptionTimer = null,
            onConnectionLost,
            onConnectionEstablished,
            onSubscriptionSuccess = null,
            onSubscriptionFailure = null,
            startNotificationTimerAfterConnectionReEstablished,
            restartSubscriptionTimer,
            token = null,
            session = null,
            notificationErrorCallback,
            notificationSuccessAfterErrorCallback,
            notificationCachePrefix = "",
            notifier,
            useNewStyleConfig,
            serverIndex,
            numberOfServers,
            nType = _notificationManager.NotificationTypes,
            restartSubscription;

    function onTokenAuth(data){
        token = data.token;
    }

    function clearCache() {
        _cache.removeItem(notificationCachePrefix + CACHEIDS.NOTIFYURL);
        _cache.removeItem(notificationCachePrefix + CACHEIDS.NOTIFYID);
        _cache.removeItem(notificationCachePrefix + CACHEIDS.SUBSCRIBEURL);
        _cache.removeItem(notificationCachePrefix + CACHEIDS.SUBSCRIBEEXPIRY);
        _cache.removeItem(notificationCachePrefix + CACHEIDS.SUBSCRIBEEXTENDINTERVAL);
        _cache.removeItem(notificationCachePrefix + CACHEIDS.SESSION);
    }

    function clearUserNamePasswordFromCache() {
        _cache.removeItem(notificationCachePrefix + CACHEIDS.USERNAME);
        _cache.removeItem(CACHEIDS.PASSWORD);
    }

    function publishDeviceSubscriptionStartedMessage(message) {
        _globalBroadcaster.publish(_CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED, message);
    }

    function publishDeviceSubscriptionEndedMessage(params) {
        _globalBroadcaster.publish(_CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_ENDED, params);
    }

    this.isAnonymous = function() {
        return isAnonymous;
    };

    function stopRestartSubscriptionTimer() {
        clearTimeout(restartSubscriptionTimer);
        restartSubscriptionTimer = null;
    }

    function onNotificationSubscriptionSuccess() {
        logger.debug("Notification subscription success");
        if (_fcsConfig.currentNotificationType === nType.WEBSOCKET) {
            _notificationManager.clearConnection({notificationType:nType.LONGPOLLING});
        }

        publishDeviceSubscriptionStartedMessage({
            "session": session
         });

        if (onSubscriptionSuccess) {
            _utils.callFunctionIfExist(onSubscriptionSuccess);
            onSubscriptionSuccess = null;
        }
    }

    function stopStartNotificationTimerAfterConnectionReEstablishedTimer() {
        clearTimeout(startNotificationTimerAfterConnectionReEstablished);
        startNotificationTimerAfterConnectionReEstablished = null;
    }

    function stopExtendNotificationSubscriptionTimer() {
        logger.debug("extend notification subscription timer is stopped.");
        clearInterval(extendNotificationSubscriptionTimer);
        extendNotificationSubscriptionTimer = null;
    }

    function stopTimers() {
        stopExtendNotificationSubscriptionTimer();
        stopStartNotificationTimerAfterConnectionReEstablishedTimer();
        stopRestartSubscriptionTimer();
    }

    function clearSubscription(params) {
        logger.debug("Clearing subscription.");
        notifier = null;
        clearCache();
        _notificationManager.clearConnection();
        stopTimers();
        publishDeviceSubscriptionEndedMessage(params);
        if (!params || !params.doNotDeleteConfig) {
            _fcsConfig.currentNotificationType = undefined;
        }
    }

    function updateOldStyleConfigValues() {
        if (serverIndex < numberOfServers) {
            logger.debug("server index: ", serverIndex);
            logger.debug("updating config values to: ", _fcsConfig.servers[serverIndex]);
            _fcsConfig.restUrl = _fcsConfig.servers[serverIndex].restUrl;
            _fcsConfig.restPort = _fcsConfig.servers[serverIndex].restPort;
            _fcsConfig.protocol = _fcsConfig.servers[serverIndex].protocol;
            _fcsConfig.websocketIP = _fcsConfig.servers[serverIndex].websocketIP;
            _fcsConfig.websocketPort = _fcsConfig.servers[serverIndex].websocketPort;
            _fcsConfig.websocketProtocol = _fcsConfig.servers[serverIndex].websocketProtocol;
            return true;
        }

        return false;
    }

    function initializeServerIndex() {
        serverIndex = 0;
    }

    function isThereAnyMoreAvailableServers() {
        return (serverIndex + 1) < numberOfServers;
    }

    function configureNextServer() {
        ++serverIndex;
        return updateOldStyleConfigValues();
    }

    function clearForOnSubscriptionFailure(err) {
        logger.debug("Clear for on subscription failure.");
        if (_fcs.isConnected()) {
            clearSubscription();
            _utils.callFunctionIfExist(onSubscriptionFailure, err);
        }
    }

    function notificationFailureHandler(error) {
        logger.debug("notification failure: ", error);
        _utils.callFunctionIfExist(notificationErrorCallback, error);
    }

    function hasSubscribed() {
        return notifier;
    }

    function handleLongPollingFailure(err) {
        logger.debug("Handle long polling failure..");
        if (useNewStyleConfig && isThereAnyMoreAvailableServers()) {
            logger.debug("Try next server.");
            restartSubscription({changeServerCallback: configureNextServer});
        } else {
            clearForOnSubscriptionFailure(err);
        }
    }

    function handleWebSocketFailure(err) {
        logger.debug("Handle web socket failure..");
        if (useNewStyleConfig && isThereAnyMoreAvailableServers()) {
            logger.debug("Try next server.");
            restartSubscription({changeServerCallback: configureNextServer});
        } else if (_fcsConfig.currentNotificationType === nType.WEBSOCKET) {
            logger.debug("New server could not be configured. Try long polling.");
            restartSubscription({newNotificationType: nType.LONGPOLLING,forceDeviceSubscription:true});
        } else {
            clearForOnSubscriptionFailure(err);
        }
    }

    function handleWebSocketOnlyFailure(err) {
        logger.debug("Handle web socket only failure..");
        if (useNewStyleConfig && isThereAnyMoreAvailableServers()) {
            logger.debug("Try next server.");
            restartSubscription({changeServerCallback: configureNextServer});
        } else {
            clearForOnSubscriptionFailure(err);
        }
    }

    function subscriptionNotificationFailureHandler(err) {
        if (_fcsConfig.notificationType === nType.LONGPOLLING) {
            handleLongPollingFailure(err);
        } else if (_fcsConfig.notificationType === nType.WEBSOCKET) {
            handleWebSocketFailure(err);
        } else if (_fcsConfig.notificationType === nType.WEBSOCKET_ONLY) {
            handleWebSocketOnlyFailure(err);
        }
    }

    function onNotificationSubscriptionFailure(err) {
        subscriptionNotificationFailureHandler(err);
    }

    function onDeviceSubscriptionFailure(err) {
        subscriptionNotificationFailureHandler(err);
    }

    // Subscribe for getting notifications
    function deviceSubscribe(forceLogout) {
        if (!_fcs.isConnected()) {
            logger.debug("Connection is lost, no need to subscribe...");
            onDeviceSubscriptionFailure(_fcs.Errors.CONNECTION_ISSUE);
            return;
        }

        stopExtendNotificationSubscriptionTimer();
        logger.debug("Subscribing...");
        _service.subscribe(function(subscribeUrl, notificationChannel, exp, poll, assignedService, servicesReceivingNotification, sessionId) {

            token = null;
            _fcs.setServices(_fcsConfig.services || assignedService);
            _fcsConfig.services = _fcsConfig.services || assignedService;
            _fcsConfig.servicesReceivingNotification = servicesReceivingNotification;
            _fcsConfig.polling = poll;
            _fcsConfig.expires = exp;
            _fcsConfig.extendInterval = exp / 2;
            notifier = {};
            notifier.notificationURL = notificationChannel;
            notifier.notificationId = notificationChannel.substr(notificationChannel.lastIndexOf("/") + 1);
            notifier.subscriptionURL = subscribeUrl;

            _cache.setItem(notificationCachePrefix + CACHEIDS.NOTIFYURL, notifier.notificationURL);
            _cache.setItem(notificationCachePrefix + CACHEIDS.NOTIFYID, notifier.notificationId);
            _cache.setItem(notificationCachePrefix + CACHEIDS.SUBSCRIBEURL, notifier.subscriptionURL);
            _cache.setItem(notificationCachePrefix + CACHEIDS.SUBSCRIBEEXPIRY, _fcsConfig.expires);
            _cache.setItem(notificationCachePrefix + CACHEIDS.SUBSCRIBEEXTENDINTERVAL, _fcsConfig.extendInterval);
            _cache.setItem(notificationCachePrefix + CACHEIDS.USERNAME, _fcs.getUser());
            if (sessionId) {
                session = sessionId;
                _cache.setItem(notificationCachePrefix + CACHEIDS.SESSION, session);
            }

            extendNotificationSubscriptionTimer = setInterval(extendNotificationSubscription, _fcsConfig.extendInterval * 1000);

            logger.debug("Subscription successfull - notifier: ", notifier);

            _notificationManager.connect({notificationURL:notificationChannel, onSuccess:onNotificationSubscriptionSuccess, onFailure:onNotificationSubscriptionFailure});

        }, function(err) {
            if (err !== _fcs.Errors.CONNECTION_ISSUE) {
                logger.error("Subscription is failed - error: " + err);

                onDeviceSubscriptionFailure(err);
            }
        },forceLogout, token);
    }

    function clearOnExtendError() {
        _notificationManager.clearConnection({withNotificationFailure: true});
        notificationFailureHandler(_CONSTANTS.NOTIFICATION.STATUS.STOP_FOR_RESTART);
        publishDeviceSubscriptionEndedMessage();
    }

    function sendExtendSubscriptionRequest() {
        if (!_fcs.isConnected()) {
            logger.debug("Connection is lost, no need to extend subscribe...");
            return;
        }

        stopExtendNotificationSubscriptionTimer();

        logger.debug("Extending subscription... - subscription URL: ", notifier.subscriptionURL);
        _service.extendSubscription(notifier.subscriptionURL, function (notificationChannel, assignedService, servicesReceivingNotification) {

            _fcs.setServices(_fcsConfig.services || assignedService);
            _fcsConfig.services = _fcsConfig.services || assignedService;
            _fcsConfig.servicesReceivingNotification = servicesReceivingNotification;
            notifier.notificationURL = notificationChannel;
            _cache.setItem(notificationCachePrefix + CACHEIDS.NOTIFYURL, notificationChannel);

            extendNotificationSubscriptionTimer = setInterval(extendNotificationSubscription, _fcsConfig.extendInterval * 1000);

            logger.debug("Extending subscription successful - notifier: ", notifier);

            _notificationManager.connect({notificationURL:notificationChannel, onSuccess:onNotificationSubscriptionSuccess, onFailure:onNotificationSubscriptionFailure});

        }, function (err) {
            if (_fcs.isConnected()) {
                logger.error("Extending subscription is failed - error: " + err);
                logger.error("Fail reusing existing subscription, re-subscribing.");
                // notify the user first
                clearOnExtendError();
                deviceSubscribe();
            }else{
                logger.error("Extending subscription is failed and connection is lost - error: " + err);
            }
        });
    }

    function subscribeToNewServer(changeServerCallback) {
        clearSubscription({doNotDeleteConfig: true});
        changeServerCallback();
        deviceSubscribe();
    }

    function handleRestartChangingServer(changeServerCallback) {
        if (!hasSubscribed()) {
            changeServerCallback();
            deviceSubscribe();
        } else {
            _service.deleteSubscription(notifier.subscriptionURL,
                    function () {
                        subscribeToNewServer(changeServerCallback);
                    },
                    function () {
                        subscribeToNewServer(changeServerCallback);
                    });
        }
    }

    function handleRestartSameServer(forceDeviceSubscription) {
        if (!hasSubscribed()) {
            deviceSubscribe();
        } else {
            if (forceDeviceSubscription) {
                _service.deleteSubscription(notifier.subscriptionURL,
                        function () {
                            deviceSubscribe();
                        },
                        function () {
                            logger.debug("Un usbscription failed for old subscription with websocket");
                            deviceSubscribe();
                        });
            }
            else {
                sendExtendSubscriptionRequest();
            }
        }
    }

    restartSubscription = function (data) {
        stopRestartSubscriptionTimer();
        restartSubscriptionTimer = setTimeout(function () {
            if (!_fcs.isConnected()) {
                logger.debug("Connection is lost, no need to restart subscription...");
                return;
            }

            logger.debug("Restarting subscription...");

            if (data.newNotificationType) {
                _fcsConfig.currentNotificationType = data.newNotificationType;
                logger.debug("Current notification type is set as: ", _fcsConfig.currentNotificationType);
            }

            if (data.clearConnectionAndNotifiyUser) {
                _notificationManager.clearConnection({withNotificationFailure: true});
                notificationFailureHandler(_CONSTANTS.NOTIFICATION.STATUS.STOP_FOR_RESTART);
            }

            if (data.changeServerCallback) {
                handleRestartChangingServer(data.changeServerCallback);
            } else {
                handleRestartSameServer(data.forceDeviceSubscription);
            }
        }, Math.random() * _CONSTANTS.TIMEOUT.INTERVAL_TO_PREVENT_CONFLICTS);
    };

    function initToFirstServer() {
        initializeServerIndex();
        updateOldStyleConfigValues();
    }

    function tryRecoveringFromLongPolling() {
        if (useNewStyleConfig && numberOfServers > 1) {
            restartSubscription({newNotificationType: nType.WEBSOCKET, clearConnectionAndNotifiyUser: true, changeServerCallback: initToFirstServer});
        } else {
            restartSubscription({newNotificationType: nType.WEBSOCKET, clearConnectionAndNotifiyUser: true});
        }
    }

    extendNotificationSubscription = function () {
        if (!_fcs.isConnected()) {
            logger.debug("Connection is lost, no need to extend subscribe...");
            return;
        }

        if (hasSubscribed()) {
            if (_fcsConfig.notificationType === nType.WEBSOCKET &&
                    _fcsConfig.currentNotificationType === nType.LONGPOLLING) {
                logger.debug("Try recovering from long polling...");
                tryRecoveringFromLongPolling();
            }
            else {
                sendExtendSubscriptionRequest();
            }
        }
        else {
            logger.debug("Cannot reuse existing subscription, re-subscribing.");
            deviceSubscribe();
        }
    };

    this.stop = function(onStopSuccess, onStopFailure, force) {
        if (!force && !_fcs.isConnected()) {
            logger.debug("Connection is lost, no need to unsubscribe...");
            if (typeof onStopFailure === 'function') {
               onStopFailure(_fcs.Errors.CONNECTION_ISSUE);
            }
            return;
        }

        logger.debug("Unsubscribing... - notifier: ", notifier);
        if (hasSubscribed()) {
            _service.deleteSubscription(notifier.subscriptionURL, function() {
                logger.debug("Unsubscription successfull");

                clearSubscription({resetConnectivity: true});

                if (typeof onStopSuccess === 'function') {
                    onStopSuccess();
                }
            }, function(err) {
                if (force) {
                    logger.debug("Forced Unsubscription successfull");
                    clearSubscription({resetConnectivity: true});
                    if (typeof onStopSuccess === 'function') {
                        onStopSuccess();
                    }
                }
                else {
                    logger.error("Unsubscribe if failed - error:" + err);
                    if (typeof onStopFailure === 'function') {
                        onStopFailure();
                    }
                }
            });
        }
        else {
            logger.trace("subscription URL is unknown, cannot send unsubscribe request.");

            if (typeof onStopSuccess === 'function') {
                onStopSuccess();
            }
        }
    };

    function startExtendNotification(forceLogout) {
        if (!_fcs.isConnected()) {
            logger.debug("Connection is lost, no need to subscribe...");
            return;
        }

        logger.debug("start - notification subscription...");

        var nurl = _cache.getItem(notificationCachePrefix + CACHEIDS.NOTIFYURL),
                nid = _cache.getItem(notificationCachePrefix + CACHEIDS.NOTIFYID),
                surl = _cache.getItem(notificationCachePrefix + CACHEIDS.SUBSCRIBEURL),
                exp = _cache.getItem(notificationCachePrefix + CACHEIDS.SUBSCRIBEEXPIRY),
                extendInterval = _cache.getItem(notificationCachePrefix + CACHEIDS.SUBSCRIBEEXTENDINTERVAL),
                user = _cache.getItem(notificationCachePrefix + CACHEIDS.USERNAME);

        logger.debug("start - cached data - nurl: " + nurl +
                " nid: " + nid + " surl: " + surl +
                " exp: " + exp + " extendInterval: " + extendInterval +" user: " + user);

        if (nurl && nid && surl && exp && extendInterval && (_fcs.getUser() === user)) {
            notifier = {};
            notifier.notificationURL = nurl;
            notifier.notificationId = nid;
            notifier.subscriptionURL = surl;
            _fcsConfig.expires = exp;
            _fcsConfig.extendInterval = extendInterval;

            extendNotificationSubscription();
        }
        else {
            deviceSubscribe(forceLogout);
        }
    }

    function decideNumberOfServers() {
        numberOfServers = _fcsConfig.servers.length;
        logger.debug("Number of servers to be tried: ", numberOfServers);
    }

    function setupConfiguration() {
        if (_fcsConfig.servers) {
            useNewStyleConfig = true;
            decideNumberOfServers();
            initializeServerIndex();
            return updateOldStyleConfigValues();
        }
        return true;
    }

    function setupInternalVariables(onSuccess, onFailure, anonymous, cachePrefix) {
        onSubscriptionSuccess = onSuccess;
        onSubscriptionFailure = onFailure;
        isAnonymous = anonymous;

        if (cachePrefix) {
            notificationCachePrefix = cachePrefix;
        }
    }

    function initializeRequiredConfigVariables() {
        // Default is long polling
        if (!_fcsConfig.notificationType) {
            _fcsConfig.notificationType = nType.LONGPOLLING;
        }

        if (_fcsConfig.notificationType === nType.WEBSOCKET_ONLY) {
            // for server only websocket and longpolling types exist.
            _fcsConfig.currentNotificationType = nType.WEBSOCKET;
        } else {
            _fcsConfig.currentNotificationType = _fcsConfig.notificationType;
        }
        logger.debug("Current notification type is set as: ", _fcsConfig.currentNotificationType);

    }

    this.start = function (onSuccess, onFailure, anonymous, cachePrefix, forceLogout) {
        if (!setupConfiguration()) {
             _utils.callFunctionIfExist(onFailure, _CONSTANTS.NOTIFICATION.STATUS.CONFIGURATION_ERROR);
             return;
        }

        setupInternalVariables(onSuccess, onFailure, anonymous, cachePrefix);
        initializeRequiredConfigVariables();

        startExtendNotification(forceLogout);
    };

    function hasStarted() {
        return _fcsConfig.currentNotificationType;
    }

    this.extend = function (onSuccess, onFailure) {
        if (!hasStarted()) {
            _utils.callFunctionIfExist(onFailure, _CONSTANTS.NOTIFICATION.STATUS.NOT_STARTED);
            return;
        }

        onSubscriptionSuccess = onSuccess;
        onSubscriptionFailure = onFailure;

        startExtendNotification();
    };

    function handleConnectionEstablished() {
        stopStartNotificationTimerAfterConnectionReEstablishedTimer();
        startNotificationTimerAfterConnectionReEstablished = setTimeout(function() {
            startExtendNotification();
            if (_fcs.isConnected()) {
                _utils.callFunctionIfExist(onConnectionEstablished);
            }
        }, Math.random() * _CONSTANTS.TIMEOUT.INTERVAL_TO_PREVENT_CONFLICTS);
    }

    function handleConnectionLost() {
        stopTimers();
        _notificationManager.clearConnection();
        _utils.callFunctionIfExist(onConnectionLost);
    }

    this.setOnConnectionLost = function(callback) {
        onConnectionLost = callback;
    };

    this.setOnConnectionEstablished = function(callback) {
        onConnectionEstablished = callback;
    };

    this.setOnError = function (callback) {
        notificationErrorCallback = callback;
    };

    this.getNotificationId = function () {
        if (notifier) {
            return notifier.notificationId;
        }
    };

    _notificationManager.setNotificationFailureCallback({callback : notificationFailureHandler});

    this.setOnSuccess = function (callback) {
        notificationSuccessAfterErrorCallback = callback;
    };

    _notificationManager.setNotificationSuccessAfterFailureCallback({callback : function () {
        logger.debug("notification success after notification failure.");
        _utils.callFunctionIfExist(notificationSuccessAfterErrorCallback);
    }});

    this.trigger = function() {
        logger.debug("Trigger called to fetch notification.");
        _notificationManager.trigger({notificationUrl:notifier.notificationURL});
    };

    function handleGoneNotification(data) {
        clearSubscription();
        clearUserNamePasswordFromCache();
        _utils.callFunctionIfExist(_fcs.notification.onGoneReceived, data);
    }

    function handleTokenOrSessionLoss() {
        clearSubscription();
        clearUserNamePasswordFromCache();
       _utils.callFunctionIfExist(onSubscriptionFailure, _CONSTANTS.SUBSCRIPTION_EVENT.TOKEN_OR_SESSION_LOSS);
    }

    _notificationCallBacks.gone = function (data) {
        handleGoneNotification(data);
    };

    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.CONNECTION_REESTABLISHED, handleConnectionEstablished);
    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.CONNECTION_LOST, handleConnectionLost);
    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.TOKEN_AUTH_STARTED, onTokenAuth, 10);
    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.TOKEN_NOT_FOUND, handleTokenOrSessionLoss);
    _globalBroadcaster.subscribe(_CONSTANTS.EVENT.SESSION_EXPIRED, handleTokenOrSessionLoss);



};

//@{fcs-jsl-prod}
var SubscriptionManager = function (_fcsConfig, _fcs, _service, _logManager, _globalBroadcaster, _cache, _notificationManager, _utils, _CONSTANTS, _notificationCallBacks) {
    return new SubscriptionManagerImpl(_fcsConfig || fcsConfig,
            _fcs || fcs,
            _service || subscriptionService,
            _logManager || logManager,
            _globalBroadcaster || globalBroadcaster,
            _cache || cache,
            _notificationManager || notificationManager,
            _utils || utils,
            _CONSTANTS || CONSTANTS,
            _notificationCallBacks || NotificationCallBacks);
};

var subscriptionManager = new SubscriptionManager();

if (__testonly__) { __testonly__.SubscriptionManager = SubscriptionManager; }
if (__testonly__) { fcs.SubscriptionManager = subscriptionManager; }
//@{fcs-jsl-prod}


/**
 * Manages a user's subscriptions to remote notifications.  A user may subscribe to specific
 * event types (calls, instant messages, presence updates) using websocket or long polling.
 *
 * Note that call/im/presence event handlers must be assigned in other objects before calling
 * notificationSubscribe/extendNotificationSubscription.
 *
 * @name notification
 * @namespace
 * @memberOf fcs
 *
 * @version 3.1.3.45
 * @since 3.0.0
 *
 * @see fcs.config.notificationType
 * @see fcs.im.onReceived
 * @see fcs.call.onReceived
 * @see fcs.presence.onReceived
 *
 */
var NotificationImpl = function(_manager) {
    /**
     * Called on receipt of a 410 GONE message
     *
     * @name fcs.notification.onGoneReceived
     * @event
     *
     * @since 3.0.0
     *
     * @example
     * var goneReceived = function(data){
     *    // do something here
     * };
     *
     * fcs.notification.onGoneReceived = goneReceived;
     */
    this.onGoneReceived = null;

    /**
     * Enum for notification types.
     *
     * @name NotificationTypes
     * @property {string} LONGPOLLING Long polling type
     * @property {string} WEBSOCKET WebSocket type
     * @property {string} WEBSOCKET_ONLY WebSocketOnly type
     * @readonly
     * @memberOf fcs.notification
     */
    this.NotificationTypes = {
        LONGPOLLING: "longpolling",
        WEBSOCKET: "websocket",
        WEBSOCKET_ONLY : "websocketonly"
    };

    /**
     * Boolean for anonymous users.
     * Used by rest requests to determine some parameters at URL and body).
     *
     * @name isAnonymous
     * @return isAnonymous true if the user is anonymous
     * @since 3.0.0
     * @memberOf fcs.notification
     */
    this.isAnonymous = function() {
        return _manager.isAnonymous();
    };

    /**
     * Unsubscribe from getting notifications
     *
     * @name fcs.notification.stop
     * @param {function} onSuccess Success callback
     * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
     * @param {boolean} [force] if true, success callback will be called ignoring all failures etc...
     * @function
     * @since 3.0.0
     * @example
     * fcs.notification.stop(
     * //Success callback
     * function(){
     *     window.console.log("Notification system is stopped successfully!!")
     * },
     * //Failure callback
     * function(){
     *     window.console.log("Something Wrong Here!!!")
     * }
     * );
     */
    this.stop = function(onSuccess, onFailure, force) {
        _manager.stop(onSuccess, onFailure, force);
    };

    /**
     * Subscribe and fetch the notifications <BR />
     * NOTE: Before subscribing, you have to set handlers for received notification. Only handlers registered before starting the notification will receive events.
     * @name fcs.notification.start
     * @param {function} onSuccess Success callback
     * @param {function} onFailure Failure callback
     * @param {boolean} anonymous Is this an anonymous
     * @param {string} cachePrefix Prefix of the cache key to be used (this allows for multiple subscriptions)
     * @param {string} forceLogout Kills the session of the oldest device.(For more information : User Guide Demo Examples in Api Doc )
     * @function
     *
     * @since 3.0.0
     *
     * @example
     *
     * //Sets up connection and notification types
     * fcs.setup({
     *        "restUrl": "&lt;rest_url&gt;",
     *        "restPort": "rest_port",
     *        "websocketIP": "&lt;websocket_ip&gt;",
     *        "websocketPort": "&lt;websocket_port&gt;",
     *        "notificationType": "websocket",
     *        "callAuditTimer": "30000",
     *        "clientControlled" : true,
     *        "protocol" : "http",
     *        "serverProvidedTurnCredentials": "false"
     *});
     *
     * // Login
     * // User must login SPiDR to be able to receive and make calls
     * // Login includes authentication and subscription steps. After logging in you can receive notifications
     * // Provide username and password to the setUserAuth method
     * var incomingCall,outgoingCall;
     * fcs.setUserAuth("user@somedomain.com","password");
     * fcs.notification.start(function(){
     *       //Initialize media
     *       fcs.call.initMedia(function(){},function(){},{
     *                 "pluginLogLevel" : 2,
     *                 "videoContainer" : "",
     *                 "pluginMode" : "auto",
     *                 "iceserver" : [{"url":"stun:206.165.51.23:3478"}]
     *             });
     *       fcs.call.onReceived = function(call) {
     *       //Handle incoming notifications here (incomingCall, callEnd, etc.)
     *       //window.alert("incoming call");
     *       //call.onStateChange(state);
     *       //call.onStreamAdded(streamURL);
     *       incomingCall=call;
     *     }
     * },
     * function(){
     * window.console.log("Something Wrong Here!!!")
     * },
     * false,false,false
     * );
     *
     */
    this.start = function(onSuccess, onFailure, anonymous, cachePrefix ,forceLogout) {
        _manager.start(onSuccess, onFailure, anonymous, cachePrefix ,forceLogout);
    };

    /**
     * Extending subscription and fetch the notifications
     *
     * @name fcs.notification.extend
     * @param {function} onSuccess Success callback
     * @param {function} onFailure Failure callback
     * @function
     */
    this.extend = function(onSuccess, onFailure) {
        _manager.extend(onSuccess, onFailure);
    };

    /**
     * Sets the notification error handler.
     *
     * @name fcs.notification.setOnError
     * @param {function(error)} callback The failure callback to be called.
     * @function
     * @since 3.0.0
     */
    this.setOnError = function(callback) {
        _manager.setOnError(callback);
    };

    /**
     * Sets the notification success handler.
     *
     * @name fcs.notification.setOnSuccess
     * @param {function} callback The success callback to be called.
     * @function
     * @since 3.0.0
     */
    this.setOnSuccess = function(callback) {
        _manager.setOnSuccess(callback);
    };

    /**
     * Sets the connection lost handler.
     *
     * @name fcs.notification.setOnConnectionLost
     * @function
     * @since 3.0.0
     */
    this.setOnConnectionLost = function(callback) {
        _manager.setOnConnectionLost(callback);
    };

    /**
     * Sets the connection established handler.
     *
     * @name fcs.notification.setOnConnectionEstablished
     * @function
     * @since 3.0.0
     */
    this.setOnConnectionEstablished = function(callback) {
        _manager.setOnConnectionEstablished(callback);
    };

    /**
     * @deprecated
     * Will be used by external triggers to fetch notifications.
     *
     * @name fcs.notification.trigger
     * @function
     * @since 3.0.0
     * @example
     *
     * fcs.notification.start();
     *
     * //Native code received SNMP Trigger so retrieve the notification
     *
     * fcs.notification.trigger();
     *
     */
    this.trigger = function() {
        _manager.trigger();
    };
};

//@{fcs-jsl-prod}
var NotificationInt = function(_manager) {
    return new NotificationImpl(_manager || subscriptionManager);
};

fcs.notification = new NotificationInt(subscriptionManager);

if (__testonly__) { __testonly__.Notification = NotificationInt; }
//@{fcs-jsl-prod}


/*
 * Finite State machine that defines state transition of basic call model.
 * State machine fires events during state transitions.
 * Components should register to FSM  in order to receive transition events
 *
 */

var CallFSMImpl = function(_logManager) {

    this.CallFSMState = {
        INIT: "INIT",
        RINGING: "RINGING",
        TRYING: "TRYING",
        ANSWERING : "ANSWERING",
        COMPLETED: "COMPLETED",
        RINGING_SLOW: "RINGING_SLOW",
        LOCAL_HOLD: "LOCAL_HOLD",
        LOCAL_HOLDING: "LOCAL_HOLDING",
        LOCAL_UNHOLDING: "LOCAL_UNHOLDING",
        LOCAL_VIDEO_STOP_START: "LOCAL_VIDEO_STOP_START",
        REMOTE_OFFER: "REMOTE_OFFER",
        REMOTE_HOLD: "REMOTE_HOLD",
        REMOTE_HOLDING: "REMOTE_HOLDING",
        REMOTE_UNHOLDING: "REMOTE_UNHOLDING",
        BOTH_HOLD: "BOTH_HOLD",
        JOINING: "JOINING",
        PROVISIONRECEIVED: "PROVISIONRECEIVED",
        REFER: "REFER",
        TRANSFERING: "TRANSFERING",
        LOCAL_SLOW_START_OFFER: "LOCAL_SLOW_START_OFFER",
        LOCAL_REOFFER: "LOCAL_REOFFER"
    };

    //CallFSM returns TransferEvent after state change
    this.TransferEvent = {
        unknownNotification_fsm: "unknownNotification_fsm",
        ignoredNotification_fsm: "ignoredNotification_fsm",
        callStart_fsm: "callStart_fsm",
        callReceived_fsm: "callReceived_fsm",
        answer_fsm: "answer_fsm",
        reject_GUI: "reject_GUI",
        callCompleted_fsm: "callCompleted_fsm",
        noAnswer_fsm: "noAnswer_fsm",
        localEnd_fsm: "localEnd_fsm",
        remoteEnd_fsm: "remoteEnd_fsm",
        answeringRingingSlow_fsm: "answeringRingingSlow_fsm",
        callCompletedAnswering_fsm: "callCompletedAnswering_fsm",
        localHold_fsm: "localHold_fsm",
        localHolding_fsm: "localHolding_fsm",
        remoteHold_fsm: "remoteHold_fsm",
        remoteHolding_fsm: "remoteHolding_fsm",
        localUnHold_fsm: "localUnHold_fsm",
        localUnHolding_fsm: "localUnHolding_fsm",
        remoteUnHold_fsm: "remoteUnHold_fsm",
        remoteUnHolding_fsm: "remoteUnHolding_fsm",
        localVideoStopStart_fsm: "localVideoStopStart_fsm",
        remoteOffer_fsm: "remoteOffer_fsm",
        joining_fsm: "joining_fsm",
        sessionComplete_fsm: "sessionComplete_fsm",
        joiningSuccess_fsm: "joiningSuccess_fsm",
        sessionFail_fsm: "sessionFail_fsm",
        ringing_fsm: "ringing_fsm",
        respondCallUpdate_fsm: "respondCallUpdate_fsm",
        remoteCallUpdate_fsm: "remoteCallUpdate_fsm",
        remotePranswer_fsm: "remotePranswer_fsm",
        forward_fsm: "forward_fsm",
        refer_fsm: "refer_fsm",
        accepted_fsm: "accepted_fsm",
        transfering_fsm: "transfering_fsm",
        transferSuccess_fsm: "transferSuccess_fsm",
        transferFail_fsm: "transferFail_fsm",
        respondCallHoldUpdate_fsm: "respondCallHoldUpdate_fsm",
        remoteOfferDuringLocalHold_fsm: "remoteOfferDuringHold_fsm",
        renegotiationCompleted_fsm: "renegotiationCompleted_fsm",
        slowStartOfferDuringRemoteHold_fsm : "slowStartOfferDuringRemoteHold_fsm",
        slowStartOfferDuringOnCall_fsm: "slowStartOfferDuringOnCall_fsm",
        stateReverted_fsm: "stateReverted_fsm",
        glareCondition_fsm: "glareCondition_fsm",
        slowStartOfferProcessed_fsm : "slowStartOfferProcessed_fsm",
        performReconnectWorkaround_fsm: "performReconnectWorkaround_fsm",
        consultativeTransfer_fsm: "consultativeTransfer_fsm",
        performCreateNewPeerWorkaround_fsm: "performCreateNewPeerWorkaround_fsm"

    };

    //CallFSM receives NotificationEvent
    this.NotificationEvent = {
        callStart_GUI: "callStart_GUI",
        callNotify: "callNotify",
        ringing_Notify: "ringing_Notify",
        answer_GUI: "answer_GUI",
        end_GUI: "end_GUI",
        respondCallUpdate_Notify: "respondCallUpdate_Notify",
        respondCallUpdate_glareCondition_Notify: "respondCallUpdate_glareCondition_Notify",
        callCompleted_fsm: "callCompleted_fsm",
        callEnd_Notify: "callEnd_Notify",
        callNotify_noSDP: "callNotify_noSDP",
        startCallUpdate_slowStart_Notify: "startCallUpdate_slowStart_Notify",
        startCallUpdate_remoteHold_Notify: "startCallUpdate_remoteHold_Notify",
        startCallUpdate_remoteOffer_Notify: "startCallUpdate_remoteOffer_Notify",
        joining_Notify: "joining_Notify",
        sessionComplete_Notify: "sessionComplete_Notify",
        joiningSuccess_Notify: "joiningSuccess_Notify",
        sessionFail_Notify: "sessionFail_Notify",
        hold_GUI: "hold_GUI",
        unhold_GUI: "unhold_GUI",
        videoStopStart_GUI: "videoStopStart_GUI",
        sessionProgress: "sessionProgress",
        callCancel_Notify: "callCancel_Notify",
        forward_GUI: "forward_GUI",
        refer_JSL: "refer_JSL",
        accepted_Notify: "accepted_Notify",
        transfering: "transfering",
        requestFailure_JSL: "requestFailure_JSL",
        webrtcFailure_JSL: "webrtcFailure_JSL",
        remoteOfferProcessed_JSL: "remoteOfferProcessed_JSL",
        remoteHoldProcessed_JSL: "remoteHoldProcessed_JSL",
        remoteUnHoldProcessed_JSL: "remoteUnHoldProcessed_JSL",
        slowStartOfferProcessed_JSL: "slowStartOfferProcessed_JSL",
        performReconnectWorkaround_JSL: "performReconnectWorkaround_JSL",
        consultativeTransfer_GUI: "consultativeTransfer_GUI",
        performCreateNewPeerWorkaround_JSL: "performCreateNewPeerWorkaround_JSL",
        revertState_JSL: "revertState_JSL"
    };
    var self = this, logger = _logManager.getLogger("callFsm");

    function FSM (call, event, onSuccess, onFailure) {
        var callState = self.getCurrentState(call);
        switch (callState) {
            case self.CallFSMState.INIT:
                switch (event) {
                    case self.NotificationEvent.callStart_GUI:
                        call.currentState = self.CallFSMState.TRYING;
                        onSuccess(call, self.TransferEvent.callStart_fsm);
                        break;
                    case self.NotificationEvent.callNotify:
                        call.currentState = self.CallFSMState.RINGING;
                        onSuccess(call, self.TransferEvent.callReceived_fsm);
                        break;
                    case self.NotificationEvent.callNotify_noSDP:
                        call.currentState = self.CallFSMState.RINGING_SLOW;
                        onSuccess(call, self.TransferEvent.callReceived_fsm);
                        break;
                    case self.NotificationEvent.joiningSuccess_Notify:
                        call.currentState = self.CallFSMState.PROVISIONRECEIVED;
                        onSuccess(call, self.TransferEvent.joiningSuccess_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.RINGING:
                switch (event) {
                    case self.NotificationEvent.answer_GUI:
                        call.currentState = self.CallFSMState.COMPLETED;
                        onSuccess(call, self.TransferEvent.answer_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.reject_GUI);
                        break;
                    case self.NotificationEvent.callNotify_noSDP:
                        call.currentState = self.CallFSMState.RINGING_SLOW;
                        onSuccess(call, self.TransferEvent.callReceived_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                    case self.NotificationEvent.callCancel_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.forward_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.forward_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.RINGING_SLOW:
                switch (event) {
                    case self.NotificationEvent.answer_GUI:
                        call.currentState = self.CallFSMState.ANSWERING;
                        onSuccess(call, self.TransferEvent.answerRingingSlow_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.reject_GUI);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                    case self.NotificationEvent.callCancel_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.forward_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.forward_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.ANSWERING:
                switch (event) {
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.COMPLETED;
                        onSuccess(call, self.TransferEvent.callCompletedAnswering_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.TRYING:
                switch (event) {
                    case self.NotificationEvent.sessionProgress:
                        call.currentState = self.CallFSMState.PROVISIONRECEIVED;
                        onSuccess(call, self.TransferEvent.remotePranswer_fsm);
                        break;
                    case self.NotificationEvent.ringing_Notify:
                        call.currentState = self.CallFSMState.PROVISIONRECEIVED;
                        onSuccess(call, self.TransferEvent.ringing_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.noAnswer_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.COMPLETED;
                        onSuccess(call, self.TransferEvent.callCompleted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.PROVISIONRECEIVED:
                switch (event) {
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.COMPLETED;
                        onSuccess(call, self.TransferEvent.callCompleted_fsm);
                        break;
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.ringing_Notify:
                        onSuccess(call, self.TransferEvent.ringing_fsm);
                        break;
                    case self.NotificationEvent.sessionProgress:
                        onSuccess(call, self.TransferEvent.remotePranswer_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.COMPLETED:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.REMOTE_HOLDING;
                        onSuccess(call,self.TransferEvent.remoteHolding_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_slowStart_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_SLOW_START_OFFER;
                        onSuccess(call,self.TransferEvent.slowStartOfferDuringOnCall_fsm);
                        break;
                    case self.NotificationEvent.hold_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_HOLDING;
                        onSuccess(call,self.TransferEvent.localHolding_fsm);
                        break;
                    case self.NotificationEvent.videoStopStart_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_VIDEO_STOP_START;
                        onSuccess(call,self.TransferEvent.localVideoStopStart_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.REMOTE_OFFER;
                        onSuccess(call,self.TransferEvent.remoteOffer_fsm);
                        break;
                    case self.NotificationEvent.transfering:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.TRANSFERING;
                        onSuccess(call, self.TransferEvent.transfering_fsm);
                        break;
                    case self.NotificationEvent.callCancel_Notify:
                        onSuccess(call, self.TransferEvent.ignoredNotification_fsm);
                        break;
                    case self.NotificationEvent.performReconnectWorkaround_JSL:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_REOFFER;
                        onSuccess(call,self.TransferEvent.performReconnectWorkaround_fsm);
                        break;
                    case self.NotificationEvent.performCreateNewPeerWorkaround_JSL:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_REOFFER;
                        onSuccess(call,self.TransferEvent.performCreateNewPeerWorkaround_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_REOFFER:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call,self.TransferEvent.respondCallUpdate_fsm);
                        break;
                    case self.NotificationEvent.webrtcFailure_JSL:
                    case self.NotificationEvent.requestFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REMOTE_OFFER:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.remoteOfferProcessed_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call,self.TransferEvent.renegotiationCompleted_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_VIDEO_STOP_START:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call,self.TransferEvent.respondCallUpdate_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_glareCondition_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.glareCondition_fsm);
                       break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_HOLDING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.LOCAL_HOLD;
                        if (call.previousState === self.CallFSMState.REMOTE_HOLD) {
                            call.currentState=self.CallFSMState.BOTH_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call,self.TransferEvent.respondCallHoldUpdate_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_glareCondition_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.glareCondition_fsm);
                       break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_UNHOLDING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.currentState = self.CallFSMState.COMPLETED;
                        if (call.previousState === self.CallFSMState.BOTH_HOLD) {
                            call.currentState=self.CallFSMState.REMOTE_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call,self.TransferEvent.respondCallHoldUpdate_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_glareCondition_Notify:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.glareCondition_fsm);
                       break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_HOLD:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.REMOTE_HOLDING;
                        onSuccess(call, self.TransferEvent.remoteHolding_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        onSuccess(call, self.TransferEvent.remoteOfferDuringLocalHold_fsm);
                        break;
                    case self.NotificationEvent.unhold_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_UNHOLDING;
                        onSuccess(call,self.TransferEvent.localUnHolding_fsm);
                        break;
                    case self.NotificationEvent.joining_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.JOINING;
                        onSuccess(call,self.TransferEvent.joining_fsm);
                        break;
                    case self.NotificationEvent.transfering:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.TRANSFERING;
                        onSuccess(call, self.TransferEvent.transfering_fsm);
                        break;
                    case self.NotificationEvent.performReconnectWorkaround_JSL:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_REOFFER;
                        onSuccess(call,self.TransferEvent.performReconnectWorkaround_fsm);
                        break;
                    case self.NotificationEvent.consultativeTransfer_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.TRANSFERING;
                        onSuccess(call,self.TransferEvent.transfering_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REMOTE_HOLDING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.remoteHoldProcessed_JSL:
                        call.currentState = self.CallFSMState.REMOTE_HOLD;
                        if (call.previousState === self.CallFSMState.LOCAL_HOLD) {
                            call.currentState=self.CallFSMState.BOTH_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call,self.TransferEvent.remoteHold_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REMOTE_UNHOLDING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.remoteUnHoldProcessed_JSL:
                        call.currentState = self.CallFSMState.COMPLETED;
                        if (call.previousState === self.CallFSMState.BOTH_HOLD) {
                            call.currentState=self.CallFSMState.LOCAL_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call,self.TransferEvent.remoteUnHold_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REMOTE_HOLD:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.REMOTE_HOLDING;
                        onSuccess(call, self.TransferEvent.remoteHolding_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.REMOTE_UNHOLDING;
                        onSuccess(call, self.TransferEvent.remoteUnHolding_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_slowStart_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_SLOW_START_OFFER;
                        onSuccess(call,self.TransferEvent.slowStartOfferDuringRemoteHold_fsm);
                        break;
                    case self.NotificationEvent.hold_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_HOLDING;
                        onSuccess(call,self.TransferEvent.localHolding_fsm);
                        break;
                    case self.NotificationEvent.joining_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.JOINING;
                        onSuccess(call,self.TransferEvent.joining_fsm);
                        break;
                    case self.NotificationEvent.performReconnectWorkaround_JSL:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_REOFFER;
                        onSuccess(call,self.TransferEvent.performReconnectWorkaround_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.BOTH_HOLD:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.REMOTE_UNHOLDING;
                        onSuccess(call, self.TransferEvent.remoteUnHolding_fsm);
                        break;
                    case self.NotificationEvent.unhold_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_UNHOLDING;
                        onSuccess(call,self.TransferEvent.localUnHolding_fsm);
                        break;
                    case self.NotificationEvent.joining_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.JOINING;
                        onSuccess(call,self.TransferEvent.joining_fsm);
                        break;
                    case self.NotificationEvent.transfering:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.TRANSFERING;
                        onSuccess(call, self.TransferEvent.transfering_fsm);
                        break;
                    case self.NotificationEvent.performReconnectWorkaround_JSL:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_REOFFER;
                        onSuccess(call,self.TransferEvent.performReconnectWorkaround_fsm);
                        break;
                    case self.NotificationEvent.consultativeTransfer_GUI:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.TRANSFERING;
                        onSuccess(call,self.TransferEvent.transfering_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_slowStart_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.LOCAL_SLOW_START_OFFER;
                        onSuccess(call,self.TransferEvent.slowStartOfferDuringRemoteHold_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_SLOW_START_OFFER:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.respondCallUpdate_Notify:
                        call.previousState = call.currentState;
                        call.currentState=self.CallFSMState.COMPLETED;
                        onSuccess(call,self.TransferEvent.respondCallUpdate_fsm);
                        break;
                    case self.NotificationEvent.requestFailure_JSL:
                    case self.NotificationEvent.webrtcFailure_JSL:
                        call.currentState=call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    case self.NotificationEvent.slowStartOfferProcessed_JSL:
                        onSuccess(call, self.TransferEvent.slowStartOfferProcessed_fsm);
                    break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.JOINING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.sessionComplete_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.sessionComplete_fsm);
                        break;
                    case self.NotificationEvent.sessionFail_Notify:
                        call.currentState = call.previousState;
                        onSuccess(call, self.TransferEvent.sessionFail_fsm);
                        break;
                    case self.NotificationEvent.refer_JSL:
                        call.currentState = self.CallFSMState.REFER;
                        onSuccess(call, self.TransferEvent.refer_fsm);
                        break;
                    case self.NotificationEvent.revertState_JSL:
                        call.currentState = call.previousState;
                        onSuccess(call, self.TransferEvent.stateReverted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REFER:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.sessionComplete_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.sessionComplete_fsm);
                        break;
                    case self.NotificationEvent.sessionFail_Notify:
                        call.currentState = call.previousState;
                        onSuccess(call, self.TransferEvent.sessionFail_fsm);
                        break;
                    //TODO Tolga - talk with lale
                    case self.NotificationEvent.accepted_Notify:
                        onSuccess(call, self.TransferEvent.accepted_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
           case self.CallFSMState.TRANSFERING:
                switch (event) {
                    case self.NotificationEvent.end_GUI:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.localEnd_fsm);
                        break;
                    case self.NotificationEvent.callEnd_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.remoteEnd_fsm);
                        break;
                    case self.NotificationEvent.sessionComplete_Notify:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.transferSuccess_fsm);
                        break;
                    case self.NotificationEvent.sessionFail_Notify:
                        call.currentState = call.previousState;
                        onSuccess(call, self.TransferEvent.transferFail_fsm);
                        break;
                        //TODO this notification is consumed for now - it is there for completeness
                    case self.NotificationEvent.accepted_Notify:
                        onSuccess(call, self.TransferEvent.accepted_fsm);
                        break;
                    case self.NotificationEvent.startCallUpdate_slowStart_Notify:
                    case self.NotificationEvent.startCallUpdate_remoteHold_Notify:
                    case self.NotificationEvent.startCallUpdate_remoteOffer_Notify:
                        // Some client send hold during transfer
                        onSuccess(call, self.TransferEvent.remoteCallUpdate_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
        }
    }

    self.getCurrentState = function(call){
        return (call.currentState ? call.currentState : self.CallFSMState.INIT);
    };

    this.handleEvent = function(call, event, handler) {
        var initialCallState;
        if (call) {
            initialCallState = self.getCurrentState(call);
            logger.info("FSM received NotificationEvent: " + event + " @ " +
                    initialCallState + " state" + ". Call Id: " + call.id);

            FSM(call, event,
                function(call, transferEvent) {
                    logger.debug("FSM handleEvent successful. (Call FSM) State Passed from " +
                            initialCallState + " to " +
                            self.getCurrentState(call) + ". TransferEvent: " +
                            transferEvent + ". Call Id: " + call.id);
                    handler(call, transferEvent);
                },
                function(call, transferEvent) {
                    logger.error("FSM handleEvent failure: " + transferEvent +
                            " @ " + self.getCurrentState(call) + ". Call Id: " +
                            call.id);
                    handler(call, transferEvent);
                });
        }
    };
};

//@{fcs-jsl-prod}
var CallFSM = function(_logManager) {
    return new CallFSMImpl(_logManager || logManager);
};

var callFSM = new CallFSM();

if (__testonly__) { __testonly__.CallFSM = CallFSM; }
//@{fcs-jsl-prod}


var CallControlServiceImpl = function(_server, _logManager, _cache, _fcs, _fcsConfig, _getWAMUrl) {

    var logger = _logManager.getLogger("callControlService");

    function addNotificationChannel(data){
        if(_fcs.notification.isAnonymous() && _cache.getItem("NotificationId")) {
            data.callMeRequest.notifyChannelId = _cache.getItem("NotificationId");
        }
    }

    function errorParser(jqXHR){
        if (jqXHR && jqXHR.responseText) {
            return JSON.parse(jqXHR.responseText).callControlResponse;
        }
    }

    this.startCall = function(from, to, sdp, onSuccess, onFailure) {

        logger.info("Call Start Function: " + from + " --> " + to);
        logger.info("Call Start Function: sdp : " + sdp);

        // response of the startCall contains callid/sessionData
        // callMe and callControl returns same response but object types have different namse
        function parseCallStart(data){
            var callid, response = _fcs.notification.isAnonymous() ? data.callMeResponse:data.callControlResponse;
            if(response){
                callid = response.sessionData;
            }
            return callid;
        }

        function dataType() {
            var data;
            if (_fcs.notification.isAnonymous()) {
                data = {
                    "callMeRequest":
                    {
                        "type":"callStart",
                        "from": from,
                        "to": to,
                        "sdp": sdp
                    }
                };
            }
            else {
                data = {
                    "callControlRequest":
                    {
                        "type":"callStart",
                        "from": from,
                        "to": to,
                        "sdp": sdp
                    }
                };

                if (_fcsConfig.earlyMedia === true) {
                    data.callControlRequest.supported = ["earlymedia"];
                }
            }
            return data;
        }

        var data = dataType();
        addNotificationChannel(data);

        _server.sendPostRequest({
            "url": _getWAMUrl(1, _fcs.notification.isAnonymous() ? "/callMe" : "/callControl"),
            "data": data
        },
        onSuccess,
        onFailure,
        parseCallStart,
        errorParser
        );
    };

    this.audit = function(callid, onSuccess, onFailure){
        var data;

           if (_fcs.notification.isAnonymous()) {
                data = {
                    "callMeRequest":
                    {
                        "type":"audit"
                    }
                };
            }
            else {
                data = {
                    "callControlRequest":
                    {
                        "type":"audit"
                    }
                };
            }

        _server.sendPutRequest({
            "url": _getWAMUrl(1, _fcs.notification.isAnonymous() ? "/callme/callSessions/" : "/callControl/callSessions/") + callid,
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.hold = function(callid , sdp , onSuccess , onFailure){
        logger.info("Hold Function : sdp : " + sdp);
        var data = {
            "callControlRequest":
            {
                "type":"startCallUpdate",
                "sdp": sdp
            }
        };

        _server.sendPutRequest({
            "url": _getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.unhold = function(callid , sdp , onSuccess , onFailure){
        logger.info("UnHold Function : sdp : " + sdp);
        var data = {
            "callControlRequest":
            {
                "type":"startCallUpdate",
                "sdp": sdp
            }
        };
        _server.sendPutRequest({
            "url": _getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.reinvite = function(callid , sdp , onSuccess , onFailure){
        logger.info("reinvite Function : sdp : " + sdp);

        var data = {
            "callControlRequest":
            {
                "type":"startCallUpdate",
                "sdp": sdp
            }
        };

        _server.sendPutRequest({
            "url": _getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.respondCallUpdate = function(callid , sdp , onSuccess , onFailure){
        logger.info("Respond Call Update Function : sdp : " + sdp);
        var data = {
            "callControlRequest":
            {
                "type":"respondCallUpdate",
                "sdp": sdp
            }
        };
        _server.sendPutRequest({
            "url": _getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.join = function (firstSessionData , secondSessionData , sdp , onSuccess , onFailure){
        logger.info("Join Function : sdp : " + sdp);
        function parseJoin(data){
            var callid, response = data.callControlResponse;

            if(response){
                callid = response.sessionData;
            }

            return callid;
        }

        var data = {
            "callControlRequest":
            {
                "type":"join",
                "firstSessionData":firstSessionData,
                "secondSessionData":secondSessionData,
                "sdp": sdp
            }
        };

        if(_fcsConfig.clientControlled === "true") {
            data.callControlRequest.clientControlled = "true";
        }


        _server.sendPostRequest({
            "url": _getWAMUrl(1, "/callControl/"),
            "data": data
        },
        onSuccess,
        onFailure,
        parseJoin,
        errorParser
        );
    };

    this.refer = function(callid, referTo, referredBy, onSuccess , onFailure){
        logger.info("Refer Function : refer to: " + referTo);
        var data = {
            "callControlRequest":
            {
                "type": "refer",
                "from": referredBy,
                "to": referTo
            }
        };

        _server.sendPutRequest({
            "url": _getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    function makeCallControlRequest(type, callid , sdp, onSuccess, onFailure) {
        logger.info("makeCallControlRequest Function : sdp : " + sdp);
        var data = {
            "callControlRequest":{
                "type": type,
                "sdp": sdp
            }
        };

        _server.sendPutRequest({
            "url": _getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    }

    function makeCallControlEndRequest(callid, onSuccess, onFailure) {
        logger.info("makeCallControlEndRequest Function: " + callid);

        _server.sendDeleteRequest({
            "url": _getWAMUrl(1, _fcs.notification.isAnonymous() ? "/callMe/callSessions/" : "/callControl/callSessions/") + callid,
            "data":{}
        },
        onSuccess,
        onFailure,
        null,
        errorParser
        );
    }

    this.endCall = function(callid, onSuccess, onFailure) {
        logger.info("endCall Function: " + callid);
        makeCallControlEndRequest(callid, onSuccess, onFailure, null, errorParser);
    };

    this.answerCall = function(callid, sdp, onSuccess, onFailure) {
        logger.info("Answer Call Function : sdp : " + sdp);
        makeCallControlRequest("callAnswer", callid, sdp, onSuccess, onFailure, null, errorParser);
    };

    function makeRequest(action, sessionData, onSuccess, onFailure, address) {
        logger.info("makeRequest Function with action : " + action);
        var data = {
            "callDispositionRequest":{
                "action": action,
                "sessionData": sessionData
            }
        };
        if(address){
            data.callDispositionRequest.address = address;
        }
        _server.sendPostRequest({
            "url": _getWAMUrl(1, "/calldisposition"),
            "data":data
        },
        onSuccess,
        onFailure,
        null,
        errorParser
        );
    }

    this.reject = function(callid, onSuccess, onFailure) {
        var dummy;
        logger.info("Reject Function: " + callid);
        makeRequest("reject", callid, onSuccess, onFailure, dummy, errorParser);
    };


    this.forward = function(callid, address , onSuccess, onFailure) {
        logger.info("Forward Function : address: " + address);
        makeRequest("forward", callid, onSuccess, onFailure, address);
    };

   this.transfer = function(callid , address ,sessiondataToTransfer , onSuccess , onFailure ){
        logger.info("Call Transfer Function : target address: " + address);
        var data = {
            "callControlRequest":
            {
                "type":"transfer",
                "address": address,
                "sessionData":sessiondataToTransfer
            }
        };

        _server.sendPutRequest({
            "url": _getWAMUrl(1, "/callControl/callSessions/" + callid),
            "data": data
        }, onSuccess, onFailure, null, errorParser);
    };

    this.clickToCall = function(callingParty, calledParty, onSuccess, onFailure) {
        var data = {
            "clickToCallRequest":
            {
                "callingParty": callingParty,
                "calledParty": calledParty
            }
        };
        _server.sendPostRequest({
            "url": _getWAMUrl(1, "/clicktocall"),
            "data": data
        },
        onSuccess,
        onFailure
        );
    };

    this.getIMRN = function(realm, source, destination, onSuccess, onFailure) {
        logger.info("(Wam Call) getIMRN Function ");

        function parseIMRNResponse(IMRNdata) {
            var receivedIMRN;
            if (IMRNdata && IMRNdata.imrnResponse) {
                receivedIMRN = utils.getProperty(IMRNdata.imrnResponse, 'imrn');
            }
            return receivedIMRN;
        }

        if(destination.match('@')){
         if(destination.split(':')[0]!=="sip"){
            destination = "sip:" + destination;
            }
        }

        var data = {
            "imrnRequest":{
                "realm": realm,
                "sourceAddress": source,
                "destinationAddress": destination
            }
        };
        _server.sendPostRequest({
            "url": _getWAMUrl(1, "/imrn"),
            "data": data
        },
        onSuccess,
        onFailure,
        parseIMRNResponse
        );
    };

};

//@{fcs-jsl-prod}
var CallControlService = function(_server, _logManager, _cache, _fcs, _fcsConfig, _getWAMUrl) {
    return new CallControlServiceImpl(_server || server,
                                      _logManager || logManager,
                                      _cache || cache,
                                      _fcs || fcs,
                                      _fcsConfig || fcsConfig,
                                      _getWAMUrl || getWAMUrl);
};

var callControlService = new CallControlService();
//@{fcs-jsl-prod}

var CallManagerImpl = function(_webRtcManager, _callFSM, _callControlService,_sdpParser, _logManager, _globalBroadcaster, _utils, _fcs) {

    /* AUDIT_KICKOFF_TIMEOUT is the interval we use to kickoff call audit after the call is setup.
     * The timeout is there to ensure we do not hit call setup race conditions when we try to kickoff the call audit */
    var calls = {}, logger = _logManager.getLogger("callManager"),
            AUDIT_KICKOFF_TIMEOUT = 3000, isReconnected = false,
            fsmNotificationEvent = _callFSM.NotificationEvent,
            fsmState = _callFSM.CallFSMState,
            self = this, isQueueEnabled = true,
            NOTIFICATION_STATE =
            {
                BUSY: 0,
                IDLE: 1
            }, CALL_STATES =
            {
                IN_CALL: 0,
                ON_HOLD: 1,
                RINGING: 2,
                ENDED: 3,
                REJECTED: 4,
                OUTGOING: 5,
                INCOMING: 6,
                ANSWERING: 7,
                JOINED: 8,
                RENEGOTIATION: 9,
                TRANSFERRED: 10,
                ON_REMOTE_HOLD: 11,
                CALL_IN_PROGRESS: 12,
                EARLY_MEDIA: 13,
                TRANSFER_FAILURE: 14
            }, CALL_HOLD_STATES =
            {
                LOCAL_HOLD: 0,
                REMOTE_HOLD: 1,
                BOTH_HOLD: 2
            }, videoDeviceStatus = true,
            mediaConstraints = {
                audio: {
                    optional: [
                        {
                            sourceId: ""
                        }
                    ]
                },
                video: {
                    mandatory: {
                        minWidth: "320",
                        minHeight: "240",
                        maxWidth: "320",
                        maxHeight: "240"
                    }, optional: [
                        {
                            sourceId: ""
                        }
                    ]
                }
            };

    this.IncomingCall = function (callid, data) {
        var id = callid, options = data, sendVideo = true, isJoin = false, buttonDisabler = false, btnTimeout, auditTimer;

        this.notificationQueue = new _utils.Queue();
        this.onLocalStreamAdded = null;
        this.onStreamAdded = null;
        this.mute = function () {
            var param = {callid: id, mute: true};

            return self.mute(param);
        };
        this.unmute = function () {
            var param = {callid: id, mute: false};

            return self.mute(param);
        };

        this.answer = function (onSuccess, onFailure, isVideoEnabled, videoQuality) {
            var param = {callid: id, isVideoEnabled: isVideoEnabled, videoQuality: videoQuality};

            if (options.answer) {
                return self.answer(param, onSuccess, onFailure);
            } else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.NOT_ALLOWED_SERVICE);
            }
        };

        this.reject = function (onSuccess, onFailure) {
            var param = {callid: id};

            if (options.reject) {
                return self.reject(param, onSuccess, onFailure);
            } else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.NOT_ALLOWED_SERVICE);
            }
        };

        this.ignore = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.ignore(param, onSuccess, onFailure);
        };

        this.forward = function (address, onSuccess, onFailure) {
            var param = {callid: id, address: address};

            if (options.forward) {
                return self.forward(param, onSuccess, onFailure);
            } else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.NOT_ALLOWED_SERVICE);
            }
        };

        this.canReject = function () {
            return options.reject === true;
        };

        this.canForward = function () {
            return options.forward === true;
        };

        this.canAnswer = function () {
            return options.answer === true;
        };

        this.canSendVideo = function () {
            var param = {callid: id};

            return self.canOriginatorSendLocalVideo(param);
        };

        this.canReceiveVideo = function () {
            var param = {callid: id};

            return self.canOriginatorReceiveRemoteVideo(param);
        };

        this.getHoldState = function () {
            var param = {callid: id};

            return self.getHoldStateOfCall(param);

        };

        this.getId = function () {
            return id;
        };

        this.end = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.end(param, onSuccess, onFailure);
        };

        this.hold = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.hold(param, onSuccess, onFailure);
        };

        this.unhold = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.unhold(param, onSuccess, onFailure);
        };

        this.directTransfer = function (address, onSuccess, onFailure) {
            var param = {callid: id, address: address};

            return self.directTransfer(param, onSuccess, onFailure);
        };

        this.consultativeTransfer = function (transferredCallId, onSuccess, onFailure) {
            var param = {currentCallId: id, targetCallId: transferredCallId};

            return self.consultativeTransfer(param, onSuccess, onFailure);
        };

        this.videoStop = function (onSuccess, onFailure) {
            var param = {callid: id, isVideoStart: false};

            return self.videoStopStart(param, onSuccess, onFailure);
        };

        this.videoStart = function (onSuccess, onFailure, videoQuality) {
            var param = {callid: id, isVideoStart: true, videoQuality: videoQuality};

            return self.videoStopStart(param, onSuccess, onFailure);
        };

        this.join = function (anotherCall, onSuccess, onFailure, isVideoEnabled, videoQuality) {
            var param = {callid1: id, callid2: anotherCall.getId()};

            return self.join(param, onSuccess, onFailure, isVideoEnabled, videoQuality);
        };

        this.sendDTMF = function (tone) {
            var param = {callid: id, tone: tone};

            return self.sendDTMF(param);
        };

        this.sendIntraFrame = function () {
            var param = {callid: id};

            if (sendVideo) {
                return self.sendIntraFrame(param);
            }
        };

        this.sendBlackFrame = function () {
            var param = {callid: id};

            return self.sendBlackFrame(param);
        };

        this.refreshVideoRenderer = function () {
            var param = {callid: id};

            return self.refreshVideoRenderer(param);
        };

        this.getJoin = function () {
            return isJoin;
        };

        this.setJoin = function (join) {
            isJoin = join;
        };

        this.getButtonDisabler = function () {
            return buttonDisabler;
        };

        this.setButtonDisabler = function (disable) {
            buttonDisabler = disable;
            if (buttonDisabler) {
                btnTimeout = setTimeout(function () {
                    buttonDisabler = false;
                },4000);
            }
        };

        this.clearBtnTimeout = function () {
            clearTimeout(btnTimeout);
        };

        this.setAuditTimer = function (audit) {
            auditTimer = setInterval(function () {
                audit();
            },fcsConfig.callAuditTimer ? fcsConfig.callAuditTimer : 30000);
        };

        this.clearAuditTimer = function () {
            clearInterval(auditTimer);
        };

        this.isCallMuted = function () {
            var param = {callid: id};

            return self.isCallMuted(param);
        };

        /* DEPRECIATED */
        this.isVideoNegotationAvailable = function (id) {
            var param = {callid: id};

            return self.isVideoNegotationAvailable(param);
        };

        this.isVideoNegotiationAvailable = function () {
            var param = {callid: id};

            return self.isVideoNegotiationAvailable(param);
        };
    };
    this.OutgoingCall = function (callid) {
        var id = callid, sendVideo = true, isJoin = false, buttonDisabler = false, btnTimeout, auditTimer;

        this.notificationQueue = new _utils.Queue();

        this.onLocalStreamAdded = null;

        this.onStreamAdded = null;

        this.canSendVideo = function () {
            var param = {callid: id};

            return self.canOriginatorSendLocalVideo(param);
        };

        this.canReceiveVideo = function () {
            var param = {callid: id};

            return self.canOriginatorReceiveRemoteVideo(param);
        };

        this.getHoldState = function () {
            var param = {callid: id};

            return self.getHoldStateOfCall(param);
        };

        this.getId = function () {
            return id;
        };

        this.sendIntraFrame = function () {
            var param = {callid: id};

            if (sendVideo) {
                return self.sendIntraFrame(param);
            }
        };

        this.sendBlackFrame = function () {
            var param = {callid: id};

            return self.sendBlackFrame(param);
        };

        this.refreshVideoRenderer = function () {
            var param = {callid: id};

            return self.refreshVideoRenderer(param);
        };

        this.mute = function () {
            var param = {callid: id, mute: true};

            return self.mute(param);
        };

        this.unmute = function () {
            var param = {callid: id, mute: false};

            return self.mute(param);
        };

        this.end = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.end(param, onSuccess, onFailure);
        };

        this.hold = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.hold(param, onSuccess, onFailure);
        };

        this.unhold = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.unhold(param, onSuccess, onFailure);
        };

        this.directTransfer = function (address, onSuccess, onFailure) {
            var param = {callid: id, address: address};

            return self.directTransfer(param, onSuccess, onFailure);
        };

        this.consultativeTransfer = function (transfaredCallId, onSuccess, onFailure) {
            var param = {currentCallId: id, targetCallId: transfaredCallId};
            return self.consultativeTransfer(param, onSuccess, onFailure);
        };

        this.videoStop = function (onSuccess, onFailure) {
            var param = {callid: id, isVideoStart: false};

            return self.videoStopStart(param, onSuccess, onFailure);
        };

        this.videoStart = function (onSuccess, onFailure, videoQuality) {
            var param = {callid: id, isVideoStart: true, videoQuality: videoQuality};

            return self.videoStopStart(param, onSuccess, onFailure);
        };

        this.join = function (anotherCall, onSuccess, onFailure, isVideoEnabled, videoQuality) {
            var param = {callid1: id, callid2: anotherCall.getId()};

            return self.join(param, onSuccess, onFailure, isVideoEnabled, videoQuality);
        };

        this.sendDTMF = function (tone) {
            var param = {callid: id, tone: tone};

            return self.sendDTMF(param);
        };

        this.getJoin = function () {
            return isJoin;
        };

        this.setJoin = function (join) {
            isJoin = join;
        };

        this.getButtonDisabler = function () {
            return buttonDisabler;
        };

        this.setButtonDisabler = function (disable) {
            buttonDisabler = disable;
            if (buttonDisabler) {
                btnTimeout = setTimeout(function () {
                    buttonDisabler = false;
                },4000);
            }
        };

        this.clearBtnTimeout = function () {
            clearTimeout(btnTimeout);
        };

        this.setAuditTimer = function (audit) {
            auditTimer = setInterval(function () {
                audit();
            },fcsConfig.callAuditTimer ? fcsConfig.callAuditTimer : 30000);
        };

        this.clearAuditTimer = function () {
            clearInterval(auditTimer);
        };

        this.isCallMuted = function () {
            var param = {callid: id};

            return self.isCallMuted(param);
        };

        /* DEPRECIATED */
        this.isVideoNegotationAvailable = function (id) {
            var param = {callid: id};

            return self.isVideoNegotationAvailable(param);
        };

        this.isVideoNegotiationAvailable = function () {
            var param = {callid: id};

            return self.isVideoNegotiationAvailable(param);
        };
    };

    self.consultativeTransfer = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.currentCallId],
                targetCall = calls[data.targetCallId],
                currentCallState, targetCallState;
        internalCall.targetCallId = data.targetCallId;
        if (targetCall.callerNumber) {
            internalCall.targetAddress = targetCall.callerNumber;
        } else {
            internalCall.targetAddress = targetCall.call.callerNumber;
        }
        currentCallState = _callFSM.getCurrentState(internalCall);
        targetCallState = _callFSM.getCurrentState(targetCall);
        if ((currentCallState === fsmState.LOCAL_HOLD ||
                currentCallState === fsmState.BOTH_HOLD) &&
                (targetCallState === fsmState.LOCAL_HOLD ||
                        targetCallState === fsmState.BOTH_HOLD)) {
            _callControlService.transfer(internalCall.id, internalCall.targetAddress, internalCall.targetCallId, function () {
                logger.info("consultative transfer successful. callId: " + internalCall.id);
                self.delegateToCallFSM(internalCall, fsmNotificationEvent.consultativeTransfer_GUI);
                _utils.callFunctionIfExist(onSuccess);
            }, function (e) {
                logger.error("consultative transfer failed. callId: " + internalCall.id);
                _utils.callFunctionIfExist(onFailure, e);
            });
        } else if (currentCallState === fsmState.LOCAL_HOLDING ||
                targetCallState === fsmState.LOCAL_HOLDING) {
            if (!internalCall.transferTrigger) {
                internalCall.transferTrigger = function () {
                    self.consultativeTransfer(data, onSuccess, onFailure);
                };
            }
            else {
                _utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            }
        } else {
            logger.error("Cannot consultative transfer in INIT callstate :" + fcs.Errors.STATE);
            _utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        }
    };

    function parseAddress(address, contact) {

        if (address.indexOf("sip:", 0) > -1) {
            address = address.replace("sip:", "");
        }
        var displayName = "";
        if (contact === undefined || contact === null) {
            return (address.indexOf("@", 0) > -1) ? "sip:" + address : address;
        }
        if (contact.firstName && contact.firstName !== "") {
            displayName += contact.firstName;
        }
        if (contact.lastName && contact.lastName !== "") {
            if (displayName === "") {
                displayName += contact.lastName;
            }
            else {
                displayName += " " + contact.lastName;
            }
        }
        if (displayName === "") {
            return (address.indexOf("@", 0) > -1) ? "sip:" + address : address;
        }
        return displayName + "<" + ((address.indexOf("@", 0) > -1) ? "sip:" + address : address) + ">";
    }

    /*
     * When connection re-establishes sets isReconnected flag true
     */
    function onConnectionLost() {
        isReconnected = true;
    }

    /*
     * clear call resources
     * clear long call audit
     * clear webrtc resources
     * triger web part
     *
     * @param call call object
     * @param state state that will be returned to web part
     */
    function clearResources(call) {
        if (call.call) {
            call.call.clearAuditTimer();
        }
        if (call.pendingRequestTimer) {
            clearTimeout(call.pendingRequestTimer);
        }
        //clear webRTC resources
        _webRtcManager.processEnd(call);
        //clear call object
        delete calls[call.id];
    }

    function setNotificationStateOfCallToBusy(internalCall) {
        logger.debug("Setting notification state to BUSY for call: " + internalCall.id);
        internalCall.notificationState = NOTIFICATION_STATE.BUSY;
    }

    function setNotificationStateOfCallToIdle(internalCall) {
        logger.debug("Setting notification state to IDLE for call: " + internalCall.id);
        internalCall.notificationState = NOTIFICATION_STATE.IDLE;
    }

    function isNotificationStateOfCallBusy(internalCall) {
        return internalCall.notificationState === NOTIFICATION_STATE.BUSY;
    }

    function triggerQueue(call) {
        if (!isQueueEnabled) {
            return;
        }
        logger.debug("NOTIFICATION_QUEUE: Process completed, notification queue state changed to IDLE");
        setNotificationStateOfCallToIdle(call);
        if (call.call.notificationQueue.size() > 0) {
            logger.debug("NOTIFICATION_QUEUE: New notification found in queue, processing it!");
            var notificationObj = call.call.notificationQueue.dequeue();
            self.onNotificationEvent(notificationObj.type, notificationObj.sessionParams);
        }
    }

    function onSubscriptionReEstablished() {
        var id, internalCall;
        if (isReconnected) {
            isReconnected = false;
            for (id in calls) {
                if (calls.hasOwnProperty(id)) {
                    internalCall = calls[id];
                    if (internalCall && _callFSM.getCurrentState(internalCall) !== fsmState.RINGING) {
                        setNotificationStateOfCallToBusy(internalCall);
                        self.delegateToCallFSM(internalCall, fsmNotificationEvent.performReconnectWorkaround_JSL);
                    }
                    else {
                        // If call signalingState is not stable, this call on ringing state. Call will be ended.
                        // Send 0 to delete the call
                        internalCall.call.onStateChange(CALL_STATES.ENDED, 0);
                        clearResources(internalCall);
                    }
                }
            }
        }
    }

    /*
     * TODO: add selected speaker to the audio constraint, after chrome implementation
     */
    function prepareAudioConstraints() {
        var selectedMicrophoneId = self.getSelectedMicrophoneId();

        if (selectedMicrophoneId) {
            mediaConstraints.audio.optional[0].sourceId = selectedMicrophoneId;
        }
        return mediaConstraints.audio;
    }

    function prepareVideoConstraints(data) {
        var videoResolutionArray, selectedCameraId = self.getSelectedCameraId(),
            isVideoEnabled, videoQuality, videoNegotiationOnAnswer;

        if (!data) { data = {}; }
        isVideoEnabled = data.isVideoEnabled;
        videoQuality = data.videoQuality;
        videoNegotiationOnAnswer = data.videoNegotiationOnAnswer;

        if (isVideoEnabled) {
            if (videoQuality && typeof videoQuality === "string") {
                // First element of array will be Width and second element will be Height
                videoResolutionArray = videoQuality.split("x");
                if (!isNaN(videoResolutionArray[0]) && !isNaN(videoResolutionArray[1])) {
                    mediaConstraints.video.mandatory.maxWidth = videoResolutionArray[0];
                    mediaConstraints.video.mandatory.minWidth = videoResolutionArray[0];
                    mediaConstraints.video.mandatory.maxHeight = videoResolutionArray[1];
                    mediaConstraints.video.mandatory.minHeight = videoResolutionArray[1];
                }
            }

            if (selectedCameraId) {
                mediaConstraints.video.optional[0].sourceId = selectedCameraId;
            }

            return mediaConstraints.video;
        } else {
            if (videoNegotiationOnAnswer) {
                return  true;
            } else {
                return false;
            }
        }
    }

    self.CALL_STATES = CALL_STATES;
    self.CALL_HOLD_STATES = CALL_HOLD_STATES;

    self.initMedia = function (data, onSuccess, onFailure) {
        _webRtcManager.initMedia(function(){
            _utils.callFunctionIfExist(onSuccess);
        }, function(e){
            _utils.callFunctionIfExist(onFailure, e);
        }, data.options);
    };

    self.set_logSeverityLevel = function (data) {
        _webRtcManager.set_logSeverityLevel(data.level);
    };

    self.enable_logCallback = function() {
        _webRtcManager.enable_logCallback();
    };

    self.disable_logCallback = function() {
        _webRtcManager.disable_logCallback();
    };

    self.get_audioInDeviceCount = function() {
        return _webRtcManager.get_audioInDeviceCount();
    };

    self.get_audioOutDeviceCount = function() {
        return _webRtcManager.get_audioOutDeviceCount();
    };

    self.get_videoDeviceCount = function() {
        return _webRtcManager.get_videoDeviceCount();
    };

    function mapGetUserMediaErrorToFcsError(e) {
        switch (e) {
            case _fcs.call.MediaErrors.NOT_FOUND:
                return _fcs.Errors.MEDIA_NOT_FOUND;
            case _fcs.call.MediaErrors.NOT_ALLOWED:
                return _fcs.Errors.MEDIA_NOT_ALLOWED;
            case _fcs.call.MediaErrors.INVALID_PARAMETER:
                return _fcs.Errors.INVALID_PARAMETER;
            default:
                return e;
        }
    }

    self.getUserMedia = function (data, onSuccess, onFailure) {
        if (data.privateStream) {
            var audioConstraints = prepareAudioConstraints(),
                    videoConstraints = prepareVideoConstraints({isVideoEnabled: true});

            if (data.options) {
                if (data.options.audio !== undefined) {
                    audioConstraints = data.options.audio;
                }
                if (data.options.video !== undefined) {
                    videoConstraints = data.options.video;
                }
            }

            _webRtcManager.privateGetUserMedia(
                    onSuccess,
                    function (e) {
                        _utils.callFunctionIfExist(onFailure, mapGetUserMediaErrorToFcsError(e));
                    },
                    {
                        audio: audioConstraints,
                        video: videoConstraints,
                        privateStream: true
                    });
        } else {
            _webRtcManager.getUserMedia(
                    onSuccess,
                    function (e) {
                        _utils.callFunctionIfExist(onFailure, mapGetUserMediaErrorToFcsError(e));
                    },
                    data.options);
        }
    };

    self.showSettingsWindow = function (data, onSuccess, onFailure) {
        _webRtcManager.showSettingsWindow(function(){
            _utils.callFunctionIfExist(onSuccess);
        }, function(e){
            _utils.callFunctionIfExist(onFailure, e);
        }, data.options);
    };

    self.createStreamRenderer = function (data) {
        return _webRtcManager.createStreamRenderer(data.streamId, data.container, data.options);
    };

    self.disposeStreamRenderer = function (data) {
        _webRtcManager.disposeStreamRenderer(data.container);
    };

    self.isPluginEnabled = function() {
        return _webRtcManager.isPluginEnabled();
    };

    self.hasGotCalls = function() {
        var callid, internalCall;
        for (callid in calls) {
            if (calls.hasOwnProperty(callid)) {
                internalCall = calls[callid];
                if (internalCall) {
                    logger.info("has got call - id: " + callid + " - state: " + _callFSM.getCurrentState(internalCall));
                    return true;
                }
            }
        }
        return false;
    };

    self.getCalls = function() {
        return calls;
    };

    self.sendIntraFrame = function (data) {
        var internalCall = calls[data.callid];
        if (internalCall) {
            _webRtcManager.sendIntraFrame(internalCall);
        }
    };

    self.sendBlackFrame = function (data) {
        var internalCall = calls[data.callid];
        if (internalCall) {
            _webRtcManager.sendBlackFrame(internalCall);
        }
    };

    self.delegateToCallFSM = function(call, stateMessage) {
        _callFSM.handleEvent(call, stateMessage, self.onStateChange);
    };

    self.answer = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid],
            videoNegotiationAvailable = self.isVideoNegotiationAvailable(data),
            getUserMediaConstraints = {
                    options: {
                        audio: prepareAudioConstraints(),
                        video: prepareVideoConstraints(
                            {
                                isVideoEnabled: data.isVideoEnabled,
                                videoQuality: data.videoQuality,
                                videoNegotiationOnAnswer: videoNegotiationAvailable
                            }
                        )
                    }};

        if (internalCall) {
            // check if term side tries to answer an audio only call with video
            if (videoNegotiationAvailable === false && data.isVideoEnabled === true) {
                logger.error("[callManager.answer] Video Session Not Available Error ");
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.VIDEO_SESSION_NOT_AVAILABLE);
                return;
            }

            if (internalCall.sdp) {
                //check with the state machine if the current state would accept an answer.
                if (_callFSM.getCurrentState(internalCall) !== fsmState.RINGING) {
                    _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
                }
                else {
                    self.getUserMedia(getUserMediaConstraints, function getUserMediaSuccessCallback(mediaInfo) {
                        internalCall.isVideoSourceAllowed = mediaInfo.video;
                        _webRtcManager.storeLocalStreamToCall(internalCall, mediaInfo.id);

                        _webRtcManager.createAnswer(internalCall, function createAnswerSuccessCallback(sdp) {
                            logger.info("[callManager.answer : sdp ]" + sdp);
                            //change call state
                            self.delegateToCallFSM(internalCall, fsmNotificationEvent.answer_GUI);
                            //send answer call
                            _callControlService.answerCall(internalCall.id, sdp, function () {
                                _utils.callFunctionIfExist(onSuccess);

                                _webRtcManager.addLocalStream(internalCall);
                            }, function(e) {
                                _utils.callFunctionIfExist(onFailure, e);
                            });
                        }, function createAnswerFailureCallback(e) {
                            logger.error("[callManager.answer] Error : " + e);
                            //Change state when the call have failed
                            //This will trigger send reject
                            self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);
                        }, data.isVideoEnabled);
                    }, function getUserMediaFailureCallback(e) {
                        _utils.callFunctionIfExist(onFailure, e);
                    });
                }
            }
            else {
                if (_callFSM.getCurrentState(internalCall) !== fsmState.RINGING_SLOW) {
                    _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
                }
                else {
                    self.getUserMedia(getUserMediaConstraints, function getUserMediaSuccessCallback(mediaInfo) {
                        internalCall.isVideoSourceAllowed = mediaInfo.video;
                        _webRtcManager.storeLocalStreamToCall(internalCall, mediaInfo.id);

                        _webRtcManager.createOffer(internalCall, function createOfferSuccessCallback(sdp) {
                            internalCall.sdp = sdp;
                            self.delegateToCallFSM(internalCall, fsmNotificationEvent.answer_GUI);
                            _callControlService.answerCall(internalCall.id, sdp, function () {
                                _utils.callFunctionIfExist(onSuccess);

                            }, function(e) {
                                _utils.callFunctionIfExist(onFailure, e);
                            });
                        }, function createOfferFailureCallback(e) {
                            logger.error("[callManager.offer] Error : " + e);
                            //Change state when the call have failed
                            //This will trigger send reject
                            self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);
                        }, data.isVideoEnabled);
                    }, function getUserMediaFailureCallback(e) {
                        _utils.callFunctionIfExist(onFailure, e);
                    });

                }
            }
        }
    };

    self.getIncomingCallById = function (data) {
        var call = null, cachedCall, internalCall;

        cachedCall = JSON.parse(cache.getItem(data.callid));
        if (cachedCall) {

            call = new self.IncomingCall(data.callid, {reject: cachedCall.optionReject, forward: cachedCall.optionForward, answer: cachedCall.optionAnswer});

            call.canOrigReceiveVideo = _sdpParser.isSdpHasVideo(cachedCall.sdp);

            call.callerNumber = cachedCall.callerNumber;
            call.callerName = cachedCall.callerName;
            call.calleeNumber = cachedCall.calleeNumber;
            call.primaryContact = cachedCall.primaryContact;

            internalCall = {
                "call": call,
                "sdp": cachedCall.sdp,
                "id": data.callid
            };

            calls[data.callid] = internalCall;

            self.delegateToCallFSM(internalCall, fsmNotificationEvent.callNotify);
        }

        return call;
    };

    function cacheCall(internalCall) {
        var callToCache = {
            "sdp": internalCall.sdp,
            "callerNumber": internalCall.call.callerNumber,
            "callerName": internalCall.call.callerName,
            "calleeNumber": internalCall.call.calleeNumber,
            "primaryContact": internalCall.call.primaryContact,
            "optionReject": internalCall.call.canReject(),
            "optionForward": internalCall.call.canForward(),
            "optionAnswer": internalCall.call.canAnswer()
        };

        cache.setItem(internalCall.id, JSON.stringify(callToCache));
    }

    self.start = function (data, onSuccess, onFailure) {
        var internalCall = {},
            getUserMediaConstraints = {
                    options: {
                        audio: prepareAudioConstraints(),
                        video: prepareVideoConstraints(
                            {
                                isVideoEnabled: data.isVideoEnabled,
                                videoQuality: data.videoQuality
                            }
                        )
                    }};

        logger.info("start call... from: " + data.from +
                " contact: " + JSON.stringify(data.contact) +
                " to: " + data.to +
                " isVideoEnabled: " + data.isVideoEnabled +
                " sendInitialVideo: " + data.sendInitialVideo +
                " videoQuality: " + data.videoQuality);

        self.getUserMedia(getUserMediaConstraints, function getUserMediaSuccessCallback(mediaInfo) {
            internalCall.isVideoSourceAllowed = mediaInfo.video;
            _webRtcManager.storeLocalStreamToCall(internalCall, mediaInfo.id);
            _webRtcManager.createOffer(internalCall, function createOfferSuccessCallback(sdp) {
                logger.info("[callManager.start : sdp ]" + sdp);

                internalCall.sdp = sdp;
                _callControlService.startCall(
                        parseAddress(data.from, data.contact),
                        parseAddress(data.to),
                        sdp,
                        function (callid) {

                            internalCall.call = new self.OutgoingCall(callid);
                            internalCall.id = callid;
                            internalCall.callerNumber = data.to;

                            self.delegateToCallFSM(internalCall, fsmNotificationEvent.callStart_GUI);
                            calls[callid] = internalCall;
                            // we need to wait until call variable to be created
                            setTimeout(function() {
                                _webRtcManager.addLocalStream(internalCall);
                            }, 10);
                            _utils.callFunctionIfExist(onSuccess, internalCall.call);
                        },
                        function (e) {
                            //TODO: update call state
                            _utils.callFunctionIfExist(onFailure, e);
                        });
            }, function createOfferFailureCallback(e) {
                logger.error("[callManager.start] Error : " + e);
                _utils.callFunctionIfExist(onFailure, e);
            }, data.sendInitialVideo
                    );
        }, function getUserMediaFailureCallback(e) {
            _utils.callFunctionIfExist(onFailure, e);
        });
    };

    self.reject = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid];
        if (!internalCall) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            return;
        }

        _callControlService.reject(data.callid, function () {
            self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);
            _utils.callFunctionIfExist(onSuccess);
        }, function (e) {
            _utils.callFunctionIfExist(onFailure, e);
        });

    };

    self.ignore = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid];
        if (!internalCall) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            return;
        }

        self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);
        _utils.callFunctionIfExist(onSuccess);
    };
    self.forward = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid];
        if (!internalCall) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            return;
        }

        _callControlService.forward(data.callid, data.address, function () {
            self.delegateToCallFSM(internalCall, fsmNotificationEvent.forward_GUI);
            _utils.callFunctionIfExist(onSuccess);
        }, function (e) {
            _utils.callFunctionIfExist(onFailure, e);
        });
    };

    function handleFailure(internalCall, failureHandler, failureEvent, retry) {
        setNotificationStateOfCallToBusy(internalCall);
        _webRtcManager.revertRtcState(internalCall, triggerQueue, triggerQueue);

        if (failureEvent) {
            self.delegateToCallFSM(internalCall, failureEvent);
        }

        if (retry && retry.timeout) {
            internalCall.pendingRequestTimer = setTimeout(function() {
                internalCall.pendingRequestTimer = null;
                retry.args.push(true);
                retry.handler.apply(null, retry.args);
            }, retry.timeout * 1000);
        }
        else {
            if (failureHandler) {
                // TODO: need to add an error code
                _utils.callFunctionIfExist(failureHandler);
            }
        }
    }

    function handleRequestFailure(internalCall, failureHandler, retry) {
        handleFailure(internalCall, failureHandler,
                fsmNotificationEvent.requestFailure_JSL, retry);
    }

    function handleWebrtcFailure(internalCall, failureHandler) {
        handleFailure(internalCall, failureHandler,
                fsmNotificationEvent.webrtcFailure_JSL);
    }

    self.hold = function (data, onSuccess, onFailure, isAutoRetried) {
        var internalCall = calls[data.callid], currentCallState;
        if (!internalCall) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            return;
        }

        if (isNotificationStateOfCallBusy(internalCall)){
            if (isAutoRetried) {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.NETWORK);
            }
            else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            }
            return;
        }

        currentCallState = _callFSM.getCurrentState(internalCall);

        if (currentCallState !== fsmState.COMPLETED &&
                currentCallState !== fsmState.REMOTE_HOLD) {
            if (isAutoRetried) {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.NETWORK);
            }
            else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            }
            return;
        }

        if (internalCall.pendingRequestTimer) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.PENDING_REQUEST);
            return;
        }

        internalCall.lastUpdateRequest = {handler: self.hold,
            args: [data, onSuccess, onFailure]};

        setNotificationStateOfCallToBusy(internalCall);

        self.delegateToCallFSM(internalCall, fsmNotificationEvent.hold_GUI);
        _webRtcManager.createHoldUpdate(internalCall,
                true,
                (currentCallState === fsmState.REMOTE_HOLD),
                function(sdp) {
                    logger.debug("[callManager.hold->createHoldUpdate : sdp ]" + sdp);
                    _callControlService.hold(internalCall.id, sdp,
                            function() {
                                setNotificationStateOfCallToIdle(internalCall);
                                _utils.callFunctionIfExist(onSuccess);
                            },
                            function(err) {
                                handleRequestFailure(internalCall, onFailure,
                                        {handler: self.hold,
                                            args: [data, onSuccess, onFailure],
                                            timeout: err.retryAfter});
                            });
                },
                function() {
                    handleWebrtcFailure(internalCall, onFailure);
                });
    };

    self.unhold = function (data, onSuccess, onFailure, isAutoRetried) {
        var internalCall = calls[data.callid], currentCallState;

        if (!internalCall) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            return;
        }

        if (isNotificationStateOfCallBusy(internalCall)){
            if (isAutoRetried) {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.NETWORK);
            }
            else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            }
            return;
        }

        currentCallState = _callFSM.getCurrentState(internalCall);

        if (currentCallState !== fsmState.LOCAL_HOLD &&
                currentCallState !== fsmState.BOTH_HOLD) {
            if (isAutoRetried) {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.NETWORK);
            }
            else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            }
            return;
        }

        if (internalCall.pendingRequestTimer) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.PENDING_REQUEST);
            return;
        }

        internalCall.lastUpdateRequest = {handler: self.unhold,
            args: [data, onSuccess, onFailure]};

        setNotificationStateOfCallToBusy(internalCall);

        self.delegateToCallFSM(internalCall, fsmNotificationEvent.unhold_GUI);
        _webRtcManager.createHoldUpdate(internalCall, false,
                (currentCallState === fsmState.BOTH_HOLD),
                function(sdp) {
                    logger.debug("[callManager.unhold->createHoldUpdate : sdp ]" + sdp);
                    _callControlService.unhold(internalCall.id, sdp,
                            function() {
                                setNotificationStateOfCallToIdle(internalCall);
                                _webRtcManager.addLocalStream(internalCall);
                                _utils.callFunctionIfExist(onSuccess);
                            },
                            function(err) {
                                handleRequestFailure(internalCall, onFailure,
                                        {handler: self.unhold,
                                            args: [data, onSuccess, onFailure],
                                            timeout: err.retryAfter});
                            });
                },
                function() {
                    handleWebrtcFailure(internalCall, onFailure);
                });
    };

    self.directTransfer = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid], currentCallState;

        if (!internalCall) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            return;
        }

        currentCallState = _callFSM.getCurrentState(internalCall);

        if (currentCallState === fsmState.LOCAL_HOLD || currentCallState === fsmState.BOTH_HOLD )
        {
            //TODO: force localhold - if the user is not on hold
            logger.info("[callManager.directTransfer->sendTransfer : transfer target ]" + data.address);
            _callControlService.transfer(internalCall.id, parseAddress(data.address), undefined , function () {
                self.delegateToCallFSM(internalCall, fsmNotificationEvent.transfering);
                _utils.callFunctionIfExist(onSuccess);
                logger.info("[callManager.directTransfer->sentTransfer : transfer target ]" + data.address);
            }, function(e){
                _utils.callFunctionIfExist(onFailure, e);
            });
        } else if (currentCallState === fsmState.LOCAL_HOLDING) {
            if (!internalCall.transferTrigger) {
                internalCall.transferTrigger = function () {
                    self.directTransfer(data, function(){
                        _utils.callFunctionIfExist(onSuccess);
                    }, function(e){
                        _utils.callFunctionIfExist(onFailure, e);
                    });
                };
            }
        }
        else {
            logger.error("directTransfer call is not in correct state: " + currentCallState);
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        }

    };

    self.videoStopStart = function (data, onSuccess, onFailure,isAutoRetried) {
        var internalCall = calls[data.callid], sdp, videoSourceAllowed,
            currentCallState, createUpdate,
            getUserMediaConstraints = {
                    options: {
                        audio: prepareAudioConstraints(),
                        video: prepareVideoConstraints(
                            {
                                isVideoEnabled: true,
                                videoQuality: data.videoQuality
                            }
                        )
                    }};

        createUpdate = function() {
            self.delegateToCallFSM(internalCall, fsmNotificationEvent.videoStopStart_GUI);
            _webRtcManager.createUpdate(
                    internalCall,
                    function(sdp) {
                        internalCall.isVideoSourceAllowed = videoSourceAllowed;
                        _callControlService.reinvite(internalCall.id, sdp,
                                function() {
                                    setNotificationStateOfCallToIdle(internalCall);
                                    _webRtcManager.addLocalStream(internalCall);
                                    _utils.callFunctionIfExist(onSuccess);
                                },
                                function(err) {
                                    handleRequestFailure(internalCall, onFailure,
                                            {handler: self.videoStopStart,
                                                args: [data, onSuccess, onFailure],
                                                timeout: err.retryAfter
                                            });
                                }
                        );
                    },
                    function() {
                        logger.error("reinvite->createUpdate : sdp " + sdp);
                        handleWebrtcFailure(internalCall, onFailure);
                    },
                    data.isVideoStart
                    );
        };

        if (!internalCall) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            return;
        }

        if (isNotificationStateOfCallBusy(internalCall)){
            if (isAutoRetried) {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.NETWORK);
            }
            else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            }
            return;
        }

        currentCallState = _callFSM.getCurrentState(internalCall);
        if (currentCallState !== fsmState.COMPLETED) {
            if (isAutoRetried) {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.NETWORK);
            }
            else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            }
            return;
        }

        if (internalCall.pendingRequestTimer) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.PENDING_REQUEST);
            return;
        }

        internalCall.lastUpdateRequest = {handler: self.videoStopStart,
            args: [data, onSuccess, onFailure]};

        setNotificationStateOfCallToBusy(internalCall);

        if (!internalCall.isVideoSourceAllowed && data.isVideoStart) {
            self.getUserMedia(getUserMediaConstraints, function getUserMediaSuccessCallback(mediaInfo) {
                videoSourceAllowed = mediaInfo.video;
                _webRtcManager.storeLocalStreamToCall(internalCall, mediaInfo.id);
                createUpdate();
            }, function getUserMediaFailureCallback(e) {
                _utils.callFunctionIfExist(onFailure, e);
            });
        } else {
            // avoiding videoSourceAllowed to return undefined if video source is allowed before
            videoSourceAllowed = true;
            createUpdate();
        }
    };

    self.mute = function (data) {
        var call = calls[data.callid];
        if (call) {
            _webRtcManager.muteAudioTrack(call, data.mute);
        }
    };

    self.sendDTMF = function (data) {
        var internalCall = calls[data.callid];

        if (internalCall) {
            _webRtcManager.sendDTMF(internalCall, data.tone);
        }
    };

    self.join = function (data, onSuccess, onFailure, isVideoEnabled, videoQuality) {
        var internalCall1 = calls[data.callid1],
                internalCall2 = calls[data.callid2],
                newInternalCall = {},
                currentCallState1,
                currentCallState2,
                getUserMediaConstraints = {
                    options: {
                        audio: prepareAudioConstraints(),
                        video: prepareVideoConstraints(
                            {
                                isVideoEnabled: isVideoEnabled,
                                videoQuality: videoQuality
                            }
                        )
                    }};

        if ((internalCall1) && (internalCall2)) {
            currentCallState1 = _callFSM.getCurrentState(internalCall1);
            currentCallState2 = _callFSM.getCurrentState(internalCall2);
            if (currentCallState1 === fsmState.LOCAL_HOLDING ||
                    currentCallState2 === fsmState.LOCAL_HOLDING) {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.PENDING_REQUEST);
                return;
            }
            if ((currentCallState1 === fsmState.LOCAL_HOLD ||
                    currentCallState1 === fsmState.REMOTE_HOLD ||
                    currentCallState1 === fsmState.BOTH_HOLD) &&
                    (currentCallState2 === fsmState.LOCAL_HOLD ||
                    currentCallState2 === fsmState.REMOTE_HOLD ||
                    currentCallState2 === fsmState.BOTH_HOLD)) {

                self.getUserMedia(getUserMediaConstraints, function(mediaInfo) {
                    newInternalCall.isVideoSourceAllowed = mediaInfo.video;
                    _webRtcManager.storeLocalStreamToCall(newInternalCall, mediaInfo.id);
                    _webRtcManager.createOffer(newInternalCall,
                            function(sdp) {
                                logger.info("join->doOffer : sdp " + sdp);
                                newInternalCall.sdp = sdp;
                                _callControlService.join(
                                        internalCall1.id,
                                        internalCall2.id,
                                        sdp,
                                        function(callid) {

                                            newInternalCall.call = new self.OutgoingCall(callid);
                                            newInternalCall.id = callid;
                                            newInternalCall.firstInternalCallId = internalCall1.id;
                                            newInternalCall.secondInternalCallId = internalCall2.id;

                                            // refer will be handled by client. We are going to need callID of partyB and partyC
                                            if (fcsConfig.clientControlled === "true") {
                                                newInternalCall.isReferer = true;
                                                newInternalCall.refer1ID = internalCall1.id;
                                                newInternalCall.refer2ID = internalCall2.id;
                                            }

                                            self.delegateToCallFSM(internalCall1, fsmNotificationEvent.joining_Notify);
                                            self.delegateToCallFSM(internalCall2, fsmNotificationEvent.joining_Notify);
                                            self.delegateToCallFSM(newInternalCall, fsmNotificationEvent.joiningSuccess_Notify);
                                            calls[callid] = newInternalCall;

                                            _utils.callFunctionIfExist(onSuccess, newInternalCall.call);
                                        }, function(e) {
                                    logger.error("callControlService.join Failed!! sdp " + sdp);
                                    _utils.callFunctionIfExist(onFailure, e);
                                });
                            }, function(e) {
                        logger.error("doOffer Failed!!");
                        _utils.callFunctionIfExist(onFailure, e);
                    }, isVideoEnabled);
                }, function(e) {
                    _utils.callFunctionIfExist(onFailure, e);
                });
            } else {
                _utils.callFunctionIfExist(onFailure, _fcs.Errors.STATE);
            }
        }
    };

    self.transfer = function() {

    };

    self.end = function (data, onSuccess) {
        var internalCall = calls[data.callid];
        if (internalCall) {
            //check with the state machine if the current state would accept an endCall.
            if (_callFSM.getCurrentState(internalCall) === fsmState.INIT) {
                logger.error("Cannot end call in INIT callstate :" + _fcs.Errors.STATE);
            } else {
                //send the end call to webrtc abstraction, change call state
                //this will trigger the send endcall or reject call
                self.delegateToCallFSM(internalCall, fsmNotificationEvent.end_GUI);

                clearResources(internalCall);
                _utils.callFunctionIfExist(onSuccess);
            }
        }

    };

    self.clickToCall = function (data, onSuccess, onFailure) {
        _callControlService.clickToCall(data.callingParty, data.calledParty, function() {
            _utils.callFunctionIfExist(onSuccess);
        }, function(e) {
            _utils.callFunctionIfExist(onFailure, e);
        });
    } ;

    self.getIMRN = function (data, onSuccess, onFailure) {
        _callControlService.getIMRN(data.realm, data.source, data.destination, function() {
            _utils.callFunctionIfExist(onSuccess);
        }, function(e) {
            _utils.callFunctionIfExist(onFailure, e);
        });
    } ;

    self.cerateIncomingCallInFSM = function(call, sdp) {

        logger.info("incomingCall : sdp = " + sdp);
        var internalCall = {
            "call": call,
            "sdp": sdp,
            "id": call.getId()
        };
        logger.info("incomingCall: " + call.getId());

        if (fcsConfig.continuity && call.canAnswer()) {
            cacheCall(internalCall);
        }

        calls[call.getId()] = internalCall;
        self.delegateToCallFSM(internalCall, fsmNotificationEvent.callNotify);
    };


    self.updateCall = function() {
    };

    self.onNotificationEvent = function(type, sessionParams) {
        var callid = sessionParams.sessionData,
                statusCode = sessionParams.statusCode,
                reasonText = sessionParams.reasonText,
                sdp = sessionParams.sdp,
                referTo = sessionParams.referTo,
                referredBy = sessionParams.referredBy,
                retryAfter = sessionParams.retryAfter,
                internalCall = calls[callid];

        logger.debug("Notification received " + type + " callid:" + callid);
        logger.debug("onNotificationEvent : sdp " + sdp);
        if (internalCall) {
            if (isQueueEnabled && isNotificationStateOfCallBusy(internalCall) &&
                    (type !== fsmNotificationEvent.callEnd_Notify) && (type !== fsmNotificationEvent.callCancel_Notify)) {
                logger.debug("NOTIFICATION_QUEUE: notification state is busy, adding process to the queue!");
                internalCall.call.notificationQueue.enqueue({
                    type: type,
                    sessionParams: sessionParams
                });
                logger.debug("NOTIFICATION_QUEUE: queue size is now " + internalCall.call.notificationQueue.size());
                return;
            }

            if(isQueueEnabled){
                setNotificationStateOfCallToBusy(internalCall);
            }

            if (sdp) {
                internalCall.prevRemoteSdp = internalCall.sdp;
                sdp = _sdpParser.deleteGoogleIceFromSdp(sdp);
                internalCall.sdp = sdp;
            }
            if (referTo && referredBy) {
                internalCall.referTo = referTo;
                internalCall.referredBy = referredBy;
            }
            internalCall.retryAfter = retryAfter;
            internalCall.statusCode = statusCode;
            internalCall.reasonText = reasonText;
        }
        self.delegateToCallFSM(internalCall, type);
    };

    self.onStateChange = function(call, event) {
        var callStates = CALL_STATES,
                transferEvent = _callFSM.TransferEvent,
                i, isJoin, isLocalHold, auditTimerDelay, startAuditTimer,
                internalCall1, internalCall2;

        calls[call.id] = call;


        function triggerCallState(state, doNotTriggerQueue) {
            logger.debug("triggerCallState:  state =   " + state + "    call.statusCode =  " + call.statusCode + "   call.reasonText =  " + call.reasonText);
            call.call.callState = state;
            _utils.callFunctionIfExist(call.call.onStateChange, state, call.statusCode, call.reasonText);
            if (!doNotTriggerQueue) {
                triggerQueue(call);
            }
        }

        function triggerCallStateWithoutQueue(state) {
            triggerCallState(state, true);
        }

        auditTimerDelay = function() {
            setTimeout(function() {
                if (_fcs.isConnected()) {
                    _callControlService.audit(call.id, function() {
                        logger.info("Audit kicked off: Success for: " + call.id);
                    }, function() {
                        logger.error("Audit: Fail for: " + call.id);
                        // no need to end the call after audit fail
                    });
                }
            }, AUDIT_KICKOFF_TIMEOUT);
        };

        startAuditTimer = function() {
            call.call.setAuditTimer(function() {
                if (_fcs.isConnected()) {
                    _callControlService.audit(call.id, function() {
                        logger.info("Audit: Success for: " + call.id);
                    }, function() {
                        logger.error("Audit: Fail for: " + call.id);
                        // no need to end the call after audit fail
                        triggerQueue(call);
                    });
                }
            });
        };

        logger.info("Transfer Event: " + event + ". callId: " + call.id);
        switch (event) {
            case transferEvent.callStart_fsm:
            case transferEvent.localHolding_fsm:
            case transferEvent.localUnHolding_fsm:
            case transferEvent.localVideoStopStart_fsm:
            case transferEvent.slowStartOfferProcessed_fsm:
            case transferEvent.joiningSuccess_fsm:
                break;
            case transferEvent.ignoredNotification_fsm:
            case transferEvent.answeringRingingSlow_fsm:
            case transferEvent.localHold_fsm:
            case transferEvent.localUnHold_fsm:
            case transferEvent.answerRingingSlow_fsm:
                triggerQueue(call);
                break;
            case transferEvent.transfering_fsm:
                triggerQueue(call);
                break;
            case transferEvent.ringing_fsm:
                triggerCallState(callStates.RINGING);
                break;
            case transferEvent.callReceived_fsm:
                if (!(call.sdp)) {
                    self.delegateToCallFSM(call, fsmNotificationEvent.callNotify_noSDP);
                }
                triggerCallState(callStates.INCOMING);
                break;
            case transferEvent.answer_fsm:
                auditTimerDelay();
                startAuditTimer();
                triggerCallState(callStates.IN_CALL);
                break;
            case transferEvent.reject_GUI:
            case transferEvent.forward_fsm:
                clearResources(call);
                break;
            case transferEvent.sessionComplete_fsm:
                _callControlService.endCall(call.id, function() {
                    logger.info("callControlService.endCall successful. callId: " + call.id);
                }, function() {
                    logger.error("callControlService.endCall FAILED!!.callId: " + call.id);
                });
                clearResources(call);
                triggerCallState(callStates.JOINED);
                break;
            case transferEvent.sessionFail_fsm:
            case transferEvent.transferFail_fsm:
                triggerCallState(callStates.TRANSFER_FAILURE);
                break;
            case transferEvent.callCompleted_fsm:
                // Workaround for webrtc dtls and firefox pranswer support bug. Can be removed when fixed by browsers.
                // dtls is enabled listened early media as answer. Now has to create a new peer for actual answer sdp.
                if (_webRtcManager.isDtlsEnabled() && call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
                    logger.info("Handle answer sdp after session progress when dtls is enabled. Create new peer workaround.");
                    self.delegateToCallFSM(call, fsmNotificationEvent.performCreateNewPeerWorkaround_JSL);
                    break;
                }

                auditTimerDelay();
                _webRtcManager.processAnswer(call,
                        function () {
                            startAuditTimer();
                            triggerCallState(callStates.IN_CALL);
                        },
                        function (err) {
                            if (err === CONSTANTS.WEBRTC.ERROR.ICE_ICELITE) {
                                logger.info("ice-lite - ice change. Create new peer workaround.");
                                self.delegateToCallFSM(call, fsmNotificationEvent.performCreateNewPeerWorkaround_JSL);
                            } else {
                                clearResources(call);
                                triggerCallState(callStates.ENDED);
                            }
                        });
                //if client is handling the refers, we need to trigger the refers for partyB and partyC from referer
                if (call.isReferer) {
                    for (i in calls) {
                        if (calls.hasOwnProperty(i)) {
                            if (calls[i] && (calls[i].id === call.refer1ID || calls[i].id === call.refer2ID)) {
                                calls[i].referCall(call.referTo, call.referredBy);
                            }
                        }
                    }
                }
                break;
            case transferEvent.noAnswer_fsm:
            case transferEvent.remoteEnd_fsm:
                if ((call.firstInternalCallId) && (call.secondInternalCallId)) {
                    internalCall1 = calls[call.firstInternalCallId];
                    self.delegateToCallFSM(internalCall1, fsmNotificationEvent.revertState_JSL);
                    internalCall2 = calls[call.secondInternalCallId];
                    self.delegateToCallFSM(internalCall2, fsmNotificationEvent.revertState_JSL);
                }
                clearResources(call);
                triggerCallState(callStates.ENDED);
                break;
            case transferEvent.localEnd_fsm:
                _callControlService.endCall(call.id, function() {
                    logger.info("CallControlService endCall successful. callId: " + call.id);
                }, function() {
                    logger.error("Cannot callControlService endCall. callId: " + call.id);
                });
                break;
            case transferEvent.callCompletedAnswering_fsm:
                logger.info("callManager: Call Completed Answering Event. callId: " + call.id);
                _webRtcManager.processAnswer(call, function() {
                    triggerCallState(callStates.IN_CALL);
                    auditTimerDelay();
                    startAuditTimer();
                }, function() {
                    clearResources(call);
                    triggerCallState(callStates.ENDED);
                });
                break;
            case transferEvent.remoteHold_fsm:
                switch (_callFSM.getCurrentState(call)) {
                    case fsmState.REMOTE_HOLD:
                        triggerCallState(callStates.ON_REMOTE_HOLD);
                        break;
                    case fsmState.BOTH_HOLD:
                        triggerCallState(callStates.ON_HOLD);
                        break;
                    default:
                        triggerQueue(call);
                        break;
                }
                break;
            case transferEvent.remoteUnHold_fsm:
                switch (_callFSM.getCurrentState(call)) {
                    case fsmState.LOCAL_HOLD:
                        triggerCallState(callStates.ON_HOLD);
                        break;
                    case fsmState.COMPLETED:
                        triggerCallState(callStates.IN_CALL);
                        break;
                    default:
                        triggerQueue(call);
                        break;
                }
                break;
            case transferEvent.remoteHolding_fsm:
                isLocalHold = (_callFSM.getCurrentState(call) === fsmState.LOCAL_HOLD) || (_callFSM.getCurrentState(call) === fsmState.BOTH_HOLD);
                _webRtcManager.processHold(call, true, isLocalHold, function(sdp) {
                    logger.info("[callManager.onStateChange.transferEvent.remoteHold_fsm->processHold : sdp ]" + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Remote Hold Transfer Event Successful. callId: " + call.id);
                        self.delegateToCallFSM(call, fsmNotificationEvent.remoteHoldProcessed_JSL);
                    }, function(errorStr) {
                        logger.error("Remote Hold Transfer Event FAILED!! - " + errorStr);
                        handleRequestFailure(call);
                    });
                }, function(errorStr) {
                    logger.error("Remote Hold FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                });
                break;
            case transferEvent.remoteOfferDuringLocalHold_fsm:
                _webRtcManager.processRemoteOfferOnLocalHold(call, function(sdp) {
                    logger.info("onStateChange.transferEvent.remoteOfferDuringLocalHold_fsm : sdp " + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Remote Offer During Local Hold Transfer Event successful. callId: " + call.id);
                        triggerQueue(call);
                    }, function(errorStr) {
                        handleRequestFailure(call);
                        logger.error("Remote Offer During Local Hold  Transfer Event FAILED!! - " + errorStr);
                    });
                }, function(errorStr) {
                    logger.error("Remote Offer During Local Hold FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                });
                break;
            case transferEvent.slowStartOfferDuringOnCall_fsm:
            case transferEvent.slowStartOfferDuringRemoteHold_fsm:
                _webRtcManager.createReOffer(call, function(sdp) {
                    logger.info("onStateChange.transferEvent.createReOffer: sdp " + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Slow Start Offer respondCallUpdate successful. callId: " + call.id);
                        self.delegateToCallFSM(call, fsmNotificationEvent.slowStartOfferProcessed_JSL);
                        triggerQueue(call);
                    }, function(errorStr) {
                        logger.error("Slow Start Offer respondCallUpdate FAILED!! - " + errorStr);
                        handleRequestFailure(call);
                    });
                }, function(errorStr) {
                    logger.error("Slow Start Offer createReOffer FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                });
                break;
            case transferEvent.performReconnectWorkaround_fsm:
                _webRtcManager.createReOffer(call, function createReOfferSuccessCallback(sdp)
                {
                    logger.info("onStateChange.transferEvent.createReOffer : sdp " + sdp);
                    _callControlService.reinvite(call.id, sdp, function reInviteSuccessCallback() {
                        setNotificationStateOfCallToIdle(call);
                        _webRtcManager.addLocalStream(call);
                        logger.info("callControlService.reinvite successful. callId: " + call.id);
                    }, function() {
                        self.delegateToCallFSM(call, fsmNotificationEvent.requestFailure_JSL);
                    });
                }, function() {
                    handleWebrtcFailure(call);
                }, true);
                break;
            case transferEvent.performCreateNewPeerWorkaround_fsm:
                logger.info("performCreateNewPeerWorkaround_fsm");
                _webRtcManager.createReOffer(call,
                        function createReOfferSuccessCallback(sdp)
                        {
                            logger.info("createReOfferSuccessCallback: sdp " + sdp);
                            _callControlService.reinvite(call.id, sdp,
                                    function reInviteSuccessCallback() {
                                        logger.info("reInviteSuccessCallback.");
                                        _webRtcManager.addLocalStream(call);
                                        startAuditTimer();
                                        triggerQueue(call);
                                    },
                                    function reInviteFailureCallback() {
                                        logger.info("reInviteFailureCallback.");
                                        self.end({callid: call.id}, function () {
                                            logger.info("end success.");
                                            clearResources(call);
                                            triggerCallState(callStates.ENDED);
                                        });
                                    });
                        },
                        function createReOfferFailureCallback() {
                            self.end({callid: call.id}, function () {
                                logger.info("end success.");
                                clearResources(call);
                                triggerCallState(callStates.ENDED);
                            });
                        }, true);
                break;
            case transferEvent.remoteUnHolding_fsm:
                isLocalHold = (call.previousState === fsmState.LOCAL_HOLD) || (call.previousState === fsmState.BOTH_HOLD);
                _webRtcManager.processHold(call, false, isLocalHold, function(sdp) {
                    logger.info("onStateChange.transferEvent.remoteUnHold_fsm->processHold : sdp " + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Remote UnHold Transfer Event successful. callId: " + call.id);
                        self.delegateToCallFSM(call, fsmNotificationEvent.remoteUnHoldProcessed_JSL);
                    }, function(errorStr) {
                        logger.error("Remote UnHold Transfer Event FAILED!! - " + errorStr);
                        handleRequestFailure(call);
                    });
                }, function(errorStr) {
                    logger.error("Remote UnHold FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                });
                break;
            case transferEvent.renegotiationCompleted_fsm:
                triggerCallState(callStates.RENEGOTIATION);
            break;
            case transferEvent.remoteOffer_fsm:
            case transferEvent.remoteCallUpdate_fsm:
                _webRtcManager.processUpdate(call, function(sdp) {
                    logger.info("onStateChange.transferEvent.remoteCallUpdate_fsm->processUpdate : sdp " + sdp);
                    _callControlService.respondCallUpdate(call.id, sdp, function() {
                        logger.info("Remote Call Update Transfer Event Successful. callId: " + call.id);
                        self.delegateToCallFSM(call, fsmNotificationEvent.remoteOfferProcessed_JSL);
                    }, function(errorStr) {
                        logger.error("Remote Call Update Transfer Event FAILED!! - " + errorStr);
                        handleRequestFailure(call);
                    });
                }, function(errorStr) {
                    logger.error("Remote Call Update FAILED!! - " + errorStr);
                    handleWebrtcFailure(call);
                }, call.currentState === fsmState.LOCAL_HOLD ? true : false);
                break;
            case transferEvent.respondCallHoldUpdate_fsm:
                isJoin = call.call.getJoin();
                _webRtcManager.processHoldRespond(call, function() {
                    logger.info("Respond Call Hold Update Event Successful. callId: " + call.id);
                    switch (_callFSM.getCurrentState(call)) {
                        case fsmState.REMOTE_HOLD:
                            triggerCallState(callStates.ON_REMOTE_HOLD);
                            break;
                        case fsmState.LOCAL_HOLD:
                        case fsmState.BOTH_HOLD:
                            triggerCallState(callStates.ON_HOLD);
                            if (typeof call.transferTrigger === 'function') {
                                call.transferTrigger();
                            }
                            break;
                        case fsmState.COMPLETED:
                            triggerCallState(callStates.IN_CALL);
                            break;
                    }
                }, function(e) {
                    logger.error("Respond Call Hold Update Event FAILED: " + e);
                    triggerQueue(call);
                }, isJoin);

                //enable clicking
                call.call.setButtonDisabler(false);
                call.call.clearBtnTimeout();

                if (isJoin === true) {
                    call.call.onJoin();
                }

                break;
            case transferEvent.respondCallUpdate_fsm:
                isJoin = call.call.getJoin();

                //enable clicking
                call.call.setButtonDisabler(false);
                call.call.clearBtnTimeout();

                //If this is a join call we need to send join request
                //onJoin() function is created at callController.js
                if (isJoin === true) {
                    _webRtcManager.processRespond(call, function() {
                        logger.info("Respond Call Update Event Successful. callId: " + call.id);
                        triggerCallState(callStates.RENEGOTIATION);
                    }, function(e) {
                        logger.error("Respond Call Update Event FAILED: " + e);
                        triggerQueue(call);
                    }, isJoin);

                    call.call.onJoin();
                } else {
                    _webRtcManager.processRespond(call, function() {
                        logger.info("Respond Call Update Event Successful. callId: " + call.id);
                        switch (_callFSM.getCurrentState(call)) {
                            case fsmState.REMOTE_HOLD:
                                triggerCallState(callStates.ON_REMOTE_HOLD);
                                break;
                            case fsmState.BOTH_HOLD:
                                triggerCallState(callStates.ON_HOLD);
                                break;
                            case fsmState.LOCAL_HOLD:
                                triggerCallState(callStates.ON_HOLD);
                                break;
                            case fsmState.COMPLETED:
                                triggerCallState(callStates.IN_CALL);
                                break;
                        }
                    }, function(e) {
                        logger.error("Respond Call Update Event FAILED: " + e);
                        triggerQueue(call);
                    }, isJoin);
                }
                break;
            case transferEvent.remotePranswer_fsm:
                // Workaround for webrtc dtls and firefox pranswer support bug. Can be removed when fixed by browsers.
                // https://code.google.com/p/webrtc/issues/detail?id=3349
                // https://bugzilla.mozilla.org/show_bug.cgi?id=1004510
                if (_webRtcManager.isDtlsEnabled()) {
                    if (call.peer.signalingState === CONSTANTS.WEBRTC.RTC_SIGNALING_STATE.STABLE) {
                        logger.info("Only first sessionProgress notification is processed, so ignoring this one.");
                        triggerQueue(call);
                    } else {
                        _webRtcManager.processAnswer(call,
                                function () {
                                    triggerCallState(callStates.EARLY_MEDIA);
                                },
                                function (e) {
                                    logger.error("Process answer for session progress FAILED: " + e);
                                    triggerQueue(call);
                                });
                    }
                } else {
                    _webRtcManager.processPreAnswer(
                            call,
                            function () {
                                triggerCallState(callStates.EARLY_MEDIA);
                            },
                            function (e) {
                                logger.error("Process pranswer FAILED: " + e);
                                triggerQueue(call);
                            }
                    );
                }
                break;
            case transferEvent.joining_fsm:
                //if client is handling the refers from referer we need to trigger the refers for partyB and partyC
                if (fcsConfig.clientControlled === "true") {
                    call.referCall = function(referTo, referredBy) {
                        _callControlService.refer(call.id, referTo, referredBy, function() {
                            logger.info("Joining Event Successful. callId: " + call.id);
                            self.delegateToCallFSM(call, fsmNotificationEvent.refer_JSL);
                        }, function(errorStr) {
                            logger.error("Joining Event FAILED!!" + errorStr);
                        });
                    };
                }
                triggerQueue(call);
                break;
            case transferEvent.transferSuccess_fsm:
                _callControlService.endCall(call.id, function() {
                    logger.info("callControlService.endCall successful. callId: " + call.id);
                }, function() {
                    logger.error("callControlService.endCall FAILED!! callId: " + call.id);
                });
                clearResources(call);
                triggerCallState(callStates.TRANSFERRED);
                logger.info("endCall successful. callId: " + call.id);
                break;
            case transferEvent.stateReverted_fsm:
                //enable clicking
                call.call.setButtonDisabler(false);
                call.call.clearBtnTimeout();

                switch (_callFSM.getCurrentState(call)) {
                    case fsmState.REMOTE_HOLD:
                        triggerCallStateWithoutQueue(callStates.ON_REMOTE_HOLD);
                        break;
                    case fsmState.BOTH_HOLD:
                        triggerCallStateWithoutQueue(callStates.ON_HOLD);
                        break;
                    case fsmState.LOCAL_HOLD:
                        triggerCallStateWithoutQueue(callStates.ON_HOLD);
                        break;
                    case fsmState.COMPLETED:
                        triggerCallStateWithoutQueue(callStates.IN_CALL);
                        break;
                    default:
                        logger.error("CANNOT REVERT THE STATE: " + _callFSM.getCurrentState(call) + ". callId: " + call.id);
                        break;
                }
                break;
            case transferEvent.glareCondition_fsm:
                handleFailure(call, null, null, {
                    handler: call.lastUpdateRequest.handler,
                    args: call.lastUpdateRequest.args,
                    timeout: call.retryAfter});
                break;
            default:
                logger.error("Undefined transition event: " + event + " for " + call.id);
                triggerQueue(call);
                break;

        }

    };

    self.refreshVideoRenderer = function (data) {
        var internalCall = calls[data.callid];
        if (internalCall) {
            _webRtcManager.refreshVideoRenderer(internalCall);
        }
    };

    self.hasVideoDevice = function() {
        return _webRtcManager.isVideoSourceAvailable();
    };

    self.hasAudioDevice = function() {
        return _webRtcManager.isAudioSourceAvailable();
    };

    self.getLocalVideoResolutions = function() {
        return _webRtcManager.getLocalVideoResolutions();
    };

    self.getRemoteVideoResolutions = function() {
        return _webRtcManager.getRemoteVideoResolutions();
    };

    self.isCallMuted = function (data) {
        return _webRtcManager.isAudioMuted(calls[data.callid]);
    };

    /* DEPRECIATED */
    self.isVideoNegotationAvailable = function (data) {
        var call = calls[data.callid];
        if (call.sdp){
            return _sdpParser.isSdpHasVideo(call.sdp);
        } else {
            return false;
        }
    };

    self.isVideoNegotiationAvailable = function (data) {
        var call = calls[data.callid];
        if (call.sdp){
            return _sdpParser.isSdpHasVideo(call.sdp);
        } else {
            return false;
        }
    };

    self.getHoldStateOfCall = function (data) {
        var internalCall = calls[data.callid];
        if (internalCall) {
            return CALL_HOLD_STATES[_callFSM.getCurrentState(internalCall)];
        }
        return undefined;
    };

    self.canOriginatorSendLocalVideo = function (data) {
        var call = calls[data.callid];
        if (call) {
            return _webRtcManager.canOriginatorSendLocalVideo(call);
        }
        return false;
    };

    self.canOriginatorReceiveRemoteVideo = function (data) {
        var call = calls[data.callid];
        if (call) {
            return _webRtcManager.canOriginatorReceiveRemoteVideo(call);
        }
        return false;
    };

    self.getStreamById = function (data) {
        return _webRtcManager.getStreamById(data.streamId);
    };

    self.removeStreamById = function (data) {
        _webRtcManager.removeStreamById(data.streamId);
    };

    self.setSelectedMicrophoneId = function(data){
        _webRtcManager.setSelectedMicrophoneId(data.microphoneId);
    };

    self.setSelectedSpeakerId = function(data){
        _webRtcManager.setSelectedSpeakerId(data.speakerId);
    };

    self.setSelectedCameraId = function(data){
        _webRtcManager.setSelectedCameraId(data.cameraId);
    };

    self.getSelectedMicrophoneId = function() {
        return _webRtcManager.getSelectedMicrophoneId();
    };

    self.getSelectedSpeakerId = function() {
        return _webRtcManager.getSelectedSpeakerId();
    };

    self.getSelectedCameraId = function() {
        return _webRtcManager.getSelectedCameraId();
    };

    self.getCameraList = function(params){
        _webRtcManager.getCameraList(function(cameraList){
            _utils.callFunctionIfExist(params.onSuccess, cameraList);
        });
    };

    self.getMicrophoneList = function(params){
        _webRtcManager.getMicrophoneList(function(microphoneList){
            _utils.callFunctionIfExist(params.onSuccess, microphoneList);
        });
    };

    self.getSpeakerList = function(params){
        _webRtcManager.getSpeakerList(function(speakerList){
            _utils.callFunctionIfExist(params.onSuccess, speakerList);
        });
    };

    NotificationCallBacks.call = function handleIncomingCall(data) {
        // disabling the notifications for verizon demo
        if (!_fcs.notification.isAnonymous()) {
            var sdp, actions, params, calls,
                    call = null,
                    callid = null,
                    options = {},
                    callParams = data.callNotificationParams,
                    dispositionParams = data.callDispositionParams,
                    sessionParams = data.sessionParams;

            //Since session also include disposition use it as default
            params = sessionParams ? sessionParams : (dispositionParams ? dispositionParams : null);
            logger.info("params: " + params);

            if (params) {
                actions = params.actions;
                logger.info("actions: " + actions);
                if (params.sessionData) {
                    callid = params.sessionData;
                    calls = self.getCalls();
                    if (calls[callid] !== undefined) {
                        logger.info("call already exists: " + callid);
                        return;
                    }
                    logger.info("sessionData: " + callid);
                }
                if (actions) {
                    options.reject = (actions.indexOf("reject", 0) > -1);
                    options.forward = (actions.indexOf("forward", 0) > -1);
                    options.answer = (actions.indexOf("answer", 0) > -1);
                }
                if (params.sdp) {
                    sdp = params.sdp;
                }
            }

            call = new self.IncomingCall(callid, options);
            call.callerNumber = _utils.getProperty(callParams, 'callerDisplayNumber');
            call.callerName = _utils.getProperty(callParams, 'callerName');
            call.calleeNumber = _utils.getProperty(callParams, 'calleeDisplayNumber');
            call.primaryContact = _utils.getProperty(callParams, 'primaryContact');
            if (call.primaryContact) {
                call.primaryContact = call.primaryContact.split(";")[0];
            }

            self.cerateIncomingCallInFSM(call, sdp);

            //notify the callback
            _utils.callFunctionIfExist(_fcs.call.onReceived, call);
        }
    };

    function handleCallControlNotification(type, data) {
        var sessionParams = data.sessionParams;
        logger.info("CallControl notification received " + type + " sessionData:" + sessionParams.sessionData);
        if (sessionParams.referTo) {
            logger.info("CallControl notification received: " + "referTo:" + sessionParams.referTo + " referredBy: " + sessionParams.referredBy);
        }
        if (sessionParams) {
            self.onNotificationEvent(type, sessionParams);
        }
    }

    NotificationCallBacks.ringing = function(data) {
        handleCallControlNotification(fsmNotificationEvent.ringing_Notify, data);
    };

    NotificationCallBacks.sessionProgress = function(data) {
        //We are discarding the sessionProgress if the SDP is empty
        if (data.sessionParams.sdp !== "") {
            handleCallControlNotification(fsmNotificationEvent.sessionProgress, data);
        }
        else {
            logger.info("Warning: SDP of sessionProgress is empty.");
        }
    };

    NotificationCallBacks.startCallUpdate = function handleStartCallUpdateNotification(data) {
        var sdp = data.sessionParams.sdp,
                notificationEvent = fsmNotificationEvent.startCallUpdate_slowStart_Notify,

                callid = data.sessionParams.sessionData,
                callParams = data.callNotificationParams,
                internalCall = calls[callid],
                remoteCallParams = {RemoteDisplayName:"", RemoteDisplayNumber:""};

        if (sdp) {
            _sdpParser.init(sdp);
            if (_sdpParser.isRemoteHold()) {
                notificationEvent = fsmNotificationEvent.startCallUpdate_remoteHold_Notify;
            }
            else {
                notificationEvent = fsmNotificationEvent.startCallUpdate_remoteOffer_Notify;
            }
        }

        if(internalCall) {
            if(!internalCall.remoteDisplayNumber) {
                internalCall.remoteDisplayNumber = utils.getProperty(callParams, 'callerDisplayNumber');
            }

            if(internalCall.remoteDisplayNumber !== utils.getProperty(callParams, 'callerDisplayNumber')) {
                internalCall.remoteDisplayNumber = utils.getProperty(callParams, 'callerDisplayNumber');

                remoteCallParams.RemoteDisplayName = utils.getProperty(callParams, 'callerName');
                remoteCallParams.RemoteDisplayNumber = utils.getProperty(callParams, 'callerDisplayNumber');

                utils.callFunctionIfExist(fcs.call.onRemoteEndPointChange, remoteCallParams);
            }
        }

        handleCallControlNotification(notificationEvent, data);
    };

    NotificationCallBacks.respondCallUpdate = function handleRespondCallUpdateNotification(data) {
        if (data.sessionParams && data.sessionParams.retryAfter) {
            handleCallControlNotification(fsmNotificationEvent.respondCallUpdate_glareCondition_Notify, data);
        }
        else {
            handleCallControlNotification(fsmNotificationEvent.respondCallUpdate_Notify, data);
        }
    };

    NotificationCallBacks.sessionComplete = function handleSssionCompleteNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.sessionComplete_Notify, data);
    };

    NotificationCallBacks.sessionFail = function handleSessionFailNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.sessionFail_Notify, data);
    };

    NotificationCallBacks.callEnd = function handleCallEndNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.callEnd_Notify, data);
    };

    NotificationCallBacks.trying = function handleTryingNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.trying_Notify, data);
    };

    NotificationCallBacks.callCancel = function handleCallCancelNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.callCancel_Notify, data);
    };

    NotificationCallBacks.accepted = function handleAcceptedNotification(data) {
        handleCallControlNotification(fsmNotificationEvent.accepted_Notify, data);
    };

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED, onSubscriptionReEstablished);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.CONNECTION_REESTABLISHED, onConnectionLost);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.NOTIFICATION_CHANNEL_LOST, onConnectionLost);


};

//@{fcs-jsl-prod}
var CallManager = function(_webRtcManager, _callFSM, _callControlService,_sdpParser, _logManager, _globalBroadcaster, _utils, _fcs) {
    return new CallManagerImpl(_webRtcManager || webRtcManager,
                               _callFSM || callFSM,
                               _callControlService || callControlService,
                               _sdpParser || sdpParser,
                               _logManager || logManager,
                               _globalBroadcaster || globalBroadcaster,
                               _utils || utils,
                               _fcs || fcs);
};

var callManager = new CallManager();

addToServiceList("call", "spidr", callManager);

if (__testonly__) { __testonly__.CallManager = CallManager; }
if (__testonly__) { __testonly__.OutgoingCall = callManager.OutgoingCall;}
if (__testonly__) { __testonly__.callManagerService = callManager; }
//@{fcs-jsl-prod}



/*
 * Finite State machine that defines state transition of basic call model.
 * State machine fires events during state transitions.
 * Components should register to FSM  in order to receive transition events
 *
 */

var RccFSMImpl = function(_logManager) {

    this.CallFSMState = {
        INIT: "INIT",
        MAKING_CALL: "MAKING_CALL",
        CALL_IN_PROGRESS: "CALL_IN_PROGRESS",
        RINGING: "RINGING",
        ANSWERED: "ANSWERED",
        CALL_RECEIVED: "CALL_RECEIVED",
        DEFLECTING_CALL: "DEFLECTING_CALL",
        ENDING_CALL: "ENDING_CALL",
        CALL_ENDED: "CALL_ENDED",
        HOLDING_CALL: "HOLDING_CALL",
        LOCAL_HOLD: "LOCAL_HOLD",
        REMOTE_HOLD: "REMOTE_HOLD",
        BOTH_HOLD: "BOTH_HOLD",
        RETRIEVING_CALL: "RETRIEVING_CALL",
        BLIND_TRANSFERING: "BLIND_TRANSFERING",
        ANSWERING_CALL: "ANSWERING_CALL",
        MAKING_CONSULTATIVE_TRANSFER: "MAKING_CONSULTATIVE_TRANSFER",
        CONFERENCING_CALL : "CONFERENCING_CALL",
        CONFERENCED_CALL : "CONFERENCED_CALL"
    };

    //CallFSM returns TransferEvent after state change
    this.TransferEvent = {
        unknownNotification_fsm: "unknownNotification_fsm",
        makeCall_fsm: "makeCall_fsm",
        callInProgress_fsm: "callInProgress_fsm",
        ringing_fsm: "ringing_fsm",
        answered_fsm: "answered_fsm",
        callReceived_fsm: "callReceived_fsm",
        callFailed_fsm: "callFailed_fsm",
        callEnded_fsm: "callEnded_fsm",
        endCall_fsm: "endCall_fsm",
        blind_transfering_fsm: "blind_transfering_fsm",
        holdCall_fsm: "holdCall_fsm",
        callHeldLocally_fsm: "callHeldLocally_fsm",
        callRetrievedLocally_fsm: "callRetrievedLocally_fsm",
        callHeldRemotely_fsm: "callHeldRemotely_fsm",
        callRetrievedRemotely_fsm: "callRetrievedRemotely_fsm",
        callHeldBoth_fsm: "callHeldBoth_fsm",
        answerCall_fsm: "answerCall_fsm",
        deflectCall_fsm: "deflectCall_fsm",
        consultativeTransfer_fsm: "consultativeTransfer_fsm",
        redirected_fsm: "redirected_fsm",
        callBlindTransferred_fsm: "callBlindTransferred_fsm",
        callConsultativeTransferred_fsm:"callConsultativeTransferred_fsm",
        callTransferred_fsm:"callTransferred_fsm",
        conferencing_fsm : "conferencing_fsm",
        conferenced_fsm : "conferenced_fsm"
    };

    //CallFSM receives NotificationEvent
    this.NotificationEvent = {
        unknowNotify: "unknowNotify",
        callInProgress: "callInProgress",
        ringing: "ringing",
        answered: "answered",
        callHeldRemotely: "callHeldRemotely",
        callRetrievedRemotely: "callRetrievedRemotely",
        callHeldLocally: "callHeldLocally",
        callRetrievedLocally: "callRetrievedLocally",
        callTransferred: "callTransferred",
        callReceived: "callReceived",
        redirected: "redirected",
        callFailed: "callFailed",
        callEnded: "callEnded",
        makeCall_GUI: "makeCall_GUI",
        deflectCall_GUI: "deflectCall_GUI",
        endCall_GUI: "endCall_GUI",
        holdCall_GUI: "holdCall_GUI",
        blind_transfering_GUI: "blind_transfering_GUI",
        retrieveCall_GUI: "retrieveCall_GUI",
        answerCall_GUI: "answerCall_GUI",
        consultativeTransfer_GUI: "consultativeTransfer_GUI",
        conferenceCall_GUI : "conferenceCall_GUI",
        conferenced : "conferenced"
    };
    var self = this, logger = _logManager.getLogger("rccFSM");

    function FSM(call, event, onSuccess, onFailure) {
        //TODO move sessionProgress somewhere else?
        var callState = self.getCurrentState(call);

        switch (callState) {
            case self.CallFSMState.INIT:
                switch (event) {
                    case self.NotificationEvent.makeCall_GUI:
                        call.currentState = self.CallFSMState.MAKING_CALL;
                        onSuccess(call, self.TransferEvent.makeCall_fsm);
                        break;
                    case self.NotificationEvent.callInProgress:
                        call.currentState = self.CallFSMState.CALL_IN_PROGRESS;
                        onSuccess(call, self.TransferEvent.callInProgress_fsm);
                        break;
                    case self.NotificationEvent.callReceived:
                        call.currentState = self.CallFSMState.CALL_RECEIVED;
                        onSuccess(call, self.TransferEvent.callReceived_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.MAKING_CALL:
                switch (event) {
                    case self.NotificationEvent.callInProgress:
                        call.currentState = self.CallFSMState.CALL_IN_PROGRESS;
                        onSuccess(call, self.TransferEvent.callInProgress_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.CALL_IN_PROGRESS:
                switch (event) {
                    case self.NotificationEvent.ringing:
                        call.currentState = self.CallFSMState.RINGING;
                        onSuccess(call, self.TransferEvent.ringing_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }

                break;
            case self.CallFSMState.RINGING:
                switch (event) {
                    case self.NotificationEvent.answered:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.answered_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    case self.NotificationEvent.endCall_GUI:
                        call.currentState = self.CallFSMState.ENDING_CALL;
                        onSuccess(call, self.TransferEvent.endCall_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.CALL_RECEIVED:
                switch (event) {
                    case self.NotificationEvent.deflectCall_GUI:
                        call.currentState = self.CallFSMState.DEFLECTING_CALL;
                        onSuccess(call, self.TransferEvent.deflectCall_fsm);
                        break;
                    case self.NotificationEvent.redirected:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.redirected_fsm);
                        break;
                    case self.NotificationEvent.endCall_GUI:
                        call.currentState = self.CallFSMState.ENDING_CALL;
                        onSuccess(call, self.TransferEvent.endCall_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    case self.NotificationEvent.answered:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.answered_fsm);
                        break;
                    case self.NotificationEvent.answerCall_GUI:
                        call.currentState = self.CallFSMState.ANSWERING_CALL;
                        onSuccess(call, self.TransferEvent.answerCall_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.ANSWERING_CALL:
                switch (event) {
                    case self.NotificationEvent.answered:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.answered_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    case self.NotificationEvent.endCall_GUI:
                        call.currentState = self.CallFSMState.ENDING_CALL;
                        onSuccess(call, self.TransferEvent.endCall_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.CONFERENCING_CALL:
                switch (event) {
                    case self.NotificationEvent.conferenced:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.conferenced_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.DEFLECTING_CALL:
                switch (event) {
                    case self.NotificationEvent.redirected:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.redirected_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.ANSWERED:
                switch (event) {
                    case self.NotificationEvent.endCall_GUI:
                        call.currentState = self.CallFSMState.ENDING_CALL;
                        onSuccess(call, self.TransferEvent.endCall_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    case self.NotificationEvent.holdCall_GUI:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.HOLDING_CALL;
                        onSuccess(call, self.TransferEvent.holdCall_fsm);
                        break;
                    case self.NotificationEvent.callHeldLocally:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.LOCAL_HOLD;
                        onSuccess(call, self.TransferEvent.callHeldLocally_fsm);
                        break;
                    case self.NotificationEvent.blind_transfering_GUI:
                        call.currentState = self.CallFSMState.BLIND_TRANSFERING;
                        onSuccess(call, self.TransferEvent.blind_transfering_fsm);
                        break;
                    case self.NotificationEvent.callHeldRemotely:
                        call.currentState = self.CallFSMState.REMOTE_HOLD;
                        onSuccess(call, self.TransferEvent.callHeldRemotely_fsm);
                        break;
                    case self.NotificationEvent.consultativeTransfer_GUI:
                        call.currentState = self.CallFSMState.MAKING_CONSULTATIVE_TRANSFER;
                        onSuccess(call, self.TransferEvent.consultativeTransfer_fsm);
                        break;
                    case self.NotificationEvent.conferenceCall_GUI:
                        call.currentState = self.CallFSMState.CONFERENCING_CALL;
                        onSuccess(call, self.TransferEvent.conferencing_fsm);
                        break;
                    case self.NotificationEvent.conferenced:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.conferenced_fsm);
                        break;
                    case self.NotificationEvent.callTransferred:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callTransferred_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.ENDING_CALL:
                switch (event) {
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.BLIND_TRANSFERING:
                switch (event) {
                    case self.NotificationEvent.callTransferred:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callBlindTransferred_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.REMOTE_HOLD:
                switch (event) {
                    case self.NotificationEvent.callRetrievedRemotely:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.callRetrievedRemotely_fsm);
                        break;
                    case self.NotificationEvent.blind_transfering_GUI:
                        call.currentState = self.CallFSMState.BLIND_TRANSFERING;
                        onSuccess(call, self.TransferEvent.blind_transfering_fsm);
                        break;
                    case self.NotificationEvent.holdCall_GUI:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.HOLDING_CALL;
                        onSuccess(call, self.TransferEvent.holdCall_fsm);
                        break;
                    case self.NotificationEvent.callHeldLocally:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.BOTH_HOLD;
                        onSuccess(call, self.TransferEvent.callHeldBoth_fsm);
                        break;
                    case self.NotificationEvent.endCall_GUI:
                        call.currentState = self.CallFSMState.ENDING_CALL;
                        onSuccess(call, self.TransferEvent.endCall_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    case self.NotificationEvent.callTransferred:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callTransferred_fsm);
                        break;
                    case self.NotificationEvent.conferenced:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.conferenced_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.HOLDING_CALL:
                switch (event) {
                    case self.NotificationEvent.callHeldLocally:
                        call.currentState = self.CallFSMState.LOCAL_HOLD;
                        if (call.previousState === self.CallFSMState.REMOTE_HOLD) {
                            call.currentState = self.CallFSMState.BOTH_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call, self.TransferEvent.callHeldLocally_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.LOCAL_HOLD:
                switch (event) {
                    case self.NotificationEvent.retrieveCall_GUI:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.RETRIEVING_CALL;
                        onSuccess(call, self.TransferEvent.retrieveCall_fsm);
                        break;
                    case self.NotificationEvent.callRetrievedLocally:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.callRetrievedLocally_fsm);
                        break;
                    case self.NotificationEvent.endCall_GUI:
                        call.currentState = self.CallFSMState.ENDING_CALL;
                        onSuccess(call, self.TransferEvent.endCall_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    case self.NotificationEvent.callHeldRemotely:
                        call.currentState = self.CallFSMState.BOTH_HOLD;
                        onSuccess(call, self.TransferEvent.callHeldBoth_fsm);
                        break;
                    case self.NotificationEvent.blind_transfering_GUI:
                        call.currentState = self.CallFSMState.BLIND_TRANSFERING;
                        onSuccess(call, self.TransferEvent.blind_transfering_fsm);
                        break;
                    case self.NotificationEvent.callTransferred:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callTransferred_fsm);
                        break;
                    case self.NotificationEvent.conferenced:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.conferenced_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.MAKING_CONSULTATIVE_TRANSFER:
                switch (event) {
                    case self.NotificationEvent.callTransferred:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callConsultativeTransferred_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.RETRIEVING_CALL:
                switch (event) {
                    case self.NotificationEvent.callRetrievedLocally:
                        call.currentState = self.CallFSMState.ANSWERED;
                        if (call.previousState === self.CallFSMState.BOTH_HOLD) {
                            call.currentState = self.CallFSMState.REMOTE_HOLD;
                        }
                        call.previousState = callState;
                        onSuccess(call, self.TransferEvent.callRetrievedLocally_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
            case self.CallFSMState.BOTH_HOLD:
                switch (event) {
                    case self.NotificationEvent.callRetrievedRemotely:
                        call.currentState = self.CallFSMState.LOCAL_HOLD;
                        onSuccess(call, self.TransferEvent.callRetrievedRemotely_fsm);
                        break;
                    case self.NotificationEvent.callHeldLocally:
                        onSuccess(call, self.TransferEvent.callHeldBoth_fsm);
                        break;
                    case self.NotificationEvent.retrieveCall_GUI:
                        call.previousState = call.currentState;
                        call.currentState = self.CallFSMState.RETRIEVING_CALL;
                        onSuccess(call, self.TransferEvent.retrieveCall_fsm);
                        break;
                    case self.NotificationEvent.callRetrievedLocally:
                        call.currentState = self.CallFSMState.REMOTE_HOLD;
                        onSuccess(call, self.TransferEvent.callRetrievedLocally_fsm);
                        break;
                    case self.NotificationEvent.callHeldRemotely:
                        onSuccess(call, self.TransferEvent.callHeldBoth_fsm);
                        break;
                    case self.NotificationEvent.endCall_GUI:
                        call.currentState = self.CallFSMState.ENDING_CALL;
                        onSuccess(call, self.TransferEvent.endCall_fsm);
                        break;
                    case self.NotificationEvent.callEnded:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callEnded_fsm);
                        break;
                    case self.NotificationEvent.callFailed:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callFailed_fsm);
                        break;
                    case self.NotificationEvent.blind_transfering_GUI:
                        call.currentState = self.CallFSMState.BLIND_TRANSFERING;
                        onSuccess(call, self.TransferEvent.blind_transfering_fsm);
                        break;
                    case self.NotificationEvent.callTransferred:
                        call.currentState = self.CallFSMState.INIT;
                        onSuccess(call, self.TransferEvent.callTransferred_fsm);
                        break;
                    case self.NotificationEvent.conferenced:
                        call.currentState = self.CallFSMState.ANSWERED;
                        onSuccess(call, self.TransferEvent.conferenced_fsm);
                        break;
                    default:
                        onFailure(call, self.TransferEvent.unknownNotification_fsm);
                        break;
                }
                break;
        }
    }

    self.getCurrentState = function(call) {
        return (call.currentState ? call.currentState : self.CallFSMState.INIT);
    };

    this.handleEvent = function(call, event, handler) {
        var initialCallState;
        if (call) {
            initialCallState = self.getCurrentState(call);
            logger.info("FSM received NotificationEvent: " + event + " @ " +
                    initialCallState + " state" + ". Call Id: " + call.id);

            FSM(call, event,
                    function(call, transferEvent) {
                        logger.debug("FSM handleEvent successful. (Call FSM) State Passed from " +
                                initialCallState + " to " +
                                self.getCurrentState(call) + ". TransferEvent: " +
                                transferEvent + ". Call Id: " + call.id);
                        handler(call, transferEvent);
                    },
                    function(call, transferEvent) {
                        logger.error("FSM handleEvent failure: " + transferEvent +
                                " @ " + self.getCurrentState(call) + ". Call Id: " +
                                call.id);
                        handler(call, transferEvent);
                    });
        }
        else if (event === self.NotificationEvent.callFailed) {
            //Server not recaived callid in call_failed notify
            //handler(call, self.TransferEvent.callFailed_fsm);
            // TODO: Remove the following log. Added to build the project.
            logger.info("self.NotificationEvent.callFailed");
        }
    };
};

//@{fcs-jsl-prod}
var RccFSM = function(_logManager) {
    return new RccFSMImpl(_logManager || logManager);
};

var rccFSM = new RccFSM();

if (__testonly__) {
    __testonly__.RccFSM = RccFSM;
    fcs.RccFSM = rccFSM;
}
//@{fcs-jsl-prod}


var RccControlServiceImpl = function (_server, _logManager) {

    var logger = _logManager.getLogger("rccControlService");

    function genericErrorParser(jqXHR, property) {
        try {
            return JSON.parse(jqXHR.responseText)[property];
        } catch (e) {
            return jqXHR.status;
        }
    }

    // the following 5 response syntaxes are defined in the REST API.
    function callRequestPostPutErrorParser(jqXHR) {
        return genericErrorParser(jqXHR, 'rccCallResponse');
    }

    function callRequestDeleteErrorParser(jqXHR) {
        return genericErrorParser(jqXHR, 'rccCallResponse');
    }

    function getDeviceListRequestErrorParser(jqXHR) {
        return genericErrorParser(jqXHR, 'rccDeviceResponse');
    }

    function sessionRequestPostPutErrorParser(jqXHR) {
        return genericErrorParser(jqXHR, 'rccSessionResponse');
    }

    function sessionRequestDeleteErrorParser(jqXHR) {
        return genericErrorParser(jqXHR, 'rccSessionResponse');
    }

    // TODO: For now in rest error response cases, given error handler is
    // called with an empty argument list. Can be refactored to map to an fcs.Errors
    // if overall JSL rest error refactoring is being done.

    function isUserMonitor(deviceID) {
        return deviceID === null;
    }

    function rccToRccDevice() {
        return "/rcc/rccdevice";
    }

    function rccToSession(deviceID) {
        if (isUserMonitor(deviceID)) {
            return "/rcc/session";
        } else {
            return "/rcc/rccdevice/" + deviceID + "/session";
        }
    }

    function rccToSessionID(deviceID, sessionID) {
        return rccToSession(deviceID) + "/" + sessionID;
    }

    function rccToCall(deviceID, sessionID) {
        return rccToSessionID(deviceID, sessionID) + "/call";
    }

    function rccToCallID(deviceID, sessionID, callID) {
        return rccToCall(deviceID, sessionID) + "/" + callID;
    }

    this.startMonitor = function (requestData, onSuccess, onFailure) {

        var urlPostfix, data = {
            "rccSessionRequest":
                    {
                        "eventType": "generic"
                    }
        };

        urlPostfix = rccToSession(requestData.deviceID);

        _server.sendPostRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, function () {
            onFailure();
        }, null, sessionRequestPostPutErrorParser);
    };
    this.extendMonitor = function (requestData, onSuccess, onFailure) {
        var data = null, urlPostfix;

        urlPostfix = rccToSessionID(requestData.deviceID, requestData.sessionID);

        _server.sendPutRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, function () {
            onFailure();
        }, null, sessionRequestPostPutErrorParser);

    };
    this.stopMonitor = function (requestData, onSuccess, onFailure) {
        var urlPostfix;

        urlPostfix = rccToSessionID(requestData.deviceID, requestData.sessionID);

        _server.sendDeleteRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": {}
        }, onSuccess, function () {
            onFailure();
        }, null, sessionRequestDeleteErrorParser);

    };
    this.makeCall = function (requestData, onSuccess, onFailure) {

        var urlPostfix, data = {
            "rccCallRequest":
                    {
                        "action": "makeCall",
                        "destination": requestData.destination
                    }
        };

        urlPostfix = rccToCall(requestData.deviceID, requestData.sessionID);

        _server.sendPostRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, function () {
            onFailure();
        }, null, callRequestPostPutErrorParser);

    };
    this.holdCall = function (requestData, onSuccess, onFailure) {

        var urlPostfix, data = {
            "rccCallRequest":
                    {
                        "action": "holdCall"
                    }
        };

        urlPostfix = rccToCallID(requestData.deviceID, requestData.sessionID, requestData.callId);

        _server.sendPutRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, function () {
            onFailure();
        }, null, callRequestPostPutErrorParser);

    };

    this.retrieveCall = function (requestData, onSuccess, onFailure) {

        var urlPostfix, data = {
            "rccCallRequest":
                    {
                        "action": "retrieveCall"
                    }
        };

        urlPostfix = rccToCallID(requestData.deviceID, requestData.sessionID, requestData.callId);

        _server.sendPutRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, function () {
            onFailure();
        }, null, callRequestPostPutErrorParser);

    };
    this.endCall = function (requestData, onSuccess, onFailure) {
        var urlPostfix;

        urlPostfix = rccToCallID(requestData.deviceID, requestData.sessionID, requestData.callId);

        _server.sendDeleteRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": {}
        }, onSuccess, function () {
            onFailure();
        }, null, callRequestDeleteErrorParser);

    };
    this.deflectCall = function (requestData, onSuccess, onFailure) {

        var urlPostfix, data = {
            "rccCallRequest":
                    {
                        "action": "deflectCall",
                        "destination": requestData.destination
                    }
        };

        urlPostfix = rccToCallID(requestData.deviceID, requestData.sessionID, requestData.callId);

        _server.sendPutRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, function () {
            onFailure();
        }, null, callRequestPostPutErrorParser);

    };
    this.blindTransfer = function (requestData, onSuccess, onFailure) {

        var urlPostfix, data = {
            "rccCallRequest":
                    {
                        "action": "blindTransfer",
                        "destination": requestData.destination
                    }
        };

        urlPostfix = rccToCallID(requestData.deviceID, requestData.sessionID, requestData.callId);

        _server.sendPutRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, function () {
            onFailure();
        }, null, callRequestPostPutErrorParser);

    };

    this.consultativeTransfer = function (requestData, onSuccess, onFailure) {

        var urlPostfix, data = {
            "rccCallRequest":
                    {
                        "action": "consultativeTransfer",
                        "callId": requestData.targetCallId
                    }
        };

        urlPostfix = rccToCallID(requestData.deviceID, requestData.sessionID, requestData.currentCallId);

        _server.sendPutRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, function () {
            onFailure();
        }, null, callRequestPostPutErrorParser);

    };

    this.answerCall = function (requestData, onSuccess, onFailure) {

        var urlPostfix, data = {
            "rccCallRequest":
            {
                "action": "answerCall"
            }
        };

        urlPostfix = rccToCallID(requestData.deviceID, requestData.sessionID, requestData.callId);

        _server.sendPutRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, function () {
            onFailure();
        }, null, callRequestPostPutErrorParser);

    };

    this.conferenceCall = function (requestData, onSuccess, onFailure) {

        var urlPostfix, data = {
            "rccCallRequest":
                    {
                        "action": "conferenceCall",
                        "callId": requestData.targetCall
                    }
        };
        urlPostfix = rccToCallID(requestData.deviceID, requestData.sessionID, requestData.currentCall);

        server.sendPutRequest({
            "url": getWAMUrl(1, urlPostfix),
            "data": data
        }, onSuccess, onFailure, null, callRequestPostPutErrorParser);
    };

    this.getDeviceList = function (onSuccess, onFailure) {
        var urlPostfix;

        urlPostfix = rccToRccDevice();

        _server.sendGetRequest({
            "url": getWAMUrl(1, urlPostfix)
        }, onSuccess, function () {
            onFailure();
        }, null, getDeviceListRequestErrorParser);
    };
};

//@{fcs-jsl-prod}
var RccControlService = function (_server, _logManager) {
    return new RccControlServiceImpl(_server || server,
            _logManager || logManager);
};

var rccControlService = new RccControlService();

if (__testonly__) { __testonly__.RccControlService = RccControlService;}
//@{fcs-jsl-prod}

var RccManagerImpl = function (_rccFSM, _rccControlService, _logManager, _globalBroadcaster) {

    /* AUDIT_KICKOFF_TIMEOUT is the interval we use to kickoff call audit after the call is setup.
     * The timeout is there to ensure we do not hit call setup race conditions when we try to kickoff the call audit */
    var calls = {}, logger = _logManager.getLogger("rccManager"),
            fsmNotificationEvent = _rccFSM.NotificationEvent,
            fsmState = _rccFSM.CallFSMState,
            self = this,
            CALL_STATES = {
                IN_CALL: 0,
                ON_HOLD: 1,
                RINGING: 2,
                ENDED: 3,
                REJECTED: 4,
                OUTGOING: 5,
                INCOMING: 6,
                ANSWERING: 7,
                JOINED: 8,
                RENEGOTIATION: 9,
                TRANSFERRED: 10,
                ON_REMOTE_HOLD: 11,
                CALL_IN_PROGRESS: 12
            }, CALL_HOLD_STATES = {
        LOCAL_HOLD: 0,
        REMOTE_HOLD: 1,
        BOTH_HOLD: 2
    }, extendMonitorDeviceTimer = null, isMonitorStarted = false,
            isSubscription = false, sessionParam = {}, onMonitorSessionLost;

    this.IncomingCall = function (callid, opts, callee, caller) {
        var id = callid, options = opts, sendVideo = true, isJoin = false, buttonDisabler = false, btnTimeout, auditTimer, calledParty = callee, callingParty = caller;

        this.notificationQueue = new utils.Queue();
        this.onLocalStreamAdded = null;
        this.onStreamAdded = null;
        this.mute = function () {
            var param = {callid: id, mute: true};

            return self.mute(param);
        };
        this.unmute = function () {
            var param = {callid: id, mute: false};

            return self.mute(param);
        };

        this.answer = function (onSuccess, onFailure, isVideoEnabled, videoQuality) {
            var param = {callid: id, isVideoEnabled: isVideoEnabled, videoQuality: videoQuality};

            if (options.answer) {
                return self.answer(param, onSuccess, onFailure);
            } else {
                onFailure();
            }
        };

        this.reject = function (onSuccess, onFailure) {
            var param = {callid: id};

            if (options.reject) {
                return self.reject(param, onSuccess, onFailure);
            } else {
                onFailure();
            }
        };

        this.ignore = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.ignore(param, onSuccess, onFailure);
        };

        this.forward = function (address, onSuccess, onFailure) {
            var param = {callid: id, address: address};

            if (options.forward) {
                return self.forward(param, onSuccess, onFailure);
            } else {
                onFailure();
            }
        };

        this.canReject = function () {
            return options.reject === true;
        };

        this.canForward = function () {
            return options.forward === true;
        };

        this.canAnswer = function () {
            return options.answer === true;
        };

        this.canSendVideo = function () {
            var param = {callid: id};

            return self.canOriginatorSendLocalVideo(param);
        };

        this.canReceiveVideo = function () {
            var param = {callid: id};

            return self.canOriginatorReceiveRemoteVideo(param);
        };

        this.getHoldState = function () {
            var param = {callid: id};

            return self.getHoldStateOfCall(param);

        };

        this.getCalledParty = function () {
            return calledParty;
        };

        this.getCallingParty = function () {
            return callingParty;
        };

        this.getId = function () {
            return id;
        };

        this.end = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.end(param, onSuccess, onFailure);
        };

        this.hold = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.hold(param, onSuccess, onFailure);
        };

        this.unhold = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.unhold(param, onSuccess, onFailure);
        };

        this.directTransfer = function (address, onSuccess, onFailure) {
            var param = {callid: id, address: address};

            return self.directTransfer(param, onSuccess, onFailure);
        };

        this.consultativeTransfer = function (transferredCallId, onSuccess, onFailure) {
            var param = {currentCallId: id, targetCallId: transferredCallId};

            return self.consultativeTransfer(param, onSuccess, onFailure);
        };

        this.videoStop = function (onSuccess, onFailure) {
            var param = {callid: id, isVideoStart: false};

            return self.videoStopStart(param, onSuccess, onFailure);
        };

        this.videoStart = function (onSuccess, onFailure, videoQuality) {
            var param = {callid: id, isVideoStart: true, videoQuality: videoQuality};

            return self.videoStopStart(param, onSuccess, onFailure);
        };

        this.join = function (anotherCall, onSuccess, onFailure) {
            var param = {callid1: id, callid2: anotherCall.getId()};

            return self.join(param, onSuccess, onFailure);
        };

        this.sendDTMF = function (tone) {
            var param = {callid: id, tone: tone};

            return self.sendDTMF(param);
        };

        this.sendIntraFrame = function () {
            var param = {callid: id};

            if (sendVideo) {
                return self.sendIntraFrame(param);
            }
        };
        this.sendBlackFrame = function () {
            var param = {callid: id};

            return self.sendBlackFrame(param);
        };

        this.refreshVideoRenderer = function () {
            var param = {callid: id};

            return self.refreshVideoRenderer(param);
        };

        this.getJoin = function () {
            return isJoin;
        };

        this.setJoin = function (join) {
            isJoin = join;
        };

        this.getButtonDisabler = function () {
            return buttonDisabler;
        };

        this.setButtonDisabler = function (disable) {
            buttonDisabler = disable;
            if (buttonDisabler) {
                btnTimeout = setTimeout(function () {
                    buttonDisabler = false;
                },
                        4000);
            }
        };

        this.clearBtnTimeout = function () {
            clearTimeout(btnTimeout);
        };

        this.setAuditTimer = function (audit) {
            auditTimer = setInterval(function () {
                audit();
            },
                    fcsConfig.callAuditTimer ? fcsConfig.callAuditTimer : 30000);
        };

        this.clearAuditTimer = function () {
            clearInterval(auditTimer);
        };

        this.isCallMuted = function () {
            var param = {callid: id};

            return self.isCallMuted(param);
        };

        /* DEPRECIATED */
        this.isVideoNegotationAvailable = function (id) {
            var param = {callid: id};

            return self.isVideoNegotationAvailable(param);
        };

        this.isVideoNegotiationAvailable = function () {
            var param = {callid: id};

            return self.isVideoNegotiationAvailable(param);
        };
    };
    this.OutgoingCall = function (callid, callee, caller) {
        var id = callid, sendVideo = true, isJoin = false, buttonDisabler = false, btnTimeout, auditTimer, calledParty = callee, callingParty = caller;

        this.notificationQueue = new utils.Queue();

        this.onLocalStreamAdded = null;

        this.onStreamAdded = null;

        this.canSendVideo = function () {
            var param = {callid: id};

            return self.canOriginatorSendLocalVideo(param);
        };

        this.canReceiveVideo = function () {
            var param = {callid: id};

            return self.canOriginatorReceiveRemoteVideo(param);
        };

        this.getHoldState = function () {
            var param = {callid: id};

            return self.getHoldStateOfCall(param);
        };

        this.getId = function () {
            return id;
        };

        this.getCalledParty = function () {
            return calledParty;
        };

        this.getCallingParty = function () {
            return callingParty;
        };

        this.sendIntraFrame = function () {
            var param = {callid: id};

            if (sendVideo) {
                return self.sendIntraFrame(param);
            }
        };

        this.sendBlackFrame = function () {
            var param = {callid: id};

            return self.sendBlackFrame(param);
        };

        this.refreshVideoRenderer = function () {
            var param = {callid: id};

            return self.refreshVideoRenderer(param);
        };

        this.mute = function () {
            var param = {callid: id, mute: true};

            return self.mute(param);
        };

        this.unmute = function () {
            var param = {callid: id, mute: false};

            return self.mute(param);
        };

        this.end = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.end(param, onSuccess, onFailure);
        };

        this.hold = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.hold(param, onSuccess, onFailure);
        };

        this.unhold = function (onSuccess, onFailure) {
            var param = {callid: id};

            return self.unhold(param, onSuccess, onFailure);
        };

        this.directTransfer = function (address, onSuccess, onFailure) {
            var param = {callid: id, address: address};

            return self.directTransfer(param, onSuccess, onFailure);
        };

        this.consultativeTransfer = function (transfaredCallId, onSuccess, onFailure) {
            var param = {currentCallId: id, targetCallId: transfaredCallId};

            return self.consultativeTransfer(param, onSuccess, onFailure);
        };

        this.videoStop = function (onSuccess, onFailure) {
            var param = {callid: id, isVideoStart: false};

            return self.videoStopStart(param, onSuccess, onFailure);
        };

        this.videoStart = function (onSuccess, onFailure, videoQuality) {
            var param = {callid: id, isVideoStart: true, videoQuality: videoQuality};

            return self.videoStopStart(param, onSuccess, onFailure);
        };

        this.join = function (anotherCall, onSuccess, onFailure) {
            var param = {callid1: id, callid2: anotherCall.getId()};

            return self.join(param, onSuccess, onFailure);
        };

        this.sendDTMF = function (tone) {
            var param = {callid: id, tone: tone};

            return self.sendDTMF(param);
        };

        this.getJoin = function () {
            return isJoin;
        };

        this.setJoin = function (join) {
            isJoin = join;
        };

        this.getButtonDisabler = function () {
            return buttonDisabler;
        };

        this.setButtonDisabler = function (disable) {
            buttonDisabler = disable;
            if (buttonDisabler) {
                btnTimeout = setTimeout(function () {
                    buttonDisabler = false;
                },
                        4000);
            }
        };

        this.clearBtnTimeout = function () {
            clearTimeout(btnTimeout);
        };

        this.setAuditTimer = function (audit) {
            auditTimer = setInterval(function () {
                audit();
            },
                    fcsConfig.callAuditTimer ? fcsConfig.callAuditTimer : 30000);
        };

        this.clearAuditTimer = function () {
            clearInterval(auditTimer);
        };

        this.isCallMuted = function () {
            var param = {callid: id};

            return self.isCallMuted(param);
        };

        /* DEPRECIATED */
        this.isVideoNegotationAvailable = function (id) {
            var param = {callid: id};

            return self.isVideoNegotationAvailable(param);
        };

        this.isVideoNegotiationAvailable = function () {
            var param = {callid: id};

            return self.isVideoNegotiationAvailable(param);
        };
    };

    self.mute = function () {
        return;
    };
    self.reject = function () {
        return;
    };
    self.ignore = function () {
        return;
    };
    self.canOriginatorSendLocalVideo = function () {
        return;
    };
    self.canOriginatorReceiveRemoteVideo = function () {
        return;
    };
    self.videoStopStart = function () {
        return;
    };
    self.sendDTMF = function () {
        return;
    };
    self.sendIntraFrame = function () {
        return;
    };
    self.sendBlackFrame = function () {
        return;
    };
    self.refreshVideoRenderer = function () {
        return;
    };
    self.isCallMuted = function () {
        return;
    };
    /* DEPRECIATED */
    self.isVideoNegotationAvailable = function () {
        return;
    };
    self.isVideoNegotiationAvailable = function () {
        return;
    };

    function setDeviceID(deviceid) {
        sessionParam.deviceID = deviceid;
    }

    function setSessionID(sessionid) {
        sessionParam.sessionID = sessionid;
    }

    function setExpiryTime(expirytime) {
        sessionParam.expiryTime = expirytime;
    }

    function setMonitorSessionParam(deviceid, sessionid, expirytime) {
        setDeviceID(deviceid);
        setSessionID(sessionid);
        setExpiryTime(expirytime);
    }

    function getMonitorSessionParam() {
        return sessionParam;
    }

    function removeMonitorSessionParam() {
        delete sessionParam.deviceID;
        delete sessionParam.sessionID;
        delete sessionParam.expiryTime;
    }

    /*
     * clear call resources
     * @param call call object
     * @param state state that will be returned to web part
     */
    function clearResources(id) {
        delete calls[id];
    }

    function clearAllResources() {
        var id;
        logger.info("Clear all call resource from JSL Api");
        for (id in calls) {
            if (calls.hasOwnProperty(id)) {
                clearResources(id);
                logger.info("Clear call resource from JSL Api - " + id);
            }
        }
    }

    function stopExtendMonitorDeviceTimer() {
        logger.info("extend monitor device subscription timer is stopped.");
        isMonitorStarted = false;
        clearInterval(extendMonitorDeviceTimer);
        extendMonitorDeviceTimer = null;
        clearAllResources();
    }

    function extendMonitorDeviceSubscription() {
        var param = {deviceID: getMonitorSessionParam().deviceID, sessionID: getMonitorSessionParam().sessionID};
        _rccControlService.extendMonitor(param, function () {
            logger.info("extend monitor device subscription request success.");
        }, function (e) {
            stopExtendMonitorDeviceTimer();
            removeMonitorSessionParam();
            utils.callFunctionIfExist(onMonitorSessionLost, e);
            logger.info("extend monitor device subscription request failure.");
        });
    }

    function startExtendMonitorDeviceTimer(timer) {
        logger.info("extend monitor device subscription timer is started.");
        isMonitorStarted = true;
        extendMonitorDeviceTimer = setInterval(extendMonitorDeviceSubscription, timer);
    }

    self.setOnMonitorSessionLost = function (data) {
        onMonitorSessionLost = data.callback;
    };

    self.CALL_STATES = CALL_STATES;
    self.CALL_HOLD_STATES = CALL_HOLD_STATES;

    self.hasGotCalls = function () {
        var callid, internalCall;
        for (callid in calls) {
            if (calls.hasOwnProperty(callid)) {
                internalCall = calls[callid];
                if (internalCall) {
                    logger.info("has got call - id: " + callid + " - state: " + _rccFSM.getCurrentState(internalCall));
                    return true;
                }
            }
        }
        return false;
    };

    self.getCalls = function () {
        return calls;
    };

    function isCall(id) {
        if (self.getCalls()[id]) {
            return true;
        }
        return false;
    }

    self.delegateToCallFSM = function (call, stateMessage) {
        _rccFSM.handleEvent(call, stateMessage, self.onStateChange);
    };

    function monitorStarted() {
        return isMonitorStarted;
    }

    self.isSubscribed = function isSubscribed() {
        return isSubscription;
    };

    function subscriptionStarted() {
        isSubscription = true;
    }

    function subscriptionStopped() {
        if (monitorStarted()) {
            stopExtendMonitorDeviceTimer();
            removeMonitorSessionParam();
        }
        isSubscription = false;
    }

    function isDeviceMonitor(deviceID) {
        return (typeof deviceID === "string") && (deviceID.length > 0);
    }

    self.start = function (data, onSuccess, onFailure) {
        var internalCall = {},
                param = {destination: data.to,
                    deviceID: getMonitorSessionParam().deviceID,
                    sessionID: getMonitorSessionParam().sessionID};

        logger.info("start call... to: " + data.to);

        if (!monitorStarted()) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        _rccControlService.makeCall(param, function (reponse) {

            internalCall.call = new self.OutgoingCall(reponse.rccCallResponse.callId);
            internalCall.id = reponse.rccCallResponse.callId;

            self.delegateToCallFSM(internalCall, fsmNotificationEvent.makeCall_GUI);
            calls[reponse.rccCallResponse.callId] = internalCall;
            utils.callFunctionIfExist(onSuccess, internalCall.call);
        }, function (e) {
            utils.callFunctionIfExist(onFailure, e);
        }
        );
    };

    self.startMonitorDevice = function (data, onSuccess, onFailure) {

        logger.info("Called start Monitor Device function with " + data.deviceID);

        if (!self.isSubscribed()) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        // if string with length greater than 0 device monitor, otherwise
        // user monitor will be started.
        if (!isDeviceMonitor(data.deviceID)) {
            // null is used in internal logic for user monitor.
            data.deviceID = null;
        }

        var param = {deviceID: data.deviceID};

        _rccControlService.startMonitor(param, function (response) {
            setMonitorSessionParam(data.deviceID, response.rccSessionResponse.sessionId, response.rccSessionResponse.expires);
            startExtendMonitorDeviceTimer(response.rccSessionResponse.expires / 2 * 1000);
            utils.callFunctionIfExist(onSuccess);
            logger.info("Start monitor device request successfuly");
        }, function (e) {
            utils.callFunctionIfExist(onFailure, e);
            logger.info("Start monitor device request failure : " + e);
        });
    };

    self.stopMonitorDevice = function (data, onSuccess, onFailure) {
        var param = {deviceID: getMonitorSessionParam().deviceID,
            sessionID: getMonitorSessionParam().sessionID};

        logger.info("Called stop monitor device function");

        if (!monitorStarted()) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        _rccControlService.stopMonitor(param, function () {
            stopExtendMonitorDeviceTimer();
            removeMonitorSessionParam();
            utils.callFunctionIfExist(onSuccess);
            logger.info("Stop monitor device request successfuly");
        }, function (e) {
            utils.callFunctionIfExist(onFailure, e);
            logger.info("Stop monitor device request failure : " + e);
        });
    };


    self.answer = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid], currentCallState,
                param = {callId: data.callid,
                    deviceID: getMonitorSessionParam().deviceID,
                    sessionID: getMonitorSessionParam().sessionID};

        logger.info("Called call answer function.Call id : " + data.callid);

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        // Answer call is supported for only device level monitoring
        if (!isDeviceMonitor(getMonitorSessionParam().deviceID)) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _rccFSM.getCurrentState(internalCall);

        if (currentCallState === fsmState.CALL_RECEIVED) {
            internalCall.answerSuccessCallback = onSuccess;
            internalCall.answerFailureCallback = onFailure;
            //send answer call
            _rccControlService.answerCall(
                    param,
                    function () {
                        // If monitered device does not support auto answer, SPiDR returns rest request success and
                        // does not return any negative notifications. Server side solution was not available.
                        // New design is as follows: In the RCC case, JSL shall not invoke success
                        // or failure callback until established Event or endCall event is received.
                        self.delegateToCallFSM(internalCall, fsmNotificationEvent.answerCall_GUI);
                        logger.info("Call answer request successfuly.");
                    },
                    function (e) {
                        logger.info("Call answer request failure. " + e);
                    });
        } else {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        }
    };

    self.hold = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid], currentCallState,
                param = {callId: data.callid,
                    deviceID: getMonitorSessionParam().deviceID,
                    sessionID: getMonitorSessionParam().sessionID};

        logger.info("Called call hold function.Call id : " + data.callid);

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _rccFSM.getCurrentState(internalCall);

        if (currentCallState === fsmState.ANSWERED ||
                currentCallState === fsmState.REMOTE_HOLD) {
            _rccControlService.holdCall(param,
                    function () {
                        self.delegateToCallFSM(internalCall, fsmNotificationEvent.holdCall_GUI);
                        utils.callFunctionIfExist(onSuccess);
                        logger.info("Call hold request successfuly.");
                    },
                    function (e) {
                        utils.callFunctionIfExist(onFailure, e);
                        logger.info("Call hold request failure. " + e);
                    }
            );
        } else {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        }
    };

    self.unhold = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid], currentCallState,
                param = {callId: data.callid,
                    deviceID: getMonitorSessionParam().deviceID,
                    sessionID: getMonitorSessionParam().sessionID};

        logger.info("Called call unhold function.Call id : " + data.callid);

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _rccFSM.getCurrentState(internalCall);

        if (currentCallState === fsmState.LOCAL_HOLD ||
                currentCallState === fsmState.BOTH_HOLD) {

            _rccControlService.retrieveCall(param,
                    function () {
                        self.delegateToCallFSM(internalCall, fsmNotificationEvent.retrieveCall_GUI);
                        utils.callFunctionIfExist(onSuccess);
                        logger.info("Call unhold request successfuly.");
                    },
                    function (e) {
                        utils.callFunctionIfExist(onFailure, e);
                        logger.info("Call unhold request failure. " + e);
                    }
            );
        }
        else {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        }
    };

    self.end = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid], _currentState,
                param = {callId: data.callid,
                    deviceID: getMonitorSessionParam().deviceID,
                    sessionID: getMonitorSessionParam().sessionID};

        logger.info("Called call end function.Call id : " + data.callid);

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        _currentState = _rccFSM.getCurrentState(internalCall);
        //check with the state machine if the current state would accept an endCall.
        if (_currentState === fsmState.CALL_RECEIVED ||
                _currentState === fsmState.ANSWERED ||
                _currentState === fsmState.LOCAL_HOLD ||
                _currentState === fsmState.REMOTE_HOLD ||
                _currentState === fsmState.BOTH_HOLD ||
                _currentState === fsmState.RINGING ||
                // in auto answer not supported device case, if answer called, will get rest request success
                // and no negative notifications, so let the user end the call while waiting for end call or monitored device
                // answers call.
                _currentState === fsmState.ANSWERING_CALL)
        {

            _rccControlService.endCall(
                    param,
                    function () {
                        self.delegateToCallFSM(internalCall, fsmNotificationEvent.endCall_GUI);
                        utils.callFunctionIfExist(onSuccess);
                        logger.info("Call end request successfuly.");
                    },
                    function (e) {
                        utils.callFunctionIfExist(onFailure, e);
                        logger.info("Call end request failure. " + e);
                    }
            );
        }
        else {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        }
    };

    self.forward = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid], currentCallState,
                param = {callId: data.callid,
                    destination: data.address,
                    deviceID: getMonitorSessionParam().deviceID,
                    sessionID: getMonitorSessionParam().sessionID};

        logger.info("Called call forward function.Call id : " + data.callid + " ,address : " + data.address);

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _rccFSM.getCurrentState(internalCall);
        if (currentCallState === fsmState.CALL_RECEIVED) {
            _rccControlService.deflectCall(param,
                    function () {
                        self.delegateToCallFSM(internalCall, fsmNotificationEvent.deflectCall_GUI);
                        utils.callFunctionIfExist(onSuccess);
                        logger.info("Call forward request successfuly.");
                    },
                    function (e) {
                        utils.callFunctionIfExist(onFailure, e);
                        logger.info("Call forward request failure. " + e);
                    });
        }
        else {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        }
    };

    self.consultativeTransfer = function (data, onSuccess, onFailure) {
        var currentInternalCall = calls[data.currentCallId],
                targetInternalCall = calls[data.targetCallId],
                currentCallState,
                targetCallState,
                param = {currentCallId: data.currentCallId,
                    targetCallId: data.targetCallId,
                    deviceID: getMonitorSessionParam().deviceID,
                    sessionID: getMonitorSessionParam().sessionID};

        logger.info("Called call consultativeTransfer function.Current Call Id : " + data.currentCallId + " ,Target Call Id : " + data.targetCallId);

        if (!currentInternalCall || !targetInternalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _rccFSM.getCurrentState(currentInternalCall);
        targetCallState = _rccFSM.getCurrentState(targetInternalCall);
        if (currentCallState !== fsmState.ANSWERED) {
            logger.error("consultativeTransfer current call is not in correct state: " + currentCallState);
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        } else if (targetCallState !== fsmState.LOCAL_HOLD &&
                targetCallState !== fsmState.BOTH_HOLD) {
            logger.error("consultativeTransfer target call is not in correct state: " + targetCallState);
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        } else {
            _rccControlService.consultativeTransfer(param, function () {
                self.delegateToCallFSM(currentInternalCall, fsmNotificationEvent.consultativeTransfer_GUI);
                utils.callFunctionIfExist(onSuccess);
                logger.info("Call consultativeTransfer request successfuly.");
            }, function (e) {
                utils.callFunctionIfExist(onFailure, e);
                logger.info("Call consultativeTransfer request failure. " + e);
            });
        }
    };

    self.join = function (data, onSuccess, onFailure) {
        var currentCall = calls[data.callid1], currentCallState, targetCallState,
                targetCall = calls[data.callid2],
                param = {currentCall: data.callid1,
                    targetCall: data.callid2,
                    deviceID: getMonitorSessionParam().deviceID,
                    sessionID: getMonitorSessionParam().sessionID};
        if (!currentCall && targetCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _rccFSM.getCurrentState(currentCall);
        targetCallState = _rccFSM.getCurrentState(targetCall);
        if (currentCallState === fsmState.ANSWERED &&
                targetCallState === fsmState.LOCAL_HOLD)
        {
            logger.info("Called call join function. CallId1 : " + data.callid1 + " CallId2 : " + data.callid2);
            _rccControlService.conferenceCall(param, function () {
                self.delegateToCallFSM(currentCall, fsmNotificationEvent.conferenceCall_GUI);
                utils.callFunctionIfExist(onSuccess);
                logger.info("Join conference request successfly. ");
            }, function (e) {
                utils.callFunctionIfExist(onFailure, e);
            });
        } else {
            logger.error("conference call is not in correct state: " + currentCallState);
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        }
    };

    self.getDeviceList = function (data, onSuccess, onFailure) {
        if (!self.isSubscribed()) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }
        logger.info("Called getDeviceList function.");
        _rccControlService.getDeviceList(function (responseData) {
            utils.callFunctionIfExist(onSuccess, responseData.rccDeviceResponse.deviceList);
            logger.info("GetDeviceList request successfuly.");
            logger.debug("Response data: " + JSON.stringify(responseData));
        }, function (e) {
            utils.callFunctionIfExist(onFailure, e);
            logger.info("GetDeviceList request failure.");
        });
    };


    self.directTransfer = function (data, onSuccess, onFailure) {
        var internalCall = calls[data.callid], currentCallState,
                param = {callId: data.callid,
                    destination: data.address,
                    deviceID: getMonitorSessionParam().deviceID,
                    sessionID: getMonitorSessionParam().sessionID};

        logger.info("Called call directTransfer function.Call Id : " + data.callid + " ,Destination : " + data.destination);

        if (!internalCall) {
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
            return;
        }

        currentCallState = _rccFSM.getCurrentState(internalCall);
        if (currentCallState === fsmState.LOCAL_HOLD ||
                currentCallState === fsmState.REMOTE_HOLD ||
                currentCallState === fsmState.ANSWERED ||
                currentCallState === fsmState.BOTH_HOLD)
        {
            //TODO: force localhold - if the user is not on hold
            logger.info("[rccManager.directTransfer->sendTransfer : transfer target ]" + data.address);
            _rccControlService.blindTransfer(param, function () {
                self.delegateToCallFSM(internalCall, fsmNotificationEvent.blind_transfering_GUI);
                utils.callFunctionIfExist(onSuccess);
                logger.info("[rccManager.directTransfer->sentTransfer : transfer target ]" + data.address);
            }, function (e) {
                logger.info("Call directTransfer request failure. " + e);
                utils.callFunctionIfExist(onFailure, e);
            });
        } else {
            logger.error("directTransfer call is not in correct state: " + currentCallState);
            utils.callFunctionIfExist(onFailure, fcs.Errors.STATE);
        }
    };

//TODO sessionParams attributes
    self.onNotificationEvent = function (type, sessionParams) {
        var callid = sessionParams.callId,
                statusCode = sessionParams.statusCode,
                internalCall = calls[callid];

        logger.debug("Notification received " + type + " callid:" + callid);

        if (internalCall) {
            internalCall.statusCode = statusCode;
        }
        self.delegateToCallFSM(internalCall, type);
    };

    self.onStateChange = function (call, event) {
        var transferEvent = _rccFSM.TransferEvent;
        calls[call.id] = call;

        function triggerCallState(state, data) {
            logger.debug("triggerCallState:  state =   " + state + "    call.statusCode =  " + call.statusCode + "   call.reasonText =  " + call.reasonText + " data = " + JSON.stringify(data));
            call.call.callState = state;
            utils.callFunctionIfExist(call.call.onStateChange, state, call.statusCode, call.reasonText, data);
        }

        function getCallerAndCalleeData(call) {
            return {calledParty: call.calledParty,
                callingParty: call.callingParty};
        }

        logger.info("Transfer Event: " + event + ". callId: " + call.id);
        switch (event) {
            case transferEvent.makeCall_fsm:
            case transferEvent.endCall_fsm:
            case transferEvent.deflectCall_fsm:
            case transferEvent.blind_transfering_fsm:
            case transferEvent.holdCall_fsm:
            case transferEvent.retrieveCall_fsm:
            case transferEvent.answerCall_fsm:
            case transferEvent.consultativeTransfer_fsm:
                break;
            case transferEvent.callInProgress_fsm:
                triggerCallState(CALL_STATES.CALL_IN_PROGRESS, getCallerAndCalleeData(call));
                break;
            case transferEvent.ringing_fsm:
                triggerCallState(CALL_STATES.RINGING, getCallerAndCalleeData(call));
                break;
            case transferEvent.answered_fsm:
                triggerCallState(CALL_STATES.IN_CALL, getCallerAndCalleeData(call));
                break;
            case transferEvent.conferenced_fsm:
                triggerCallState(CALL_STATES.JOINED);
                break;
            case transferEvent.callReceived_fsm:
                triggerCallState(CALL_STATES.INCOMING, getCallerAndCalleeData(call));
                break;
            case transferEvent.callFailed_fsm:
                clearResources(call.id);
                triggerCallState(CALL_STATES.REJECTED);
                break;
            case transferEvent.callEnded_fsm:
                clearResources(call.id);
                triggerCallState(CALL_STATES.ENDED);
                break;
            case transferEvent.callHeldLocally_fsm:
            case transferEvent.callHeldBoth_fsm:
                triggerCallState(CALL_STATES.ON_HOLD);
                break;
            case transferEvent.callHeldRemotely_fsm:
                triggerCallState(CALL_STATES.ON_REMOTE_HOLD);
                break;
            case transferEvent.callRetrievedRemotely_fsm:
                switch (_rccFSM.getCurrentState(call)) {
                    case fsmState.LOCAL_HOLD:
                        triggerCallState(CALL_STATES.ON_HOLD);
                        break;
                    case fsmState.ANSWERED:
                        triggerCallState(CALL_STATES.IN_CALL);
                        break;
                    default:
                        logger.error("Undefined transition event: " + event + " for " + call.id);
                        break;
                }
                break;
            case transferEvent.callRetrievedLocally_fsm:
                switch (_rccFSM.getCurrentState(call)) {
                    case fsmState.REMOTE_HOLD:
                        triggerCallState(CALL_STATES.ON_REMOTE_HOLD);
                        break;
                    case fsmState.ANSWERED:
                        triggerCallState(CALL_STATES.IN_CALL);
                        break;
                }
                break;
            case transferEvent.callBlindTransferred_fsm:
            case transferEvent.callConsultativeTransferred_fsm:
            case transferEvent.redirected_fsm:
            case transferEvent.callTransferred_fsm:
                clearResources(call.id);
                triggerCallState(CALL_STATES.TRANSFERRED);
                break;
            default:
                logger.error("Undefined transition event: " + event + " for " + call.id);
                break;
        }

    };

    self.getHoldStateOfCall = function (data) {
        var internalCall = calls[data.callid];
        if (internalCall) {
            return CALL_HOLD_STATES[_rccFSM.getCurrentState(internalCall)];
        }
        return undefined;
    };

    //TODO data attributes sessionParams=>notificationMessage
    function handleCallControlNotification(type, data) {
        if (type && data) {
            self.onNotificationEvent(type, data);
            logger.info("RemoteCallControl notification received: " + "type:" + type);
        }
    }

    NotificationCallBacks.RemoteCallControl = function (data) {
        var rccEvent = data.rccNotificationParams.rccEvent,
                rccNotifyData = data.rccNotificationParams,
                rccNotifySecondData = {},
                incomingCall = {},
                newOutgoingCall = {},
                options, internalCall = calls[rccNotifyData.callId];

        rccNotifyData.statusCode = data.statusCode;

        logger.debug("rccNotifyData: " + JSON.stringify(rccNotifyData));

        if (isDeviceMonitor(getMonitorSessionParam().deviceID)) {
            options = {reject: false, forward: true, answer: true};
        } else {
            options = {reject: false, forward: true, answer: false};
        }

        //---------------------------------------------------------------//
        // This method workaround for RCC conferenced notify.
        //
        // Recaive Notify Example : {statusCode : 0,rccEvent: "conferenced",callId : "joined callId",endedCallId : "endedCallId"}
        //
        // Create new notify data  for ended call and launch double handleCallControlNotification().
        // For joined call : handleCallControlNotification(rccNotifyData).
        // For ended call : handleCallControlNotification(rccNotifySecondData);
        function copyNotifyDataForConferencedDoubleCallID(data) {
            rccNotifySecondData.rccEvent = "callEnded";
            rccNotifySecondData.callId = data.endedCallId;
            rccNotifySecondData.statusCode = data.statusCode;
            delete data.endedCallId;

            return rccNotifySecondData;
        }
        //----------------------------------------------------------------//

        function addCallerAndCalleeToTheCall(rccNotifyData) {
            internalCall = calls[rccNotifyData.callId];
            if (internalCall) {
                internalCall.calledParty = rccNotifyData.calledParty;
                internalCall.callingParty = rccNotifyData.callingParty;
            }
        }

        switch (rccEvent) {
            case fsmNotificationEvent.callRetrievedRemotely :
                handleCallControlNotification(fsmNotificationEvent.callRetrievedRemotely, rccNotifyData);
                break;
            case fsmNotificationEvent.callHeldRemotely :
                handleCallControlNotification(fsmNotificationEvent.callHeldRemotely, rccNotifyData);
                break;
            case fsmNotificationEvent.callRetrievedLocally :
                handleCallControlNotification(fsmNotificationEvent.callRetrievedLocally, rccNotifyData);
                break;
            case fsmNotificationEvent.callHeldLocally :
                handleCallControlNotification(fsmNotificationEvent.callHeldLocally, rccNotifyData);
                break;
            case fsmNotificationEvent.callTransferred :
                handleCallControlNotification(fsmNotificationEvent.callTransferred, rccNotifyData);
                break;
            case fsmNotificationEvent.redirected :
                handleCallControlNotification(fsmNotificationEvent.redirected, rccNotifyData);
                break;
            case fsmNotificationEvent.callFailed :
                if (internalCall) {
                    utils.callFunctionIfExist(internalCall.answerFailureCallback, fcs.Errors.CALL_FAILED);
                }
                handleCallControlNotification(fsmNotificationEvent.callFailed, rccNotifyData);
                break;
            case fsmNotificationEvent.answered :
                addCallerAndCalleeToTheCall(rccNotifyData);
                if (internalCall) {
                    utils.callFunctionIfExist(internalCall.answerSuccessCallback);
                    // No need to trigger failure callback once answered successfully (answered event is received)
                    if (internalCall.answerFailureCallback) {
                        internalCall.answerFailureCallback = undefined;
                    }
                }
                handleCallControlNotification(fsmNotificationEvent.answered, rccNotifyData);
                break;
            case fsmNotificationEvent.callReceived :
                incomingCall.call = new self.IncomingCall(rccNotifyData.callId, options, rccNotifyData.calledParty, rccNotifyData.callingParty);
                incomingCall.id = rccNotifyData.callId;
                calls[rccNotifyData.callId] = incomingCall;
                utils.callFunctionIfExist(fcs.call.onReceived, incomingCall.call);
                addCallerAndCalleeToTheCall(rccNotifyData);
                handleCallControlNotification(fsmNotificationEvent.callReceived, rccNotifyData);
                break;
            case fsmNotificationEvent.ringing :
                addCallerAndCalleeToTheCall(rccNotifyData);
                handleCallControlNotification(fsmNotificationEvent.ringing, rccNotifyData);
                break;
            case fsmNotificationEvent.callInProgress :
                if (!isCall(rccNotifyData.callId)) {
                    newOutgoingCall.call = new self.OutgoingCall(rccNotifyData.callId, rccNotifyData.calledParty, rccNotifyData.callingParty);
                    newOutgoingCall.id = rccNotifyData.callId;
                    calls[rccNotifyData.callId] = newOutgoingCall;
                    utils.callFunctionIfExist(fcs.call.onOutgoingCall, newOutgoingCall.call);
                }
                addCallerAndCalleeToTheCall(rccNotifyData);
                handleCallControlNotification(fsmNotificationEvent.callInProgress, rccNotifyData);
                break;
            case fsmNotificationEvent.conferenced :
                handleCallControlNotification(fsmNotificationEvent.callEnded, copyNotifyDataForConferencedDoubleCallID(rccNotifyData));
                handleCallControlNotification(fsmNotificationEvent.conferenced, rccNotifyData);
                break;
            case fsmNotificationEvent.callEnded :
                if (internalCall) {
                    utils.callFunctionIfExist(internalCall.answerFailureCallback, fcs.Errors.CALL_ENDED);
                }
                handleCallControlNotification(fsmNotificationEvent.callEnded, rccNotifyData);
                break;
            default:
                handleCallControlNotification(fsmNotificationEvent.unknowNotify, rccNotifyData);
                break;
        }
    };
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED, subscriptionStarted);
    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_ENDED, subscriptionStopped);


};

//@{fcs-jsl-prod}
var RccManager = function (_rccFSM, _rccControlService, _logManager, _globalBroadcaster) {
    return new RccManagerImpl(_rccFSM || rccFSM,
            _rccControlService || rccControlService,
            _logManager || logManager,
            _globalBroadcaster || globalBroadcaster);
};

var rccManager = new RccManager();

addToServiceList("call", "rcc", rccManager);


if (__testonly__) {__testonly__.RccManager = rccManager;fcs.RccManager = rccManager;}
if (__testonly__) {__testonly__.rccManagerService = rccManager;}
//@{fcs-jsl-prod}


var CalllogServiceImpl = function(_server) {

    var clUrl = "/logHistory",
        lrUrl = "/logRecord/",
        callTypes = {},
        callTypesEnum = {
            INCOMING: 0,
            MISSED: 1,
            OUTGOING: 2
        },
        DEFAULT_START_INDEX = 0,
        DEFAULT_COUNT = 100;

    callTypes.incoming = callTypesEnum.INCOMING;
    callTypes.outgoing = callTypesEnum.OUTGOING;
    callTypes.missed = callTypesEnum.MISSED;

    function parseData(data) {
        var i, logs = [], log, params, type, date;
        if(data && data.logHistory && data.logHistory.logItems){
            for(i=0; i < data.logHistory.logItems.length;i++){
                params = data.logHistory.logItems[i].params;
                log =  new fcs.calllog.Entry(params);

                log.id = utils.getProperty(params, 'recordId');
                log.address = utils.getProperty(params, 'callerDisplayNumber');
                log.name = utils.getProperty(params, 'callerName');
                log.duration = utils.getProperty(params, 'duration');

                // convert string timestamp to Date object
                date = parseInt(params.startTime, 10);
                log.startTime = isNaN(date) ? null : new Date(date);

                // convert wam value to fcs.calllog.CallTypes value
                log.type = null;
                type = utils.getProperty(params, 'direction');
                if(type !== null && callTypes[type] !== undefined){
                    log.type = callTypes[type];
                }

                logs.push(log);
            }
            // We need to sort *logs array to view call logs in descending time order inside CallLogTab
            logs = logs.sort(function(a,b){return b.startTime - a.startTime;});
        }

        return logs;
    }

    function composeRetreiveData(startIndex, count) {
        var data = {startIndex: DEFAULT_START_INDEX,
            count: DEFAULT_COUNT};

        if (startIndex) {
            if (startIndex.trim) {
                startIndex.trim();
            }

            if (isFinite(startIndex) && startIndex >= 0 && startIndex !== "") {
                data.startIndex = startIndex;
            }
        }

        if (count) {
            if (count.trim) {
                count.trim();
            }

            if (isFinite(count) && count >= 0 && count !== "") {
                data.count = count;
            }
        }

        return data;
    }

    this.retrieve = function(onSuccess, onFailure, startIndex, count) {
        _server.sendGetRequest({
                url: getWAMUrl(1, clUrl),
                "data": composeRetreiveData(startIndex, count)
            },
            onSuccess,
            onFailure,
            parseData
        );

    };

    this.retrievePartial = function(startIndex, count, onSuccess, onFailure) {
        _server.sendGetRequest({
                url: getWAMUrl(1, clUrl),
                "data": composeRetreiveData(startIndex, count)
            },
            onSuccess,
            onFailure,
            parseData
        );

    };

    this.removeAll = function(onSuccess, onFailure) {

        _server.sendDeleteRequest({
                url: getWAMUrl(1, clUrl)
            },
            onSuccess,
            onFailure
        );
    };

    this.remove = function(calllogid,onSuccess, onFailure) {

        _server.sendDeleteRequest({
                url: getWAMUrl(1, lrUrl + calllogid)
            },
            onSuccess,
            onFailure
        );
    };
};

//@{fcs-jsl-prod}
var CalllogService = function (_server) {
    return new CalllogServiceImpl(_server || server);
};

var calllogService = new CalllogService();
//@{fcs-jsl-prod}

var CalllogManagerImpl = function (_service) {
    this.retrieve = function (onSuccess, onFailure, startIndex, count) {
        _service.retrieve(onSuccess, onFailure, startIndex, count);
    };

    this.retrievePartial = function(startIndex, count, onSuccess, onFailure) {
        _service.retrievePartial(startIndex, count, onSuccess, onFailure);
    };

    this.removeAll = function (onSuccess, onFailure) {
        _service.removeAll(onSuccess, onFailure);
    };

    this.remove = function (calllogid, onSuccess, onFailure) {
        _service.remove(calllogid, onSuccess, onFailure);
    };
};

//@{fcs-jsl-prod}
var CalllogManager = function (_service) {
    return new CalllogManagerImpl(_service || calllogService);
};

var calllogManager = new CalllogManager();
//@{fcs-jsl-prod}


/**
* Provides access to a user's call log.
*
* @name calllog
* @namespace
* @memberOf fcs
*
* @version 3.1.3.45
* @since 3.0.0
*/
var CalllogImpl = function(_manager){

   /**
    * Enum for the type of call log.
    * @name CallTypes
    * @enum {number}
    * @since 3.0.0
    * @readonly
    * @memberOf fcs.calllog
    * @property {number} [INCOMING=0] Incoming call.
    * @property {number} [MISSED=1] Missed call.
    * @property {number} [OUTGOING=2] Outgoing call.
    */
    this.CallTypes = {

        INCOMING: 0,

        MISSED: 1,

        OUTGOING: 2
    };

   /**
    * Retrieves the list of call logs from the server.
    *
    * @name fcs.calllog.retrieve
    * @function
    * @since 3.0.0
    * @param {function} onSuccess The onSuccess({@link Array.<fcs.calllog.Entry>}) callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @param {number} [startIndex=0] starting offset within the list of log records (records before this offset will not be returned)
    * @param {number} [count=100] The number of the log records to be returned
    *
    * @example
    * var onSuccess = function(data){
    *    var i = 0;
    *    for (i in data) {
    *       window.console.log("call log record id: " + data[i].id + " entry: ", data);
    *    }
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.calllog.retrieve(onSuccess, onError);
    * OR
    * fcs.calllog.retrieve(onSuccess, onError, 10);
    * OR
    * fcs.calllog.retrieve(onSuccess, onError, 10, 50);
    */
    this.retrieve = function (onSuccess, onFailure, startIndex, count) {
        _manager.retrieve(onSuccess, onFailure, startIndex, count);
    };

   /**
    * Retrieves a  list of call logs within a give range from the server.
    *
    * @name fcs.calllog.retrievePartial
    * @function
    * @since 3.1.0
    * @param {number} [startIndex=0] starting offset within the list of log records (records before this offset will not be returned)
    * @param {number} [count=100] The number of the log records to be returned
    * @param {function} onSuccess The onSuccess({@link Array.<fcs.calllog.Entry>}) callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    *
    * @example
    * var onSuccess = function(data){
    *    var i = 0;
    *    for (i in data) {
    *       window.console.log("call log record id: " + data[i].id + " entry: ", data);
    *    }
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.calllog.retrievePartial(10, 50, onSuccess, onError);
    */
    this.retrievePartial = function (startIndex, count, onSuccess, onFailure) {
        _manager.retrievePartial(startIndex, count, onSuccess, onFailure);
    };

   /**
    * Deletes a call log from the server.
    *
    * @name fcs.calllog.remove
    * @function
    * @since 3.0.0
    * @param {string} calllogid The id of the call log to be deleted
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    *
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.calllog.remove("calllogid", onSuccess, onError);
    */
    this.remove = function (calllogid, onSuccess, onFailure) {
        _manager.remove(calllogid, onSuccess, onFailure);
    };

   /**
    * Clears the entire call log from the server.
    *
    * @name fcs.calllog.removeAll
    * @function
    * @since 3.0.0
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    *
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.calllog.removeAll( onSuccess, onError);
    */
    this.removeAll = function (onSuccess, onFailure) {
        _manager.removeAll(onSuccess, onFailure);
    };

   /**
    * @name Entry
    * @class
    * @memberOf fcs.calllog
    * @version 3.1.3.45
    * @since 3.0.0
    */
    this.Entry = function(){};

   /**
    * Unique record id of log.
    *
    * @name fcs.calllog.Entry#id
    * @field
    * @since 3.0.0
    * @type {String}
    */

   /**
    * Display number of caller.
    *
    * @name fcs.calllog.Entry#address
    * @field
    * @since 3.0.0
    * @type {String}
    */

   /**
    * Name of caller.
    *
    * @name fcs.calllog.Entry#name
    * @field
    * @since 3.0.0
    * @type {String}
    */

   /**
    * Duration of call.
    *
    * @name fcs.calllog.Entry#duration
    * @field
    * @since 3.0.0
    * @type {String}
    */

   /**
    * Start time of call.
    *
    * @name fcs.calllog.Entry#startTime
    * @field
    * @since 3.0.0
    * @type {Date}
    */

   /**
    * Type of call.
    *
    * @name fcs.calllog.Entry#type
    * @field
    * @since 3.0.0
    * @type {fcs.calllog.CallTypes}
    */
};

//@{fcs-jsl-prod}
var Calllog = function (_manager) {
    return new CalllogImpl(_manager || calllogManager);
};

fcs.calllog = new Calllog();
//@{fcs-jsl-prod}


var AddressbookServiceImpl = function (_server, _getWAMUrl) {

    var urlStr = "/addressbook/contacts/";

    this.retrieve = function (parseData, onSuccess, onFailure) {
        _server.sendGetRequest({
            url: _getWAMUrl(1, "/addressbook")
        },
        onSuccess,
                onFailure,
                parseData,
                undefined,
                "addressBookResponse");
    };

    this.searchDirectory = function (criteria, searchType, parseData, onSuccess, onFailure) {

        _server.sendGetRequest({
            "url": _getWAMUrl(1, "/directory"),
            "data": {"criteria": criteria, "criteriaType": searchType}
        },
        onSuccess,
                onFailure,
                parseData);
    };

    this.deleteContact = function (nickName, onSuccess, onFailure) {
        _server.sendDeleteRequest({
            "url": _getWAMUrl(1, urlStr + nickName)
        },
        onSuccess,
                onFailure);
    };

    this.addContact = function (requestData, onSuccess, onFailure) {
        var contactData = {"addressBookRequest": {"addressBookEntries": []}};
        contactData.addressBookRequest.addressBookEntries.push(requestData);

        _server.sendPostRequest({
            "url": _getWAMUrl(1, urlStr),
            "data": contactData
        },
        onSuccess,
                onFailure);
    };

    this.modifyContact = function (nickname, requestData, onSuccess, onFailure) {
        var contactData = {"addressBookRequest": {"addressBookEntries": []}};
        contactData.addressBookRequest.addressBookEntries.push(requestData);

        _server.sendPutRequest({
            "url": _getWAMUrl(1, urlStr + nickname),
            "data": contactData
        },
        onSuccess,
        onFailure);
    };

};

//@{fcs-jsl-prod}
var AddressbookService = function (_server, _getWAMUrl) {
    return new AddressbookServiceImpl(_server || server,
            _getWAMUrl || getWAMUrl);
};

var addressbookService = new AddressbookService();

if (__testonly__) { __testonly__.AddressbookService = AddressbookService ;}
//@{fcs-jsl-prod}

var AddressbookManagerImpl = function(_service, _utils) {
    var SearchType = {
        FIRSTNAME: 0,
        LASTNAME: 1,
        NAME: 2,
        PHONENUMBER: 3,
        USERNAME: 4,
        NA: 5
    }, Entry = function() {
    }, searchTypes = {};

    searchTypes[SearchType.FIRSTNAME] = "1";
    searchTypes[SearchType.LASTNAME] = "2";
    searchTypes[SearchType.NAME] = "3";
    searchTypes[SearchType.PHONENUMBER] = "4";
    searchTypes[SearchType.USERNAME] = "5";
    searchTypes[SearchType.NA] = "-1";

    function parseData(result) {
        var i, entries = [], entry, params, items;
        if (result) {
            if (result.directory) {
                items = result.directory.directoryItems;
            } else if (result.addressBookResponse) {
                items = result.addressBookResponse.addressBookEntries;
            }

            if (items) {
                for (i = 0; i < items.length; i++) {
                    params = items[i];
                    entry = new Entry();

                    entry.id = _utils.getProperty(params, 'entryId');
                    entry.nickname = _utils.getProperty(params, 'nickname');
                    entry.primaryContact = _utils.getProperty(params, 'primaryContact');
                    entry.firstName = _utils.getProperty(params, 'firstName');
                    entry.lastName = _utils.getProperty(params, 'lastName');
                    entry.photoUrl = _utils.getProperty(params, 'photoUrl');
                    entry.emailAddress = _utils.getProperty(params, 'emailAddress');
                    entry.homePhone = _utils.getProperty(params, 'homePhone');
                    entry.mobilePhone = _utils.getProperty(params, 'mobilePhone');
                    entry.workPhone = _utils.getProperty(params, params.workPhone ? 'workPhone' : 'businessPhone');
                    entry.friendStatus = _utils.getProperty(params, 'friendStatus');
                    entry.conferenceURL = _utils.getProperty(params, 'conferenceURL');
                    if (!entry.friendStatus) {
                        entry.friendStatus = false;
                    }
                    entry.groupList = _utils.getProperty(params, 'groupList');
                    entry.fax = _utils.getProperty(params, 'fax');
                    entry.pager = _utils.getProperty(params, 'pager');

                    entries.push(entry);
                }
            }
        }

        return entries;
    }

    function parseRequestData(entry) {
        var requestData = new Entry();

            requestData.nickname = entry.nickname;
            requestData.primaryContact = entry.primaryContact;
            requestData.firstName = entry.firstName;
            requestData.lastName = entry.lastName;
            requestData.photoUrl = entry.photoUrl;
            requestData.emailAddress = entry.email;
            requestData.homePhone = entry.homePhone;
            requestData.mobilePhone = entry.mobilePhone;
            requestData.workPhone = entry.workPhone;
            requestData.friendStatus = entry.friendStatus;
            requestData.conferenceURL = entry.conferenceUrl;
            requestData.fax = entry.fax;
            requestData.pager = entry.pager;


            return requestData;
    }


    this.Entry = Entry;

    this.SearchType = SearchType;

    this.retrieve = function(onSuccess, onFailure) {
        _service.retrieve(parseData, onSuccess, onFailure);
    };

    this.searchDirectory = function(criteria, searchType, onSuccess, onFailure) {
        var type = (searchTypes[searchType] === undefined) ? "-1" : searchTypes[searchType];
        _service.searchDirectory(criteria, type, parseData, onSuccess, onFailure);
    };

    this.deleteContact =  function(nickname,onSuccess, onFailure){
        _service.deleteContact(nickname,onSuccess,onFailure);
    };
    this.addContact = function(requestData,onSuccess,onFailure){
        var data = parseRequestData(requestData);
        _service.addContact(data,onSuccess,onFailure);
    };
    this.modifyContact = function(nickname,requestData,onSuccess,onFailure){
        var data = parseRequestData(requestData);
        _service.modifyContact(nickname,data,onSuccess,onFailure);
    };
};

//@{fcs-jsl-prod}
var AddressbookManager = function(service, _utils) {
    return new AddressbookManagerImpl(service || addressbookService, utils || _utils);
};
var addressbookManager = new AddressbookManager();

if (__testonly__) { __testonly__.AddressbookManager = AddressbookManager ;}
//@{fcs-jsl-prod}





/**
 * Addressbook and directory.
 *
 * @name addressbook
 * @namespace
 * @memberOf fcs
 * @version 3.1.3.45
 * @since 3.0.0
 */
var AddressbookImpl = function(_manager) {

    /**
     * Addressbook entry.
     *
     * @typedef {Object} AddressbookEntry
     * @readonly
     *
     * @property {?String}  entryId - Unique identifier for the entry.
     * @property {String}  nickname - Name of the user as it will appear for a personal contact.
     * @property {String}  primaryContact - User's primary contact number (this should be the prefered number for contacting the user).
     * @property {?String}  firstName - First name of the user.
     * @property {?String}  lastName - Last name of the user.
     * @property {?String}  photoUrl - URL from which to retrieve the picture of the user.
     * @property {?String}  email - Email address of the user.
     * @property {?String}  homePhone - Home phone number for the user.
     * @property {?String}  mobilePhone - Mobile phone number for the user.
     * @property {?String}  workPhone - Work phone number for the user.
     * @property {!boolean} friendStatus - Friend status of the user.
     * @property {?String}  fax - Fax number of the user.
     * @property {?String}  pager - Pager number of the user.
     * @property {?String}  conferenceURL - Conference url of the user.
     * @property {?String}  groupList - Work group list of the user.
     */
    this.Entry = _manager.Entry;

    /**
     * Enum for the search criteria filter used in directory searches.
     *
     * @name SearchType
     * @readonly
     * @memberOf fcs.addressbook
     * @enum {number}
     * @since 3.0.0
     *
     * @property {number} FIRSTNAME Search by first name
     * @property {number} LASTNAME Search by last name
     * @property {number} NAME Search by name
     * @property {number} PHONENUMBER Search by phone number
     * @property {number} USERNAME Search by username
     * @property {number} NA Not applicable
     */
    this.SearchType = _manager.SearchType;

    /**
     * Success callback for addressbook retreive/search request.
     *
     * @callback addressbookRequestSuccess
     * @param {Array.<AddressbookEntry>} responseMessage
     */

    /**
     * Failure callback for addressbook retreive/search request.
     *
     * @callback addressbookRequestFailure
     * @param {fcs.Errors} responseCode
     */

    /**
     * Retrieves the list of address book entries from the server
     * and executes the success callback on completion or failure
     * callback on error.
     *
     * @name retrieve
     * @function
     * @since 3.0.0
     * @memberOf fcs.addressbook
     *
     * @param {addressbookRequestSuccess} success callback function
     * @param {addressbookRequestFailure} failure callback function
     *
     * @example
     * var onSuccess = function(entryArray){
     *    var index;
     *    for (index in entryArray) {
     *      console.log(entryArray[index].nickname +", " + entryArray[index].primaryContact);
     *    }
     * };
     *
     * var onError = function (err) {
     *   console.log(err);
     * };
     *
     * fcs.addressbook.retrieve(onSuccess, onError);
     *
     */
    this.retrieve = _manager.retrieve;

    /**
     * Searches the directory.
     *
     * @name searchDirectory
     * @function
     * @since 3.0.0
     * @memberOf fcs.addressbook
     *
     * @param {string} criteria The string to search in the directory
     * @param {fcs.addressbook.SearchType} searchType The criteria (filter) to be applied to the search
     * @param {addressbookRequestSuccess} success callback function
     * @param {addressbookRequestFailure} failure callback function
     *
     * @example
     * var onSuccess = function(entryArray){
     *     var index;
     *     for (index in entryArray) {
     *         console.log(entryArray[index].firstName + ", " + entryArray[index].lastName);
     *     }
     * };
     * var onError = function (err) {
     *   console.log(err);
     * };
     *
     * fcs.addressbook.searchDirectory("Michael", fcs.addressbook.SearchType.FIRSTNAME, onSuccess, onError);
     */
    this.searchDirectory = _manager.searchDirectory;

    /**
     * Deletes a contact from addressbook
     *
     * @name deleteContact
     * @function
     * @since 3.0.0
     * @memberOf fcs.addressbook
     *
     * @param {string} contact nickname to be deleted
     * @param {addressbookRequestSuccess} success callback function
     * @param {addressbookRequestFailure} failure callback function
     *
     * @example
     * var onSuccess = function(){
     *    console.log("contact deleted successfully");
     * };
     *
     * var onError = function (err) {
     *   console.log(err);
     * };
     *
     * fcs.addressbook.deleteContact(nickname, onSuccess, onError);
     *
     */
    this.deleteContact = _manager.deleteContact;


    /**
     * Add a contact to addressbook
     *
     * @name addContact
     * @function
     * @since 3.0.0
     * @memberOf fcs.addressbook
     *
     * @param {AddressbookEntry} contact data which included  contact info
     * @param {addressbookRequestSuccess} success callback function
     * @param {addressbookRequestFailure} failure callback function
     *
     * @example
     * var onSuccess = function(){
     *    console.log("contact added successfully");
     * };
     *
     * var onError = function (err) {
     *   console.log(err);
     * };
     *
     * fcs.addressbook.addContact(requestData, onSuccess, onFailure);
     *
     */
    this.addContact = _manager.addContact;

    /**
     * Modify contact
     *
     * @name addContact
     * @function
     * @since 3.0.0
     * @memberOf fcs.addressbook
     *
     * @param {string} nickname of contact which will modify
     * @param {AddressbookEntry} contact data which included  contact info
     * @param {addressbookRequestSuccess} success callback function
     * @param {addressbookRequestFailure} failure callback function
     *
     * @example
     * var onSuccess = function(){
     *    console.log("contact modified successfully");
     * };
     *
     * var onError = function (err) {
     *   console.log(err);
     * };
     *
     * var onError = function (err) {
     *   console.log(err);
     * };
     *
     * fcs.addressbook.modifyContact(nickname,requestData,onSuccess,onFailure);
     *
     */
    this.modifyContact = _manager.modifyContact;
};

//@{fcs-jsl-prod}
var Addressbook = function(manager) {
    return new AddressbookImpl(manager || addressbookManager);
};

fcs.addressbook = new Addressbook();
//@{fcs-jsl-prod}





var CollaborationServiceImpl = function (_server, _getWAMUrl) {

    var urlStr = "/collaboration/";

    this.retrieve = function (query, parseData, onSuccess, onFailure) {
        _server.sendGetRequest({
            url: _getWAMUrl(1, urlStr + query)
        },
        onSuccess,
                onFailure,
                parseData,
                undefined,
                "collaborationResponse");
    };

};

//@{fcs-jsl-prod}
var CollaborationService = function (_server, _getWAMUrl) {
    return new CollaborationServiceImpl(_server || server,
            _getWAMUrl || getWAMUrl);
};

var collaborationService = new CollaborationService();
//@{fcs-jsl-prod}

var CollaborationManagerImpl = function(_service, _utils) {

    this.retrieveWebCollaborationHostUrl = function (onSuccess, onFailure) {
        _service.retrieve("webcollaborationhosturl", function (result) {
            return _utils.getProperty(result.collaborationResponse, 'webCollaborationHostURL');
        }, onSuccess, onFailure);
    };

    this.retrieveVideoCollaborationHostUrl = function (onSuccess, onFailure) {
        _service.retrieve("videocollaborationhosturl", function (result) {
            return _utils.getProperty(result.collaborationResponse, 'videoCollaborationHostURL');
        }, onSuccess, onFailure);
    };

};

//@{fcs-jsl-prod}
var CollaborationManager = function(service, _utils) {
    return new CollaborationManagerImpl(service || collaborationService, _utils || utils);
};
var collaborationManager = new CollaborationManager();
//@{fcs-jsl-prod}


/**
 * Collaboration
 *
 * @name collaboration
 * @namespace
 * @memberOf fcs
 * @version 3.1.3.45
 * @since 3.1.0
 */
var CollaborationImpl = function (_manager) {

    /**
     * Success callback for collaboration retrieveWebCollaborationHostUrl and retrieveVideoCollaborationHostUrl request.
     *
     * @callback collaborationRequestSuccess
     * @param {String} url
     */

    /**
     * Failure callback for collaboration retrieveWebCollaborationHostUrl and retrieveVideoCollaborationHostUrl request.
     *
     * @callback collaborationRequestFailure
     * @param {fcs.Errors} responseCode
     */

    /**
     * Retrieves the webCollaborationHostUrl, which is included by collaboration response, from the server
     * and executes the success callback on completion or failure
     * callback on error.
     *
     * @name retrieveWebCollaborationHostUrl
     * @function
     * @since 3.1.0
     * @memberOf fcs.collaboration
     *
     * @param {collaborationRequestSuccess} success callback function
     * @param {collaborationRequestFailure} failure callback function
     *
     * @example
     * var onSuccess = function(webcollaborationhosturl){
     *    console.log(webcollaborationhosturl);
     * };
     *
     * var onError = function (err) {
     *   console.log(err);
     * };
     *
     * fcs.collaboration.retrieveWebCollaborationHostUrl(onSuccess, onError);
     *
     */
    this.retrieveWebCollaborationHostUrl = _manager.retrieveWebCollaborationHostUrl;

    /**
     * Retrieves the videoCollaborationHostUrl, which is included by collaboration response, from the server
     * and executes the success callback on completion or failure
     * callback on error.
     *
     * @name retrieveVideoCollaborationHostUrl
     * @function
     * @since 3.1.0
     * @memberOf fcs.collaboration
     *
     * @param {collaborationRequestSuccess} success callback function
     * @param {collaborationRequestFailure} failure callback function
     *
     * @example
     * var onSuccess = function(videoCollaborationHostUrl){
     *    console.log(videoCollaborationHostUrl);
     * };
     *
     * var onError = function (err) {
     *   console.log(err);
     * };
     *
     * fcs.collaboration.retrieveVideoCollaborationHostUrl(onSuccess, onError);
     *
     */
    this.retrieveVideoCollaborationHostUrl = _manager.retrieveVideoCollaborationHostUrl;
};

//@{fcs-jsl-prod}
var Collaboration = function (manager) {
    return new CollaborationImpl(manager || collaborationManager);
};

fcs.collaboration = new Collaboration();
//@{fcs-jsl-prod}


/**
* Call and Remote Call Control (RCC) related resources (IMRN, Click To Call, Call Disposition).
*
* Available for SPiDR since 3.0.0, and for RCC since 3.1.1.
*
* @name call
* @namespace
*
* @memberOf fcs
*
* @version 3.1.3.45
*/

var CallImpl = function(_manager) {

   /**
    * This field provides the state of local video status like "recvonly", "sendrecv", "sendrecv" etc.
    *
    * This is a SPiDR service only member.
    *
    * @name fcs.call.localVideoState
    * @field
    * @type {number}
    * @since 3.0.0
    */
    this.localVideoState = 0;

   /**
    * This field provides the state of remote video status like "recvonly", "sendrecv", "sendrecv" etc.
    *
    * This is a SPiDR service only member.
    *
    * @name fcs.call.remoteVideoState
    * @field
    * @since 3.0.0
    * @type {number}
    */
    this.remoteVideoState = 0;

    /**
    * Sets the handler for received call notifications.
    *
    * This is a SPiDR and RCC service event.
    *
    * @name onReceived
    * @event
    * @memberOf fcs.call
    * @param {fcs.call.Call} call The call object
    * @example
    * // SPiDR service example is as follows:
    * // @since 3.0.0
    * // This function listens received calls
    * function callReceived(call) {
    *    console.log("There is an incomming call...");
    *
    *    //This function listens call state changes in JSL API level
    *    call.onStateChange = function(state) {
    *        onStateChange(call, state);
    *    };
    *
    *    //This function listens media streams in JSL API level
    *    call.onStreamAdded = function(streamURL) {
    *        // Remote Video is turned on by the other end of the call
    *        // Stream URL of Remote Video stream is passed into this function
    *        onStreamAdded(streamURL);
    *    };
    *
    *    // Answering the incomming call
    *    call.answer(onAnswer, onFailure, isVideoAnswer);
    * }
    *
    * fcs.call.onReceived = callReceived;
    *
    * // RCC service example is as follows:
    * // @since 3.1.1
    * function onCallReceived(call) {
    *   console.log('There is an incomming call...');
    *
    *   call.onStateChange = function (state, statusCode, reasonText, data) {
    *       onStateChange(call, state, data);
    *   };
    * }
    *
    * fcs.call.onReceived = onCallReceived;
    *
    */
    this.onReceived = null;

    /**
     * Sets the handler for monitored device initiated outgoing call notifications.
     *
     * This is an RCC service only event.
     *
     * @name onOutgoingCall
     * @event
     * @since 3.1.1
     * @memberOf fcs.call
     * @param {fcs.call.Call} Call The call object
     *
     * @example
     * //This function listens monitored device initiated outgoing calls
     * function outgoingCall(call) {
     *    console.log("A new call is successful!");
     *
     *    //This function listens call state changes in JSL API level
     *    outgoingCall.onStateChange = function(state, statusCode, reasonText, data) {
     *      onStateChange(call, state, data);
     *    };
     *
     * }
     * fcs.call.onOutgoingCall = outgoingCall;
     */
    this.onOutgoingCall = null;

    /**
    * Monitor session is automatically and periodically extended after it is
    * started (see {@link fcs.call.startMonitorDevice}). In case of extend
    * monitor failure, given onMonitorSessionLost callback
    * function is called.
    *
    * This is an RCC service only method.
    *
    * @name fcs.call.setOnMonitorSessionLost
    * @function
    * @since 3.1.1
    * @param {function} callback callback function for on monitor session lost
    *
    * @example
    * onSuccess = function () {
    *   console.log('Start monitor success');
    *
    *   fcs.call.setOnMonitorSessionLost(
    *       function () {
    *           console.log('Extend monitor session lost! Please again start new monitor session.');
    *       });
    * }
    *
    * onFailure = function () {
    *   console.log('Start monitor failure');
    * }
    *
    * fcs.call.startMonitorDevice(deviceID, onSuccess, onFailure);
    *
    */
    this.setOnMonitorSessionLost = function(callback){
        var param = {callback:callback};

        param = extend(param, {serviceName:'rcc'});

        return _manager.invoke('call', 'setOnMonitorSessionLost', param);
    };

    /**
    * Initialize the media components in order to provide real time communication.
    * When using FCS Plug-in with audio only the plugin will be added as an hidden object to root of the document.
    * When using FCS Plug-in with both audio and video, the object will be added to the videoContainer.
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.initMedia
    * @function
    * @since 3.0.0
    * @param {function} [onSuccess] The onSuccess() to be called when the media have been successfully acquired
    * @param {function} [onFailure] The onFailure({@link fcs.call.MediaErrors}) to be called when media could not be aquired
    * @param {object} [options] The options used for initialization
    * @param {string} [options.pluginLogLevel="2"] The log level of webrtc plugin
    * @param {object} [options.videoContainer] html node in which to inject the video
    * @param {object} [options.remoteVideoContainer] html node in which to inject the remote video
    * @param {object} [options.localVideoContainer] html node in which to inject the preview of the user camera
    * @param {object} [options.iceserver] ice server ip address ex: [{"url":"stun:206.165.51.69:3478"}, {"url":"turn:206.165.51.69:3478", "credential":"dummyCredential", "password":"dummyPwd"}]
    * @param {object} [options.pluginMode=WEBRTC] use downloaded plugin which overrides webrtc capabilities of browser if avaliable (DEPRECATED. See {@link fcs.setup} for the new usage. )
    * @param {object} [options.pluginMode=AUTO] use webrtc capabilities of browser if avaliable otherwise force user to download plugin (DEPRECATED. See {@link fcs.setup} for the new usage. )
    * @param {object} [options.webrtcdtls=FALSE] webrtc disabled
    * @param {object} [options.webrtcdtls=TRUE] webrtc enabled
    * @param {object} [options.language="en"] language setting of the plugin
    *
    * @example
    * &lt;script&gt;
    * fcs.setup(
    *   {
    *       notificationType: fcs.notification.NotificationTypes.WEBSOCKET,
    *       websocketProtocol : 'wss',
    *       websocketIP: '1.1.1.1',
    *       websocketPort : '8581',
    *       clientIp: 'IP Address',
    *       restUrl: 'http://ip:port',
    *       restPort": '443',
    *       pluginMode: {
    *           mode: 'webrtc',
    *           h264: false,
    *           chrome: {
    *               mode: 'auto'
    *           },
    *           firefox: {
    *               version: '38+',
    *               mode: 'auto'
    *           }
    *       }
    *   );
    *
    *   // Media options
    *   var mediaOptions = {
    *       "notificationType": "websocket",
    *       "iceserver": [{"url":"stun:206.165.51.69:3478"},
    *                     {"url":"turn:206.165.51.69:3478",
    *                       "credential":"dummyCredential",
    *                       "password":"dummyPwd"}]
    *       "webrtcdtls": false,
    *       "videoContainer": document.getElementById("defaultVideoContainer")
    *   };
    *
    *   // Initializing media
    *   fcs.call.initMedia(
    *       function() {
    *           console.log("Media was initialized successfully!");
    *       },
    *       function(error) {
    *           switch(error) {
    *               case fcs.call.MediaErrors.WRONG_VERSION : // Alert
    *                   console.log("Media Plugin Version Not Supported");
    *                   break;
    *
    *               case fcs.call.MediaErrors.NEW_VERSION_WARNING : //Warning
    *                   console.log("New Plugin Version is available");
    *                   break;
    *
    *               case fcs.call.MediaErrors.NOT_INITIALIZED : // Alert
    *                   console.log("Media couldn't be initialized");
    *                   break;
    *
    *               case fcs.call.MediaErrors.NOT_FOUND : // Alert
    *                   console.log("Plugin couldn't be found!");
    *                   break;
    *           }
    *       },
    *       mediaOptions
    *   );
    * &lt;/script&gt;
    *
    * &lt;div id="defaultVideoContainer"&gt;&lt;/div&gt;
    */

    this.initMedia = function (onSuccess, onFailure, options) {
        var param = {options: options};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'initMedia', param, onSuccess, onFailure);
    };

    /**
    * Starts a call.
    *
    * This is a SPiDR and RCC service method.
    *
    * @name fcs.call.startCall
    * @function
    * @param {string} from The caller's address (e.g. SIP URI) used to establish the call. This is a SPiDR service only parameter.
    * @param {object} [contact] Contains users firstName and lastName. This is a SPiDR service only parameter.
    * @param {string} [contact.firstName="John"] First Name of the user
    * @param {string} [contact.lastName="Doe"] Last Name of the user
    * @param {string} to The callee's address (e.g. SIP URI) used to establish the call
    * @param {function} onSuccess The onSuccess({@link fcs.call.OutgoingCall}) callback function to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
    * @param {boolean} [isVideoEnabled] This will add m=video to SDP. This is a SPiDR service only parameter.
    * @param {boolean} [sendInitialVideo] In order to make video call set this to true. This is a SPiDR service only parameter.
    * @param {string} [videoQuality] Sets the quality of video. This is a SPiDR service only parameter.
    * @param {object} params Contains the service name ({serviceName:'spidr'} or ({serviceName:'rcc'}). SPiDR service parameter is default. If it is a RCC service, the service parameter should be given.
    *
    * @example
    * // SPiDR service example is as follows:
    * // @since 3.0.0
    * // Make Voice Call
    * // Start a voice call to the uri indicated with "to" argument
    * // Login is a prerequisite for making calls
    * // contact is an object with two fields contact.firstName and contact.lastName that specifies caller info
    * fcs.call.startCall(fcs.getUser(), contact, to,
    *      function(outgoingCall){
    *                //get callid for your web app to be used later for handling popup windows
    *                var callId = outgoingCall.getId();
    *
    *                outgoingCall.onStateChange = function(state,statusCode){
    *                //Add statusCode that returned from the server property to the call
    *                outgoingCall.statusCode = statusCode;
    *                //Put your web app code to handle call state change like ringing, onCall ...etc.
    *	    };
    *
    *       outgoingCall.onStreamAdded = function(streamURL){
    *           // Setting up source (src tag) of remote video container
    *           $("#remoteVideo").attr("src", streamURL);
    *       };
    *    },
    *    function(){
    *       //put your web app failure handling code
    *       window.alert("CALL_FAILED");
    *    },
    *    false, false);
    *
    * // RCC service example is as follows:
    * // @since 3.1.1
    * // Start a call from a monitored device.
    * fcs.call.startCall(undefined, undefined,
    *    // destination
    *    destination,
    *    // onSuccess callback
    *    function (outgoingCall)
    *    {
    *        outgoingCall.onStateChange = function (state, statusCode, reasonText, data) {
    *                onStateChange(outgoingCall, state, data);
    *        };
    *        console.log('make call request success');
    *    },
    *    // onFailure callback
    *    function (e) {
    *        console.log('make call request failure!');
    *    },
    *    undefined, undefined, undefined, {serviceName: 'rcc'});
    *
    */

    this.startCall = function (from, contact, to, onSuccess, onFailure, isVideoEnabled, sendInitialVideo, videoQuality, params) {
        var param = {from: from, contact: contact, to: to, isVideoEnabled: isVideoEnabled, sendInitialVideo: sendInitialVideo, videoQuality: videoQuality};
        param = extend(param, params);

        return _manager.invoke('call', 'start', param, onSuccess, onFailure);
    };

   /**
     * Starts monitoring a device.
     *
     * This is an RCC service only method.
     *
     * @name fcs.call.startMonitorDevice
     * @function
     * @since 3.1.1
     * @param {string} deviceID If string with length greater than 0; device monitor will be started, otherwise user monitor will be started.
     * @param {function} onSuccess The onSuccess callback function to be called
     * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
     *
     * @example
     * // User is subscribed...
     * // If deviceID is a string with length greater than 0; device monitor will be started,
     * // otherwise user monitor will be started.
     * var deviceID = null;
     * fcs.call.startMonitorDevice(
     *     deviceID,
     *     // onSuccess callback
     *     function () {
     *         console.log('Start monitor success');
     *     },
     *     // onFailure callback
     *     function () {
     *         console.log('Start monitor failure');
     *     });
     */

    this.startMonitorDevice = function (deviceID, onSuccess, onFailure) {
        var param = {deviceID: deviceID};
        param = extend(param, {serviceName:'rcc'});

        return _manager.invoke('call', 'startMonitorDevice', param, onSuccess, onFailure);
    };

     /**
     * Stops monitoring a device.
     *
     * This is an RCC service only method.
     *
     * @name fcs.call.stopMonitorDevice
     * @function
     * @since 3.1.1
     * @param {function} onSuccess The onSuccess callback function to be called
     * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
     *
     * @example
     * fcs.call.stopMonitorDevice(
     *  // onSuccess callback
     *  function () {
     *      console.log('stop monitor success');
     *  },
     *  // onFailure callback
     *  function () {
     *      console.log('stop monitor failure');
     *  });
     *
     */

    this.stopMonitorDevice = function (onSuccess, onFailure) {
        var param = {};
        param = extend(param, {serviceName:'rcc'});

        return _manager.invoke('call', 'stopMonitorDevice', param, onSuccess, onFailure);
    };


    /**
     * Lists the registered devices of the RCC subscriber.
     *
     * This is an RCC service only method.
     *
     * @name fcs.call.getRCCDeviceList
     * @function
     * @since 3.1.1
     * @param {function} onSuccess The onSuccess callback function to be called with an array of device info objects. Each object contains deviceURI, deviceId and uuid fields.
     * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
     *
     * @example
     * // User is subscribed...
     * fcs.call.getRCCDeviceList(
     *  // onsuccess callback
     *  function(deviceList) {
     *      console.log('get device list success');
     *      for (i = 0; i < deviceList.length; i++) {
     *          // use device list array elements: Sample element:
     *          // "deviceURI":"user1@1.1.1.1:5061",
     *          // "uuid":"00000000-0000-1000-8000-001ECAF35125",
     *          // "deviceId":"c2lwOmVyZGVtMUA0Ny4xNjguMjQ2LjMzOjUwNjE7dHJhbnNwb3J0PXRjcCQ8dXJuOnV1aWQ6IDAw%0AMDAwMDAwLTAwMDAtMTAwMC04MDAwLTAwMUVDQUYzNTEyNT4%3D%0A"
     *      }
     *  },
     *  // onFailure callback
     *  function(e) {
     *      console.log('get device list failure');
     *  });
     */
    this.getRCCDeviceList = function (onSuccess, onFailure) {
        var param = {};
        param = extend(param, {serviceName:'rcc'});

        return _manager.invoke('call', 'getDeviceList', param, onSuccess, onFailure);
    };




    /**
    * Sets log severity level for Webrtc Plugin (not used for native webrtc)
    * 5 levels(sensitive:0, verbose:1, info:2, warning:3, error:4).
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.set_logSeverityLevel
    * @function
    * @since 3.0.0
    *
    */

    this.set_logSeverityLevel = function (level) {
        var param = {level: level};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'set_logSeverityLevel', param);
    };

    /**
    * Enables log callback for Webrtc Plugin (not used for native webrtc).
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.enable_logCallback
    * @function
    * @since 3.0.0
    */

    this.enable_logCallback = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'enable_logCallback', param);
    };

    /**
    * Disables log callback for Webrtc Plugin (not used for native webrtc).
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.disable_logCallback
    * @function
    * @since 3.0.0
    */

    this.disable_logCallback = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'disable_logCallback', param);
    };

    /**
    * Gets audioInDeviceCount.
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.get_audioInDeviceCount
    * @function
    * @since 3.0.0
    */

    this.get_audioInDeviceCount = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'get_audioInDeviceCount', param);
    };

    /**
    * Gets audioOutDeviceCount.
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.get_autioOutDeviceCount
    * @function
    * @since 3.0.0
    */

    this.get_audioOutDeviceCount = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'get_audioOutDeviceCount', param);
    };

    /**
    * Gets videoDeviceCount.
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.get_videoDeviceCount
    * @function
    * @since 3.0.0
    */

    this.get_videoDeviceCount = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'get_videoDeviceCount', param);
    };

    /**
    * Returns Video Device(Camera) availability.
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.hasVideoDevice
    * @function
    * @since 3.0.0
    *
    * @example
    * if(fcs.call.hasVideoDevice()){
    *     // If there is a video device available, show local video container
    *     callView.toggleLocalVideo(true);
    * }
    */
    this.hasVideoDevice = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'get_videoDeviceCount', param);
    };

    /**
    * Returns Audio Device(Microphone) availability.
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.hasAudioDevice
    * @function
    * @since 3.0.0
    *
    * @example
    * if(!fcs.call.hasAudioDevice()){
    *     window.alert("There is no available audio source!");
    * }
    */
    this.hasAudioDevice = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'hasAudioDevice', param);
    };


    /**
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.getUserMedia
    * @function
    * @since 3.0.0
    * @param onSuccess success callback of getUserMedia
    * @param onFailure failure callback of getUserMedia
    * @param options contains audio and video constraints
    *
    * @example
    * fcs.call.getUserMedia(
    *    function(mediaInfo){
    *        window.console.log("media initialized. mediaInfo: " + JSON.stringify(mediaInfo));
    *    },
    *    function(err){
    *        window.console.log("media initialization error " + err);
    *    },
    *    {
    *        "audio": true,
    *        "video": true
    *    }
    * );
    */

    this.getUserMedia = function(onSuccess, onFailure, options) {
        var param = {options: options, privateStream: true};
        param = extend(param, {serviceName:'spidr', privateStream: true});

        return _manager.invoke('call', 'getUserMedia', param, onSuccess, onFailure);
    };

    /**
    * Shows device settings Window
    * Only works with PLUGIN.
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.showSettingsWindow
    * @function
    * @since 3.0.0
    *
    * @example
    * $("#device_settings_button").click(function() {
    *    fcs.call.showSettingsWindow();
    * });
    */

    this.showSettingsWindow = function (onSuccess, onFailure, options) {
        var param = {options: options};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'showSettingsWindow', param, onSuccess, onFailure);
    };

    /**
    * Gets local video resolutions with the order below
    * localVideoHeight-localVideoWidth
    * Only works with PLUGIN.
    * This is a SPiDR service only method.
    *
    * @name fcs.call.getLocalVideoResolutions
    * @function
    * @since 3.0.0
    *
    * @example
    * var pluginLocalVideoResolution = fcs.call.getLocalVideoResolutions();
    * var localVideoHeight = pluginLocalVideoResolution[0];
    * var localVideoWidth = pluginLocalVideoResolution[1];
    * console.log("Local Video Dimensions: " + localVideoWidth + "," + localVideoHeight);
    */

    this.getLocalVideoResolutions = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'getLocalVideoResolutions', param);
    };

    /**
    * Gets remote video resolutions with the order below
    * remoteVideoHeight-remoteVideoWidth
    * Only works with PLUGIN.
    * This is a SPiDR service only method.
    *
    * @name fcs.call.getRemoteVideoResolutions
    * @function
    * @since 3.0.0
    *
    * @example
    * var pluginRemoteVideoResolution = fcs.call.getRemoteVideoResolutions();
    * var remoteVideoHeight = pluginRemoteVideoResolution[0];
    * var remoteVideoWidth = pluginRemoteVideoResolution[1];
    * console.log("Remote Video Dimensions: " + remoteVideoWidth + "," + remoteVideoHeight);
    */

    this.getRemoteVideoResolutions = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'getRemoteVideoResolutions', param);
    };

    /**
    * Shows if plugin is enabled.
    * Only works with PLUGIN.
    * This is a SPiDR service only method.
    *
    * @name fcs.call.isPluginEnabled
    * @function
    * @since 3.0.0
    *
    * @example
    * if(fcs.call.isPluginEnabled()) {
    *     $("#device_settings_details").show();
    * }
    */

    this.isPluginEnabled = function () {
        var param = {};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'isPluginEnabled', param);
    };

    /**
     * Checks if any call exists.
     *
     * This is a SPiDR and RCC service method.
     *
     * @name fcs.call.hasGotCalls
     * @function
     * @param {object} params Contains the service name ({serviceName:'spidr'} or ({serviceName:'rcc'}). SPiDR service parameter is default. If it is a RCC service, the service parameter should be given.
     * @returns {Boolean} true if any call exists, false otherwise.
     *
     * @example
     * // SPiDR service example is as follows:
     * // @since 3.0.0
     * if(fcs.call.hasGotCalls()) {
     *  console.log('At least one call is available.');
     * }
     *
     * // RCC service example is as follows:
     * // @since 3.1.1
     * if(fcs.call.hasGotCalls({serviceName:'rcc'})) {
     *  console.log('At least one call is available.');
     * }
     */
    this.hasGotCalls = function (params) {
        var param = {};
        param = extend(param, params);

        return _manager.invoke('call', 'hasGotCalls', param);
    };

    /**
    * Retrived a call by Id.
    *
    * This function allow to retrive a call which was cached by the call continuation feature.
    * This is a SPiDR service only method.
    *
    * @name fcs.call.getIncomingCallById
    * @function
    * @since 3.0.0
    * @param {string} id from The id of the incoming call
    * @returns {fcs.call.IncomingCall}
    *
    */
    this.getIncomingCallById = function (id) {
        var param = {callid: id};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'getIncomingCallById', param);
    };

    /**
    * Create a renderer for an audio/video stream.
    * This is a SPiDR service only method.
    *
    * @name fcs.call.createStreamRenderer
    * @function
    * @since 3.0.0
    * @param {string} streamUrl The url of the stream
    * @param {object} container The DOM node into which to create the renderer (the content of the node will be cleared)
    * @param {object} options The options to be used for the renderer
    * @returns {Object} renderer Renderer object
    *
    */
    this.createStreamRenderer = function (streamId, container, options) {
        var param = {streamId: streamId, container: container, options: options};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'createStreamRenderer', param);
    };

    /**
    * Discpose of a previously created renderer.
    * This is a SPiDR service only method.
    *
    * @name fcs.call.disposeStreamRenderer
    * @function
    * @since 3.0.0
    * @param {object} container The DOM node into which the renderer was previously created
    */
    this.disposeStreamRenderer = function (container) {
        var param = {container: container};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'disposeStreamRenderer', param);
    };

    /**
    * States of the Call.
    *
    * This is a SPiDR and RCC service member.
    * Available for SPiDR since 3.0.0, and for RCC since 3.1.1.
    *
    * @name States
    * @enum {number}
    * @readonly
    * @memberOf fcs.call
    * @property {number} [IN_CALL=0] The call has been established. In rcc mode, called and calling party information is also passed to the client in on state change callback.
    * @property {number} [ON_HOLD=1] The call has been put on hold.
    * @property {number} [RINGING=2] The outgoing call is ringing. In rcc mode, called and calling party information is also passed to the client in on state change callback.
    * @property {number} [ENDED=3] The call has been terminated.
    * @property {number} [REJECTED=4] The outgoing call request has been rejected by the other party.
    * @property {number} [OUTGOING=5] The outgoing call request has been sent but no response have been received yet.
    * @property {number} [INCOMING=6] The incoming call has been received but has not been answered yet. In rcc mode, called and calling party information is also passed to the client in on state change callback.
    * @property {number} [ANSWERING=7] The incoming call has been answered but the call as not been establish yet.
    * @property {number} [JOINED=8] The call is joined.
    * @property {number} [RENEGOTIATION=9] The call is re-established.
    * @property {number} [TRANSFERRED=10] The call is transferred to a third party.
    * @property {number} [ON_REMOTE_HOLD=11] The call has been put on hold remotely.
    * @property {number} [CALL_IN_PROGRESS=12] The call is in progress. In rcc mode, called and calling party information is also passed to the client in on state change callback.
    * @property {number} [EARLY_MEDIA=13] Early media process successful.
    * EARLY_MEDIA and RINGING states can be triggered multiple times in different orders.
    * In each of these states, if the respondCallUpdate notification comes
    * and processed successfully, the state is IN_CALL.
    * @property {number} [TRANSFER_FAILURE=14] The call couldn't be transferred to a third party.
    */

    this.States = {
        IN_CALL: 0,
        ON_HOLD: 1,
        RINGING: 2,
        ENDED: 3,
        REJECTED: 4,
        OUTGOING: 5,
        INCOMING: 6,
        ANSWERING: 7,
        JOINED: 8,
        RENEGOTIATION: 9,
        TRANSFERRED: 10,
        ON_REMOTE_HOLD: 11,
        CALL_IN_PROGRESS: 12,
        EARLY_MEDIA: 13,
        TRANSFER_FAILURE: 14
    };

    /**
    * Hold states of the Call.
    *
    * This is a SPiDR and RCC service member.
    * Available for SPiDR since 3.0.0, and for RCC since 3.1.1.
    *
    * @name HoldStates
    * @enum {number}
    * @readonly
    * @memberOf fcs.call
    * @property {number} [LOCAL_HOLD=0] The call has been put on hold locally.
    * @property {number} [REMOTE_HOLD=1] The call has been put on hold remotely.
    * @property {number} [BOTH_HOLD=2] he call has been put on both locally and remotely.
    */

    this.HoldStates = {
        LOCAL_HOLD: 0,
        REMOTE_HOLD: 1,
        BOTH_HOLD: 2
    };

    /**
    * Type of media initialization errors.
    *
    * This is a SPiDR service only member.
    *
    * @name MediaErrors
    * @enum {number}
    * @since 3.0.0
    * @readonly
    * @memberOf fcs.call
    * @property {number} [NOT_FOUND=1] No media source available.
    * @property {number} [NOT_ALLOWED=2] User did not allow media use.
    * @property {number} [OPTIONS=3] Missing or wrong use of options.
    * @property {number} [WRONG_VERSION=4] The version of the plugin is not supported.
    * @property {number} [NOT_INITIALIZED=5] The media is not initialized.
    * @property {number} [NEW_VERSION_WARNING=6] New plugin version is available.
    * @property {number} [INVALID_PARAMETER=7] Invalid parameter.
    *
    */
    this.MediaErrors = {
        NOT_FOUND: 1,
        NOT_ALLOWED: 2,
        OPTIONS: 3,
        WRONG_VERSION: 4,
        NOT_INITIALIZED: 5,
        NEW_VERSION_WARNING: 6,
        INVALID_PARAMETER: 7
    };

    /**
    * Call a party through a client device using the Click To Call service.
    * This is a SPiDR service only method.
    *
    * @name fcs.call.clickToCall
    * @function
    * @since 3.0.0
    * @param {string} callingParty The caller's address (e.g. SIP) used to establish the call
    * @param {string} calledParty The callee's address (e.g. SIP) used to establish the call
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    *
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.call.clickToCall("user1@test.com", "user2@test.com", onSuccess, onError);
    */

    this.clickToCall = function (callingParty, calledParty, onSuccess, onFailure) {
        var param = {callingParty: callingParty, calledParty: calledParty};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'clickToCall', param, onSuccess, onFailure);
    };

   /**
    * Provide the user with a routable PSTN number as a result of an IMRN allocation request.
    * This is a SPiDR service only method.
    *
    * @name fcs.call.getIMRN
    * @function
    * @param {string} realm The pool of numbers from which IMRN will be allocated
    * @param {string} source The URI of the individual placing the call
    * @param {string} destination The URI of the individual receiving the call
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    */

    this.getIMRN = function (realm, source, destination, onSuccess, onFailure) {
        var param = {realm: realm, source: source, destination: destination};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'getIMRN', param, onSuccess, onFailure);
    };

   /**
    * Return the stream refined by id
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.getStreamById
    * @function
    * @param id of the stream
    */
    this.getStreamById = function(id) {
        var param = {streamId: id};
        param = extend(param, {serviceName:'spidr'});

        return _manager.invoke('call', 'getStreamById', param);
    };

   /**
    * Delete selected stream
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.removeStreamById
    * @function
    * @param id of the stream
    */
    this.removeStreamById = function(id) {
        var param = {streamId: id};
        param = extend(param, {serviceName:'spidr'});

        _manager.invoke('call', 'removeStreamById', param);
    };

   /**
    * Sets specific audio input for the next call
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.setSelectedMicrophoneId
    * @function
    * @param id of the audio input device
    */
    this.setSelectedMicrophoneId = function(id) {
        var param = {microphoneId: id};
        param = extend(param, {serviceName:'spidr'});

        _manager.invoke('call', 'setSelectedMicrophoneId', param);
    };

   /**
    * Sets specific video input for the next call
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.setSelectedCameraId
    * @function
    * @param id of the video input device
    */
    this.setSelectedCameraId = function(id) {
        var param = {cameraId: id};
        param = extend(param, {serviceName:'spidr'});

        _manager.invoke('call', 'setSelectedCameraId', param);
    };

   /**
    * Returns available video input sources
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.getCameraList
    * @function
    * @param onSuccess success callback of getCameraList
    */
    this.getCameraList = function(onSuccess) {
        var param = {};
        param = extend(param, {onSuccess: onSuccess, serviceName:'spidr'});

        return _manager.invoke('call', 'getCameraList', param);
    };

   /**
    * Returns available audio input sources
    *
    * This is a SPiDR service only method.
    *
    * @name fcs.call.getMicrophoneList
    * @function
    * @param onSuccess success callback of getMicrophoneList
    */
    this.getMicrophoneList = function(onSuccess) {
        var param = {};
        param = extend(param, {onSuccess: onSuccess, serviceName:'spidr'});

        return _manager.invoke('call', 'getMicrophoneList', param);
    };

    /**
    * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
    *
    * This is a SPiDR and RCC service class.
    * Available for SPiDR since 3.0.0, and for RCC since 3.1.1.
    *
    * @name IncomingCall
    * @class
    * @memberOf fcs.call
    * @augments fcs.call.Call
    * @param {String} callid Unique identifier for the call
    * @param {Object} opts options
    * @param {String} callee Called party information. This is an RCC service parameter.
    * @param {String} caller Calling party information. This is an RCC service parameter.
    * @version 3.1.3.45
    */
    this.IncomingCall = function () {

        /**
         * Sets the handler for listening local video stream ready event.
         *
         * This is a SPiDR service only event.
         *
         * @name fcs.call.IncomingCall#onLocalStreamAdded
         * @function
         * @since 3.0.0.1
         *
         **/

        /**
         * Sets the handler for listening remote video stream ready event.
         *
         * This is a SPiDR service only event.
         *
         * @name fcs.call.IncomingCall#onStreamAdded
         *
         * @function
         * @since 2.0.0
         * @param {?String} streamUrl remote video streamUrl
         *
         **/

       /**
       *
       * This is a SPiDR service only member.
       *
       * @name fcs.call.IncomingCall#calleeNumber
       * @field
       * @since 3.0.0
       * @type {String}
       *
       * @example
       *
       * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
       *
       * var incomingCall = {};
       * fcs.call.onReceived = function(call) {
       *    incomingCall = call;
       * };
       *
       * incomingCall.calleeNumber;
       */

       /**
       *
       * This is a SPiDR service only member.
       *
       * @name fcs.call.IncomingCall#callerNumber
       * @field
       * @since 3.0.0
       * @type {String}
       *
       * @example
       *
       * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
       *
       * var incomingCall = {};
       * fcs.call.onReceived = function(call) {
       *    incomingCall = call;
       * };
       *
       * incomingCall.callerNumber;
       */

        /**
       *
       * This is a SPiDR service only member.
       *
       * @name fcs.call.IncomingCall#callerName
       * @field
       * @since 3.0.0
       * @type {String}
       *
       * @example
       *
       * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
       *
       * var incomingCall = {};
       * fcs.call.onReceived = function(call) {
       *    incomingCall = call;
       * };
       *
       * incomingCall.callerName;
       */

        /**
       *
       * This is a SPiDR service only member.
       *
       * @name fcs.call.IncomingCall#primaryContact
       * @field
       * @since 3.0.0
       * @type {String}
       *
       * @example
       *
       * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
       *
       * var incomingCall = {};
       * fcs.call.onReceived = function(call) {
       *    incomingCall = call;
       * };
       *
       * incomingCall.primaryContact;
       */

        /**
         * Puts the speaker into mute.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#mute
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.mute();
         */

        /**
         * Puts the speaker into unmute.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#unmute
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.unmute();
         */

        /**
         * Answers the call.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#answer
         * @function
         * @param {function} onSuccess The onSuccess() callback function to be called. In RCC, success callback is triggered when answered event is received.
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called. In RCC, failure call back is triggered when end or failed event is received before answered event, or there is a state failure.
         * @param {boolean} [isVideoEnabled] Start call with video or not. This is a SPiDR service only parameter.
         * @param {String} [videoQuality] Video quality. This is a SPiDR service only parameter.
         *
         * @example
         * // SPiDR service example is as follows:
         * // @since 3.0.0
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    console.log('Answer call success!');
         * };
         * var onError = function (err) {
         *   console.log('Answer call failure!');
         * };
         *
         * incomingCall.answer(onSuccess, onFailure, true, "1280x720");
         *
         * // RCC service example is as follows:
         * // @since 3.1.1
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.answer(
         *  // onSuccess callback
         *  function () {
         *      console.log('Answer call success!');
         *  },
         *  // onFailure callback
         *  function () {
         *      console.log('Answer call failure!');
         *  });
         */

        /**
         * Rejects the call.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#reject
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onError = function (err) {
         *   //do something here
         * };
         *
         * incomingCall.reject(onSuccess, onFailure);
         */

        /**
         * Ignores the call. Client will not send any rest request for this one. Ignore is on client side only.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#ignore
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onError = function (err) {
         *   //do something here
         * };
         *
         * incomingCall.ignore(onSuccess, onFailure);
         */

        /**
         * Forwards the call.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#forward
         * @function
         * @param {string} address The address where the call is transferred (e.g. SIP URI)
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    console.log('Forward call success!');
         * };
         * var onError = function (err) {
         *   console.log('Forward call failure!');
         * };
         *
         * incomingCall.forward("user1@test.com", onSuccess, onFailure);
         */

        /**
         *
         * Checks the incoming call if it has reject option.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#canReject
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canReject();
         */

        /**
         *
         * Checks the incoming call if it has forward option.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#canForward
         * @function
         * @returns {Boolean}
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canForward();
         */

        /**
         * Checks the incoming call if it has answer option.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#canAnswer
         * @function
         * @returns {Boolean}
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canAnswer();
         */

        /**
         * Are we able to send video.
         * Ex: Client may try to send video but video cam can be unplugged. Returns false in that case.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#canSendVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canSendVideo();
         */

        /**
         * Are we able to send video. Checks the incoming SDP.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#canReceiveVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.canReceiveVideo();
         */

         /**
         * Returns hold state of call.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#getHoldState
         * @function
         * @returns {@link fcs.HoldStates} or undefined if call has not been put
         * on hold.
         *
         * @example
         * // Available since 3.0.4 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.getHoldState();
         */

        /**
         * Gets called party.
         *
         * This is an RCC service method.
         *
         * @name fcs.call.IncomingCall#getCalledParty
         * @function
         * @returns {calledParty} string describing the called party
         *
         * @example
         * // Available since 3.1.0 for RCC service.
         *
         *   fcs.call.onReceived = onCallReceived;
         *   function onCallReceived(call) {
         *       console.log("Called party: " + call.getCalledParty());
         *   }
         */

        /**
         * Gets calling party.
         *
         * This is an RCC service method.
         *
         * @name fcs.call.IncomingCall#getCallingParty
         * @function
         * @returns {callingParty} string describing the calling party
         *
         * @example
         * // Available since 3.1.0 for RCC service.
         *
         *   fcs.call.onReceived = onCallReceived;
         *   function onCallReceived(call) {
         *       console.log("Calling party: " + call.getCallingParty());
         *   }
         */


        /**
         * Gets call id.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#getId
         * @function
         * @returns {id} Unique identifier for the call
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.getId();
         */

        /**
         * End the call.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#end
         * @function
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.end(
         *   // onSuccess callback
         *   function () {
         *       console.log('Call is ended!');
         *   },
         *   // onFailure callback
         *   function () {
         *       console.log('Call could not be ended!');
         *   });
         */

        /**
          * Holds the call.
          *
          * This is a SPiDR and RCC service method.
          *
          * @name fcs.call.IncomingCall#hold
          * @function
          * @param {function} onSuccess The onSuccess() callback function to be called
          * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
          *
          * @example
          * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
          * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
          *
          * var incomingCall = {};
          * fcs.call.onReceived = function(call) {
          *    incomingCall = call;
          * };
          *
          * var onSuccess = function(){
          *    console.log('Call is held!');
          * };
          * var onFailure = function(err){
          *    console.log('Call could not be held!');
          * };
          *
          * incomingCall.hold(onSuccess, onFailure);
          */

        /**
         * Resume the call.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#unhold
         * @function
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    console.log('Call is retrieved!');
         * };
         * var onFailure = function(err){
         *    console.log('Call could not be retrieved!');
         * };
         *
         * incomingCall.unhold(onSuccess, onFailure);
         */

        /**
         * Directly transfers the existing call to another recipient.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#directTransfer
         * @function
         * @param {string} address The address where the call is transferred (e.g. SIP URI)
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    console.log('Call is transferred!');
         * };
         * var onFailure = function(err){
         *    console.log('Call could not be transferred!');
         * };
         *
         * incomingCall.directTransfer("user@domain.com", onSuccess, onFailure);
         */

        /**
        * Transfers an existing call to another existing call.
        *
        *
        * @name fcs.call.IncomingCall#consultativeTransfer
        * @function
        * @since 3.1.1
        * @param {string} transferredCallId The id of call which will be transferred into the current(incoming) call
        * @param {function} onSuccess The onSuccess() callback function to be called
        * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
        *
        * @example
        *
        * // When an outgoing call is received, {@link fcs.call.event:onOutgoingCall} handler will be invoked.
        *
        * var outgoingCall = {};
        * fcs.call.onOutgoingCall = function(call) {
        *    outgoingCall = call;
        * };
        *
        * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        *
        * var incomingCall = {};
        * fcs.call.onReceived = function(call) {
        *    incomingCall = call;
        * };
        *
        * incomingCall.consultativeTransfer(outgoingCall.getId(), onSuccess, onFailure);
        */

        /**
         * Stop the video for this call after the call is established.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#videoStop
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onFailure = function(err){
         *    //do something here
         * };
         *
         * incomingCall.videoStop(onSuccess, onFailure);
         */

        /**
         * Start the video for this call after the call is established.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#videoStart
         * @function
         * @since 3.0.0
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure() callback function to be called
         * @param {string} [videoQuality] Sets the quality of video, this parameter will be passed to getUserMedia()
         *                  if the video source is allowed before, this parameter will not be used
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * var onSuccess = function(){
         *    //do something here
         * };
         * var onFailure = function(err){
         *    //do something here
         * };
         *
         * incomingCall.videoStart(onSuccess, onFailure);
         */

        /**
         * Join 2 calls.
         * You need two different calls to establish this functionality.<br>
         *
         * In SPiDR implementation: in order to join two calls both calls must
         * be put into hold state first.<br>
         *
         * In RCC implementation: in order to join two calls one call must
         * be in local hold state, and the other one must be in answered state. <br>
         *
         * If not call servers will not handle your request.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.IncomingCall#join
         * @function
         * @param {fcs.call.Call} anotherCall Call that we want the current call to be joined to.
         * @param {function} onSuccess The onSuccess({@link fcs.call.Call}) to be called when the call have been joined provide the joined call as parameter
         * @param {function} [onFailure] The onFailure() to be called when media could not be join
         * @param {boolean} [isVideoEnabled] In order to join video calls set this to true. This is a SPiDR service only parameter.
         * @param {string} [videoQuality] Sets the quality of video. This is a SPiDR service only parameter.
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * // And another {@link fcs.call.OutgoingCall} or {@link fcs.call.IncomingCall} is required which is going to be joined.
         * var anotherCall; // assume this is previosuly created.
         *
         * var joinOnSuccess = function(joinedCall){
         *    joinedCall // newly created.
         *    console.log('Join success!');
         * };
         * var joinOnFailure = function(){
         *    console.log('Join failure!');
         * };
         *
         * incomingCall.join(anotherCall, joinOnSuccess, joinOnFailure, isVideoEnabled, videoQuality);
         *
         * // When join() is successfuly completed, joinOnSuccess({@link fcs.call.OutgoingCall}) will be invoked.
         */

        /**
         * Send Dual-tone multi-frequency signaling.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#sendDTMF
         * @function
         * @since 3.0.0
         * @param {String} tone Tone to be send as dtmf.
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.sendDTMF("0");
         */

        /**
         * Force the plugin to send a IntraFrame
         * Only used by PLUGIN.
         * This needs to be called when sending video.
         * Solves video freeze issue.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#sendIntraFrame
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.sendIntraFrame();
         */

        /**
         * Force the plugin to send a BlackFrame
         * Only used by PLUGIN.
         * Some of the SBC's(Session Border Controllers) do not establish one way video.
         * audio only side has to send a blackFrame in order to see the incoming video.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#sendBlackFrame
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.sendBlackFrame();
         */

        /**
         * Force the plugin to refresh video renderer
         * with this call's remote video stream
         * Only used by PLUGIN.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#refreshVideoRenderer
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.refreshVideoRenderer();
         */

        /**
         * Returns the call is a join call or not
         * Do not use this function if you really dont need it.
         * This will be handled by the framework.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#getJoin
         * @function
         * @since 3.0.0
         * @returns {Boolean} isJoin
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.getJoin();
         */

        /**
         * Marks the call as a join call or not
         * Do not use this function if you really dont need it.
         * This will be handled by the framework.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#setJoin
         * @function
         * @since 3.0.0
         * @param {String} join
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.setJoin(true);
         */

        /**
         * Returns the button is a disabled or not
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#getButtonDisabler
         * @function
         * @since 3.0.0
         * @returns {Boolean} buttonDisabler
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.getButtonDisabler();
         */

        /**
         * Disable the button after waiting 4000 milliseconds.
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#setButtonDisabler
         * @function
         * @since 3.0.0
         * @param {Boolean} disable
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.setButtonDisabler(true);
         */

        /**
         * Clears the timer set with fcs.call.IncomingCall#setButtonDisabler.
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#clearBtnTimeout
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.clearBtnTimeout();
         */


        /**
        * Long call audit
        * Creates a timer after call is established.
        * This timer sends a "PUT" request to server.
        * This will continue until one request fails.
        * Handled by framework. You dont need to call this function.
        * This is a SPiDR service only method.
        *
        * @name fcs.call.IncomingCall#setAuditTimer
        * @function
        * @since 3.0.0
        * @param {String} audit
        *
        * @example
        *
        * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        * incomingCall.setAuditTimer(audit);
        */


        /**
        * Clears the long call audit prior to clearing all call resources.
        * Handled by framework. you dont need to call this function.
        * This is a SPiDR service only method.
        *
        * @name fcs.call.IncomingCall#clearAuditTimer
        * @function
        * @since 3.0.0
        *
        * @example
        *
        * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        */

        /**
         * @deprecated DO NOT USE, use isVideoNegotiationAvailable instead
         * Returns video negotation availability.
         *
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#isVideoNegotationAvailable
         * @function
         * @since 3.0.1
         * @param {String} id Unique identifier for the call
         * @example
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.isVideoNegotationAvailable();
         */

        /**
         * Returns video negotiation availability.
         *
         * This is a SPiDR service only method.
         *
         * @name fcs.call.IncomingCall#isVideoNegotiationAvailable
         * @function
         * @since 3.1.0
         * @example
         * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var incomingCall = {};
         * fcs.call.onReceived = function(call) {
         *    incomingCall = call;
         * };
         *
         * incomingCall.isVideoNegotiationAvailable();
         */
    };

    /**
    * This class is used to represent an outgoing call.
    *
    * This is a SPiDR and RCC service class.
    * Available for SPiDR since 3.0.0, and for RCC since 3.1.1.
    *
    * @name OutgoingCall
    * @class
    * @memberOf fcs.call
    * @augments fcs.call.Call
    * @param {String} callid Unique identifier for the call
    * @param {String} callee Called party information. This is an RCC service parameter. Exists in received calls. Does not exist in rcc client started calls.
    * @param {String} caller Calling party information. This is an RCC service parameter. Exists in received calls. Does not exist in rcc client started calls.
    * @version 3.1.3.45
    */
    this.OutgoingCall = function () {

        /**
         * Sets the handler for listening local video stream ready event.
         *
         * This is a SPiDR service only event.
         *
         * @name fcs.call.OutgoingCall#onLocalStreamAdded
         * @function
         * @since 3.0.0.1
         *
         **/

        /**
         * Sets the handler for listening remote video stream ready event.
         *
         * This is a SPiDR service only event.
         *
         * @name fcs.call.OutgoingCall#onStreamAdded
         *
         * @function
         * @since 2.0.0
         * @param {?String} streamUrl remote video streamUrl
         *
         **/

        /**
         * Are we able to send video.
         * Ex: Client may try to send video but video cam can be unplugged. Returns false in that case.
         *
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#canSendVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.canSend();
         */

        /**
         * Are we able to send video. Checks the incoming SDP.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#canReceiveVideo
         * @function
         * @since 3.0.0
         * @returns {Boolean}
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.canReceiveVideo();
         */

         /**
         * Returns hold state of call.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.OutgoingCall#getHoldState
         * @function
         * @returns {@link fcs.HoldStates} or undefined if call has not been put
         * on hold.
         *
         * @example
         * // Available since 3.0.4 for SPiDR service, and since 3.1.1 for RCC service.
         * // When an outgoingCall call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * outgoingCall.getHoldState();
         */


        /**
         * Gets called party.
         *
         * This is an RCC service method. This paremeter exists in received calls. Does not exist in rcc client started calls.
         *
         * @name fcs.call.OutgoingCall#getCalledParty
         * @function
         * @returns {calledParty} string describing the called party
         *
         * @example
         * // Available since 3.1.0 for RCC service.
         *
         *   fcs.call.onOutgoingCall = onOutgoingCall;
         *   function onOutgoingCall(call) {
         *       console.log("Called party: " + call.getCalledParty());
         *   }
         */

        /**
         * Gets calling party.
         *
         * This is an RCC service method. This paremeter exists in received calls. Does not exist in rcc client started calls.
         *
         * @name fcs.call.OutgoingCall#getCallingParty
         * @function
         * @returns {callingParty} string describing the calling party
         *
         * @example
         * // Available since 3.1.0 for RCC service.
         *
         *   fcs.call.onOutgoingCall = onOutgoingCall;
         *   function onOutgoingCall(call) {
         *       console.log("Calling party: " + call.getCallingParty());
         *   }
         */


        /**
         * Gets call id.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.OutgoingCall#getId
         * @function
         * @returns {id} Unique identifier for the call
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.getId();
         */

        /**
         * Force the plugin to send a IntraFrame.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#sendIntraFrame
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.sendIntraFrame();
         */

        /**
         * Force the plugin to send a BlackFrame.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#sendBlackFrame
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.sendBlackFrame();
         */

        /**
         * Force the plugin to refresh video renderer
         * with this call's remote video stream.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#refreshVideoRenderer
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.refreshVideoRenderer();
         */

        /**
         * Puts the speaker into mute.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#mute
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.mute();
         */

        /**
         * Puts the speaker into unmute.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#unmute
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.unmute();
         */

        /**
         * End the call.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.OutgoingCall#end
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         * @function
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * outgoingCall.end(
         *   // onSuccess callback
         *   function () {
         *       console.log('Call is ended!');
         *   },
         *   // onFailure callback
         *   function () {
         *       console.log('Call could not be ended!');
         *   });
         */

        /**
          * Holds the call.
          *
          * This is a SPiDR and RCC service method.
          *
          * @name fcs.call.OutgoingCall#hold
          * @function
          * @param {function} onSuccess The onSuccess() callback function to be called
          * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
          *
          * @example
          * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
          * // A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
          *
          * var outgoingCall = {};
          * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
          *
          * var holdCallOnSuccess = function(){
          *    console.log('Call is held!');
          * };
          * var holdCallOnFailure = function(err){
          *    console.log('Call could not be held!');
          * };
          *
          * outgoingCall.hold(holdCallOnSuccess, holdCallOnFailure);
          */

        /**
         * Resume the call.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.OutgoingCall#unhold
         * @function
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var unholdCallOnSuccess = function(){
         *    console.log('Call is retrieved!');
         * };
         * var unholdCallOnFailure = function(err){
         *    console.log('Call could not be retrieved!');
         * };
         *
         * outgoingCall.unhold(unholdCallOnSuccess, unholdCallOnFailure);
         */

        /**
         * Directly transfers the existing call to another recipient.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.OutgoingCall#directTransfer
         * @function
         * @param {string} address The address where the call is transferred (e.g. SIP URI)
         * @param {function} onSuccess The onSuccess() callback function to be called
         * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var onSuccess = function(){
         *    console.log('Call is transferred!');
         * };
         * var onFailure = function(err){
         *    console.log('Call could not be transferred!');
         * };
         *
         * outgoingCall.directTransfer("user@domain.com", onSuccess, onFailure);
         */

        /**
        * Transfers an existing call to another existing call.
        *
        * This is an RCC service only method.
        *
        * @name fcs.call.OutgoingCall#consultativeTransfer
        * @function
        * @since 3.1.1
        * @param {string} transferredCallId The id of call which will be transferred into the current(outgoing) call
        * @param {function} onSuccess The onSuccess() callback function to be called
        * @param {function} onFailure The onFailure({@link fcs.Errors}) callback function to be called
        *
        * @example
        *
        * // When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        *
        * var incomingCall = {};
        * fcs.call.onReceived = function(call) {
        *    incomingCall = call;
        * };
        *
        * // When an outgoing call is received, {@link fcs.call.event:onOutgoingCall} handler will be invoked.
        *
        * var outgoingCall = {};
        * fcs.call.onOutgoingCall = function(call) {
        *    outgoingCall = call;
        * };
        *
        * outgoingCall.consultativeTransfer(incomingCall.getId(), onSuccess, onFailure);
        */

        /**
         * Stop the video for this call after the call is established.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#videoStop
         * @function
         * @since 3.0.0
         * @param {function} [onSuccess] The onSuccess() to be called when the video is stopped<br />
         * function()
         * @param {function} [onFailure] The onFailure() to be called when the video could not be stopped<br />
         * function()
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var videoStopOnSuccess = function(){
         *    //do something here
         * };
         * var videoStopOnFailure = function(){
         *    //do something here
         * };
         *
         * outgoingCall.videoStop(videoStopOnSuccess, videoStopOnFailure);
         */

        /**
         * Start the video for this call after the call is established.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#videoStart
         * @function
         * @since 3.0.0
         * @param {function} [onSuccess] The onSuccess() to be called when the video is started
         * @param {function} [onFailure] The onFailure() to be called when the video could not be started
         * @param {string} [videoQuality] Sets the quality of video, this parameter will be passed to getUserMedia()
         *                  if the video source is allowed before, this parameter will not be used
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var videoStartOnSuccess = function(){
         *    //do something here
         * };
         * var videoStartOnFailure = function(){
         *    //do something here
         * };
         *
         * outgoingCall.videoStart(videoStopOnSuccess, videoStopOnFailure);
         */

        /**
         * Join 2 calls.
         * You need two different calls to establish this functionality.<br>
         *
         * In SPiDR implementation: in order to join two calls both calls must
         * be put into hold state first.<br>
         *
         * In RCC implementation: in order to join two calls one call must
         * be in local hold state, and the other one must be in answered state. <br>
         *
         * If not call servers will not handle your request.
         *
         * This is a SPiDR and RCC service method.
         *
         * @name fcs.call.OutgoingCall#join
         * @function
         * @param {fcs.call.Call} anotherCall Call that we want the current call to be joined to.
         * @param {function} onSuccess The onSuccess({@link fcs.call.OutgoingCall}) to be called when the call have been joined provide the joined call as parameter
         * @param {function} [onFailure] The onFailure() to be called when media could not be join
         * @param {boolean} [isVideoEnabled] In order to join video calls set this to true. This is a SPiDR service only parameter.
         * @param {string} [videoQuality] Sets the quality of video. This is a SPiDR service only parameter.
         *
         * @example
         * // Available since 3.0.0 for SPiDR service, and since 3.1.1 for RCC service.
         * // A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * // And another {@link fcs.call.OutgoingCall} or {@link fcs.call.IncomingCall} is required which is going to be joined.
         * var anotherCall; // assume this is previosuly created.
         *
         * var joinOnSuccess = function(joinedCall){
         *    joinedCall // newly created.
         *    console.log('Join success!');
         * };
         * var joinOnFailure = function(){
         *    console.log('Join failure!');
         * };
         *
         * outgoingCall.join(anotherCall, joinOnSuccess, joinOnFailure, isVideoEnabled, videoQuality);
         *
         * // When join() is successfuly completed, joinOnSuccess({@link fcs.call.OutgoingCall}) will be invoked.
         */

        /**
         * Send Dual-tone multi-frequency signaling.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#sendDTMF
         * @function
         * @since 3.0.0
         * @param {String} tone Tone to be send as dtmf.
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var videoStartOnSuccess = function(){
         *    //do something here
         * };
         * var videoStartOnFailure = function(){
         *    //do something here
         * };
         *
         * outgoingCall.sendDTMF("0");
         */

        /**
         * Returns the call is a join call or not
         * Do not use this function if you really dont need it.
         * This will be handled by the framework.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#getJoin
         * @function
         * @since 3.0.0
         * @returns {Boolean} isJoin
         *
         * @example
         *
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         *
         * var videoStartOnSuccess = function(){
         *    //do something here
         * };
         * var videoStartOnFailure = function(){
         *    //do something here
         * };
         *
         * outgoingCall.getJoin();
         *
         * This method will return true if the outgoingCall is a previously joined call {@see {@link fcs.call.outgoingCall#join}}.
         */

        /**
         * Marks the call as a join call or not
         * Do not use this function if you really dont need it.
         * This will be handled by the framework.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#setJoin
         * @function
         * @since 3.0.0
         * @param {String} join
         *
         * @example
         *
         * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.onReceived = function(call) {
         *    outgoingCall = call;
         * };
         *
         * outgoingCall.setJoin(true);
         */

        /**
         * Returns the button is a disabled or not
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#getButtonDisabler
         * @function
         * @since 3.0.0
         * @returns {Boolean} buttonDisabler
         *
         * @example
         *
         * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.onReceived = function(call) {
         *    outgoingCall = call;
         * };
         *
         * outgoingCall.getButtonDisabler();
         */

        /**
         * Clears the timer set with fcs.call.IncomingCall#setButtonDisabler.
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#clearBtnTimeout
         * @function
         * @since 3.0.0
         * @param {bool} disable
         *
         * @example
         *
         * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.onReceived = function(call) {
         *    outgoingCall = call;
         * };
         *
         * outgoingCall.clearBtnTimeout();
         */

        /**
         * Clears the timer set with fcs.call.IncomingCall#setButtonDisabler.
         * You may want to disable your buttons while waiting for a response.
         * Ex: this will prevent clicking multiple times for hold button until first hold response is not recieved.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#clearBtnTimeout
         * @function
         * @since 3.0.0
         *
         * @example
         *
         * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
         *
         * var outgoingCall = {};
         * fcs.call.onReceived = function(call) {
         *    outgoingCall = call;
         * };
         *
         * outgoingcall.clearBtnTimeout();
         */

        /**
        * Long call audit
        * Creates a timer after call is established.
        * This timer sends a "PUT" request to server.
        * This will continue until one request fails.
        * Handled by framework. You dont need to call this function.
        * This is a SPiDR service only method.
        *
        * @name fcs.call.OutgoingCall#setAuditTimer
        * @function
        * @since 3.0.0
        * @param {function} audit
        *
        * @example
        *
        * When an incoming call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        * incomingCall.setAuditTimer(audit);
        */


        /**
        * Clears the long call audit prior to clearing all call resources.
        * Handled by framework. you dont need to call this function.
        * This is a SPiDR service only method.
        *
        * @name fcs.call.OutgoingCall#clearAuditTimer
        * @function
        * @since 3.0.0
        *
        * @example
        *
        * When an outgoing call is received, {@link fcs.call.event:onReceived} handler will be invoked.
        */

        /**
         * @deprecated DO NOT USE, use isVideoNegotiationAvailable instead
         * Returns video negotation availability.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#isVideoNegotationAvailable
         * @function
         * @since 3.0.1
         * @param {String} id Unique identifier for the call
         * @example
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.isVideoNegotationAvailable(id);
         */

        /**
         * Returns video negotiation availability.
         * This is a SPiDR service only method.
         *
         * @name fcs.call.OutgoingCall#isVideoNegotiationAvailable
         * @function
         * @since 3.1.0
         * @example
         * A previously created {@link fcs.call.OutgoingCall} is required. {@see {@link fcs.call.startCall}} for more details.
         *
         * var outgoingCall = {};
         * fcs.call.startCall(..., ..., ..., onSuccess(outgoingCall), ..., ...);
         * outgoingCall.isVideoNegotiationAvailable();
         */
    };
};

//@{fcs-jsl-prod}
var Call = function(manager) {
    return new CallImpl(manager || callManager);
};

fcs.call = new Call(serviceInvokeManager);

if (__testonly__) { __testonly__.Call = Call; }
//@{fcs-jsl-prod}



var RouteManagementServiceImpl = function(_server) {

    var routeManagementUrl = "/routelist";

    function parseResponse(routeListData) {
        var receivedRouteList = [], items, params, entry, i;
        if(routeListData && routeListData.routeResponse){
            items = routeListData.routeResponse.routeList;
           // receivedRouteList = utils.getProperty(routeListData.routeResponse, 'routeList');

        if(items){
            for(i=0; i < items.length;i++){
                params =items[i];
                entry = new fcs.routes.Entry();
                entry.name = utils.getProperty(params, 'name');
                entry.status = utils.getProperty(params, 'status');
                receivedRouteList.push(entry);
            }
        }
        }
        return receivedRouteList;
    }

    this.retrieve = function(onSuccess, onFailure) {

        _server.sendGetRequest({
                        "url": getWAMUrl(1, routeManagementUrl)
                    },
                    onSuccess,
                    onFailure,
                    parseResponse
        );
    };

    function makeRequest(routeList, onSuccess, onFailure, action) {
        var data = {routeRequest:{"routeList": routeList, "action": action}};
        _server.sendPutRequest({
            "url": getWAMUrl(1, routeManagementUrl),
            "data": data
        }, onSuccess, onFailure);
    }

    this.activate = function(routeList, onSuccess, onFailure) {
        makeRequest(routeList, onSuccess, onFailure, "activate");
    };


    this.deactivate = function(routeList, onSuccess, onFailure) {
        makeRequest(routeList, onSuccess, onFailure, "deactivate");
    };


    this.reorder = function(routeList, onSuccess, onFailure) {
        makeRequest(routeList, onSuccess, onFailure, "reorder");
    };

};

//@{fcs-jsl-prod}
var RouteManagementService = function (_server) {
    return new RouteManagementServiceImpl(_server || server);
};
var routemanagementService = new RouteManagementService();
//@{fcs-jsl-prod}

var RouteManagementManagerImpl = function (_service) {
    this.retrieve = function(onSuccess, onFailure) {
        _service.retrieve(onSuccess, onFailure);
    };
    this.activate = function(routeList, onSuccess, onFailure) {
        _service.activate(routeList, onSuccess, onFailure);
    };
    this.deactivate = function(routeList, onSuccess, onFailure) {
        _service.deactivate(routeList, onSuccess, onFailure);
    };
    this.reorder = function(routeList, onSuccess, onFailure) {
        _service.reorder(routeList, onSuccess, onFailure);
    };
};

//@{fcs-jsl-prod}
var RouteManagementManager = function (_service) {
    return new RouteManagementManagerImpl(_service || routemanagementService);
};

var routemanagementManager = new RouteManagementManager();
//@{fcs-jsl-prod}


/**
* Route Management facilities.
*
* @name routes
* @namespace
* @memberOf fcs
*
* @version 3.1.3.45
* @since 3.0.0
*
*/
var RouteManagementImpl = function(_manager) {

   /**
    * @name Entry
    * @class
    * @memberOf fcs.routes
    * @version 3.1.3.45
    * @since 3.0.0
    */
   this.Entry = function(){};

    /**
    * Name of route.
    *
    * @name fcs.routes.Entry#name
    * @field
    * @type {String}
    * @since 3.0.0
    */

    /**
    * Status of route.
    *
    * @name fcs.routes.Entry#status
    * @field
    * @type {Boolean}
    * @since 3.0.0
    */

   /**
    * Retrieves the list of routes associated with the user.
    *
    * @name fcs.routes.retrieve
    * @function
    * @param {function} onSuccess({Array.<String>}) The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(data){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.routes.retrieve(onSuccess, onError);
    */
    this.retrieve = function(onSuccess, onFailure) {
        _manager.retrieve(onSuccess, onFailure);
    };
   /**
    * Activate the route(s) associated with the user.
    *
    * @name fcs.routes.activate
    * @function
    * @param {Array.<String>} routeList The list of routes to be modified
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.routes.activate(["Route1","Route2"], onSuccess, onError);
    */
    this.activate = function (routeList, onSuccess, onFailure) {
        _manager.activate(routeList, onSuccess, onFailure);
    };
   /**
    * Deactivate the route(s) associated with the user.
    *
    * @name fcs.routes.deactivate
    * @function
    * @param {Array.<String>} routeList The list of routes to be modified
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.routes.deactivate(["Route1","Route2"], onSuccess, onError);
    */
    this.deactivate = function (routeList, onSuccess, onFailure) {
        _manager.deactivate(routeList, onSuccess, onFailure);
    };
   /**
    * Reorder the route(s) associated with the user.
    *
    * @name fcs.routes.reorder
    * @function
    * @param {string[]} routeList The list of routes to be modified
    * @param {function} onSuccess The onSuccess({Array.<String>}) callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.routes.reorder(["Route1","Route2"], onSuccess, onError);
    */
    this.reorder = function (routeList, onSuccess, onFailure) {
        _manager.reorder(routeList, onSuccess, onFailure);
    };
};

//@{fcs-jsl-prod}
var RouteManagement = function (_manager) {
    return new RouteManagementImpl(_manager || routemanagementManager);
};

fcs.routes = new RouteManagement();
//@{fcs-jsl-prod}


var UserProfileDataServiceImpl = function (_server, _getWAMUrl, _utils, _fcs) {

    var userProfileDataUrl = "/userProfileData";

    function parseResponse(userProfileReceived) {
        var userProfileItem, params;
        if (userProfileReceived && userProfileReceived.userProfileData) {
            params = userProfileReceived.userProfileData;

            userProfileItem = new _fcs.userprofile.UserProfile();

            userProfileItem.photo = _utils.getProperty(params, 'photoURL');
            userProfileItem.homePhone = _utils.getProperty(params, 'homePhone');
            userProfileItem.workPhone = _utils.getProperty(params, 'workPhone');
            userProfileItem.mobilePhone = _utils.getProperty(params, 'mobilePhone');
            userProfileItem.emailAddress = _utils.getProperty(params, 'emailAddress');
            userProfileItem.voicemailAccessNumbers = "voicemail@" + _fcs.getUser().split('@')[1];
            userProfileItem.voicemailUserId = _utils.getProperty(params, 'vmailUserId');
            userProfileItem.confBridgeNumList = _utils.getProperty(params, 'confBridgeNumList');
            userProfileItem.accessCode = _utils.getProperty(params, 'accessCode');
            userProfileItem.modCode = _utils.getProperty(params, 'modCode');
            userProfileItem.firstName = _utils.getProperty(params, 'firstName');
            userProfileItem.lastName = _utils.getProperty(params, 'lastName');
            userProfileItem.assignedService = _utils.getProperty(params, 'assignedService');
            userProfileItem.confServer = _utils.getProperty(params, 'confServer');
            userProfileItem.statusCode = _utils.getProperty(params, 'statusCode');
            userProfileItem.webCollabRoomURL = _utils.getProperty(params, 'webCollabRoomURL');
            userProfileItem.videoConferenceRoomURL = _utils.getProperty(params, 'videoConferenceRoomURL');
            userProfileItem.videoConferenceAccessNumbers = _utils.getProperty(params, 'videoConferenceAccessNumbers');
            userProfileItem.videoConferenceExtensionNumber = _utils.getProperty(params, 'videoConferenceExtensionNumber');
        }

        return userProfileItem;
    }

    this.retrieve = function (onSuccess, onFailure) {

        _server.sendGetRequest({
            "url": _getWAMUrl(1, userProfileDataUrl)
        },
        onSuccess,
                onFailure,
                parseResponse
                );
    };
};

//@{fcs-jsl-prod}
var UserProfileDataService = function (_server, _getWAMUrl, _utils, _fcs) {
    return new UserProfileDataServiceImpl(_server || server, _getWAMUrl || getWAMUrl, utils || _utils, fcs || _fcs);
};
var userprofiledataService = new UserProfileDataService();
//@{fcs-jsl-prod}

var UserProfileDataManagerImpl = function (_service) {
    this.retrieve = function(onSuccess, onFailure) {
        _service.retrieve(onSuccess, onFailure);
    };
};

//@{fcs-jsl-prod}
var UserProfileDataManager = function (_service) {
    return new UserProfileDataManagerImpl(_service || userprofiledataService);
};

var userprofiledataManager = new UserProfileDataManager();
//@{fcs-jsl-prod}


/**
 * User profile data resources.
 *
 * @name userprofile
 * @namespace
 * @memberOf fcs
 *
 * @version 3.1.3.45
 * @since 3.0.0
 *
 */
var UserProfileDataImpl = function(_manager) {

   /**
    * Retrieves the user profile.
    *
    * @name fcs.userprofile.retrieve
    * @function
    * @param {function} onSuccess The onSuccess({@link fcs.userprofile.UserProfile}) callback to be called
    * @param {function} onFailure The onFailure({@link fcs.MediaErrors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(data){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.userprofile.retrieve(onSuccess, onError);
    */

    this.retrieve = function(onSuccess, onError){
        _manager.retrieve(onSuccess, onError);
    };

   /**
    * User Profile
    *
    * @name UserProfile
    * @class
    * @memberOf fcs.userprofile
    * @version 3.1.3.45
    * @since 3.0.0
    */

    this.UserProfile = function() {
       /**
        * User's first name.
        *
        * @name fcs.userprofile.UserProfile#firstName
        * @field
        * @type {string}
        * @since 3.0.0
        */

       /**
        * User's last name.
        *
        * @name fcs.userprofile.UserProfile#lastName
        * @field
        * @type {string}
        * @since 3.0.0
        */

       /**
        * User's photo URL.
        *
        * @name fcs.userprofile.UserProfile#photo
        * @field
        * @type {string}
        * @since 3.0.0
        */

       /**
        * User's home phone number.
        *
        * @name fcs.userprofile.UserProfile#homePhone
        * @field
        * @type {string}
        * @since 3.0.0
        */

       /**
        * User's business phone number.
        *
        * @name fcs.userprofile.UserProfile#workPhone
        * @field
        * @type {string}
        * @since 3.0.0
        */

       /**
        * User's mobile phone number.
        *
        * @name fcs.userprofile.UserProfile#mobilePhone
        * @field
        * @type {string}
        * @since 3.0.0
        */

       /**
        * User's email address.
        *
        * @name fcs.userprofile.UserProfile#emailAddress
        * @field
        * @type {string}
        * @since 3.0.0
        */

       /**
        * User's conference code.
        *
        * @name fcs.userprofile.UserProfile#accessCode
        * @field
        * @type {string}
        * @since 3.0.0
        */

       /**
        * User's moderator code.
        *
        * @name fcs.userprofile.UserProfile#modCode
        * @field
        * @type {string}
        * @since 3.0.0
        */

        /**
        * The list of conference bridge numbers.
        *
        * @name fcs.userprofile.UserProfile#confBridgeNumList
        * @field
        * @type {string[]}
        * @since 3.0.0
        */

        /**
        * Voice mail access numbers.
        *
        * @name fcs.userprofile.UserProfile#voicemailAccessNumbers
        * @field
        * @type {string}
        * @since 3.0.0
        */

        /**
        * Voice mail user id.
        *
        * @name fcs.userprofile.UserProfile#voicemailUserId
        * @field
        * @type {string}
        * @since 3.0.0
        */

       /**
        * Web collabration url
        *
        * @name fcs.userprofile.UserProfile#webCollabRoomURL
        * @field
        * @type {string}
        * @since 3.1.0
        */

       /**
        * Video Conference Room Url
        *
        * @name fcs.userprofile.UserProfile#videoConferenceRoomURL
        * @field
        * @type {string}
        * @since 3.1.0
        */

       /**
        * Video Conference Access Numbers
        *
        * @name fcs.userprofile.UserProfile#videoConferenceAccessNumbers
        * @field
        * @type {string[]}
        * @since 3.1.0
        */

       /**
        * Video Conference Extension Number.
        *
        * @name fcs.userprofile.UserProfile#videoConferenceExtensionNumber
        * @field
        * @type {string}
        * @since 3.1.0
        */

        /**
        * Status codes for User Profile Data response.<br />
        *
        * "0" - SUCCESSFUL.<br />
        * "2" - INSUFFICIENT_INFO.<br />
        * "4" - AUTHORIZATION_FAILURE.<br />
        * "35" - SERVICE_NOT_AUTHORIZED.<br />
        * "37" - INVALID_PARAMETER_VALUE.<br />
        * "26" - Internal server error.<br />
        *
        * @name fcs.userprofile.UserProfile#statusCode
        * @field
        * @type {string}
        * @since 3.0.0
        */
    };

};

//@{fcs-jsl-prod}
var UserProfileData = function (_manager) {
    return new UserProfileDataImpl(_manager || userprofiledataManager);
};

fcs.userprofile = new UserProfileData();
//@{fcs-jsl-prod}

var IMServiceImpl = function(_server) {
    this.onReceived = null;

    var logger = fcs.logManager.getLogger("imService");

    function parseImSendResponse(result){
        if(result && result.imResponse && result.imResponse.messageId){
            return result.imResponse.messageId;
        }
    }

    function send(im, onSuccess, onFailure) {
        var data = {
            "imRequest": {
                "toUrl":im.primaryContact,
                "type":im.type,
                "message":im.msgText,
                "charset":im.charset
            }
        };

        logger.info("IM -->  SENT : to: " + im.primaryContact);

        _server.sendPostRequest({
                        "url":getWAMUrl(1, "/instantmessage"),
                        "data":data
                    },
                    function (callId) {
                        utils.callFunctionIfExist(onSuccess, callId);
                    },
                    onFailure,
                    parseImSendResponse
                );
    }

    this.send = send;

};

//@{fcs-jsl-prod}
var IMService = function (_server) {
    return new IMServiceImpl(_server || server);
};
var imService = new IMService();

NotificationCallBacks.IM = function (data) {
    // disabling the notifications for verizon demo
    if (!fcs.notification.isAnonymous()) {
        var im = new fcs.im.Message(),
                imParams = data.imnotificationParams,
                tempContact,
                trimUserDomain;

        im.type = utils.getProperty(imParams, 'type');
        im.msgText = utils.getProperty(imParams, 'msgText');
        im.charset = utils.getProperty(imParams, 'charset');
        im.fullName = utils.getProperty(imParams, 'fullName');

        tempContact = utils.getProperty(imParams, 'primaryContact');
        if (tempContact.indexOf("sip:") !== -1) {
            tempContact = tempContact.substring(4, tempContact.length);
        }

        trimUserDomain = tempContact.indexOf(";user=phone");
        if (trimUserDomain !== -1) {
            tempContact = tempContact.substr(0, trimUserDomain);
        }
        im.primaryContact = tempContact;

        fcs.logManager.getLogger("imService").info("IM received from: " + im.primaryContact);
        utils.callFunctionIfExist(fcs.im.onReceived, im);
    }
};

NotificationCallBacks.IMResponse = function(data){
    var imResponseParams, responseCode, response = {},
            logger = fcs.logManager.getLogger("imService");

    if (data) {
        imResponseParams = data.imresponseNotificationParams;

        if (!imResponseParams) {
            return;
        }
    } else {
        return;
    }

    logger.info("IMResponse received : ", {IM_RESPONSE: data});

    responseCode = imResponseParams.responseCode;

    if(responseCode==="200" || responseCode === undefined){
        return;
    }
    else if (responseCode==="") {
        responseCode="480";
    }

    response.id = imResponseParams.callid;
    response.userName = imResponseParams.userName;
    response.error = responseCode;

    utils.callFunctionIfExist(fcs.im.onReceived, response);
};
//@{fcs-jsl-prod}

var IMManagerImpl = function (_service) {
    this.send = function(im, onSuccess, onFailure) {
        _service.send(im, onSuccess, onFailure);
    };
};

//@{fcs-jsl-prod}
var IMManager = function (_service) {
    return new IMManagerImpl(_service || imService);
};

var imManager = new IMManager();
//@{fcs-jsl-prod}


/**
* Handles sending/receiving of instant messages (IM).
*
* @name im
* @namespace
* @memberOf fcs
*
* @version 3.1.3.45
* @since 3.0.0
*/
var IMImpl = function(_manager) {
   /**
    * Sends an IM to the specified user.
    *
    * @name fcs.im.send
    * @function
    * @param {fcs.im.Message} message The message to send
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var im = new fcs.im.Message();
    * im.primaryContact = "user1@genband.com";
    * im.type = "A2";
    * im.msgText = text;
    * im.charset = "UTF-8";
    *
    * var onSuccess = function(){
    *   console.log("The IM for " + primaryContact + " is sent successfully!");
    * };
    * var onError = function (err) {
    *   console.log("An error occured: " + err);
    * };
    *
    * fcs.im.send(im, onSuccess, onError);
    */
    this.send = function(im, onSuccess, onFailure) {
        _manager.send(im, onSuccess, onFailure);
    };
   /**
    * Called on receipt of an instant message
    *
    * @name fcs.im.onReceived
    * @event
    * @param {fcs.im.Message} im Message received
    * @since 3.0.0
    * @example
    * var messageReceived = function(msg){
    *    var from = msg.primaryContact;
    *    var messageContent = msg.msgText;
    *    console.log("A new IM received from: " + msg.primaryContact + " > " + messageContent);
    *
    * };
    *
    * fcs.im.onReceived = messageReceived;
    */
    this.onReceived = null;
   /**
    * @name Message
    * @class
    * @memberOf fcs.im
    * @version 3.1.3.45
    * @since 3.0.0
    */
   this.Message = function(){};
   /**
    * The fullName is a string used to identify name of primaryContact
    *
    * @name fcs.im.Message#fullName
    * @field
    * @type {String}
    * @since 3.0.0
    */

    /**
    * The type is a string used to identify the receiving client type such as “A2”,”Facebook”.
    * Only “A2” is supported for SPiDR 1.0.
    *
    * @name fcs.im.Message#type
    * @field
    * @type {String}
    * @since 3.0.0
    */

   /**
    * The msgText is a string used to identify the message content which will be send to target client.
    *
    * @name fcs.im.Message#msgText
    * @field
    * @type {String}
    * @since 3.0.0
    */

   /**
    * The charset is a string used to identify character set type of the message.
    *
    * @name fcs.im.Message#charset
    * @field
    * @type {String}
    * @since 3.0.0
    */

   /**
    * The primaryContact is a string used to identify target client which will receive the IM.
    *
    * @name fcs.im.Message#primaryContact
    * @field
    * @type {String}
    * @since 3.0.0
    */
};

//@{fcs-jsl-prod}
var IM = function(_manager) {
    return new IMImpl(_manager || imManager);
};

fcs.im = new IM();
//@{fcs-jsl-prod}
/**
* Handles receiving of custom messages (Custom).
*
* @name custom
* @namespace
* @memberOf fcs
*
* @version 3.1.3.45
* @since 3.0.0
*/
var Custom = function() {

   /**
    * Called on receipt of an instant message
    *
    * @name fcs.custom.onReceived
    * @event
    * @param {fcs.custom.Message} custom Message received
    * @since 3.0.0
    * @example
    * var messageReceived = function(msg){
    *    // do something here
    * };
    *
    * fcs.custom.onReceived = messageReceived;
    */

};


var CustomImpl = function() {
    this.onReceived = null;
};

//@{fcs-jsl-prod}
CustomImpl.prototype = new Custom();
fcs.custom = new CustomImpl();

NotificationCallBacks.custom = function(data) {
    utils.callFunctionIfExist(fcs.custom.onReceived, data);
};
//@{fcs-jsl-prod}

var PRESENCE_URL = "/presence", PRESENCE_WATCHER_URL = "/presenceWatcher",
    REQUEST_TYPE_WATCH = "watch", REQUEST_TYPE_STOP_WATCH = "stopwatch", REQUEST_TYPE_GET = "get",
    PRESENCE_STATE = {
        CONNECTED:       0,
        UNAVAILABLE:     1,
        AWAY:            2,
        OUT_TO_LUNCH:    3,
        BUSY:            4,
        ON_VACATION:     5,
        BE_RIGHT_BACK:   6,
        ON_THE_PHONE:    7,
        ACTIVE:          8,
        INACTIVE:        9,
        PENDING:         10,
        OFFLINE:         11,
        CONNECTEDNOTE:   12,
        UNAVAILABLENOTE: 13
    },
    STATUS_OPEN = "open",
    STATUS_CLOSED = "closed",
    ACTIVITY_UNKNOWN = "unknown",
    ACTIVITY_AWAY = "away",
    ACTIVITY_LUNCH = "lunch",
    ACTIVITY_BUSY = "busy",
    ACTIVITY_VACATION = "vacation",
    ACTIVITY_ON_THE_PHONE = "on-the-phone",
    ACTIVITY_OTHER = "other",
    NOTE_BE_RIGHT_BACK = "Be Right Back",
    NOTE_OFFLINE = "Offline",
    USERINPUT_ACTIVE = "active",
    USERINPUT_INACTIVE = "inactive";

var PresenceStateParser =  function(){

    var stateRequest = [];

    stateRequest[PRESENCE_STATE.CONNECTED] = {status: STATUS_OPEN, activity: ACTIVITY_UNKNOWN};
    stateRequest[PRESENCE_STATE.UNAVAILABLE] = {status: STATUS_CLOSED, activity: ACTIVITY_UNKNOWN};
    stateRequest[PRESENCE_STATE.AWAY] = {status: STATUS_OPEN, activity: ACTIVITY_AWAY};
    stateRequest[PRESENCE_STATE.OUT_TO_LUNCH] = {status: STATUS_OPEN, activity: ACTIVITY_LUNCH};
    stateRequest[PRESENCE_STATE.BUSY] = {status: STATUS_CLOSED, activity: ACTIVITY_BUSY};
    stateRequest[PRESENCE_STATE.ON_VACATION] = {status: STATUS_CLOSED, activity: ACTIVITY_VACATION};
    stateRequest[PRESENCE_STATE.BE_RIGHT_BACK] = {status: STATUS_OPEN, activity: ACTIVITY_OTHER, note: NOTE_BE_RIGHT_BACK};
    stateRequest[PRESENCE_STATE.ON_THE_PHONE] = {status: STATUS_OPEN, activity: ACTIVITY_ON_THE_PHONE};
    stateRequest[PRESENCE_STATE.ACTIVE] = {status: STATUS_OPEN, activity: ACTIVITY_UNKNOWN, userInput: USERINPUT_ACTIVE};
    stateRequest[PRESENCE_STATE.INACTIVE] = {status: STATUS_CLOSED, activity: ACTIVITY_UNKNOWN, userInput: USERINPUT_INACTIVE};
    stateRequest[PRESENCE_STATE.OFFLINE] = {status: STATUS_CLOSED, activity: ACTIVITY_OTHER, note: NOTE_OFFLINE};
    stateRequest[PRESENCE_STATE.CONNECTEDNOTE] = {status: STATUS_OPEN, activity: ACTIVITY_OTHER};
    stateRequest[PRESENCE_STATE.UNAVAILABLENOTE] = {status: STATUS_CLOSED, activity: ACTIVITY_OTHER};

    this.getRequestObject = function(presenceState){
        var state = stateRequest[presenceState];

        if(state){
            return state;
        } else {
        throw new Error("Invalid Presence State");
        }
    };

    this.getState = function(presence) {
        switch (presence.userInput) {
            case USERINPUT_ACTIVE:
                return PRESENCE_STATE.ACTIVE;
            case USERINPUT_INACTIVE:
                return PRESENCE_STATE.INACTIVE;
        }

        switch (presence.note) {
            case NOTE_BE_RIGHT_BACK:
                return PRESENCE_STATE.BE_RIGHT_BACK;
            case NOTE_OFFLINE:
                return PRESENCE_STATE.OFFLINE;
        }
        if (presence.note) {
            if (presence.status === STATUS_OPEN) {
                return PRESENCE_STATE.CONNECTEDNOTE;
            }
            else {
                return PRESENCE_STATE.UNAVAILABLENOTE;
            }
        }

        switch (presence.activity) {
            case ACTIVITY_AWAY:
                return PRESENCE_STATE.AWAY;
            case ACTIVITY_LUNCH:
                return PRESENCE_STATE.OUT_TO_LUNCH;
            case ACTIVITY_BUSY:
                return PRESENCE_STATE.BUSY;
            case ACTIVITY_VACATION:
                return PRESENCE_STATE.ON_VACATION;
            case ACTIVITY_ON_THE_PHONE:
                return PRESENCE_STATE.ON_THE_PHONE;
            case ACTIVITY_UNKNOWN:
                if (presence.status === STATUS_OPEN) {
                    return PRESENCE_STATE.CONNECTED;
                }
                else {
                    return PRESENCE_STATE.UNAVAILABLE;
                }
        }
        return PRESENCE_STATE.CONNECTED;
    };
};

var presenceStateParser;

var PresenceServiceImpl = function(_server, _logManager, _presenceStateParser) {
    var logger = _logManager.getLogger("presenceService");

    this.onReceived = null;

    this.update = function(presenceState, onSuccess, onFailure) {

        _server.sendPostRequest({
            "url": getWAMUrl(1, PRESENCE_URL),
            "data": {"presenceRequest": _presenceStateParser.getRequestObject(presenceState)}
                },
                onSuccess,
                onFailure
        );

    };

    function makeRequest(watchedUserList, onSuccess, onFailure, action) {
        var data = {"presenceWatcherRequest":{"userList": watchedUserList, "action": action}};
        _server.sendPostRequest({
                        "url": getWAMUrl(1, PRESENCE_WATCHER_URL),
                        "data": data
                    },
                    onSuccess,
                    onFailure
        );
    }

    this.watch = function (watchedUserList, onSuccess, onFailure) {
        logger.info("subscribe presence status of users:", watchedUserList);
        makeRequest(watchedUserList, function (result) {
            if (onSuccess && typeof onSuccess === 'function') {
                onSuccess(result.presenceWatcherResponse.expiryValue);
            }
        }, onFailure, REQUEST_TYPE_WATCH);
    };

    this.stopwatch = function(watchedUserList, onSuccess, onFailure) {

        makeRequest(watchedUserList, onSuccess, onFailure, REQUEST_TYPE_STOP_WATCH);
    };


    this.retrieve = function(watchedUserList, onSuccess, onFailure) {

        makeRequest(watchedUserList, onSuccess, onFailure, REQUEST_TYPE_GET);
    };

};

//@{fcs-jsl-prod}
presenceStateParser = new PresenceStateParser();

var presenceService = new PresenceServiceImpl(server, logManager, presenceStateParser);

/*
 * In order to find the users presence client receives 3 parameters from WAM
 * status, activity, note and userInput.
 * status is received in every presence notification and can have two parameters: open and closed
 * For activity and note there can be only one of them in the presence notification.
 * userInput comes with activity but userInput is the  one that decides presence.
 * Presence is decided according to status and activity/note combination
 */
NotificationCallBacks.presenceWatcher = function(data){
    if(!fcs.notification.isAnonymous()) {
        var presence = new fcs.presence.UpdateEvent(), presenceParams = data.presenceWatcherNotificationParams;

        presence.name = utils.getProperty(presenceParams, 'name');
        presence.type = utils.getProperty(presenceParams, 'type');
        presence.status = utils.getProperty(presenceParams, 'status');
        presence.activity = utils.getProperty(presenceParams, 'activity');
        presence.note = utils.getProperty(presenceParams, 'note');
        presence.userInput = utils.getProperty(presenceParams, 'userInput');

        presence.state = presenceStateParser.getState(presence);

        fcs.logManager.getLogger("presenceService").info("presence received: ", presence);
        utils.callFunctionIfExist(fcs.presence.onReceived, presence);

    }
};
//@{fcs-jsl-prod}

var PresenceManagerImpl = function (_service, _fcs, _logManager, _globalBroadcaster, _utils) {
    var self = this, logger = _logManager.getLogger("presenceMng"),
            watchedUserList = [], presenceExtendInterval = null;

    self.Failures = {
        SERVICE_FAILURE: 0
    };

    function getUserListToWatch(userList) {
        var i, userListDelta = [];

        for (i in userList) {
            if (userList.hasOwnProperty(i) && watchedUserList.indexOf(userList[i]) === -1) {
                userListDelta.push(userList[i]);
            }
        }

        return userListDelta;
    }

    function getUserListToStopWatch(userList) {
        var i, userListDelta = [];

        for (i in userList) {
            if (userList.hasOwnProperty(i) && watchedUserList.indexOf(userList[i]) !== -1) {
                userListDelta.push(userList[i]);
            }
        }

        return userListDelta;
    }

    function removeUsersFromWacthedUserList(userList) {
        var i, indexToRemove;

        for (i in userList) {
            if (userList.hasOwnProperty(i)) {
                indexToRemove = watchedUserList.indexOf(userList[i]);
                watchedUserList.splice(indexToRemove, 1);
            }
        }
    }

    self.update = _service.update;

    function clearPresenceSubscriptionExtendIntervalAndWacthedUserList() {
        clearInterval(presenceExtendInterval);
        presenceExtendInterval = null;
        watchedUserList = [];
    }

    function setUpPresenceSubsriptionExtendInterval(expiryValue) {
        if (!presenceExtendInterval) {
            presenceExtendInterval = setInterval(function () {
                sendWatchRequest(watchedUserList, undefined, function (err) {
                    logger.error("presence svc. ext. subs. fail", err);
                    _utils.callFunctionIfExist(_fcs.presence.onFailure, self.Failures.SERVICE_FAILURE);
                });
            }, (expiryValue * 1000) / 2);
        }
    }

    function sendWatchRequest(userList, onSuccess, onFailure) {
        if (userList.length > 0) {
            _service.watch(userList, function (expiryValue) {
                setUpPresenceSubsriptionExtendInterval(expiryValue);
                _utils.callFunctionIfExist(onSuccess);
            }, function (err) {
                clearPresenceSubscriptionExtendIntervalAndWacthedUserList();
                _utils.callFunctionIfExist(onFailure, err);
            });
        }
    }

    self.watch = function (userList, onSuccess, onFailure) {
        var userListToWatch;

        if (!Array.isArray(userList) || userList.length === 0) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.INVALID_PARAMETER);
            return;
        }

        if (watchedUserList.length > 0) {
            // there are some users previously watched

            // identify delta between userList and watchedUserList
            userListToWatch = getUserListToWatch(userList);

            if (userListToWatch.length === 0) {
                // provided userList is already watched
                _utils.callFunctionIfExist(onSuccess);
                return;
            }
            // send watch request to delta
            // add delta to watchedUserLists
            // do not initiate extend interval

            watchedUserList = watchedUserList.concat(userListToWatch);
        }
        else {
            // initial watch request
            watchedUserList = userListToWatch = userList;
        }

        sendWatchRequest(userListToWatch, onSuccess, onFailure);
    };

    self.stopwatch = function (userList, onSuccess, onFailure) {
        var userListToStop;

        if (!Array.isArray(userList) || userList.length === 0) {
            _utils.callFunctionIfExist(onFailure, _fcs.Errors.INVALID_PARAMETER);
            return;
        }

        if (watchedUserList.length === 0) {
            _utils.callFunctionIfExist(onSuccess);
            return;
        }

        userListToStop = getUserListToStopWatch(userList);

        if (userListToStop.length === 0) {
            _utils.callFunctionIfExist(onSuccess);
            return;
        }

        _service.stopwatch(userListToStop, function () {
            removeUsersFromWacthedUserList(userListToStop);

            if (watchedUserList.length === 0) {
                clearPresenceSubscriptionExtendIntervalAndWacthedUserList();
            }
            _utils.callFunctionIfExist(onSuccess);
        }, function (err) {
            _utils.callFunctionIfExist(onFailure, err);
        });
    };

    self.retrieve = _service.retrieve;

    function presenceServiceOnSubscriptionStartedHandler() {
        sendWatchRequest(watchedUserList);
    }

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_STARTED,
            presenceServiceOnSubscriptionStartedHandler);

    _globalBroadcaster.subscribe(CONSTANTS.EVENT.DEVICE_SUBSCRIPTION_ENDED,
            clearPresenceSubscriptionExtendIntervalAndWacthedUserList);
};

//@{fcs-jsl-prod}
var presenceManager = new PresenceManagerImpl(presenceService, fcs, logManager, globalBroadcaster, utils);
//@{fcs-jsl-prod}


/**
* Groups presence related resources (Presence Update, Presence Watcher)
*
* @name presence
* @namespace
* @memberOf fcs
*
* @version 3.1.3.45
* @since 3.0.0
*/
var PresenceImpl = function(_manager) {

   /**
    * States for presences update requests.
    *
    * @name State
    * @enum {number}
    * @since 3.0.0
    * @readonly
    * @memberOf fcs.presence
    * @property {number} [CONNECTED=0] The user is currently online
    * @property {number} [UNAVAILABLE=1] The user is currently unavailable
    * @property {number} [AWAY=2] The user is currently away
    * @property {number} [OUT_TO_LUNCH=3] The user is currently out for lunch
    * @property {number} [BUSY=4] The user is currently busy
    * @property {number} [ON_VACATION=5] The user is currently on vacation
    * @property {number} [BE_RIGHT_BACK=6] The user will be right back
    * @property {number} [ON_THE_PHONE=7] The user is on the phone
    * @property {number} [ACTIVE=8] The user is currently active
    * @property {number} [INACTIVE=9] The user is currently inactive
    * @property {number} [PENDING=10] Waiting for user authorization
    * @property {number} [OFFLINE=11] The user is currently offline
    * @property {number} [CONNECTEDNOTE=12] The user is connected and defined a note
    * @property {number} [UNAVAILABLENOTE=13] The user is unavailable and defined a note
    */
    this.State = {
        CONNECTED:       0,
        UNAVAILABLE:     1,
        AWAY:            2,
        OUT_TO_LUNCH:    3,
        BUSY:            4,
        ON_VACATION:     5,
        BE_RIGHT_BACK:   6,
        ON_THE_PHONE:    7,
        ACTIVE:          8,
        INACTIVE:        9,
        PENDING:         10,
        OFFLINE:         11,
        CONNECTEDNOTE:   12,
        UNAVAILABLENOTE: 13
    };

   /**
    * Sends the user's updated status and activity to the server.
    *
    * @name fcs.presence.update
    * @function
    * @param {fcs.presence.State} presenceState The user's presence state
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.presence.update(fcs.presence.State.BE_RIGHT_BACK, onSuccess, onError );
    */
    this.update = function(presenceState, onSuccess, onFailure) {
        _manager.update(presenceState, onSuccess, onFailure);
    };

   /**
    * Starts watching the presence status of users in the provided user list.
    *
    * @name fcs.presence.watch
    * @function
    * @param {Array.<String>} watchedUserList list of users whose status is to be watched<br />
    * If userList is an empty array or not an array, the onFailure callback to be called<br />
    * with {@link fcs.Errors}#INVALID_PARAMETER
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.presence.watch(["user1", "user2"], onSuccess, onError );
    */
    this.watch = function(watchedUserList, onSuccess, onFailure) {
        _manager.watch(watchedUserList, onSuccess, onFailure);
    };

   /**
    * Stops watching the presence status of the users in the provided user list.
    *
    * @name fcs.presence.stopwatch
    * @function
    * @param {Array.<String>} userList list of users whose status is to be unwatched<br />
    * If userList is an empty array or not an array, the onFailure callback to be called<br />
    * with {@link fcs.Errors}#INVALID_PARAMETER
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.presence.stopwatch(["user1", "user2"], onSuccess, onError );
    */
    this.stopwatch = function(userList, onSuccess, onFailure) {
        _manager.stopwatch(userList, onSuccess, onFailure);
    };

   /**
    * Sends a request to receive a notification for the presence status of the users in the provided user list.<br />
    * For each user in the provided list, {@link fcs.presence.event:onReceived} handler will be invoked.
    *
    * @name fcs.presence.retrieve
    * @function
    * @param {Array.<String>} userList list of users whose status is to be retrieved
    * @param {function} onSuccess The onSuccess() callback to be called
    * @param {function} onFailure The onFailure({@link fcs.Errors}) callback to be called
    * @since 3.0.0
    * @example
    * var onSuccess = function(){
    *    //do something here
    * };
    * var onError = function (err) {
    *   //do something here
    * };
    *
    * fcs.presence.retrieve(["user1", "user2"], onSuccess, onError );
    */
    this.retrieve = function(watchedUserList, onSuccess, onFailure) {
        _manager.retrieve(watchedUserList, onSuccess, onFailure);
    };

   /**
    * Handler called for when receiving a presence notification
    *
    * @name onReceived
    * @event
    * @memberOf fcs.presence
    * @param {fcs.presence.UpdateEvent} event The presence update event
    * @since 3.0.0
    * @example
    *
    * fcs.presence.onReceived = function(data) {
    *    //do something here
    * }
    */

   /**
    * Failures for presence service
    *
    * @name Failures
    * @enum {number}
    * @since 3.1.0
    * @readonly
    * @memberOf fcs.presence
    * @property {number} [SERVICE_FAILURE=0] Presence service failure<br />
    * Presence service interrupted unexpectedly, please contact to your system administrator
    */
    this.Failures = _manager.Failures;

   /**
    * Handler called for when receiving presence service failures
    *
    * @name onReceived
    * @event
    * @memberOf fcs.presence
    * @param {fcs.presence.Failures} event The presence update event
    * @since 3.1.0
    * @example
    *
    * fcs.presence.onFailure = function(err) {
    *    //do something here
    * }
    */

   /**
    * Represents a presence change event
    *
    * @name UpdateEvent
    * @class
    * @memberOf fcs.presence
    * @version 3.1.3.45
    * @since 3.0.0
    */
   this.UpdateEvent = function(){};
   /**
    * User name of the contact whose presence has changed.
    *
    * @name fcs.presence.UpdateEvent#name
    * @field
    * @type {String}
    * @since 3.0.0
    */

    /**
     * The presence state of the user.
     *
    * @name fcs.presence.UpdateEvent#state
    * @field
    * @type {fcs.presence.State}
    * @since 3.0.0
    */

   /**
    * The type of network for this presence.
    *
    * @name fcs.presence.UpdateEvent#type
    * @field
    * @type {String}
    * @since 3.0.0
    */
};

//@{fcs-jsl-prod}
fcs.presence = new PresenceImpl(presenceManager);
//@{fcs-jsl-prod}
/*global window */
if ( typeof window.define === "function" && window.define.amd ) {
	define( "fcs", [], function () { return window.fcs; } );
}

})( window );
