define([
    'Ctl.speakeasy/Version',
    'Ctl.speakeasy/Config',
    'Ctl.speakeasy/Notification',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'Ctl/Auth',
    'Ctl/Error',
    'fcs',
    'Ctl.speakeasy/CallManager',
    'Ctl.speakeasy/AudiotonesManager'
], function (
    Version,
    Config,
    Notification,
    Logger,
    Promise,
    Ajax,
    Utils,
    Auth,
    Error,
    fcs,
    CallManager,
    AudiotonesManager
) {

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

        /**
         * Function to call when notification connection will lost
         * @type {Function}
         */
        self.connectionLostCallback = null;

        /**
         * Function to call when notification connection will established
         * @type {Function}
         */
        self.connectionEstablishedCallback = null;

        /**
         * Function to call when notification connection will failed
         * @type {Function}
         */
        self.connectionErrorCallback = null;

        /**
         * SpeakEasy initialization
         *
         * @param {string} accessToken The access token from authentication process
         * @param {string} refreshToken The refresh token from authentication process
         * @param {string} publicId The user public id
         * @param {Function} successCallback The function will be called after success initialization
         * @param {Function} errorCallback The function will be called after some error occurred
         * @param {object}   errorCallback.error The error object
         * @param {String}   errorCallback.error.type The error type. Possible values: 'NOTIFICATION', 'MEDIA', 'OTHER'
         * @param {Integer}   errorCallback.error.code The error code
         * @param {String}   errorCallback.error.message The error message
         */
        function init(accessToken, refreshToken, publicId, successCallback, errorCallback) {

            if(Utils.isNull(accessToken) && Utils.isNull(refreshToken)) {
                accessToken = Auth.getAccessToken();
                refreshToken = Auth.getRefreshToken();
            }

            if (accessToken && refreshToken && publicId) {
                Auth.setAccessToken(accessToken);
                Auth.setRefreshToken(refreshToken);
                Auth.setDefaultSubscriptionService('SpeakEasy', publicId, function(err, response) {
                    if (!err && response) {
                        initFcs();
                    } else {
                        if(typeof err == 'object') {
                            err = 'SpeakEasy initialization failed.';
                        }
                        Utils.doCallback(errorCallback, [ new Error(Error.Types.OTHER, 1, err) ]);
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

                var fcsApiConfig = getFcsApiConfig();

                fcs.setUserAuth(getPublicUserId(), getVoipTnCipherRef());

                // Set ajaxHook for url, headers and data intersection
                fcsApiConfig.ajaxHook = "customAjaxSetup";
                window.customAjaxSetup = customAjaxSetup;

                fcs.setup(fcsApiConfig);

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

                Notification.setOnConnectionLost(self.connectionLostCallback);
                Notification.setOnConnectionEstablished(self.connectionEstablishedCallback);
                Notification.setOnConnectionError(self.connectionErrorCallback);

                Notification.start(
                    function() {
                        self.logger.log("You are logged in successfully!");
                        self.logger.log("Notification system is started up successfully!");

                        fcs.call.initMedia(
                            function() {
                                self.logger.info('The media features has been succesfully initialized');
                                Utils.doCallback(successCallback);
                            },
                            function(errorCode) {
                                self.logger.error('The media features initialization failed');

                                Utils.doCallback(errorCallback, [ new Error(Error.Types.MEDIA, errorCode, 'Media initialization failed') ]);
                            }
                        );

                        Notification.setOnCallReceived(CallManager.processReceivedCall);
                    },
                    function(error) {
                        self.logger.log(error);
                        Utils.doCallback(errorCallback, [ error ]);
                    }
                );
            }

            AudiotonesManager.init();
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
                if (anch.pathname.indexOf('@') > -1) {
                    var part = anch.pathname.substr(anch.pathname.indexOf('@'), anch.pathname.length);
                    curPathname = part.substr(part.indexOf('/'), part.length);
                } else {
                    curPathname = anch.pathname.substr(anch.pathname.lastIndexOf('/'), anch.pathname.length);
                }
                var pubUserId = getPublicUserId();

                //Fixes for IE11
                if (anch.origin === undefined) {
                    anch.origin = anch.protocol + "//" + anch.hostname;
                }
                if (curPathname.charAt(0) !== '/') {
                    curPathname = '/' + curPathname;
                }

                //If the URL is to be proxied by AAA, prepend the required SEProxy portion to the URL path...
                for (var i = 0; i < Config.settings.proxyForURLPatterns.length; i++) {
                    var curRE = new RegExp(Config.settings.proxyForURLPatterns[i]);
                    if (curRE.test(settings.url)) {
                        var sePrependURL = Config.settings.SEProxyPrependURL + pubUserId;
                        settings.url = anch.origin + sePrependURL + curPathname;
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

                settings.headers['Authorization'] = 'Bearer ' + Auth.getAccessToken();
            }

            return settings;
        }

        /**
         * Retrieve user's public ID
         * @return {String} user's client ID
         */
        function getPublicUserId() {
            var serviceName = Utils.getObject('serviceName');
            var speakEasy = Utils.getObject('services_' + serviceName);
            var phoneNumber = Utils.get('publicId');
            return phoneNumber + speakEasy.rtc.domain;
        }

        /**
         * Retrieve user's authentication and Ciphering Reference
         * @returns {String} user's VoipTnCipherRef
         */
        function getVoipTnCipherRef() {
            var serviceName = Utils.getObject('serviceName');
            var speakEasy = Utils.getObject('services_' + serviceName);
            return speakEasy.networkIdentity.authenticationandCipheringReference;
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
                return Config.fcsapi.intg;
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
                    // clear browser's data storage (cookies, localStorage etc.)
                    Utils.removeAll();
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

        /**
         * Implements all authentication features
         * @type {Ctl.Auth}
         */
        this.Auth = Auth;

        /**
         * Implements manage calls features
         * @type {Ctl.speakeasy.CallManager}
         */
        this.CallManager = CallManager;

    }

    return new SpeakEasy();

});
