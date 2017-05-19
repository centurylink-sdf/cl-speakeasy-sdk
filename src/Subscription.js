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

                VOIPTN: "VoipTn",
                VOIPCREF: "VoipTnCipherRef",
                MYPUBLICUSER: "MyPublicUser",
                services: 'services',
                serviceName: 'serviceName',
                serviceCatalog: {
                    publicId: 'publicId',
                    domain: 'domain',
                    id: 'id',
                    webSocketEndpoints: 'webSocketEndpoints',
                    voipTnCipherRef: 'voipTnCipherRef'
                },
                RTCService: {
                    Enabled : "RTCServiceEnabled",
                    Exists : "RTCServiceExists",
                    ProvisioningState : "RTCServiceProvisioningState",
                    Uris : "RTCUris"
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
            Utils.setObject(config.storageKeywords.serviceName, serviceCatalog.productName);
            Utils.setObject(config.storageKeywords.services + '_' + serviceCatalog.productName, serviceCatalog);
        }

        /**
         * Get service details
         * @return {Object} Object with service details
         */
        function getServiceCatalog() {
            var serviceName = Utils.getObject(config.storageKeywords.serviceName);
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

        function parseWebRTCServers(uris) {

            var parsedServers = [];

            if (typeof uris === 'string') {
                uris = uris.replace(/ /g,'');
                try {
                    uris = JSON.parse(uris);
                } catch (e) {
                    if(uris.indexOf('$') >= 0) {
                        uris = uris.split('$');
                    }
                }
            }

            var addToServerList = function(server) {
                if(parsedServers.indexOf(server) === -1) {
                    parsedServers.push(server);
                }
            };

            if (uris) {
                for (var key in uris) {
                    if (uris.hasOwnProperty(key)) {
                        if (uris[key] instanceof Array) {
                            for (var i=0; i<uris[key].length; i++) {
                                addToServerList(uris[key][i]);
                            }
                        } else {
                            if (typeof uris[key] === 'string') {

                                try {
                                    var parsedUris = JSON.parse(uris[key]);
                                    if (parsedUris instanceof Array) {
                                        for (var j=0; j<parsedUris.length; j++) {
                                            var parsedServerList = this.parseWebRTCServers(parsedUris[j]);
                                            for(var k = 0; k < parsedServerList.length; k++) {
                                                addToServerList(parsedServerList[k]);
                                            }
                                        }
                                    }
                                }
                                catch(e) {
                                    addToServerList(uris[key]);
                                }
                            } else {
                                for (var p in uris[key]) {
                                    if (uris[key].hasOwnProperty(p)) {
                                        if (uris[key][p] instanceof Array) {
                                            for(var m = 0; m < uris[key][p].length; m++) {
                                                addToServerList(uris[key][p][m]);
                                            }
                                        }
                                        else {
                                            addToServerList(uris[key][p]);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }

            localStorage.setItem(config.storageKeywords.RTCService.Uris, JSON.stringify(parsedServers));
        }

        function setOAuthCredentials(data) {

            var dynamicStorage = Utils.getDynamicStorage();

            var publicUser = '';

            dynamicStorage.setItem(config.storageKeywords.VOIPCREF, data.networkIdentity.authenticationandCipheringReference);
            dynamicStorage.setItem(config.storageKeywords.VOIPTN, data.networkIdentity.moniker);

            if(data.rtc) {
                publicUser = data.networkIdentity.moniker + data.rtc.domain;
                parseWebRTCServers(data.rtc.routing);
            }
            else {
                publicUser = data.networkIdentity.moniker;
            }

            localStorage.setItem(this.storageKeywords.MYPUBLICUSER, publicUser);
        }

        function setCtlIdCredentials(preRegData) {

            var dynamicStorage = Utils.getDynamicStorage();

            dynamicStorage.setItem(config.storageKeywords.VOIPTN, preRegData.HomePreRegisterResponse.VoipTn);
            dynamicStorage.setItem(config.storageKeywords.VOIPCREF, preRegData.HomePreRegisterResponse.VoipTnCipherRef);

            localStorage.setItem(config.storageKeywords.MYPUBLICUSER, preRegData.HomePreRegisterResponse.MyPublicUser);
            localStorage.setItem(config.storageKeywords.RTCService.Exists, preRegData.HomePreRegisterResponse.RTCServiceExists);

            parseWebRTCServers(preRegData.HomePreRegisterResponse.VoIPDomainURIs);
        }

        this.getSubscriptionServices = getSubscriptionServices;
        this.getSubscriptionServiceDetails = getSubscriptionServiceDetails;
        this.getServiceCatalog = getServiceCatalog;
        this.setServiceCatalog = setServiceCatalog;
        this.setPublicId = setPublicId;
        this.getPublicId = getPublicId;
        this.setCtlIdCredentials = setCtlIdCredentials;
        this.setOAuthCredentials = setOAuthCredentials;

    }

    return new Subscription();

});
