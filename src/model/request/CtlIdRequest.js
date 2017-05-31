define([
    'Ctl.speakeasy/Config'
], function (
    Config
) {
    /**
     * @class Ctl.model.request.CtlIdRequest
     * @extends Ctl.model.request.BaseRequest
     * @private
     *
     * CtlID Request
     *
     * The Token endpoint authenticates user credentials and in response
     * provides an access token which should be used in all resource requests.
     *
     * @param {String} username The resource owner username
     * @param {String} password The resource owner password
     * @constructor
     */
    function CtlIdRequest(username, password) {

        this.username = username;
        this.password = password;

        this.requestHeaders = [
            [ 'Content-Type', 'application/json' ],
            [ 'Accept', 'application/json' ]

        ];
    }

    /**
     * Retrieves data as a string of the AccessTokenRequest
     * @return {String} string with all the data about AccessTokenRequest
     */
    CtlIdRequest.prototype.getData = function() {
        return JSON.stringify(this.objectify());
    };

    /**
     * Retrieves data as an object of the AccessTokenRequest
     * @return {Object} object with all the data about AccessTokenRequest
     */
    CtlIdRequest.prototype.objectify = function () {
        var o = {
            "Username": this.username,
            "Password": this.password
        };

        if (this.SessionId) {
            o.SessionId = this.SessionId;
        }
        if (this.SessionDuration) {
            o.SessionDuration = this.SessionDuration;
        }

        return o;
    };

    /**
     * Retrieves request URL of the AccessTokenRequest
     * @return {String} string with URL for AccessTokenRequest
     */
    CtlIdRequest.prototype.getRequestUrl = function () {
        return this.getCtlIdServerURL() + Config.settings.ctlIdLoginURI;
    };

    CtlIdRequest.prototype.getRequestHeaders = function () {
        return this.requestHeaders;
    };

    CtlIdRequest.prototype.getCtlIdServerURL = function () {
        var configSection = Config.useConfig;
        var settings = Config.settings[configSection];
        if(settings) {
            return settings.ctlIdServerURL;
        }
        else {
            return Config.settings.intg.ctlIdServerURL;
        }
    };

    /**
     * Type of the Ajax request
     * @type {String}
     */
    CtlIdRequest.prototype.type = 'POST';

    return CtlIdRequest;
});
