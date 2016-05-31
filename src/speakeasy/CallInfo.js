/**
 * Created by Peter on 4/8/2016.
 */
define([
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils'
], function (
    Config,
    Logger,
    Promise,
    Ajax,
    Utils
) {

    /**
     * @class Ctl.speakeasy.CallInfo
     * Store the current calls information
     *
     * @requires Config
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function CallInfo() {

        var self = this;
        self.logger = new Logger('CallInfo');
        self.calls = [];
        self.currentCall = null;


        self.subscribedEvents = {};

        self.events = {
            ON_DELETE_CALL: "ON_DELETE_CALL",
            BEFORE_ANSWER_CALL: "BEFORE_ANSWER_CALL",
            BEFORE_UNHOLD: "BEFORE_UNHOLD"
        };

        /**
         * Get all calls
         *
         */
        function getCalls() {
            return self.calls;
        }

        /**
         * Get total call count
         * @return {int} Calls count
         */
        function getCallsCount() {
            var calls = self.getCalls();
            return Object.keys(calls).length;
        }

        /**
         * Get active call
         *
         */
        function getCurrentCall() {
            return self.currentCall;
        }

        /**
         * Set active call
         * @param call
         */
        function setCurrentCall(call) {
            self.currentCall = call;
        }

        function addCall(call, isCurrent) {

            var callId = call.getCallId();

            self.calls[callId] = call;

            if(isCurrent) {
                self.currentCall = call;
            }
        }

        /**
         * Get call by callID
         *
         * @param   {String} callID
         * @return  {Call} Contains call object with required info
         */
        function get(callID) {
            return self.calls[callID];
        }

        /**
         *
         * @param callId
         */
        function deleteCall(callId) {
            var callToDelete = self.get(callId);
            if(callToDelete) {
                delete self.calls[callId];
                if(self.currentCall.id == callId) {
                    self.currentCall = null;

                    //make previous call as current
                    for (var id in self.calls) {
                        self.currentCall = self.calls[id];
                        break;
                    }
                }
            }
        }

        /**
         *
         * @param event
         * @param callback
         * @returns {Ctl.speakeasy.CallInfo}
         */
        function subscribeEvents(event, callback) {
            if (!self.subscribedEvents[event]) {
                self.subscribedEvents[event] = [];
            }
            self.subscribedEvents[event].push({ context: self, callback: callback });
            return self;
        }

        /**
         *
         * @param event
         * @returns {*}
         */
        function triggerEvent(event) {
            if (!self.subscribedEvents[event]) return false;
            var args = Array.prototype.slice.call(arguments, 1),
                promises = [];

            for (var i = 0, l = self.subscribedEvents[event].length; i < l; i++) {
                var subscription = self.subscribedEvents[event][i];
                promises.push(subscription.callback.apply(subscription.context, args));
            }
            return Promise.chain(promises);
        }

        this.getCalls = getCalls;
        this.getCallsCount = getCallsCount;
        this.getCurrentCall = getCurrentCall;
        this.setCurrentCall = setCurrentCall;
        this.get = get;
        this.addCall = addCall;
        this.deleteCall = deleteCall;
        this.subscribeEvents = subscribeEvents;
        this.triggerEvent = triggerEvent;

    }

    return new CallInfo();

});
