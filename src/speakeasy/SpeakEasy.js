define([
    'Ctl.speakeasy/Version',
    'Ctl.speakeasy.config',
    'Ctl.speakeasy/Notification',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'Ctl/Auth',
    'fcs',
    'Ctl.speakeasy/CallManager',
    'base64',
    'sha256'
], function (Version, Config, Notification, Logger, Promise, Ajax, Utils, Auth, fcs, CallManager) {

    /**
     * @class Ctl.speakeasy.SpeakEasy
     * @singleton
     * Main SpeakEasy class
     *
     * @requires Ctl.speakeasy.Version
     * @requires Ctl.speakeasy.Config
     * @requires Ctl.Logger
     * @requires Ctl.Promise
     * @requires Ctl.Ajax
     * @requires Ctl.Utils
     * @requires fcs
     * @requires Ctl.speakeasy.CallManager
     */
    function SpeakEasy() {

        var self = this;
        self.logger = new Logger('SpeakEasy');

        function init(accessToken, refreshToken, publicId, callback) {

            if (accessToken && refreshToken && publicId) {
                Auth.setAccessToken(accessToken);
                Auth.setRefreshToken(refreshToken);
                Auth.setDefaultSubscriptionService('SpeakEasy', publicId, function(err, response) {
                    if (!err && response) {
                        initFcs();
                    } else {
                        Utils.doCallback(callback, [ err, response ]);
                    }
                });
            } else {
                initFcs();
            }

            function initFcs() {

                self.logger.info('Initializing calling features');

                function initFcsLogger() {
                    function jslLogHandler(loggerName, level, logObject) {
                        var LOG_LEVEL = fcs.logManager.Level,
                            msg = logObject.timestamp + " - " + loggerName + " - " + level + " - " + logObject.message;

                        switch(level) {
                            case LOG_LEVEL.DEBUG:
                                window.console.debug(msg, logObject.args);
                                break;
                            case LOG_LEVEL.INFO:
                                window.console.info(msg, logObject.args);
                                break;
                            case LOG_LEVEL.ERROR:
                                window.console.error(msg, logObject.args);
                                break;
                                default:
                                window.console.log(msg, logObject.args);
                        }
                    }

                    fcs.logManager.initLogging(jslLogHandler, true);
                }
                initFcsLogger();

                fcs.setUserAuth(getPublicUserId(), getVoipTnCipherRef());

                // Set ajaxHook for url, headers and data intersection
                Config.fcsapi.ajaxHook = "customAjaxSetup";
                window.customAjaxSetup = customAjaxSetup;

                fcs.setup(getFcsApiConfig());

                // TODO: Implement support check for WebRTC
                // fcs.onPluginRequired = function(error) {
                //     switch (error) {
                //         case fcs.call.MediaErrors.WRONG_VERSION: // Alert
                //             showErrorMessage("Media Plugin Version Not Supported. See fcs.call.MediaErrors.WRONG_VERSION");
                //             pluginDownloadDialog("Media Plugin Version Not Supported");
                //             break;
                //
                //         case fcs.call.MediaErrors.NEW_VERSION_WARNING: //Warning
                //             showWarningMessage("New Media Version Available Wanrning! See fcs.call.MediaErrors.NEW_VERSION_WARNING");
                //             break;
                //
                //         case fcs.call.MediaErrors.NOT_INITIALIZED: // Alert
                //             showErrorMessage("Media couldn't be initialized. See fcs.call.MediaErrors.NOT_INITIALIZED");
                //             break;
                //
                //         case fcs.call.MediaErrors.NOT_FOUND: // Alert
                //             showErrorMessage("Plugin couldn't be found! See fcs.call.MediaErrors.NOT_FOUND");
                //             pluginDownloadDialog("Plugin couldn't be found!");
                //             break;
                //     }
                // }

                Notification.start(
                    function() {
                        self.logger.log("You are logged in successfully!");
                        self.logger.log("Notification system is started up successfully!");

                        fcs.call.initMedia(
                            function() {
                                self.logger.info('The media features has been succesfully initialized');
                                Utils.doCallback(callback);
                            },
                            function(error) {
                                self.logger.error('The media features initialization failed');
                                Utils.doCallback(callback, [ error ]);
                            }
                        );

                        fcs.call.onReceived = CallManager.processReceivedCall;

                    },
                    function(e) {
                        var notificationError = "An error occurred! Notification subsystem couldn't be started!";
                        self.logger.log(notificationError);
                        if (e === fcs.Errors.AUTH) {
                            var err = "Authentication error occured";
                            self.logger.log(err);
                            Utils.doCallback(callback, [ notificationError + ' ' + err ]);
                        } else {
                            Utils.doCallback(callback, [ notificationError ]);
                        }
                    }
                );

            }

        }

        /**
         * This method is a wrapper for the jquery.ajaxSetup function.  If a URL is
         * a third-party URL that is to be proxied through CTL Application Framework (AF),
         * prepend the AF RequestServlet URL to the third-party URL.
         *
         * @param scope
         * @param settings
         * @returns {*}
         */
        function customAjaxSetup(scope, settings) {
            if (settings) {

                //Use browser to parse out the pathname...
                var anch = document.createElement('a');
                anch.href = settings.url;
                var curPathname;

                if(Config.useCertification) {
                    curPathname = anch.pathname;
                }
                else {
                    if (anch.pathname.indexOf('@') > -1) {
                        var part = anch.pathname.substr(anch.pathname.indexOf('@'), anch.pathname.length);
                        curPathname = part.substr(part.indexOf('/'), part.length);
                    } else {
                        curPathname = anch.pathname.substr(anch.pathname.lastIndexOf('/'), anch.pathname.length);
                    }
                }

                var pubUserId = Config.useCertification ? Utils.get('publicId') : getPublicUserId();

                //Fixes for IE11
                if (anch.origin === undefined) {
                    anch.origin = anch.protocol + "//" + anch.hostname;
                }
                if (curPathname.charAt(0) !== '/') {
                    curPathname = '/' + curPathname;
                }

                var configSettings = getSettings();

                //If the URL is to be proxied by AAA, prepend the required SEProxy portion to the URL path...
                for (var i = 0; i < configSettings.proxyForURLPatterns.length; i++) {
                    var curRE = new RegExp(configSettings.proxyForURLPatterns[i]);
                    if (curRE.test(settings.url)) {
                        var sePrependURL = configSettings.SEProxyPrependURL + pubUserId + configSettings.AFAdditionalURLDetails;
                        settings.url = anch.origin + sePrependURL + curPathname + anch.search;
                        break;
                    }
                }
                var originalOnload = this.onload;
                this.onload = function(e) {
                    if (e.target && e.target.status === 401) {
                        Auth.reAuthenticate(function(error, response) {
                            if(!error) {
                                init();
                            } else {
                                self.logger.error('reAuthenticate error', response);
                            }

                        });
                    }
                    originalOnload(arguments);
                };

                if(Config.useConfig === 'cert')
                {
                    if(/RequestServlet/.test(settings.url)){
                        //add spidr url headers
                        settings.headers['X-CTLRTC-SPiDR-FQDN'] = Notification.activeWebRTCServer ? Notification.activeWebRTCServer : undefined;
                    }

                    //If the URL is bound for AFProxy, generate the required SHA256 token
                    var reAF = new RegExp(".*RWS/restful/(?!(PreRegister))");
                    if (!settings.disableRewrite) {
                        if (reAF.exec(settings.url) !== null) {
                            settings.url = addTokensToUrl(settings.url, settings.type, settings.data);
                        }
                    }
                }
                else {
                    settings.headers['Authorization'] = 'Bearer ' + Auth.getAccessToken();
                }

                // var originalOnerror = this.onerror;
                // this.onerror = function(e) {
                //     debugger;
                //     console.log(e);
                //     originalOnerror(arguments);
                // };
                //
                // this.onreadystatechange = function() {
                //     console.log("readystate: " + this.readyState);
                //     if(this.readyState === 4) {
                //         console.log("status: " + this.status);
                //         if (this.status === 401) {
                //             console.log("Your login/password is incorrect");
                //             return;
                //         }
                //         console.log(this.responseText);
                //     }
                // };

            }

            return settings;
        }

        /**
         * Adds token to url request string
         * @param {string} url
         * @param {string} type GET,POST, etc.
         * @param {string} data request payload
         * @returns {string}
         */
        function addTokensToUrl(url, type, data){
            //Use browser to parse out the pathname...
            var anch = document.createElement('a');
            anch.href = url;
            var curPathname = anch.pathname;

            //Fixes for IE11
            if (anch.origin === undefined) {
                anch.origin = anch.protocol + "//" + anch.hostname;
            }
            if (curPathname.charAt(0) !== '/') {
                curPathname = '/' + curPathname;
            }

            //Get the remaining details from localStorage and settings for the AJAX call...
            var cipherRef = getVoipTnCipherRef();

            //Get the HMAC vals..
            var hmacVals = createAFAuthTokens(cipherRef, type, curPathname, data);

            //Create/append to search string in URL with AFProxy auth tokens
            var searchStr = anch.search.length > 0 ? anch.search + "&" : "?";
            searchStr = searchStr + "token=" + hmacVals.hmacValue + "&optionstoken=" + hmacVals.optionsHmacValue;

            if(anch.origin.indexOf("https") === -1 && curPathname.indexOf("requestedBy=WEBRTC") === -1 ){
                searchStr += "&requestedBy=WEBRTC";
            }

            return anch.origin + curPathname + searchStr;
        }

        /**
         * Generate HMAC authentication tokens required by CTL AFProxy
         *
         * @param cipherRef - Shared secret between AFProxy & client
         * @param method - HTTP method (i.e. GET, POST, PUT)
         * @param path - Path portion of URL (i.e. /RequestServlet/WEBRTC)
         * @param body - Optional.  Body portion of an HTTP request.
         * @returns {Object}
         */
        function createAFAuthTokens(cipherRef, method, path, body) {
            var retVal = {};

            //All hmac generation scenarios use cipherRef + method + path...
            var inputString = utf8_encode(cipherRef + method + path);

            //Generate hmac value for CORS OPTIONS scenario
            retVal.optionsHmacValue = CryptoJS.SHA256(inputString);

            if (typeof body !==  "string" && !(body instanceof ArrayBuffer)) {
                body = JSON.stringify(body);
            }

            //POST method uses first 400 chars of the body.
            if (method && body && body !== undefined && (method.toLowerCase() == "post" || method.toLowerCase() == "put" || method.toLowerCase() == "delete"))
                inputString = typeof body === "string" ? inputString + body.substring(0, 400) : inputString;

            //Generate hmac value.
            retVal.hmacValue = CryptoJS.SHA256(inputString);

            return retVal;
        }


        /**
         * Retrieve user's public ID
         * @return {String} user's client ID
         */
        function getPublicUserId() {
            var speakEasy = Utils.getObject('services_SpeakEasy');
            var phoneNumber = Utils.get('publicId');
            var publicUserId = phoneNumber + speakEasy.rtc.domain;
            return publicUserId;
        }

        /**
         * Retrieve user's authentication and Ciphering Reference
         * @returns {String} user's VoipTnCipherRef
         */
        function getVoipTnCipherRef() {
            var speakEasy = Utils.getObject('services_SpeakEasy');
            var voipTnCipherRef = speakEasy.networkIdentity.authenticationandCipheringReference;
            return voipTnCipherRef;
        }

        /**
         * Get FcsApi setting from config for current environment
         * @returns {*}
         */
        function getFcsApiConfig() {
            var configSection = Config.useConfig;
            var fcsapi = Config.fcsapi[configSection];

            if(fcsapi) {
                return fcsapi;
            }
            else {
                Config.fcsapi.intg;
            }
        }

        /**
         * Get setting from config for current environment
         * @returns {object} config object
         */
        function getSettings() {
            var configSection = Config.useConfig;
            var settings = Config.settings[configSection];

            if(settings) {
                return settings;
            }
            else {
                Config.settings.intg;
            }
        }

        /**
         * Logout from the SpeakEasy service
         * @param  {Function} successCallback function called in successfull case
         * @param  {Function} failureCallback function called in failure case
         */
        function logout(successCallback, failureCallback) {

            fcs.notification.stop(
                function(){
                    self.logger.log('Notification system is stopped successfully!!');
                    Utils.doCallback(successCallback);
                },
                function(){
                    self.logger.log('Something Wrong Here!!!');
                    Utils.doCallback(failureCallback);
                }
            );
        }

        /**
         * Get a version of the SpeakEasy API client
         *
         * @return {String} Contains SpeakEasy API client version
         */
        function version() {
            return Version;
        }

        this.version = version;
        this.logout = logout;
        this.init = init;
        this.getPublicUserId = getPublicUserId;

        this.CallManager = CallManager;

    }

    return new SpeakEasy();

});
