define([
    'Ctl.ctlapiloader/Version',
    'Ctl.ctlapiloader/Config',
    'Ctl/Logger',
    'Ctl/Utils',
    'Ctl/Auth'
], function (
    Version,
    Config,
    Logger,
    Utils,
    Auth
) {

    /**
     * @class Ctl.ctlapiloader.CtlApiLoader
     *
     * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
     *
     * Ctl.ctlapiloader.CtlApiLoader is the heart of the CenturyLink JavaScript API loading capability. It is most commonly used
     * via the {@link Ctl.ctlapiloader.CtlApiLoader#load} shorthand. Ctl.ctlapiloader.CtlApiLoader is used for asynchronous loading approach
     * and leverage it advantages for the best development flow.
     *
     * @requires Ctl.ctlapiloader.Version
     * @requires Ctl.ctlapiloader.Config
     * @requires Ctl.Logger
     * @requires Ctl.Utils
     * @requires Ctl.Auth
     *
     * @singleton
     */
    function CtlApiLoader() {

        var logger = new Logger('CtlApiLoader');
        var loadedApis = [];

        /**
         * Retrieves a version of the API loader
         *
         * @return {String} Contains API loader version
         */
        function getVersion() {
            return Version;
        }

        /**
         * Loads CenturyLink API
         *
         * @param  {String}   name     Name of the API to load
         * @param  {String}   version  Version of the API to load
         * @param  {Function} callback Callback to call after API is loaded and initialized
         */
        function load(name, version, callback) {
            require(
                [name],
                function(api) {
                    Utils.doCallback(callback, [null, api]);
                },
                function(err) {
                    Utils.doCallback(callback, [err]);
                }
            );
        }

        /**
         * Logout from services and clear browser's data storage (cookies, localStorage etc.)
         * @return {[type]} [description]
         */
        function logout() {
            Utils.removeAll();
        }

        this.Auth = Auth;
        this.getVersion = getVersion;
        this.load = load;
        this.logout = logout;
    }

    return new CtlApiLoader();

});
