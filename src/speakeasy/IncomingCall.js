define([
    'Ctl.speakeasy/BaseCall',
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'Ctl.speakeasy/EventEmitter',
    'Ctl.speakeasy/CallInfo'
], function (
    BaseCall,
    Config,
    Logger,
    Promise,
    Ajax,
    Utils,
    EventEmitter,
    CallInfo
) {
    /**
     * @class Ctl.speakeasy.IncomingCall
     * @extends Ctl.speakeasy.BaseCall
     * The incoming call implementation
     *
     * @requires Config
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     * @requires CallInfo
     */
    function IncomingCall() {
        BaseCall.apply(this, arguments);

        var self = this;

        self.incoming = true;

        function init() {
            var callerInfo = self.getCallerInfo();

            self.callerName = callerInfo.name;
            self.callerNumber = callerInfo.number;

            if(self.callerNumber.indexOf('@') >= 0 && self.callerNumber.indexOf('secondary') == -1) {
                self.callerNumber = self.callerNumber.substring(0, self.callerNumber.indexOf('@'));
            }

            if (self.callerNumber.indexOf(';transport=UDP') !== -1) {
                self.callerNumber = self.callerNumber.replace(';transport=UDP','');
            }

            self.fcsCall.callerNumber = self.callerNumber;
        }

        /**
         * Answers the call
         * @param {Function} successCallback The callback function to be called after success
         * @param {Function} failureCallback The callback function to be called after failure
         */
        self.answer = function(successCallback, failureCallback) {

            var p = EventEmitter.trigger(EventEmitter.events.BEFORE_ANSWER_CALL, null, true, self.id);

            p.then(function(error) {

                if(error) {
                    Utils.doCallback(failureCallback);
                }
                else {
                    self.fcsCall.answer(
                        function () {
                            self.logger.info("You are on call.");
                            self.ringing = false;
                            CallInfo.setCurrentCall(self);
                            Utils.doCallback(successCallback);
                        },
                        function () {
                            self.logger.error("Call answer is failed!");
                            Utils.doCallback(failureCallback);
                        });
                }
            });
        };

        /**
         * Rejects the call
         * @param {Function} successCallback The callback function to be called after success
         * @param {Function} failureCallback The callback function to be called after failure
         */
        self.reject = function(successCallback, failureCallback) {

            AudiotonesManager.stop(AudiotonesManager.INTERRUPT);

            self.fcsCall.reject(
                function () {
                    self.logger.info("Rejected incomming call...");
                    EventEmitter.trigger(EventEmitter.events.ON_DELETE_CALL, null, true, self.id);
                    self.fcsCall.onStateChange(fcs.call.States.REJECTED);
                    Utils.doCallback(successCallback);
                },
                function () {
                    self.logger.error("Call reject is failed!");
                    Utils.doCallback(failureCallback);
                });
        };

        /**
         * Gets caller information
         * @returns {Object} The caller information
         * @returns {String} return.name The name of the caller
         * @returns {String} return.number The number of the caller
         */
        self.getCallerInfo = function() {

            if(self.fcsCall) {
                return {
                    name: self.fcsCall.callerName,
                    number: self.fcsCall.callerNumber
                }
            }

            return null;
        }

        init();
    }

    IncomingCall.prototype = Object.create(BaseCall.prototype);
    IncomingCall.prototype.constructor = IncomingCall;

    return IncomingCall;
});
