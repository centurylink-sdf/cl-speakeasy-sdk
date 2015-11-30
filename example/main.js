require(['CtlApiLoader'], function(CtlApiLoader){

    var username = 'test01',
        password = 'password1234'

    // authenticate
    // CtlApiLoader.authenticate(username, password, function() {
    //     console.info('Successfully authenticated. Now you can load any CenturyLink API.');
    // });

    // use the sdk for your needs, this call should load SpeakEasy API Client
    CtlApiLoader.load('speakeasy', '0.1.0', function() {
        console.log('SpeakEasy has been loaded');
    });

});
