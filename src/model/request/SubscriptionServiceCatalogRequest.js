define([
    'Ctl.ctlapiloader/Config',
    'Ctl.model.request/BaseRequest'
], function (
    Config,
    BaseRequest
) {

    /**
     * @class Ctl.model.request.SubscriptionServiceCatalogRequest
     * @extends Ctl.model.request.BaseRequest
     * @private
     *
     * Get subscription service catalog request
     *
     * @param {String} serviceName name of the service to get info about
     * @param {String} publicId    public user ID
     */
    function SubscriptionServiceCatalogRequest(serviceName, publicId) {
        BaseRequest.call(this);
        this.serviceName = serviceName;
        this.publicId = publicId;
    }

    SubscriptionServiceCatalogRequest.prototype = Object.create(BaseRequest.prototype);

    /**
     * Retrieves request URL of the SubscriptionServiceCatalogRequest
     * @return {String} string with URL for SubscriptionServiceCatalogRequest
     */
    SubscriptionServiceCatalogRequest.prototype.getRequestUrl = function() {
            return this.getCtlServerURL() +
                Config.settings.getSubscriptionServiceCatalogURI
                .replace('{service}', this.serviceName)
                .replace('{publicId}', this.publicId);
    };

    /**
     * Type of the Ajax request
     * @type {String}
     */
    SubscriptionServiceCatalogRequest.prototype.type = "GET";

    return SubscriptionServiceCatalogRequest;
});
