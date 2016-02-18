define([
    'Ctl.speakeasy.Config',
    'Ctl.common.Logger',
    'Ctl.common.Promise',
    'Ctl.common.Ajax',
    'Ctl.common.Utils'
], function (Config, Logger, Promise, Ajax, Utils) {

    /**
     * Manage calls
     *
     * @requires Config
     * @requires Logger
     * @requires Promise
     * @requires Ajax
     * @requires Utils
     */
    function Call() {

        var logger = new Logger('Call');

        var p = new Promise();

        /**
         * Get all calls
         *
         */
        function answer() {
        }

        /**
         * Get active call
         *
         */
        function hangUp() {
        }

        /**
         * Load CneturyLink API
         *
         */
        function hold(callback) {
        }

        this.answer = answer;
        this.hangUp = hangUp;
        this.hold = hold;
    }

    return new Call();

});
