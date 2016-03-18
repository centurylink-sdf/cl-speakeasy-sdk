define(['Ctl.apiloader/Config', 'Ctl.model.request/BaseRequest'], function (Config, BaseRequest) {

    /**
     * @class Ctl.model.request.SubscriptionServiceCatalogRequest
     * @extends Ctl.model.request.BaseRequest
     * @param {[type]} serviceName [description]
     * @param {[type]} publicId    [description]
     */
    function SubscriptionServiceCatalogRequest(serviceName, publicId) {
        BaseRequest.call(this);
        this.serviceName = serviceName;
        this.publicId = publicId;
    }

    SubscriptionServiceCatalogRequest.prototype = Object.create(BaseRequest.prototype);

    SubscriptionServiceCatalogRequest.prototype.getRequestUrl = function() {
            return Config.settings.ctlServerURL +
                Config.settings.getSubscriptionServiceCatalogURI
                .replace('{service}', this.serviceName)
                .replace('{publicId}', this.publicId);
    };
    SubscriptionServiceCatalogRequest.prototype.type = "GET";

    return SubscriptionServiceCatalogRequest;
});
