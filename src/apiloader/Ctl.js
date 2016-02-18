//@tag foundation,core
//@define Ctl

define([
    'Ctl.apiloader.Version',
    'Ctl.apiloader.Config',
    'Ctl.common.Logger',
    'Ctl.common.Promise',
    'Ctl.common.Ajax',
    'Ctl.common.Utils',
    'model/request/BaseRequest',
    'model/request/AccessTokenRequest',
], function (Version, Config, Logger, Promise, Ajax, Utils, BaseRequest, AccessTokenRequest) {

    /**
     * Main CenturyLink API loader class
     *
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function Ctl() {

        var logger = new Logger('Ctl');

        /**
         * Authenticate client with OAuth method and store tokens for later use
         *
         * @param  {String}   username Username to authenticate
         * @param  {String}   password Password to authenticate
         * @param  {Function} callback Callback to call once authentication finished
         * @return {Promise}  p
         *
         * ## Sample usage:
         *
         *     Ctl.authenticate('username', 'password', function(response) {
         *     	alert(response);
         *     });
         *
         */
        function authenticate(username, password, callback) {

            var atRequest = new AccessTokenRequest(username, password);

            /* a callback to make the request */
            var accessTokenRequest = function() {
                return Ajax.request(atRequest.type, atRequest.getRequestUrl(), atRequest.objectify(), atRequest.requestHeaders);
            }.bind(this);

            var response = function(err, request) {
                var p = new Promise();

                return p;
            }.bind(this);

            /* a callback to clean up and return data to the client */
            var oncomplete = function(err, response) {

                logger.info("REQUEST", err, response);

                if (!err && response) {
                    BaseRequest.prototype.accessToken = response.response.access_token;
                    setAccessToken(response.response.access_token);
                    setRefreshToken(response.response.refresh_token);
                }

                Utils.doCallback(callback, [ err, response ]);
            }.bind(this);

            /* and a promise to chain them all together */
            Promise.chain([ accessTokenRequest ]).then(oncomplete);
        }

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
                    Utils.doCallback(callback, [null, api]);
                },
                function(err) {
                    Utils.doCallback(callback, [err]);
                }
            );
        }

        /**
         * Store the OAuth access token for later use - uses localstorage if available
         *
         * @private
         * @param   {String} token
         */
        function setAccessToken(token) {
            // TODO: Store token in cookies
            Utils.set("access_token", token);
        }

        /**
         * Get the OAuth access token
         *
         * @private
         * @return  {String} token
         */
        function getAccessToken() {
            return Utils.get("access_token");
        }

        /**
         * Store the OAuth refresh token for later use - uses localstorage if available
         *
         * @private
         * @param   {String} token
         */
        function setRefreshToken(token) {
            // TODO: Store token in cookies
            Utils.set("refresh_token", token);
        }

        /**
         * Get the OAuth refresh token
         *
         * @private
         * @return  {String} token
         */
        function getRefreshToken() {
            return Utils.get("refresh_token");
        }

        this.authenticate = authenticate;
        this.version = version;
        this.load = load;
    }

    return new Ctl();

});
