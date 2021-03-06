define([
    'Ctl.speakeasy/Config',
    'Ctl/Logger'
], function (
    Config,
    Logger
) {

    /**
     * @class Ctl.speakeasy.CallInfo
     * Store the current calls information
     *
     * @requires Ctl.speakeasy.Config
     * @requires Ctl.Logger
     */
    function CallInfo() {

        var self = this;
        self.logger = new Logger('CallInfo');
        self.calls = [];
        self.currentCall = null;

        /**
         * Get all calls
         * @return List of call objects
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
            return calls.length;
        }

        /**
         * Get active call
         * @return {Ctl.speakeasy.IncomingCall | Ctl.speakeasy.OutgoingCall} Current incoming  or outgoing call object
         */
        function getCurrentCall() {
            return self.currentCall;
        }

        /**
         * Set active call
         * @param {Ctl.speakeasy.IncomingCall | Ctl.speakeasy.OutgoingCall} call Incoming  or outgoing call object
         */
        function setCurrentCall(call) {
            self.currentCall = call;
        }

        /**
         * Add call to the list of calls
         * @param {Ctl.speakeasy.IncomingCall | Ctl.speakeasy.OutgoingCall} call Incoming  or outgoing call object
         * @param {Boolean} isCurrent determines if it is current call
         */
        function addCall(call, isCurrent) {

            var callId = call.getCallId();
            self.calls.splice(callId,0, call);
            if(isCurrent) {
                self.currentCall = call;
            }
        }

        /**
         * Get call by callID
         *
         * @param   {String} callID
         * @return  {Ctl.speakeasy.IncomingCall | Ctl.speakeasy.OutgoingCall} Incoming  or outgoing call object
         */
        function get(callID) {
            var result = self.calls.filter(function( call ) {
                return call.id == callID;
            });
            if(result.length > 0) {
                return result[0];
            }
            else {
                return null;
            }
        }

        /**
         * Delete call from existing calls and make next call as current
         * @private
         * @param callId
         */
        function deleteCall(callId) {
            var callToDelete = self.get(callId);
            if(callToDelete) {
                for (var i = self.calls.length - 1; i >= 0; i--) {
                    if (self.calls[i].id == callId) {
                        self.calls.splice(i, 1);
                    }
                }
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

        this.getCalls = getCalls;
        this.getCallsCount = getCallsCount;
        this.getCurrentCall = getCurrentCall;
        this.setCurrentCall = setCurrentCall;
        this.get = get;
        this.addCall = addCall;
        this.deleteCall = deleteCall;
    }

    return new CallInfo();

});
