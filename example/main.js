require(['CtlApiLoader'], function(CtlApiLoader){

    var username = 'test01',
        password = 'password1234';

    // authenticate
    CtlApiLoader.authenticate(username, password, function() {
        console.info('Successfully authenticated. Now you can load any CenturyLink API.');
        loadSpeakEasy();
    });

    function loadSpeakEasy() {
        // use the sdk for your needs, this call should load SpeakEasy API Client
        CtlApiLoader.load('SpeakEasy', '0.1.0', function(err, speakEasy) {

            if (err) {
                console.log('Error loading SpeakEasy');
                console.log(err);
            } else {
                console.log('SpeakEasy has been loaded');
                speakEasy.sayHello();
            }

        });
    }

});
