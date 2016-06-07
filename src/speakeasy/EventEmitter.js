define([
    'Ctl/Promise'
], function (
    Promise
) {

    /**
     * @class Ctl.EventEmitter
     * @private
     * @singleton
     */
    function EventEmitter() {

        var self = this;
        self.subscribedEvents = {};

        self.events = {
            ON_DELETE_CALL: 'ON_DELETE_CALL',
            BEFORE_ANSWER_CALL: 'BEFORE_ANSWER_CALL',
            BEFORE_UNHOLD: 'BEFORE_UNHOLD',

            CALL_RINGING: 'CALL_RINGING',
            CALL_STARTED: 'CALL_STARTED',
            CALL_ENDED: 'CALL_ENDED',
            CALL_HELD: 'CALL_HELD',
            CALL_REMOTE_HELD: 'CALL_REMOTE_HELD',
            CALL_REJECTED: 'CALL_REJECTED'
        };

        /**
         * Subscripbe for an event
         * @param  {Object}   event    event to subscribe
         * @param  {Function} callback callback for handled event
         * @return {Object}            EventEmitter
         */
        function on(event, callback) {
            if (!self.subscribedEvents[event]) {
                self.subscribedEvents[event] = [];
            }
            self.subscribedEvents[event].push({ context: self, callback: callback });
            return self;
        }

        /**
         * Trigger event
         * @param  {Object} event        event to trigger
         * @param  {Boolean} usePromises use promises or not
         * @return {Object}              EventEmitter
         */
        function trigger(event, usePromises) {
            if (!self.subscribedEvents[event]) return false;
            var args = Array.prototype.slice.call(arguments, 2),
                promises = [];

            for (var i = 0, l = self.subscribedEvents[event].length; i < l; i++) {
                var subscription = self.subscribedEvents[event][i];
                if(usePromises) {
                    promises.push(subscription.callback.apply(subscription.context, args));
                }
                else {
                    subscription.callback.apply(subscription.context, args);
                }
            }

            if(usePromises) {
                return Promise.chain(promises);
            }
            else {
                return self;
            }
        }

        this.on = on;
        this.trigger = trigger;
    }

    return new EventEmitter();
});
