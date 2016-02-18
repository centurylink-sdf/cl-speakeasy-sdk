define(['Ctl.apiloader.Config'], function (Config) {
    /**
     * Refresh Token Request
     *
     * The Token endpoint authenticates refresh token and in response provides
     * an access token which should be used in all resource requests.
     *
     * @param {String} refreshToken The resource owner refresh_token
     * @constructor
     */
    function SubscriptionServiceIdentitiesRequest(refreshToken) {
        this.refreshToken = refreshToken;
        this.grantType = 'refresh_token';
    }

    SubscriptionServiceIdentitiesRequest.prototype = {
        getData: function() {
            return JSON.stringify(this.objectify());
        },
        objectify: function () {
            var o = {
                'grant_type': this.grantType,
                'refresh_token': this.refreshToken
            };

            return o;
        },
        getRequestUrl: function () {
            return Config.settings.ctlServerURL + Config.settings.getSubscriptionServiceIdentitiesURI;
        },
        type: "GET"
    };
    return SubscriptionServiceIdentitiesRequest;
});
