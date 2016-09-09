define([
    'Ctl.ctlapiloader/Config',
    'Ctl.model.request/BaseRequest'
], function (
    Config,
    BaseRequest
) {
    /**
     * @class Ctl.model.request.RefreshTokenRequest
     * @extends Ctl.model.request.BaseRequest
     * @private
     * 
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

    /**
     * Retrieves data as a string of the RefreshTokenRequest
     * @return {String} string with all the data about RefreshTokenRequest
     */
    RefreshTokenRequest.prototype.getData = function() {
        return JSON.stringify(this.objectify());
    };

    /**
     * Retrieves data as an object of the RefreshTokenRequest
     * @return {Object} object with all the data about RefreshTokenRequest
     */
    RefreshTokenRequest.prototype.objectify = function () {
        var o = {
            'grant_type': this.grantType,
            'refresh_token': this.refreshToken
        };

        return o;
    };

    /**
     * Retrieves request URL of the RefreshTokenRequest
     * @return {String} string with URL for RefreshTokenRequest
     */
    RefreshTokenRequest.prototype.getRequestUrl = function () {
        return Config.settings.ctlServerURL + Config.settings.loginURI;
    };

    /**
     * Type of the Ajax request
     * @type {String}
     */
    RefreshTokenRequest.prototype.type = 'POST';

    return RefreshTokenRequest;
});
