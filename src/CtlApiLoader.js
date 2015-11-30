define('CtlApiLoader', ['Logger', 'Promise', 'Ajax', 'Utils'], function (Logger, Promise, Ajax, Utils) {

    /**
     * Main CenturyLink API loader class
     *
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function CtlApiLoader() {

        var self = this;
        var name = "CtlApiLoader";

        self.logger = new Logger(name);
        self.endpoint = 'https://auth.veuxdu.centurylink.com/token';

        var p = new Promise();

        /**
         * Authenticate client with OAuth method and store tokens for later use
         *
         * @param  {String}   username Username to authenticate
         * @param  {String}   password Password to authenticate
         * @param  {Function} callback Callback to call once authentication finished
         * @return {Promise}  p
         *
         * ## Sample usage:
         *
         *     CtlApiLoader.authenticate('username', 'password', function(response) {
         *     	alert(response);
         *     });
         *
         */
        function authenticate(username, password, callback) {
            var data = {
    			grant_type: 'password',
    			username: username,
    			password: password
    		};

            /* a callback to make the request */
            var request = function() {
                return Ajax.post(this.endpoint, data);
            }.bind(this);

            /* a callback to process the response */
            // var response = function(err, request) {
            //     return new Usergrid.Response(err, request);
            // }.bind(this);

            /* a callback to clean up and return data to the client */
            var oncomplete = function(err, response) {
                p.done(err, response);
                self.logger.info("REQUEST", err, response);
                Utils.doCallback(callback, [ err, response ]);
            }.bind(this);

            /* and a promise to chain them all together */
            Promise.chain([ request ]).then(oncomplete);
            return p;
        }

        /**
         * Get a version of the API loader
         *
         * @return {String} Contains API loader version
         */
        function version() {
            self.logger.info('version');
        }

        /**
         * Load CneturyLink API
         *
         * @param  {String}   name     Name of the API to load
         * @param  {String}   version  Version of the API to load
         * @param  {Function} callback Callback to call after API is loaded and initialized
         */
        function load(name, version, callback) {

            // TODO: Implement dynamic loading of the remote module
            // self.logger.info('load');
            // require('http://localhost:8000/example/speakeasy.js', ['require'], function(SpeakEasy) {
            //     console.log('loaded...');
            //     console.log(SpeakEasy);
            // });
            // Utils.doCallback(callback, [ err, response ]);
        }

        /**
         * Store the OAuth token for later use - uses localstorage if available
         *
         * @private
         * @param   {String} token
         */
        function setToken(token) {
            Utils.set("token", token);
        }

        /**
         * Get the OAuth token
         *
         * @private
         * @return  {String} token
         */
        function getToken() {
            return Utils.get("token");
        }

        this.authenticate = authenticate;
        this.version = version;
        this.load = load;
    }

    return new CtlApiLoader();

});
