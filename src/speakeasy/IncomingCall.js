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
     *
     * @param successCallback
     * @param failureCallback
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
     *
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
