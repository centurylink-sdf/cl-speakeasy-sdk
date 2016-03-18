define(['Ctl.apiloader/Config', 'Ctl.model.request/BaseRequest'], function (Config, BaseRequest) {

    /**
     * @class Ctl.model.request.SubscriptionServiceIdentitiesRequest
     * @extends Ctl.model.request.BaseRequest
     */
    function SubscriptionServiceIdentitiesRequest() {
        BaseRequest.call(this);
    }

    SubscriptionServiceIdentitiesRequest.prototype = Object.create(BaseRequest.prototype);

    SubscriptionServiceIdentitiesRequest.prototype.getRequestUrl = function () {
            return Config.settings.ctlServerURL + Config.settings.getSubscriptionServiceIdentitiesURI;
    };
    SubscriptionServiceIdentitiesRequest.prototype.type = "GET";

    return SubscriptionServiceIdentitiesRequest;
});
