define(['Promise', 'Auth'], function(Promise, Auth){
    describe('Testing Promise module', function(){
        var p = new Promise();

        beforeEach(function(done){
            p.done(false, 'test');
            done();
        });

        it('Should return result of resolved promise', function(done){
            p.then(function(error, result){
                expect(result).toEqual('test');
                done();
            });
        });
    });

    describe('Testing Auth module', function(){
        var username = 'test01';
        var password = 'password1234';

        beforeEach(function(done){
            Auth.login(username, password, function(){
                console.log(Auth.isAuthenticated());
                done();
            });
        });

        it('should login user', function(done){
            done();
        });
    });
});
