define(['Ctl.apiloader.Config', 'model/request/BaseRequest'], function (Config, BaseRequest) {
    /**
     * Refresh Token Request
     *
     * The Token endpoint authenticates refresh token and in response provides
     * an access token which should be used in all resource requests.
     *
     * @param {String} refreshToken The resource owner refresh_token
     * @constructor
     */
    function SubscriptionServiceIdentitiesRequest() {
        BaseRequest.call(this);
    }

    SubscriptionServiceIdentitiesRequest.prototype = Object.create(BaseRequest.prototype);

    SubscriptionServiceIdentitiesRequest.prototype.getRequestUrl = function () {
            return Config.settings.ctlServerURL + Config.settings.getSubscriptionServiceIdentitiesURI;
    };
    SubscriptionServiceIdentitiesRequest.prototype.type = "GET";

    return SubscriptionServiceIdentitiesRequest;
});
