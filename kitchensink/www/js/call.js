var Ctl = CtlApiLoader;

var _speakEasy = null;
var btnLogin = $('.btn-login');
var btnLogout = $('.btn-logout');

// For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.Auth-method-isAuthenticated
if (Ctl.Auth.isAuthenticated()) {
    loadSpeakEasy();
} else {
    window.location.href = 'index.html';
}

function loadSpeakEasy() {

    // Use the sdk for your needs, this call should load SpeakEasy API Client
    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.ctlapiloader.CtlApiLoader-method-load
    Ctl.load('SpeakEasy', '0.1.4', function(err, speakEasy) {

        if (err) {
            console.log(err);
        } else {

            _speakEasy = speakEasy;

            _speakEasy.init(null, null, null, function() {

                console.log('SpeakEasy has been loaded');
                console.log('Running SpeakEasy v' + speakEasy.version());

                // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.Auth-method-getLoginUsername
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

                // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallManager-method-setup
                speakEasy.CallManager.setup(
                    {
                        localVideoContainer: 'localVideo',
                        remoteVideoContainer: 'remoteVideo'
                    }
                );

                // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallManager-event-onCallReceived
                speakEasy.CallManager.onCallReceived = function (call) {

                    attachCallListeners(call);

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.IncomingCall-method-getCallerInfo
                    var callerInfo = call.getCallerInfo();

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-getCallId
                    addCall(call.getCallId(), { name: callerInfo.name, number: callerInfo.number, status: 'Incoming' });

                    // Call dialog box
                    var r = confirm('Incoming call from '+ callerInfo.name +'(' + callerInfo.number + ')! Would you like to answer?');
                    if (r === true) {
                        // Answering on the incoming call
                        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.IncomingCall-method-answer
                        call.answer(function() {
                            showInfoMessage('Call is answered!');
                            updateCallButtonsGroup();
                        }, function() {
                            showErrorMessage('Call couldn\'t be answered!');
                        });
                    } else {
                        // Rejecting the incomming call
                        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.IncomingCall-method-reject
                        call.reject(function() {

                        }, function() {
                            showErrorMessage('Call couldn\'t be rejected!');
                        });
                    }
                };

                btnMakeCall.addEventListener('click', function (e) {
                    var numToCall = confDestination.value;

                    $('#btnGroupCall').show();
                    confDestination.value = '';

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallManager-method-createCall
                    speakEasy.CallManager.createCall(numToCall, false, function(call) {
                        updateCallButtonsGroup();
                        attachCallListeners(call);
                        addCall(call.getCallId(), { name: '', number: numToCall, status: 'Ringing' });
                    }, function() {
                        showErrorMessage('Make new call failed!');
                    });
                });

                btnEndCall.addEventListener('click', function (e) {

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallInfo-method-getCurrentCall
                    var currentCall = speakEasy.CallManager.getCurrentCall();

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-hangUp
                    currentCall.hangUp(function() {

                        showInfoMessage('Call is ended!');

                        updateCallStatus(currentCall.getCallId(), 'Ended');
                        setTimeout(function() {
                            removeCall(currentCall.getCallId());
                            updateCallButtonsGroup();
                        }, 1000);
                    }, function() {
                        showErrorMessage('Call couldn\'t be ended!');
                    });
                });

                btnStartVideo.addEventListener('click', function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-startVideoSend
                    currentCall.startVideoSend(
                       function() {
                           showInfoMessage('Video is started!');
                           $('#localVideoContainer').show();
                           $(btnStartVideo).hide();
                           $(btnStopVideo).show();
                       },
                       function() {
                           showErrorMessage('Video couldn\'t be started!');
                       }
                   );
                });

                btnStopVideo.addEventListener('click', function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-stopVideoSend
                    currentCall.stopVideoSend(
                       function() {
                           showInfoMessage('Video is stopped!');
                           $('#localVideoContainer').hide();
                           $(btnStopVideo).hide();
                           $(btnStartVideo).show();
                       },
                       function() {
                           showErrorMessage('Video couldn\'t be stopped!');
                       }
                   );
                });

                btnHoldCall.addEventListener('click', function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-hold
                    currentCall.hold(
                        function() {
                            $(btnHoldCall).hide();
                            $(btnUnHoldCall).show();
                        },
                        function() {
                            showErrorMessage('Call couldn\'t be held!');
                        }
                    );
                });

                btnUnHoldCall.addEventListener('click', function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-unhold
                    currentCall.unhold(
                        function() {
                            $(btnUnHoldCall).hide();
                            $(btnHoldCall).show();
                        },
                        function() {
                            showErrorMessage('Call couldn\'t be resumed!');
                        }
                    );
                });

                btnMute.addEventListener('click', function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-mute
                    currentCall.mute();
                    showInfoMessage('Call is muted!');
                    $(btnMute).hide();
                    $(btnUnMute).show();
                });

                btnUnMute.addEventListener('click', function (e) {
                    var currentCall = speakEasy.CallManager.getCurrentCall();

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-unmute
                    currentCall.unmute();
                    showInfoMessage('Call is unmuted!');
                    $(btnUnMute).hide();
                    $(btnMute).show();
                });

                btnLogout.addEventListener('click', function (e) {
                    $('#progressLogout').show();

                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.SpeakEasy-method-logout
                    speakEasy.logout(function() {
                        showInfoMessage('SpeakEasy logout succeed!');
                        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.Auth-method-logout
                        Ctl.logout();
                        $('#progressLogout').hide();
                        window.location.href = 'index.html';
                    },
                    function() {
                        showErrorMessage('SpeakEasy logout has failed!');
                        Ctl.logout();
                        $('#progressLogout').hide();
                        window.location.href = 'index.html';
                    });
                });

                confDestination.addEventListener('keydown', function (e) {
                    var keyCode = e.keyCode;
                    console.log('keyCode = ' + keyCode);
                    var keyStr = String.fromCharCode(keyCode);
                    var regexKey = /[0-9]|[#]|[*]/;
                    var currentCall = speakEasy.CallManager.getCurrentCall();
                    if (currentCall) {
                        if (regexKey.test(keyStr)) {
                            // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-sendDigits
                            currentCall.sendDigits(keyStr);
                        }
                    }
                    else {
                        if (regexKey.test(keyStr)) {
                            // just play dialtone
                            speakEasy.CallManager.dialTonePlay(keyStr);
                        }
                    }
                },
                false);

            })

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
    $('#noCallsRow').hide();

    $callRow.click(function() {
        var callId = $(this).attr('data-id');
        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallManager-method-switchTo
        _speakEasy.CallManager.switchTo(callId, function() {
            updateCallButtonsGroup();
            showInfoMessage('The call has switched successfully');
            $('#currentCalls').find('tr').removeClass('active');
            $(this).addClass('active');
        },
        function() {
            showErrorMessage('The call switch are failed');
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

    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallManager-method-getCallsCount
    if(_speakEasy.CallManager.getCallsCount() === 0) {
        $('#noCallsRow').show();
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
            $('#localVideoContainer').show();
        }
        else {
            $('#localVideoContainer').hide();
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

        $('#btnGroupCall').show();
    }
    else {
        $('#btnGroupCall').hide();
    }
}

function attachCallListeners(call) {

    var callId = call.getCallId();

    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-on
    call.on('CALL_RINGING', function() {
        showInfoMessage('Ringing!');
        updateCallStatus(callId, 'Ringing');
    });

    call.on('CALL_STARTED', function() {
        showInfoMessage('Call is started!');
        updateCallStatus(callId, 'In Call');
        updateCallButtonsGroup();
    });

    call.on('CALL_ENDED', function() {
        showInfoMessage('Call was ended on other side!');

        updateCallStatus(callId, 'Ended');
        setTimeout(function() {
            removeCall(callId);
        }, 1000);

        updateCallButtonsGroup();
    });

    call.on('CALL_HELD', function() {
        showInfoMessage('Call is held!');
        updateCallStatus(callId, 'Hold');
    });

    call.on('CALL_REMOTE_HELD', function() {
        showInfoMessage('Call was held on other side!');
        updateCallStatus(callId, 'Remote hold');
        updateCallButtonsGroup();
    });

    call.on('CALL_REJECTED', function() {
        showInfoMessage('Call was rejected!');
        updateCallStatus(callId, 'Rejected');
        updateCallButtonsGroup();
        setTimeout(function() {
            removeCall(callId);
        }, 1000);
    });

}

// Utility functions to show error|info|success|warning messages
function showErrorMessage(msg) {
    showMessage(msg, 'alert alert-danger');
}

function showInfoMessage(msg) {
    showMessage(msg, 'alert alert-info');
}

function showSuccessMessage(msg) {
    showMessage(msg, 'alert alert-success');
}

function showWarningMessage(msg) {
    showMessage(msg, 'alert alert-warning');
}

function showMessage(msg, classNames) {
    var logContainer = document.getElementById('logContainer');
    var elChild = document.createElement('div');
    elChild.className = classNames;
    elChild.innerHTML = msg;
    logContainer.insertBefore(elChild, logContainer.firstChild);
}
