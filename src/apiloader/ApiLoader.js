define([
    'Ctl.apiloader/Version',
    'Ctl.apiloader/Config',
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
     * @class Ctl.apiloader.ApiLoader
     *
     * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
     *
     * Ctl.apiloader.ApiLoader is the heart of the CenturyLink JavaScript API loading capability. It is most commonly used
     * via the {@link Ctl.apiloader.ApiLoader#load} shorthand. Ctl.apiloader.ApiLoader is used for asynchronous loading approach
     * and leverage it advantages for the best development flow.
     *
     * @requires Ctl.apiloader.Version
     * @requires Ctl.apiloader.Config
     * @requires Ctl.Logger
     * @requires Ctl.Utils
     * @requires Ctl.Auth
     *
     * @singleton
     */
    function ApiLoader() {

        var logger = new Logger('ApiLoader');
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
                    loadedApis.push(api);
                    Utils.doCallback(callback, [null, api]);
                },
                function(err) {
                    Utils.doCallback(callback, [err]);
                }
            );
        }

        /**
         * Retrieves list of loaded APIs
         * @return {Array} list of APIs
         */
        function getLoadedApis() {
            return loadedApis;
        }

        function logout() {
            Utils.removeAll();
        }

        this.Auth = Auth;
        this.getVersion = getVersion;
        this.load = load;
        this.getLoadedApis = getLoadedApis;
        this.logout = logout;
    }

    return new ApiLoader();

});
