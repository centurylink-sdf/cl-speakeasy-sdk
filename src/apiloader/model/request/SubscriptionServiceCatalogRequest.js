define(['Ctl.apiloader.Config', 'model/request/BaseRequest'], function (Config, BaseRequest) {

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
