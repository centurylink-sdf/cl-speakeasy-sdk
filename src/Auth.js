define([
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'Ctl.model.request/BaseRequest',
    'Ctl.model.request/AccessTokenRequest',
    'Ctl.model.request/RefreshTokenRequest',
    'Ctl/Subscription'
], function (
    Logger,
    Promise,
    Ajax,
    Utils,
    BaseRequest,
    AccessTokenRequest,
    RefreshTokenRequest,
    Subscription
) {

    /**
     * [Auth description]
     * @class Ctl.Auth
     */
    function Auth() {

        var logger = new Logger('Auth');

        var config = {
            storageKeywords: {
                accessToken: 'access_token',
                refreshToken: 'refresh_token',
                loginUsername: 'last_login_username'
            }
        };

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
         *     Ctl.Auth.login('username', 'password', function(response) {
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

            var getAccessToken = function() {

                return Ajax.request(
                        atRequest.type,
                        atRequest.getRequestUrl(),
                        atRequest.objectify(),
                        atRequest.getRequestHeaders()
                    );

            }.bind(this);

            var syncSubscriptionServices = function(err, request) {
                if (!err && request) {
                    BaseRequest.prototype.accessToken = request.response.access_token;
                    BaseRequest.prototype.refreshToken = request.response.refresh_token;
                    setAccessToken(request.response.access_token);
                    setRefreshToken(request.response.refresh_token);
                    setLoginUsername(username);
                    return Subscription.sync(username);
                } else {
                    var fail = new Promise();
                    fail.done(err.response, null);
                    return fail;
                }
            }.bind(this);

            var oncomplete = function(err, request) {
                Utils.doCallback(callback, [ err, request ]);
            }.bind(this);

            Promise.chain([ getAccessToken, syncSubscriptionServices ]).then(oncomplete);
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

                if (!err && request) {
                    BaseRequest.prototype.accessToken = request.response.access_token;
                    BaseRequest.prototype.refreshToken = request.response.refresh_token;
                    setAccessToken(request.response.access_token);
                    setRefreshToken(request.response.refresh_token);
                }

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
            // TODO:10 Figure out better place for logout for the all loaded services
            // for (var i=0; i<loadedApis.length; i++) {
            //     loadedApis[i].logout();
            // }
            Utils.removeAll();
        }

        /**
         * Store the OAuth access token for later use - uses localstorage if available
         *
         * @private
         * @param   {String} token
         */
        function setAccessToken(token) {
            Utils.set(config.storageKeywords.accessToken, token);
        }

        /**
         * Get the OAuth access token
         *
         * @private
         * @return  {String} token
         */
        function getAccessToken() {
            return Utils.get(config.storageKeywords.accessToken);
        }

        /**
         * Store the OAuth refresh token for later use - uses localstorage if available
         *
         * @private
         * @param   {String} token
         */
        function setRefreshToken(token) {
            Utils.set(config.storageKeywords.refreshToken, token);
        }

        /**
         * Get the OAuth refresh token
         *
         * @private
         * @return  {String} token
         */
        function getRefreshToken() {
            return Utils.get(config.storageKeywords.refreshToken);
        }

        /**
         * Store the login username for later use - uses localstorage if available
         *
         * @private
         * @param   {String} username
         */
        function setLoginUsername(username) {
            Utils.set(config.storageKeywords.loginUsername, username);
        }

        /**
         * Get the login username
         *
         * @private
         * @return  {String} username
         */
        function getLoginUsername() {
            return Utils.get(config.storageKeywords.loginUsername);
        }

        this.login = login;
        this.reAuthenticate = reAuthenticate;
        this.isAuthenticated = isAuthenticated;
        this.setLoginUsername = setLoginUsername;
        this.getLoginUsername = getLoginUsername;

    }

    return new Auth();

});
