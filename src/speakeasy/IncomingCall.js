define([
    'Ctl.speakeasy/BaseCall',
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils'
], function (BaseCall, Config, Logger, Promise, Ajax, Utils) {

    var self = null;

    /**
     * @class Ctl.speakeasy.IncomingCall
     * Manage calls
     *
     * @requires Config
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function IncomingCall() {
        BaseCall.apply(this, arguments);

        self = this;
    }

    /**
     *
     * @param successCallback
     * @param failureCallback
     */
    function answer(successCallback, failureCallback) {

        self.internalCall.answer(
            function () {
                self.logger.info("You are on call.");
                Utils.doCallback(successCallback);
            },
            function () {
                self.logger.error("Call answer is failed!");
                Utils.doCallback(failureCallback);
            });
    }

    /**
     *
     * @param successCallback
     * @param failureCallback
     */
    function reject(successCallback, failureCallback) {

        self.internalCall.reject(
            function () {
                self.logger.info("Rejected incomming call...");
                Utils.doCallback(successCallback);
            },
            function () {
                self.logger.error("Call reject is failed!");
                Utils.doCallback(failureCallback);
            });
    }

    /**
     *
     */
    function getCallerInfo() {

    }

    IncomingCall.prototype = Object.create(BaseCall.prototype);
    IncomingCall.prototype.constructor = IncomingCall;

    IncomingCall.prototype.answer = answer;
    IncomingCall.prototype.reject = reject;
    IncomingCall.prototype.getCallerInfo = getCallerInfo;

    return IncomingCall;
});
