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
    'model/request/RefreshTokenRequest',
    'model/request/SubscriptionServiceIdentitiesRequest',
    'model/request/SubscriptionServiceCatalogRequest',
], function (
    Version,
    Config,
    Logger,
    Promise,
    Ajax,
    Utils,
    BaseRequest,
    AccessTokenRequest,
    RefreshTokenRequest,
    SubscriptionServiceIdentitiesRequest,
    SubscriptionServiceCatalogRequest
) {

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

        var storageKeywords = {
            accessToken: 'access_token',
            refreshToken: 'refresh_token',
            services: 'services',
            serviceCatalog: {
                publicId: 'publicId',
                domain: 'domain',
                id: 'id',
                webSocketEndpoints: 'webSocketEndpoints'
            }
        };

        var loadedApis = [];

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
         *     Ctl.login('username', 'password', function(response) {
         *     	alert(response);
         *     });
         *
         */
        function login(username, password, callback) {
            if (isAuthenticated()) {
                loginFromCache(callback);
            } else {
                authenticate(username, password, callback);
            }
        }

        function authenticate(username, password, callback) {

            var atRequest = new AccessTokenRequest(username, password);

            var accessTokenRequest = function() {

                return Ajax.request(
                        atRequest.type,
                        atRequest.getRequestUrl(),
                        atRequest.objectify(),
                        atRequest.getRequestHeaders()
                    );

            }.bind(this);

            var serviceListRequest = function(err, request) {

                BaseRequest.prototype.accessToken = request.response.access_token;
                BaseRequest.prototype.refreshToken = request.response.refresh_token;
                setAccessToken(request.response.access_token);
                setRefreshToken(request.response.refresh_token);

                var slRequest = new SubscriptionServiceIdentitiesRequest();
                return Ajax.request(
                        slRequest.type,
                        slRequest.getRequestUrl(),
                        null,
                        slRequest.getRequestHeaders()
                    );

            }.bind(this);

            var serviceCatalogRequest = function(err, request) {

                // TODO: Currently saving subscribed services only for first item
                // Will be needed to loop through all subscribed services and retrieve catalog info for each.
                var keys = Object.keys(request.response.Services);
                var serviceKey = keys[0];
                var subscribedServices = request.response.Services[keys[0]];
                setServices(subscribedServices);

                var seCatalogRequest = new SubscriptionServiceCatalogRequest(Config.services.speakEasyServiceName, serviceKey);
                return Ajax.request(
                        seCatalogRequest.type,
                        seCatalogRequest.getRequestUrl(),
                        null,
                        seCatalogRequest.getRequestHeaders()
                    );

            }.bind(this);

            /* a callback to clean up and return data to the client */
            var oncomplete = function(err, request) {

                logger.info("REQUEST", err, request);

                if (!err && request) {
                    setServiceCatalog(request.response.ServiceCatalog);
                }

                Utils.doCallback(callback, [ err, request ]);
            }.bind(this);

            /* and a promise to chain them all together */
            Promise.chain([ accessTokenRequest, serviceListRequest, serviceCatalogRequest ]).then(oncomplete);
        }

        function reAuthenticate(callback) {
            var rtRequest = new RefreshTokenRequest(getRefreshToken());

            var refreshTokenRequest = function() {

                return Ajax.request(
                        rtRequest.type,
                        rtRequest.getRequestUrl(),
                        rtRequest.objectify(),
                        rtRequest.getRequestHeaders()
                    );

            }.bind(this);

            var oncomplete = function(err, request) {

                logger.info("REQUEST", err, request);

                Utils.doCallback(callback, [ err, request ]);
            }.bind(this);

            Promise.chain([ refreshTokenRequest ]).then(oncomplete);

        }

        function isAuthenticated() {
            return getAccessToken() != null;
        }

        function loginFromCache(callback) {
            BaseRequest.prototype.accessToken = getAccessToken();
            BaseRequest.prototype.refreshToken = getRefreshToken();
            Utils.doCallback(callback, [null]);
        }

        function logout() {
            for (var i=0; i<loadedApis.length; i++) {
                loadedApis[i].logout();
            }
            Utils.removeAll();
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
                    loadedApis.push(api);
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
            Utils.set(storageKeywords.accessToken, token);
        }

        /**
         * Get the OAuth access token
         *
         * @private
         * @return  {String} token
         */
        function getAccessToken() {
            return Utils.get(storageKeywords.accessToken);
        }

        /**
         * Store the OAuth refresh token for later use - uses localstorage if available
         *
         * @private
         * @param   {String} token
         */
        function setRefreshToken(token) {
            Utils.set(storageKeywords.refreshToken, token);
        }

        /**
         * Get the OAuth refresh token
         *
         * @private
         * @return  {String} token
         */
        function getRefreshToken() {
            return Utils.get(storageKeywords.refreshToken);
        }

        function setServices(services) {
            Utils.set(storageKeywords.services, JSON.stringify(services));
        }

        function getServices(services) {
            return Utils.get(storageKeywords.services);
        }

        function setServiceCatalog(serviceCatalog) {
            Utils.setObject(storageKeywords.services + '_' + serviceCatalog.serviceName, serviceCatalog);
        }

        function getServiceCatalog(serviceName) {
            return Utils.getObject(serviceName);
        }

        function getLoadedApis() {
            return loadedApis;
        }

        this.login = login;
        this.logout = logout;
        this.version = version;
        this.load = load;
        this.getLoadedApis = getLoadedApis;
    }

    return new Ctl();

});
