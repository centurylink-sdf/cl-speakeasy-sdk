define([
    'Ctl/Utils'
], function (
    Utils
) {

    /**
     * Promise implementation
     * @class Ctl.Promise
     * @author Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @docauthor Andrew Kovalenko <andrew@jaybirdgroup.com>
     * @private
     * @requires Ctl.Utils
     */
    function Promise() {
        this.complete = false;
        this.error = null;
        this.result = null;
        this.callbacks = [];
    }

    /**
     * Promise implementation for callback
     * @param  {Function} callback Call once promise mits requirement
     * @param  {Object}   context  [description]
     * @return {[type]}            [description]
     */
    Promise.prototype.then = function(callback, context) {
        var f = function() {
            return callback.apply(context, arguments);
        };
        if (this.complete) {
            f(this.error, this.result);
        } else {
            this.callbacks.push(f);
        }
    };

    /**
     * Add handlers to be called when the Deferred object is resolved
     * @param  {Object}   error  Fired error in case of failure
     * @param  {Object}   result Result
     */
    Promise.prototype.done = function(error, result) {
        this.complete = true;
        this.error = error;
        this.result = result;
        if (this.callbacks) {
            for (var i = 0; i < this.callbacks.length; i++) { this.callbacks[i](error, result); }
            this.callbacks.length = 0;
        }
    };

    /**
     * Utility method to join promises
     * @param  {Ctl.Promise} promises Array of promises
     * @return {Ctl.Promise} p
     */
    Promise.join = function(promises) {
        var p = new Promise(), total = promises.length, completed = 0, errors = [], results = [];
        function notifier(i) {
            return function(error, result) {
                completed += 1;
                errors[i] = error;
                results[i] = result;
                if (completed === total) {
                    p.done(errors, results);
                }
            };
        }
        for (var i = 0; i < total; i++) {
            if(Utils.isFunction(promises[i])) {
                promises[i]().then(notifier(i));
            }
            else {
                promises[i].then(notifier(i));
            }
        }
        return p;
    };

    /**
     * Utility method to chain Deferred
     * @param  {Ctl.Promise} promises Array of promises
     * @param  {Object} error    Error if failed
     * @param  {Object} result   Result if success
     * @return {Ctl.Promise}     Promise
     */
    Promise.chain = function(promises, error, result) {
        var p = new Promise();
        if (promises === null || promises.length === 0) {
            p.done(error, result);
        } else {

            function processPromise(err, res) {
                promises.splice(0, 1);
                //self.logger.info(promises.length)
                if (promises) {
                    Promise.chain(promises, err, res).then(function(e, r) {
                        p.done(e, r);
                    });
                } else {
                    p.done(err, res);
                }
            }

            if(Utils.isFunction(promises[0])) {
                promises[0](error, result).then(processPromise);
            }
            else {
                promises[0].then(processPromise);
            }
        }
        return p;
    };

    return Promise;
});
