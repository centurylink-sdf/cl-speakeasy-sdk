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

        var mock = false;

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

        var ids = [
            { "publicID": "7202839128", "ID": "test01" },
            { "publicID": "7202839129", "ID": "test02" },
            { "publicID": "7202839243", "ID": "test03" },
            { "publicID": "7202839244", "ID": "test04" },
            { "publicID": "7202839245", "ID": "test05" },
            { "publicID": "3183601228", "ID": "437171125" },
            { "publicID": "3183601229", "ID": "437171136" },
            { "publicID": "3183601754", "ID": "444577233" },
            { "publicID": "3183601755", "ID": "444577277" },
            { "publicID": "3183601756", "ID": "444577313" },
            { "publicID": "3183601758", "ID": "444577391" },
            { "publicID": "3183601759", "ID": "444577426" }
        ];

        function sync(username) {

            if (mock) return mockSync(username);

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

                var publicId;
                var products = request.response.Products;
                if (!products || products.length === 0) {
                    p.done("No products returned.", request.response);
                }

                var publicIds = Object.keys(products);
                $.each(publicIds, function (index, value) {
                    var serviceNames = products[value];
                    if ($.inArray('SpeakEasy', serviceNames) !== -1 || $.inArray('SpeakEasy-Out', serviceNames) !== -1) {
                        publicId = value;
                        return true;
                    }
                    return false;
                });

                if (!publicId) {
                    p.done("No SpeakEasy product returned.", request.response);
                }

                var subscribedServices = ["SpeakEasy","Courier"];
                setServices(subscribedServices);

                return getSubscriptionServiceDetails(Config.services.speakEasyServiceName, publicId);
            }.bind(this);

            var oncomplete = function(err, request) {
                if (!err && request) {
                    setServiceCatalog(request.response);
                }
                p.done(err, request.response);
            }.bind(this);

            Promise.chain([ serviceListRequest, serviceCatalogRequest ]).then(oncomplete);
            return p;
        }

        function mockSync(username) {
            var p = new Promise();

            var publicId;
            for(var i=0; i<ids.length; i++) {
                if (ids[i]["ID"] === username) {
                    publicId = ids[i]["publicID"];
                    break;
                }
            }

            var subscribedServices = ["SpeakEasy", "Courier"];
            setServices(subscribedServices);

            var response = {
                "ServiceCatalog": {
                    "publicID":"" + publicId,
                    "serviceName":"SpeakEasy",
                    "domain":"ctlvoip.lab.centurylink",
                    "ID": username + "-1",
                    "WebSocketEndpoints":"www.intg104.centurylink.com:8590$www.intg104.centurylink.com:8590"
                }
            };

            setServiceCatalog(response.ServiceCatalog);

            p.done(null, response.ServiceCatalog);

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
            Utils.setObject(config.storageKeywords.services + '_' + serviceCatalog.productName, serviceCatalog);
        }

        function getServiceCatalog(serviceName) {
            return Utils.getObject(config.storageKeywords.services + '_' + serviceName);
        }

        this.sync = sync;
        this.getServiceCatalog = getServiceCatalog;

    }

    return new Subscription();

});
