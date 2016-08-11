define([
    'Ctl.speakeasy/Version',
    'Ctl.speakeasy/Config',
    'Ctl.speakeasy/Notification',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'Ctl/Auth',
    'fcs',
    'Ctl.speakeasy/CallManager'
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

        function init() {
            self.logger.info('Initializing calling features');

            // initFcsLogger();

            fcs.setUserAuth(getPublicUserId(), '');

            // Set ajaxHook for url, headers and data intersection
            Config.fcsapi.ajaxHook = customAjaxSetup;
            //Config.fcsapi.localVideoContainer = document.getElementById('localVideo');
            //Config.fcsapi.remoteVideoContainer = document.getElementById('remoteVideo');
            fcs.setup(Config.fcsapi);

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
                        },
                        function(error) {
                            self.logger.error('The media features initialization failed');
                        }
                    );

                    fcs.call.onReceived = CallManager.processReceivedCall;

                },
                function(e) {
                    self.logger.log("An error occurred! Notification subsystem couldn't be started!");
                    if (e === fcs.Errors.AUTH) {
                        self.logger.log("Authentication error occured");
                    }
                }
            );

        }

        init();

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

        /**
         * This method is a wrapper for the jquery.ajaxSetup function.  If a URL is
         * a third-party URL that is to be proxied through CTL Application Framework (AF),
         * prepend the AF RequestServlet URL to the third-party URL.
         *
         * @param xhr
         * @param settings
         * @returns {*}
         */
        function customAjaxSetup(xhr, scope, settings) {
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
                var originalOnload = xhr.onload;
                xhr.onload = function(e) {
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

                settings.headers['Authorization'] = 'Bearer ' +  Utils.get("access_token");
            }

            return settings;
        }

        /**
         * Retrieve user's public ID
         * @return {String} user's client ID
         */
        function getPublicUserId() {
            var speakEasy = Utils.getObject('services_SpeakEasy');
            var publicUserId = speakEasy.phoneNumber + speakEasy.rtc.domain;
            return publicUserId;
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
        this.getPublicUserId = getPublicUserId;

        this.CallManager = CallManager;

    }

    return new SpeakEasy();

});
