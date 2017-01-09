define([], function () {

    /**
     * Represent the error
     * @class Ctl.Error
     * @author Peter Jashchenko <peter@jaybirdgroup.com>
     * @docauthor Peter Jashchenko <peter@jaybirdgroup.com>
     * @param {String} type The type of error
     * @param {Number} code The error code
     * @param {String} message The error message
     */
    function Error(type, code, message) {
        this.type = type;
        this.code = code;
        this.message = message;
    }

    /**
     * Error types
     * @type {Object}
     */
    Error.Types = {
        LOGIN: 'LOGIN',
        NOTIFICATION: 'NOTIFICATION',
        MEDIA: 'MEDIA',
        CALLING: 'CALLING',
        OTHER: 'OTHER'
    };

    return Error;
});
