define(['Ctl.apiloader/Config', 'Ctl.model.request/BaseRequest'], function (Config, BaseRequest) {
    /**
     * @class Ctl.model.request.AccessTokenRequest
     * @extends Ctl.model.request.BaseRequest
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

    AccessTokenRequest.prototype.getData = function() {
        return JSON.stringify(this.objectify());
    };
    AccessTokenRequest.prototype.objectify = function () {
        var o = {
            'grant_type': this.grantType,
            'username': this.username,
            'password': this.password
        };

        return o;
    };
    AccessTokenRequest.prototype.getRequestUrl = function () {
        return Config.settings.ctlServerURL + Config.settings.loginURI;
    };
    AccessTokenRequest.prototype.type = 'POST';

    return AccessTokenRequest;
});
