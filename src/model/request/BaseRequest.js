define([
    'Ctl.speakeasy/Config'
], function(
    Config
){

    /**
     * @class Ctl.model.request.BaseRequest
     * @private
     *
     * Simple class that represents a Request that will be made by any Ctl.Ajax
     * subclass. All this class does is standardize the representation of a Request
     * as used by any BaseRequest subclass, it does not contain any actual logic or
     * perform the request itself.
     */
    function BaseRequest(){
        this.requestHeaders = [
            [ 'Content-Type', 'application/x-www-form-urlencoded' ],
            [ 'Accept', 'application/json' ],
            [ 'Authorization', this.accessToken ? 'Bearer ' + this.accessToken : '']
        ];
    }

    BaseRequest.prototype = {
        getRequestHeaders: function(){
            return this.requestHeaders;
        },
        getCtlServerURL: function() {
            var configSection = Config.useConfig;
            var settings = Config.settings[configSection];
            if(settings) {
                return settings.ctlServerURL;
            }
            else {
                return Config.settings.intg.ctlServerURL;
            }
        }
    };

    return BaseRequest;
});
