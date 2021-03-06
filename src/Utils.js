define([], function () {

    /**
     * This module is a collection of classes designed to make working with
     * the CenturyLink Services API as easy as possible.
     *
     * @class Ctl.Utils
     * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @private
     */
    function Utils() {

        var self = this;

        /**
         * Check if the URL is valid
         * @param  {[type]}  url [description]
         * @return {Boolean}     [description]
         */
        function isValidUrl(url) {
            if (!url) { return false; }
            var doc, base, anchor, isValid = false;
            try {
                doc = document.implementation.createHTMLDocument("");
                base = doc.createElement("base");
                base.href = base || window.lo;
                doc.head.appendChild(base);
                anchor = doc.createElement("a");
                anchor.href = url;
                doc.body.appendChild(anchor);
                isValid = (anchor.href !== "");
            } catch (e) {
                console.error(e);
            } finally {
                doc.head.removeChild(base);
                doc.body.removeChild(anchor);
                base = null;
                anchor = null;
                doc = null;
                return isValid;
            }
        }

        /**
         * Method to encode the query string parameters
         *
         * @param   {Object} params - an object of name value pairs that will be urlencoded
         * @return  {String} Returns the encoded string
         */
        function encodeParams(params) {
            var queryString;
            if (params && Object.keys(params)) {
                queryString = [].slice.call(arguments).reduce(function(a, b) {
                    return a.concat(b instanceof Array ? b : [ b ]);
                }, []).filter(function(c) {
                    return "object" === typeof c;
                }).reduce(function(p, c) {
                    !(c instanceof Array) ? p = p.concat(Object.keys(c).map(function(key) {
                        return [ key, c[key] ];
                    })) : p.push(c);
                    return p;
                }, []).reduce(function(p, c) {
                    c.length === 2 ? p.push(c) : p = p.concat(c);
                    return p;
                }, []).reduce(function(p, c) {
                    c[1] instanceof Array ? c[1].forEach(function(v) {
                        p.push([ c[0], v ]);
                    }) : p.push(c);
                    return p;
                }, []).map(function(c) {
                    c[1] = encodeURIComponent(c[1]);
                    return c.join("=");
                }).join("&");
            }
            return queryString;
        }

        /**
         * Method to determine whether or not the passed variable is a function
         *
         * @param   {any} f - any variable
         * @return  {Boolean} Returns true or false
         */
        function isFunction(f) {
            return f && f !== null && typeof f === "function";
        }

        /**
         * A safe wrapper for executing a callback
         *
         * @param   {Function}  callback    the passed-in callback method
         * @param   {Array}     params      an array of arguments to pass to the callback
         * @param   {Object}    context     an optional calling context for the callback
         * @return  Returns whatever would be returned by the callback. or false.
         */
        function doCallback(callback, params, context) {
            var returnValue;
            if (isFunction(callback)) {
                if (!params) { params = []; }
                if (!context) { context = this; }
                params.push(context);
                //try {
                returnValue = callback.apply(context, params);
            }
            return returnValue;
        }

        /**
         * Save object into storage
         * @param {String} key   Object's key
         * @param {Object} value Object's value
         */
        function setObject(key, value) {
            if (value) {
                value = JSON.stringify(value);
            }
            this.set(key, value);
        }

        /**
         * Save string into storage
         * @param {String} key   String key
         * @param {String} value String value
         */
        function set(key, value) {
            var keyStore = "ctlapi_" + key;
            this[key] = value;
            if (typeof Storage !== "undefined") {
                if (value) {
                    sessionStorage.setItem(keyStore, value);
                } else {
                    sessionStorage.removeItem(keyStore);
                }
            }
        }

        /**
         * Get object from storage
         * @param {String} key   Object's key
         * @return {Object} value Object's value
         */
        function getObject(key) {
            return JSON.parse(this.get(key));
        }

        /**
         * Get string from storage
         * @param {String} key   String key
         * @return {String} value String value
         */
        function get(key) {
            var keyStore = "ctlapi_" + key;
            var value = null;
            if (this[key]) {
                value = this[key];
            } else if (typeof Storage !== "undefined") {
                value = sessionStorage.getItem(keyStore);
            }
            return value;
        }

        /**
         * Remove all data in storage
         */
        function removeAll() {
            for (var i = sessionStorage.length; i--;){
                // if (sessionStorage.key(i).indexOf('ctlapi_') > -1) {
                    sessionStorage.removeItem(sessionStorage.key(i));
                // }
            }
        }


        /**
         * Merge the contents of two objects together into the first object. If target object in null will be created new one.
         * @param {Object} target
         * @param {Object} object1
         * @returns {Object} extended object
         */
        function extend(target , object1) {

            if(target == null) {
                target = {};
            }

            if(object1 != null) {
                for (var i in object1) {
                    // check if the extended object has that property
                    if (object1.hasOwnProperty(i)) {
                        // mow check if the child is also and object so we go through it recursively
                        if (typeof target[i] == "object" && target.hasOwnProperty(i) && target[i] != null) {
                            self.extend(target[i], object1[i]);
                        } else {
                            target[i] = object1[i];
                        }
                    }
                }
            }

            return target;
        }

        /**
         * Check if value is not null or undefined
         * @param value
         * @returns {boolean}
         */
        function isNotNull(value) {
            return value != null && typeof value != 'undefined';
        }

        /**
         * Check if value is null or undefined
         * @param value
         * @returns {boolean}
         */
        function isNull(value) {
            return value == null || typeof value == 'undefined';
        }

        function getDynamicStorage() {

            var dynamicStorage = (window.inBrowser) ? sessionStorage : localStorage;
            if(window.location.href.indexOf("forceLocal=true") > -1) {
                dynamicStorage = localStorage;
            }
            if(window.location.href.indexOf("forceLocal=false") > -1) {
                dynamicStorage = sessionStorage;
            }

            return dynamicStorage;
        }

        this.isValidUrl = isValidUrl;
        this.encodeParams = encodeParams;
        this.isFunction = isFunction;
        this.doCallback = doCallback;
        this.setObject = setObject;
        this.set = set;
        this.getObject = getObject;
        this.get = get;
        this.removeAll = removeAll;
        this.extend = extend;
        this.isNotNull = isNotNull;
        this.isNull = isNull;
        this.getDynamicStorage = getDynamicStorage;

    }

    return new Utils();

});
