define(function(){

        function BaseRequest(){
            this.requestHeaders = [
                [ 'Content-Type', 'application/x-www-form-urlencoded' ],
                [ 'Accept', 'application/json' ],
                [ 'Authorization', this.accessToken ? 'Bearer ' + this.accessToken : '']
            ];
        }

        BaseRequest.prototype = {
            getRequestHeaders: function(){
                return this.requestHeaders;
            }
        };

        return BaseRequest;
    }
);
