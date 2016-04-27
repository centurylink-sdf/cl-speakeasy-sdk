define(['jquery', 'ApiLoader'], function($, Ctl) {

    var btnLogin = $('.btn-login');
    var btnLogout = $('.btn-logout');

    if (Ctl.Auth.isAuthenticated()) {
        loadSpeakEasy();
    } else {
        window.location.href = 'index.html';
    }

    function loadSpeakEasy() {

        // use the sdk for your needs, this call should load SpeakEasy API Client
        Ctl.load('SpeakEasy', '0.1.4', function(err, speakEasy) {

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
                var btnMute = document.getElementById('btnMute');
                var btnUnMute = document.getElementById('btnUnMute');

                var btnLogout = document.getElementById('btnLogout');

                speakEasy.CallManager.setup(
                    {
                        localVideoContainer: "localVideo",
                        remoteVideoContainer: "remoteVideo"
                    }
                );

                speakEasy.CallManager.onCallReceived = function (call) {

                    attachCallListeners(call);

                    var callerInfo = call.getCallerInfo();

                    // Call dialog box
                    var r = confirm("Incoming call from "+ callerInfo.name +"(" + callerInfo.number + ")! Would you like to answer?");
                    if (r === true) {
                        // Answering on the incoming call
                        call.answer(function() {
                            showInfoMessage("Call is answered!");
                            $("#btnGroupCall").show();
                        }, function() {
                            showErrorMessage("Call couldn't be answered!");
                        });
                    } else {
                        // Rejecting the incomming call
                        call.reject(function() {
                            showInfoMessage("Call is rejected!");
                        }, function() {
                            showErrorMessage("Call couldn't be rejected!");
                        });
                    }
                };

                btnMakeCall.addEventListener("click", function (e) {
                    var numToCall = confDestination.value;
                    $("#btnGroupCall").show();
                    speakEasy.CallManager.createCall(numToCall, false, function(call) {
                        attachCallListeners(call);
                    });
                });

                btnEndCall.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.hangUp(function() {
                        showInfoMessage("Call is ended!");
                        $("#btnGroupCall").hide();
                    }, function() {
                        showErrorMessage("Call couldn't be ended!");
                    });
                });

                btnStartVideo.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.videoStart(
                       function() {
                           showInfoMessage("Video is started!");
                           $("#localVideoContainer").show();
                       },
                       function() {
                           showErrorMessage("Video couldn't be started!");
                       }
                   );
                });

                btnStopVideo.addEventListener("click", function (e) {

                    // var $toastContent = $('<span>I am toast content</span>');
                    // Materialize.toast($toastContent, 5000);

                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.videoStop(
                       function() {
                           showInfoMessage("Video is stopped!");
                           $("#localVideoContainer").hide();
                       },
                       function() {
                           showErrorMessage("Video couldn't be stopped!");
                       }
                   );
                });

                btnHoldCall.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.hold(
                        function() {
                            showInfoMessage("Call is held!");
                        },
                        function() {
                            showErrorMessage("Call couldn't be held!");
                        }
                    );
                });

                btnUnHoldCall.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.unhold(
                        function() {
                            showInfoMessage("Call is resumed!");
                        },
                        function() {
                            showErrorMessage("Call couldn't be resumed!");
                        }
                    );
                });

                btnMute.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.mute();
                    showInfoMessage("Call is muted!");
                });

                btnUnMute.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.unmute();
                    showInfoMessage("Call is unmuted!");
                });

                btnLogout.addEventListener("click", function (e) {
                    $('#progressLogout').show();
                    speakEasy.logout(function() {
                        showInfoMessage("SpeakEasy logout succeed!");
                        Ctl.logout();
                        $('#progressLogout').hide();
                        window.location.href = 'index.html';
                    },
                    function() {
                        showErrorMessage("SpeakEasy logout has failed!");
                        Ctl.logout();
                        $('#progressLogout').hide();
                        window.location.href = 'index.html';
                    });
                });
            }
        });
    }

    function attachCallListeners(call) {
        call.onStateChanged = function(state) {
            switch (state) {
                case call.events.CALL_RINGING:
                    showInfoMessage("Ringing!");
                    break;
                case call.events.CALL_STARTED:
                    showInfoMessage("Call is started!");
                    break;
                case call.events.CALL_ENDED:
                    showInfoMessage("Call was ended on other side!");
                    $("#btnGroupCall").hide();
                    break;
                case call.events.CALL_HELD:
                    showInfoMessage("Call was held on other side!");
                    break;
                case call.events.CALL_REJECTED:
                    showInfoMessage("Call was rejected!");
                    break;
            }
        }
    }

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

});
