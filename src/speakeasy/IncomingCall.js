define([
    'Ctl.speakeasy/BaseCall',
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils',
    'Ctl.speakeasy/CallInfo'
], function (
    BaseCall,
    Config,
    Logger,
    Promise,
    Ajax,
    Utils,
    CallInfo
) {

    var self = null;

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

        self = this;
    }

    /**
     * Answers the call
     * @param {Function} successCallback The callback function to be called after success
     * @param {Function} failureCallback The callback function to be called after failure
     */
    function answer(successCallback, failureCallback) {

        var p = CallInfo.triggerEvent(CallInfo.events.BEFORE_ANSWER_CALL, self.id);

        p.then(function(error) {

            if(error) {
                Utils.doCallback(failureCallback);
            }
            else {
                self.fcsCall.answer(
                    function () {
                        self.logger.info("You are on call.");

                        CallInfo.setCurrentCall(self);
                        Utils.doCallback(successCallback);
                    },
                    function () {
                        self.logger.error("Call answer is failed!");
                        Utils.doCallback(failureCallback);
                    });
            }
        });
    }

    /**
     * Rejects the call
     * @param {Function} successCallback The callback function to be called after success
     * @param {Function} failureCallback The callback function to be called after failure
     */
    function reject(successCallback, failureCallback) {

        self.fcsCall.reject(
            function () {
                self.logger.info("Rejected incomming call...");
                CallInfo.triggerEvent(CallInfo.events.ON_DELETE_CALL, self.id);
                Utils.doCallback(successCallback);
            },
            function () {
                self.logger.error("Call reject is failed!");
                Utils.doCallback(failureCallback);
            });
    }

    /**
     * Gets caller information
     * @returns {Object} The caller information
     * @returns {String} return.name The name of the caller
     * @returns {String} return.number The number of the caller
     */
    function getCallerInfo() {

        if(self.fcsCall) {
            return {
                name: self.fcsCall.callerName,
                number: self.fcsCall.callerNumber
            }
        }

        return null;
    }

    IncomingCall.prototype = Object.create(BaseCall.prototype);
    IncomingCall.prototype.constructor = IncomingCall;

    IncomingCall.prototype.answer = answer;
    IncomingCall.prototype.reject = reject;
    IncomingCall.prototype.getCallerInfo = getCallerInfo;

    return IncomingCall;
});
