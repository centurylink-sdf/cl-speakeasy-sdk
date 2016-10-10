define([
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'Ctl.model.request/SubscriptionServiceIdentitiesRequest',
    'Ctl.model.request/SubscriptionServiceCatalogRequest'
], function (
    Logger,
    Promise,
    Ajax,
    Utils,
    SubscriptionServiceIdentitiesRequest,
    SubscriptionServiceCatalogRequest
) {

    /**
     * Work with subscription services in CenturyLink
     * @class Ctl.Subscription
     * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @private
     * @requires Ctl.Logger
     * @requires Ctl.Promise
     * @requires Ctl.Ajax
     * @requires Ctl.Utils
     * @requires Ctl.model.request.SubscriptionServiceIdentitiesRequest
     * @requires Ctl.model.request.SubscriptionServiceCatalogRequest
     */
    function Subscription() {

        var logger = new Logger('Subscription');

        /**
         * Storage keywords for storing subscription settings
         * @type {Object}
         */
        var config = {
            storageKeywords: {
                services: 'services',
                serviceCatalog: {
                    publicId: 'publicId',
                    domain: 'domain',
                    id: 'id',
                    webSocketEndpoints: 'webSocketEndpoints',
                    voipTnCipherRef: 'voipTnCipherRef'
                }
            }
        };

        /**
         * Retrieve list of subscribed services
         * @return {Ctl.Promise} CTL promise object
         */
        function getSubscriptionServices() {
            var slRequest = new SubscriptionServiceIdentitiesRequest();
            return Ajax.request(
                    slRequest.type,
                    slRequest.getRequestUrl(),
                    null,
                    slRequest.getRequestHeaders()
                );
        }

        /**
         * Retrieve details of particular service
         * @param  {String} serviceName Name of the service to get details about
         * @param  {String} publicId    Moniker (public ID) tied to the service
         * @return {Ctl.Promise} CTL promise object
         */
        function getSubscriptionServiceDetails(serviceName, publicId) {
            var seCatalogRequest = new SubscriptionServiceCatalogRequest(serviceName, publicId);
            return Ajax.request(
                    seCatalogRequest.type,
                    seCatalogRequest.getRequestUrl(),
                    null,
                    seCatalogRequest.getRequestHeaders()
                );
        }

        /**
         * Set services into storage
         * @param {Object} services Object with services
         * @protected
         */
        function setServices(services) {
            Utils.set(config.storageKeywords.services, JSON.stringify(services));
        }

        /**
         * Get services from the storage
         * @return {Object}     Object with services
         * @protected
         */
        function getServices() {
            return Utils.get(config.storageKeywords.services);
        }

        /**
         * Set service catalog details into storage
         * @param {Object} serviceCatalog Object with service details
         */
        function setServiceCatalog(serviceCatalog) {
            Utils.setObject(config.storageKeywords.services + '_' + serviceCatalog.productName, serviceCatalog);
        }

        /**
         * Get service details
         * @param  {String} serviceName Service name to get info about
         * @return {Object}             Object with service details
         */
        function getServiceCatalog(serviceName) {
            return Utils.getObject(config.storageKeywords.services + '_' + serviceName);
        }

        /**
         * Set moniker (public ID) in storage
         * @param {String} publicId user's public ID (moniker)
         */
        function setPublicId(publicId) {
            Utils.set(config.storageKeywords.serviceCatalog.publicId, publicId);
        }

        /**
         * Get moniker (public ID) from storage
         */
        function getPublicId() {
            return Utils.get(config.storageKeywords.serviceCatalog.publicId);
        }

        this.getSubscriptionServices = getSubscriptionServices;
        this.getSubscriptionServiceDetails = getSubscriptionServiceDetails;
        this.getServiceCatalog = getServiceCatalog;
        this.setServiceCatalog = setServiceCatalog;
        this.setPublicId = setPublicId;
        this.getPublicId = getPublicId;

    }

    return new Subscription();

});
