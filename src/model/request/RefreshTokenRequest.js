define(['Ctl.apiloader/Config', 'Ctl.model.request/BaseRequest'], function (Config, BaseRequest) {
    /**
     * @class Ctl.model.request.RefreshTokenRequest
     * @extends Ctl.model.request.BaseRequest
     * Refresh Token Request
     *
     * The Token endpoint authenticates refresh token and in response provides
     * an access token which should be used in all resource requests.
     *
     * @param {String} refreshToken The resource owner refresh_token
     * @constructor
     */
    function RefreshTokenRequest(refreshToken) {
        BaseRequest.call(this);
        this.refreshToken = refreshToken;
        this.grantType = 'refresh_token';
    }

    RefreshTokenRequest.prototype = Object.create(BaseRequest.prototype);

    RefreshTokenRequest.prototype.getData = function() {
        return JSON.stringify(this.objectify());
    };
    RefreshTokenRequest.prototype.objectify = function () {
        var o = {
            'grant_type': this.grantType,
            'refresh_token': this.refreshToken
        };

        return o;
    };
    RefreshTokenRequest.prototype.getRequestUrl = function () {
        return Config.settings.ctlServerURL + Config.settings.loginURI;
    };
    RefreshTokenRequest.prototype.type = 'POST';

    return RefreshTokenRequest;
});
