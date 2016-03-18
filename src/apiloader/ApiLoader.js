//@tag foundation,core
//@define ApiLoader

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
     * Main CenturyLink API loader class
     *
     * @class Ctl
     * @requires Ctl.common.Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function ApiLoader() {

        var logger = new Logger('ApiLoader');

        var loadedApis = [];


        /**
         * Get a version of the API loader
         *
         * @return {String} Contains API loader version
         */
        function version() {
            return Version;
        }

        /**
         * Load CneturyLink API
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

        function getLoadedApis() {
            return loadedApis;
        }

        this.Auth = Auth;
        this.version = version;
        this.load = load;
        this.getLoadedApis = getLoadedApis;
    }

    return new ApiLoader();

});
