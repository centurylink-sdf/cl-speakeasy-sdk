define(function(){

        function BaseRequest(){
            this.requestHeaders = [
                [ "Content-Type", "application/x-www-form-urlencoded" ],
                [ "Accept", "application/json" ],
                [ "Authorization", "Bearer " + this.accessToken]
            ];
        }

        return BaseRequest;
    }
);
