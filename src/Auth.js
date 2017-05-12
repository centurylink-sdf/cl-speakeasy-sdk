define([
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'Ctl/Error',
    'Ctl.model.request/BaseRequest',
    'Ctl.model.request/AccessTokenRequest',
    'Ctl.model.request/RefreshTokenRequest',
    'Ctl/Subscription'
], function (
    Logger,
    Promise,
    Ajax,
    Utils,
    Error,
    BaseRequest,
    AccessTokenRequest,
    RefreshTokenRequest,
    Subscription
) {

    /**
     * Main class responsible for authentication
     * @class Ctl.Auth
     * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
     *
     * @requires Ctl.Logger
     * @requires Ctl.Promise
     * @requires Ctl.Ajax
     * @requires Ctl.Utils
     * @requires Ctl.model.request.BaseRequest
     * @requires Ctl.model.request.AccessTokenRequest
     * @requires Ctl.model.request.RefreshTokenRequest
     * @requires Ctl.Subscription
     */
    function Auth() {

        var logger = new Logger('Auth');

        /**
         * Configuration for storage namings
         *
         * @private
         * @type {Object}
         */
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

        /**
         * Make service calls to authenticate user
         * @param  {String}   username Username to authenticate
         * @param  {String}   password Password to authenticate
         * @param  {Function} callback Callback to call once authentication finished
         *
         * @private
         */
        function authenticate(username, password, callback) {

            if (username.indexOf('@instalink') > 0 || window.location.pathname.lastIndexOf('/instant', 0) === 0){

                if (username.indexOf('@') < 0) {
                    username += '@instalink';
                }

                oauth(username, password, callback);
            } else {

                ctlid(username, password, callback);
            }
        }


        function ctlid(username, password, callback) {

            var legalAckFail = false;
            var request = new CtlIDRequest(username, password);
            var ajaxArgus = {
                url: request.getRequestUrl(),
                type: request.type,
                data: request.getData(),
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                success: function(preRegData) {

                    if (preRegData.HomePreRegisterResponse.CtlIdResponse.completionUrlField){
                        //Login is successful, but LegalAck has not been signed.
                        legalAckFail = true;  // set to prevent auth token request
                        return onFailure("legalAckFail", preRegData.HomePreRegisterResponse.CtlIdResponse.completionUrlField);
                    } else {
                        //this.setInternalCredentials(preRegData);
                    }



                }.bind(this),
                error: function(jqXHR) {
                    onFailure(jqXHR);
                }
            };

            return $.ajax(ajaxArgus).done(function() {

                if (legalAckFail) {
                    return $.Deferred().resolve().promise();
                }

                var oauthRequest = new OAuthRequest(username, password);
                var oauthArgs = {
                    url: oauthRequest.getRequestUrl(),
                    type: oauthRequest.type,
                    data: oauthRequest.getData(),
                    headers: oauthRequest.getRequestHeaders(),
                    success: function(oAuthRequestResponse) {

                        this.setInternalOAuthLogin(username, oAuthRequestResponse);
                        BaseOAuthRequest.prototype.accessToken = oAuthRequestResponse.access_token;
                        onSuccess(false);
                    }.bind(this),
                    error: function(jqXHR) {

                        onFailure(jqXHR);
                    }
                };

                return $.ajax(oauthArgs);
            }.bind(this))
                .fail(function(err) {
                    onFailure(err);
                });
        }

        function oauth(username, password, callback) {

            var atRequest = new AccessTokenRequest(username, password);

            var getAccessToken = function() {

                return Ajax.request(
                    atRequest.type,
                    atRequest.getRequestUrl(),
                    atRequest.objectify(),
                    atRequest.getRequestHeaders()
                );

            }.bind(this);

            var getSubscriptionServices = function(err, request) {
                if (!err && request) {
                    setAccessToken(request.response.access_token);
                    setRefreshToken(request.response.refresh_token);
                    setLoginUsername(username);
                    return Subscription.getSubscriptionServices();
                } else {
                    var fail = new Promise();
                    fail.done(err, null);
                    return fail;
                }
            }.bind(this);


            var oncomplete = function(err, request) {

                if (!err) {
                    var products = request.response.Products;
                    if (!products || products.length === 0) {
                        err = new Error(Error.Types.LOGIN, 0, 'No products returned.')
                    }
                }

                if(err) {
                    var errorMessage = 'Authentication failed. ';
                    errorMessage += resolveErrorMessage(err.response);

                    err = new Error(Error.Types.LOGIN, 0, errorMessage);
                }

                Utils.doCallback(callback, [ err, products ]);
            }.bind(this);

            Promise.chain([ getAccessToken, getSubscriptionServices ]).then(oncomplete);
        }

        /**
         * Get details about subscription for specific moniker (public ID)
         * @param {String}   serviceName Name of the service to get details about
         * @param {String}   publicId    Moniker (account public ID) for the service
         * @param {Function} callback    Callback to call once subscription details set
         */
        function setDefaultSubscriptionService(serviceName, publicId, callback) {
            Subscription.getSubscriptionServiceDetails(serviceName, publicId).then(function(err, request) {
                if (!err && request) {
                    Subscription.setServiceCatalog(request.response);
                    Subscription.setPublicId(publicId);
                }

                if(err) {

                    var errorMessage = 'Service subscription details retrieval failed. ';
                    errorMessage += resolveErrorMessage(err.response);

                    err = new Error(Error.Types.LOGIN, 0, errorMessage);
                }

                Utils.doCallback(callback, [ err, request ]);
            });
        }

        /**
         * Authenticate if access token has expired
         * @param  {Function} callback Callback to call once re-authentication finished
         */
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
                    setAccessToken(request.response.access_token);
                    setRefreshToken(request.response.refresh_token);
                }

                if(err) {

                    var errorMessage = 'ReAuthentication failed. ';
                    errorMessage += resolveErrorMessage(err.response);

                    err = new Error(Error.Types.LOGIN, 0, errorMessage);
                }

                Utils.doCallback(callback, [ err, request ]);
            }.bind(this);

            Promise.chain([ refreshTokenRequest ]).then(oncomplete);

        }

        /**
         * Check if client is already authenticated
         * @return {Boolean} true if authenticated
         */
        function isAuthenticated() {
            return getAccessToken() != null;
        }

        /**
         * Login without additional service requests if client already authenticated
         * @param  {Function} callback function to call once authenticated
         * @private
         */
        function loginFromCache(callback) {
            BaseRequest.prototype.accessToken = getAccessToken();
            BaseRequest.prototype.refreshToken = getRefreshToken();
            Utils.doCallback(callback, [null]);
        }

        /**
         * Remove all related data from Storage
         */
        function logout() {
            // TODO:10 Figure out better place for logout for the all loaded services
            // for (var i=0; i<loadedApis.length; i++) {
            //     loadedApis[i].logout();
            // }
            Utils.removeAll();
        }

        /**
         * Store the OAuth access token for later use - uses sessionStorage if available
         *
         * @protected
         * @param   {String} token
         */
        function setAccessToken(token) {
            BaseRequest.prototype.accessToken = token;
            Utils.set(config.storageKeywords.accessToken, token);
        }

        /**
         * Get the OAuth access token
         *
         * @protected
         * @return  {String} token
         */
        function getAccessToken() {
            if (BaseRequest.prototype.accessToken) {
                return BaseRequest.prototype.accessToken;
            } else {
                return Utils.get(config.storageKeywords.accessToken);
            }
        }

        /**
         * Store the OAuth refresh token for later use - uses sessionStorage if available
         *
         * @protected
         * @param   {String} token
         */
        function setRefreshToken(token) {
            BaseRequest.prototype.refreshToken = token;
            Utils.set(config.storageKeywords.refreshToken, token);
        }

        /**
         * Get the OAuth refresh token
         *
         * @protected
         * @return  {String} token
         */
        function getRefreshToken() {
            if (BaseRequest.prototype.refreshToken) {
                return BaseRequest.prototype.refreshToken;
            } else {
                return Utils.get(config.storageKeywords.refreshToken);
            }
        }

        /**
         * Store the login username for later use - uses sessionStorage if available
         *
         * @param   {String} username
         */
        function setLoginUsername(username) {
            Utils.set(config.storageKeywords.loginUsername, username);
        }

        /**
         * Get the login username
         *
         * @return  {String} username
         */
        function getLoginUsername() {
            return Utils.get(config.storageKeywords.loginUsername);
        }


        /**
         * Resolve error message from response
         *
         * @private
         * @param {object} response
         * @returns {string} Resolved error message
         */
        function resolveErrorMessage(response) {
            var errorMessage = '';

            if(response) {
                if(typeof response == 'object') {
                    if(response.hasOwnProperty('responseMessage')) {
                        errorMessage = response.responseMessage;
                    }
                }
                else {
                    errorMessage = response;
                }
            }
            return errorMessage;
        }

        this.login = login;
        this.logout = logout;
        this.reAuthenticate = reAuthenticate;
        this.isAuthenticated = isAuthenticated;
        this.setLoginUsername = setLoginUsername;
        this.getLoginUsername = getLoginUsername;
        this.setDefaultSubscriptionService = setDefaultSubscriptionService;
        this.setAccessToken = setAccessToken;
        this.getAccessToken = getAccessToken;
        this.setRefreshToken = setRefreshToken;
        this.getRefreshToken = getRefreshToken;

    }

    return new Auth();

});
