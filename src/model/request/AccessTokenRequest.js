define([
    'Ctl.ctlapiloader/Config',
    'Ctl.model.request/BaseRequest'
], function (
    Config,
    BaseRequest
) {
    /**
     * @class Ctl.model.request.AccessTokenRequest
     * @extends Ctl.model.request.BaseRequest
     * @private
     * 
     * Access Token Request
     *
     * The Token endpoint authenticates user credentials and in response
     * provides an access token which should be used in all resource requests.
     *
     * @param {String} username The resource owner username
     * @param {String} password The resource owner password
     * @constructor
     */
    function AccessTokenRequest(username, password) {
        BaseRequest.call(this);
        this.username = username;
        this.password = password;
        this.grantType = 'password';
    }

    AccessTokenRequest.prototype = Object.create(BaseRequest.prototype);

    /**
     * Retrieves data as a string of the AccessTokenRequest
     * @return {String} string with all the data about AccessTokenRequest
     */
    AccessTokenRequest.prototype.getData = function() {
        return JSON.stringify(this.objectify());
    };

    /**
     * Retrieves data as an object of the AccessTokenRequest
     * @return {Object} object with all the data about AccessTokenRequest
     */
    AccessTokenRequest.prototype.objectify = function () {
        var o = {
            'grant_type': this.grantType,
            'username': this.username,
            'password': this.password
        };

        return o;
    };

    /**
     * Retrieves request URL of the AccessTokenRequest
     * @return {String} string with URL for AccessTokenRequest
     */
    AccessTokenRequest.prototype.getRequestUrl = function () {
        return Config.settings.ctlServerURL + Config.settings.loginURI;
    };

    /**
     * Type of the Ajax request
     * @type {String}
     */
    AccessTokenRequest.prototype.type = 'POST';

    return AccessTokenRequest;
});
