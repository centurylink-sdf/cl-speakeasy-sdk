define(['Ctl.apiloader.Config', 'model/request/BaseRequest'], function (Config, BaseRequest) {
    /**
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

    AccessTokenRequest.prototype = {
        getData: function() {
            return JSON.stringify(this.objectify());
        },
        objectify: function () {
            var o = {
                'grant_type': this.grantType,
                'username': this.username,
                'password': this.password
            };

            return o;
        },
        getRequestUrl: function () {
            return Config.settings.ctlServerURL + Config.settings.loginURI;
        },
        type: "POST"
    };
    return AccessTokenRequest;
});
