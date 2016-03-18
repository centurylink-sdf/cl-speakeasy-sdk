define([
    'Ctl.apiloader/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'Ctl.model.request/SubscriptionServiceIdentitiesRequest',
    'Ctl.model.request/SubscriptionServiceCatalogRequest'
], function (
    Config,
    Logger,
    Promise,
    Ajax,
    Utils,
    SubscriptionServiceIdentitiesRequest,
    SubscriptionServiceCatalogRequest
) {

    /**
     * [Subscription description]
     * @class Ctl.common.Subscription
     */
    function Subscription() {

        var logger = new Logger('Subscription');

        var config = {
            storageKeywords: {
                services: 'services',
                serviceCatalog: {
                    publicId: 'publicId',
                    domain: 'domain',
                    id: 'id',
                    webSocketEndpoints: 'webSocketEndpoints'
                }
            }
        };

        function sync() {
            var p = new Promise();

            var serviceListRequest = function() {
                return getSubscriptionServices();
            }.bind(this);

            var serviceCatalogRequest = function(err, request) {

                if (err) {
                    p.done(err, request.response);
                }

                // FIXME:0 Currently saving subscribed services only for first item
                // Will be needed to loop through all subscribed services and retrieve catalog info for each.
                var keys = Object.keys(request.response.Services);
                var publicId = keys[0];
                var subscribedServices = request.response.Services[keys[0]];
                setServices(subscribedServices);

                return getSubscriptionServiceDetails(Config.services.speakEasyServiceName, publicId);
            }.bind(this);

            var oncomplete = function(err, request) {
                if (!err && request) {
                    setServiceCatalog(request.response.ServiceCatalog);
                }
                p.done(err, request.response);
            }.bind(this);

            Promise.chain([ serviceListRequest, serviceCatalogRequest ]).then(oncomplete);
            return p;
        }

        function getSubscriptionServices() {
            var slRequest = new SubscriptionServiceIdentitiesRequest();
            return Ajax.request(
                    slRequest.type,
                    slRequest.getRequestUrl(),
                    null,
                    slRequest.getRequestHeaders()
                );
        }

        function getSubscriptionServiceDetails(serviceName, publicId) {
            var seCatalogRequest = new SubscriptionServiceCatalogRequest(serviceName, publicId);
            return Ajax.request(
                    seCatalogRequest.type,
                    seCatalogRequest.getRequestUrl(),
                    null,
                    seCatalogRequest.getRequestHeaders()
                );
        }

        function setServices(services) {
            Utils.set(config.storageKeywords.services, JSON.stringify(services));
        }

        function getServices(services) {
            return Utils.get(config.storageKeywords.services);
        }

        function setServiceCatalog(serviceCatalog) {
            Utils.setObject(config.storageKeywords.services + '_' + serviceCatalog.serviceName, serviceCatalog);
        }

        function getServiceCatalog(serviceName) {
            return Utils.getObject(config.storageKeywords.services + '_' + serviceName);
        }

        this.sync = sync;
        this.getServiceCatalog = getServiceCatalog;

    }

    return new Subscription();

});
