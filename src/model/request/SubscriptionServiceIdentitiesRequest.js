define([
    'Ctl/Utils',
    'Ctl.speakeasy/Config',
    'Ctl.model.request/BaseRequest'
], function (
    Utils,
    Config,
    BaseRequest
) {

    /**
     * @class Ctl.model.request.SubscriptionServiceIdentitiesRequest
     * @extends Ctl.model.request.BaseRequest
     * @private
     *
     * Get subscription service list request
     *
     */
    function SubscriptionServiceIdentitiesRequest() {
        BaseRequest.call(this);
    }

    SubscriptionServiceIdentitiesRequest.prototype = Object.create(BaseRequest.prototype);

    /**
     * Retrieves request URL of the SubscriptionServiceIdentitiesRequest
     * @return {String} string with URL for SubscriptionServiceIdentitiesRequest
     */
    SubscriptionServiceIdentitiesRequest.prototype.getRequestUrl = function () {

        var instalinkAccount = Utils.get('instalink');
        return this.getCtlServerURL() + (instalinkAccount === 'true' ? Config.settings.Instalink.getSubscriptionServiceIdentitiesURI : Config.settings.getSubscriptionServiceIdentitiesURI);
    };

    /**
     * Type of the Ajax request
     * @type {String}
     */
    SubscriptionServiceIdentitiesRequest.prototype.type = "GET";

    return SubscriptionServiceIdentitiesRequest;
});
