define([
    'Ctl/Logger',
    'Ctl/Promise'
], function (Logger, Promise) {

    function partial() {
        var args = Array.prototype.slice.call(arguments);
        var fn = args.shift();
        return fn.bind(this, args);
    }

    /**
     * Wrapper for AJAX calls
     * @class Ctl.Ajax
     * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @private
     * @requires Ctl.Logger
     * @requires Ctl.Promise
     */
    function Ajax() {

        var self = this;
        var name = "Ajax";

        self.logger = new Logger(name);

        /**
         * Encode key-value object into URI string
         *
         * @private
         * @param  {Object/String} data Data to encode
         * @return {String}      Encoded string
         */
        function encode(data) {
            var result = "";
            if (typeof data === "string") {
                result = data;
            } else {
                var e = encodeURIComponent;
                for (var i in data) {
                    if (data.hasOwnProperty(i)) {
                        if (Object.keys(data).indexOf(i) > 0) {
                            result += "&";
                        }
                        result += e(i) + "=" + e(data[i]);
                    }
                }
            }
            return result;
        }

        /**
         * Request method to do AJAX calls.
         * @param  {String} method Request method. POST, GET, PUT, DELETE etc.
         * @param  {String} url Url to make request
         * @param  {Object} data Data to send
         * @return {Ctl.Promise} p
         */
        function request(method, url, data, headers) {
            var p = new Promise(), timeout;
            self.logger.time(method + " " + url);
            (function(xhr) {
                xhr.onreadystatechange = function() {
                    if (this.readyState === 4) {
                        self.logger.timeEnd(method + " " + url);
                        clearTimeout(timeout);
                        if (this.status === 200) {
                            p.done(null, this);
                        }
                        if ((this.status >= 400 && this.status <= 451) || (this.status >= 500 && this.status <= 511)) {
                            p.done(this, null);
                        }
                    }
                };
                xhr.onerror = function(response) {
                    clearTimeout(timeout);
                    p.done(response, null);
                };
                xhr.oncomplete = function(response) {
                    clearTimeout(timeout);
                    self.logger.timeEnd(method + " " + url);
                    self.info("%s request to %s returned %s", method, url, this.status);
                };
                xhr.open(method, url);
                xhr.responseType = 'json';
                if (headers) {
                    for (var i = 0; i < headers.length; i++) {
                        if (headers[i][1]) { xhr.setRequestHeader(headers[i][0], headers[i][1]); }
                    }
                }
                timeout = setTimeout(function() {
                    xhr.abort();
                    p.done({ response: 'API Call timed out.'}, null);
                }, 3e4);
                //BACKLOG:0 stick that timeout in a config variable
                xhr.send(encode(data));
            })(new XMLHttpRequest());
            return p;
        }


        this.request = request;

        /**
         * @method get      Do AJAX GET request
         * @param  {String} url     Url to make request
         * @param  {Object} data    Data to send
         * @return {Ctl.Promise} p
         */
        this.get = partial(request, "GET");

        /**
         * @method post      Do AJAX POST request
         * @param  {String} url     Url to make request
         * @param  {Object} data    Data to send
         * @return {Ctl.Promise} p
         */
        this.post = partial(request, "POST");

        /**
         * @method put      Do AJAX PUT request
         * @param  {String} url     Url to make request
         * @param  {Object} data    Data to send
         * @return {Ctl.Promise} p
         */
        this.put = partial(request, "PUT");

        /**
         * @method delete      Do AJAX DELETE request
         * @param  {String} url     Url to make request
         * @param  {Object} data    Data to send
         * @return {Ctl.Promise} p
         */
        this.delete = partial(request, "DELETE");
    }

    return new Ajax();
});
