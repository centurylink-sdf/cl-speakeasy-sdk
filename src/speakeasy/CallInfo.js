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
            return Object.keys(calls).length;
        }

        /**
         * Get active call
         * @return {Object} Current call object
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

        /**
         * Add call to the list of calls
         * @param {Object}  call      Call object
         * @param {Boolean} isCurrent determines if it is current call
         */
        function addCall(call, isCurrent) {

            var callId = call.getCallId();

            console.log('adding the call: ' + callId);

            self.calls[callId] = call;

            if(isCurrent) {
                console.log('Set as current');
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
         * Delete call from existing calls and make next call as current
         * @private
         * @param callId
         */
        function deleteCall(callId) {

            console.log('Deleting call ' + callId);

            var callToDelete = self.get(callId);
            if(callToDelete) {
                console.log('Call found, deleting...');
                delete self.calls[callId];

                console.log(self.calls);

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
