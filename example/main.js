require(['ApiLoader'], function(Ctl){

    var username = 'test01',
        password = 'password1234';

    console.log('Running CtlApi v' + Ctl.version());

    // login into CTL service
    Ctl.Auth.login(username, password, function(error, response) {
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

                var confDestination = document.getElementById('confDestination');
                var btnMakeCall = document.getElementById('btnMakeCall');
                var btnEndCall = document.getElementById('btnEndCall');
                var btnStartVideo = document.getElementById('btnStartVideo');
                var btnStopVideo = document.getElementById('btnStopVideo');
                var btnHoldCall = document.getElementById('btnHoldCall');
                var btnUnHoldCall = document.getElementById('btnUnHoldCall');

                btnMakeCall.addEventListener("click", function (e) {
                    var numToCall = confDestination.value;
                    speakEasy.CallManager.createCall(numToCall);
                });

                btnEndCall.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.end(function() {
                        showInfoMessage("Call is ended!");
                    }, function() {
                        showErrorMessage("Call couldn't be ended!");
                    });
                });

                btnStartVideo.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.videoStart(
                       function() {
                           showInfoMessage("Video is started!");
                       },
                       function() {
                           showErrorMessage("Video couldn't be started!");
                       }
                   );
                });

                btnStopVideo.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.videoStop(
                       function() {
                           showInfoMessage("Video is stopped!");
                       },
                       function() {
                           showErrorMessage("Video couldn't be stopped!");
                       }
                   );
                });

                // btnHoldCall.addEventListener("click", function (e) {
                // });
                //
                // btnUnHoldCall.addEventListener("click", function (e) {
                // });

            }

        });
    }

});

// Utility function to show error messages
function showErrorMessage(msg) {
    showMessage(msg, "alert alert-danger");
}
// Utility function to show info messages
function showInfoMessage(msg) {
    showMessage(msg, "alert alert-info");
}
// Utility function to show info success messages
function showSuccessMessage(msg) {
    showMessage(msg, "alert alert-success");
}
// Utility function to show warning messages
function showWarningMessage(msg) {
    showMessage(msg, "alert alert-warning");
}

function showMessage(msg, classNames) {
    var logContainer = document.getElementById('logContainer');
    var elChild = document.createElement("div");
    elChild.className = classNames;
    elChild.innerHTML = msg;
    logContainer.insertBefore(elChild, logContainer.firstChild);
}
