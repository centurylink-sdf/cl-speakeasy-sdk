define(['Ctl.model.request/AccessTokenRequest'], function(AccessTokenRequest){
    describe("A spec to test AccessTokenRequest module", function(){
        var request;

        beforeEach(function(){
            request = new AccessTokenRequest("test02", "password1234");
        });


        it("should fire AccessTokenRequest objectify method", function(){
            
            var username = request.objectify().username;
            var password = request.objectify().password;

            expect(username).toEqual("test02");
            expect(password).toEqual("password1234");
        });
    });
});
