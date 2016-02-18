define([
    'Ctl.speakeasy.Version',
    'Ctl.speakeasy.Config',
    'Ctl.common.Logger',
    'Ctl.common.Promise',
    'Ctl.common.Ajax',
    'Ctl.common.Utils',
    'fcs',
    'CallManager'
], function (Version, Config, Logger, Promise, Ajax, Utils, fcs, CallManager) {

    /**
     * Main CenturyLink API loader class
     *
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function SpeakEasy() {

        var self = this;
        self.logger = new Logger('SpeakEasy');

        (function init() {
            self.logger.info('Initializing calling features');

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

            fcs.setUserAuth('7202839128@ctlvoip.lab.centurylink', 'abc123');

            // Set ajaxHook for url, headers and data intersection
            Config.fcsapi.ajaxHook = customAjaxSetup;

            fcs.setup(Config.fcsapi);

            // Notification system is being started in order to receive notification messages.
            // The user is authenticated in this function too.
            fcs.notification.start(
                //Success callback
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

                },
                // Failure callback
                function() {
                    self.logger.log("An error occurred! Notification subsystem couldn't be started!");
                }
            );

        })();

        /**
         * This method is a wrapper for the jquery.ajaxSetup function.  If a URL is
         * a third-party URL that is to be proxied through CTL Application Framework (AF),
         * prepend the AF RequestServlet URL to the third-party URL.
         *
         * @param target
         * @param settings
         * @returns {*}
         */
        function customAjaxSetup(target, scope, settings) {
            var ajaxObj = settings;

            if (settings) {

                //If the URL is to be proxied by SE, prepend the required SEProxy portion to the URL path...
                for (var i = 0; i < Config.settings.proxyForURLPatterns.length; i++) {
                    var curRE = new RegExp(Config.settings.proxyForURLPatterns[i]);
                    if (curRE.test(settings.url)) {
                        settings.url = settings.url.replace(curRE, Config.settings.SEProxyPrependURL);
                        break;
                    }
                }

                ajaxObj.headers['Authorization'] = 'Bearer ' +  Utils.get("access_token");

                ajaxObj.url = settings.url;
            }

            return ajaxObj;
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
        this.CallManager = CallManager;

    }

    return new SpeakEasy();

});
