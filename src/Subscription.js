define([
    'Ctl.ctlapiloader/Config',
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
     * @class Ctl.Subscription
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
            Utils.setObject(config.storageKeywords.services + '_' + serviceCatalog.productName, serviceCatalog);
        }

        function getServiceCatalog(serviceName) {
            return Utils.getObject(config.storageKeywords.services + '_' + serviceName);
        }

        this.getSubscriptionServices = getSubscriptionServices;
        this.getSubscriptionServiceDetails = getSubscriptionServiceDetails;
        this.getServiceCatalog = getServiceCatalog;
        this.setServiceCatalog = setServiceCatalog;

    }

    return new Subscription();

});
