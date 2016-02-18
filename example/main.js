require(['Ctl'], function(Ctl){

    var username = 'test01',
        password = 'password1234';

    console.log('Running CtlApi v' + Ctl.version());

    // authenticate
    Ctl.authenticate(username, password, function(error, response) {
        if (!error) {
            console.info('Successfully authenticated. Now you can load any CenturyLink API.');
            loadSpeakEasy();
        } else {
            console.error('Authentication failed: ', error);
        }
    });

    function loadSpeakEasy() {
        // use the sdk for your needs, this call should load SpeakEasy API Client
        Ctl.load('SpeakEasy', '0.1.0', function(err, speakEasy) {

            if (err) {
                console.log('Error loading SpeakEasy');
                console.log(err);
            } else {
                console.log('SpeakEasy has been loaded');
                console.log('Running SpeakEasy v' + speakEasy.version());

                var callButton = document.getElementById('callButton');
                callButton.addEventListener("click", function() {
                    speakEasy.CallManager.createCall('7202839129');
                });
                
            }

        });
    }

});
