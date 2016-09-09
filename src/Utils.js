define([], function () {

    /**
     * This module is a collection of classes designed to make working with
     * the CenturyLink Services API as easy as possible.
     *
     * @class Ctl.Utils
     * @private
     *
     */
    function Utils() {

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

        function setObject(key, value) {
            if (value) {
                value = JSON.stringify(value);
            }
            this.set(key, value);
        }

        function set(key, value) {
            var keyStore = "ctlapi_" + key;
            this[key] = value;
            if (typeof Storage !== "undefined") {
                if (value) {
                    localStorage.setItem(keyStore, value);
                } else {
                    localStorage.removeItem(keyStore);
                }
            }
        }

        function getObject(key) {
            return JSON.parse(this.get(key));
        }

        function get(key) {
            var keyStore = "ctlapi_" + key;
            var value = null;
            if (this[key]) {
                value = this[key];
            } else if (typeof Storage !== "undefined") {
                value = localStorage.getItem(keyStore);
            }
            return value;
        }

        function removeAll() {
            for (var i = localStorage.length; i--;){
                // if (localStorage.key(i).indexOf('ctlapi_') > -1) {
                    localStorage.removeItem(localStorage.key(i));
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
                Object.keys(object1).forEach(function(key) {
                    target[ key ] = object1[ key ];
                });
            }

            return target;
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

    }

    return new Utils();

});
