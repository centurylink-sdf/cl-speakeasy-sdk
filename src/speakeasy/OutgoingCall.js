define([
    'Ctl.speakeasy/BaseCall',
    'Ctl.speakeasy/Config',
    'Ctl/Logger',
    'Ctl/Promise',
    'Ctl/Ajax',
    'Ctl/Utils'
], function (
    BaseCall,
    Config,
    Logger,
    Promise,
    Ajax,
    Utils
) {

    var self = null;

    /**
     * @class Ctl.speakeasy.OutgoingCall
     * @extends Ctl.speakeasy.BaseCall
     * Manage calls
     *
     * @requires Config
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function OutgoingCall() {
        BaseCall.apply(this, arguments);

        self = this;
    }

    /**
     *
     */
    function getCalleeInfo() {

    }

    OutgoingCall.prototype = Object.create(BaseCall.prototype);
    OutgoingCall.prototype.constructor = OutgoingCall;

    OutgoingCall.prototype.getCalleeInfo = getCalleeInfo;

    return OutgoingCall;
});
