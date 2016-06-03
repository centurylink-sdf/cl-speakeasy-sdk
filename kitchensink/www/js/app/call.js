define(['jquery', 'CtlApiLoader'], function($, Ctl) {

    var _speakEasy = null;
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

                _speakEasy = speakEasy;

                console.log('SpeakEasy has been loaded');
                console.log('Running SpeakEasy v' + speakEasy.version());

                var userName = Ctl.Auth.getLoginUsername();

                $('#userName').html(userName);

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

                    addCall(call.getCallId(), { name: callerInfo.name, number: callerInfo.number, status: 'Incoming' });

                    // Call dialog box
                    var r = confirm("Incoming call from "+ callerInfo.name +"(" + callerInfo.number + ")! Would you like to answer?");
                    if (r === true) {
                        // Answering on the incoming call
                        call.answer(function() {
                            showInfoMessage("Call is answered!");
                            updateCallButtonsGroup();
                        }, function() {
                            showErrorMessage("Call couldn't be answered!");
                        });
                    } else {
                        // Rejecting the incomming call
                        call.reject(function() {

                        }, function() {
                            showErrorMessage("Call couldn't be rejected!");
                        });
                    }
                };

                btnMakeCall.addEventListener("click", function (e) {
                    var numToCall = confDestination.value;

                    $("#btnGroupCall").show();
                    confDestination.value = '';

                    speakEasy.CallManager.createCall(numToCall, false, function(call) {
                        updateCallButtonsGroup();
                        attachCallListeners(call);
                        addCall(call.getCallId(), { name: '', number: numToCall, status: 'Ringing' });
                    }, function() {
                        showErrorMessage("Make new call failed!");
                    });
                });

                btnEndCall.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.hangUp(function() {

                        updateCallButtonsGroup();

                        updateCallStatus(currentCall.getCallId(), 'Ended');
                        setTimeout(function() {
                            removeCall(currentCall.getCallId());
                        }, 1000);
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
                           $(btnStartVideo).hide();
                           $(btnStopVideo).show();
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
                           $("#localVideoContainer").hide();
                           $(btnStopVideo).hide();
                           $(btnStartVideo).show();
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
                            $(btnHoldCall).hide();
                            $(btnUnHoldCall).show();
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
                            $(btnUnHoldCall).hide();
                            $(btnHoldCall).show();
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
                    $(btnMute).hide();
                    $(btnUnMute).show();
                });

                btnUnMute.addEventListener("click", function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    currentCall.unmute();
                    showInfoMessage("Call is unmuted!");
                    $(btnUnMute).hide();
                    $(btnMute).show();
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

                confDestination.addEventListener("keydown", function (e) {
                    var keyCode = e.keyCode;
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    if (currentCall) {
                        console.log('keyCode = ' + keyCode);
                        var keyStr = String.fromCharCode(keyCode);

                        var regexKey = /[0-9]|[#]|[*]/;
                        if (regexKey.test(keyStr)) {
                            currentCall.sendDTMF(keyStr);
                        }

                    }
                },
                false);
            }
        });
    }

    function addCall(callId, callInfo) {

        var callsTable = $('#currentCalls');
        var $callRow = $('<tr></tr>').attr('data-id', callId).addClass('active');

        $callRow.append(['<td>', callInfo.name, '</td>'].join(''));
        $callRow.append(['<td>', callInfo.number, '</td>'].join(''));
        $callRow.append(['<td class="js-status">', callInfo.status, '</td>'].join(''));

        callsTable.find('tbody').append($callRow);
        $("#noCallsRow").hide();

        $callRow.click(function() {
            var callId = $(this).attr('data-id');
            _speakEasy.CallManager.switchTo(callId, function() {
                updateCallButtonsGroup();
                showInfoMessage("The call has switched successfully");
                $('#currentCalls').find('tr').removeClass('active');
                $(this).addClass('active');
            },
            function() {
                showErrorMessage("The call switch are failed");
            })
        });
    }

    function updateCallStatus(callId, status) {

        var $callRow = $('#currentCalls').find('tr[data-id="'+callId+'"]');
        $callRow.find('.js-status').text(status);
    }

    function removeCall(callId) {
        var $callRow = $('#currentCalls').find('tr[data-id="'+callId+'"]');
        $callRow.remove();

        if(_speakEasy.CallManager.getCallsCount() == 0) {
            $("#noCallsRow").show();
        }
    }

    function updateCallButtonsGroup() {

        var callsCount = _speakEasy.CallManager.getCallsCount();

        if(callsCount > 0) {
            var call = _speakEasy.CallManager.getCurrentCall();

            if(call.isMuted) {
                $(btnMute).hide();
                $(btnUnMute).show();
            }
            else {
                $(btnUnMute).hide();
                $(btnMute).show();
            }

            if(call.isVideoStarted) {
                $(btnStartVideo).hide();
                $(btnStopVideo).show();
                $("#localVideoContainer").show();
            }
            else {
                $("#localVideoContainer").hide();
                $(btnStopVideo).hide();
                $(btnStartVideo).show();
            }

            if(call.isOnHold()) {
                $(btnHoldCall).hide();
                $(btnUnHoldCall).show();
            }
            else {
                $(btnUnHoldCall).hide();
                $(btnHoldCall).show();
            }

            $("#btnGroupCall").show();
        }
        else {
            $("#btnGroupCall").hide();
        }
    }

    function attachCallListeners(call) {
        call.onStateChanged = function(state) {
            var callId = call.getCallId();
            switch (state) {
                case call.events.CALL_RINGING:
                    showInfoMessage("Ringing!");
                    updateCallStatus(callId, 'Ringing');
                    break;
                case call.events.CALL_STARTED:
                    showInfoMessage("Call is started!");
                    updateCallStatus(callId, 'In Call');
                    break;
                case call.events.CALL_ENDED:
                    showInfoMessage("Call was ended on other side!");

                    updateCallStatus(callId, 'Ended');
                    setTimeout(function() {
                        removeCall(callId);
                    }, 1000);

                    updateCallButtonsGroup();

                    break;
                case call.events.CALL_HELD:
                    showInfoMessage("Call is held!");
                    updateCallStatus(callId, 'Hold');
                    break;
                case call.events.CALL_REMOTE_HELD:
                    showInfoMessage("Call was held on other side!");
                    updateCallStatus(callId, 'Remote hold');
                    updateCallButtonsGroup();
                    break;
                case call.events.CALL_REJECTED:
                    showInfoMessage("Call was rejected!");
                    updateCallStatus(callId, 'Rejected');
                    updateCallButtonsGroup();
                    setTimeout(function() {
                        removeCall(callId);
                    }, 1000);

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
