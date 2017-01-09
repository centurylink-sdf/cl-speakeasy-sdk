var CtlSpeakEasy = SpeakEasy;

console.log('SpeakEasy has been loaded');
console.log('Running SpeakEasy v' + CtlSpeakEasy.version());

// For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.Auth-method-isAuthenticated
if (CtlSpeakEasy.Auth.isAuthenticated()) {
    initSpeakEasy();
} else {
    window.location.href = 'index.html';
}

function initSpeakEasy() {

    CtlSpeakEasy.init(null, null, null, function() {

        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.Auth-method-getLoginUsername
        var userName = CtlSpeakEasy.Auth.getLoginUsername();
        $('#userName').html(userName);

        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallManager-method-setup
        CtlSpeakEasy.CallManager.setup(
            {
                localVideoContainer: 'localVideo',
                remoteVideoContainer: 'remoteVideo'
            }
        );

        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallManager-event-onCallReceived
        CtlSpeakEasy.CallManager.onCallReceived = function (call) {

            // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.IncomingCall-method-getCallerInfo
            var callerInfo = call.getCallerInfo();
            var incomingCallId = call.getCallId();

            // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-getCallId
            addCall(incomingCallId, { name: callerInfo.name, number: callerInfo.number, status: 'Incoming' });

            // Call dialog box
            var r = confirm('Incoming call from '+ callerInfo.name +'(' + callerInfo.number + ')! Would you like to answer?');
            if (r === true) {
                // Answering on the incoming call
                // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.IncomingCall-method-answer
                call.answer(function() {
                    showInfoMessage('Call is answered!');
                    attachCallListeners(call);
                    updateCallButtonsGroup();
                }, function() {
                    removeCall(incomingCallId);
                    showErrorMessage('Call couldn\'t be answered!');
                });
            } else {
                // Rejecting the incomming call
                // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.IncomingCall-method-reject
                call.reject(function() {
                    removeCall(incomingCallId);
                }, function() {
                    removeCall(incomingCallId);
                    showErrorMessage('Call couldn\'t be rejected!');
                });
            }
        };

    }, function(error) {
        showErrorMessage(error.message);
    });

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

    btnMakeCall.addEventListener('click', function (e) {
        var numToCall = confDestination.value;
        var isVideoCall = false;

        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallManager-method-createCall
        CtlSpeakEasy.CallManager.createCall(numToCall, isVideoCall, function(call) {

            $('#btnGroupCall').show();
            confDestination.value = '';

            if(isVideoCall) {
                $('#localVideoContainer').show();
            }

            updateCallButtonsGroup();
            attachCallListeners(call);
            addCall(call.getCallId(), { name: '', number: numToCall, status: 'Ringing' });
        }, function(error) {
            if(error) {
                showErrorMessage(error.message);
            }
            else {
                showErrorMessage('Make new call failed!');
            }
        });
    });

    btnEndCall.addEventListener('click', function (e) {

        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.CallInfo-method-getCurrentCall
        var currentCall = CtlSpeakEasy.CallManager.getCurrentCall();

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
        var currentCall = CtlSpeakEasy.CallManager.getCurrentCall();

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
        var currentCall = CtlSpeakEasy.CallManager.getCurrentCall();

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
        var currentCall = CtlSpeakEasy.CallManager.getCurrentCall();

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
        var currentCall = CtlSpeakEasy.CallManager.getCurrentCall();

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
        var currentCall = CtlSpeakEasy.CallManager.getCurrentCall();

        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-mute
        currentCall.mute();
        showInfoMessage('Call is muted!');
        $(btnMute).hide();
        $(btnUnMute).show();
    });

    btnUnMute.addEventListener('click', function (e) {
        var currentCall = CtlSpeakEasy.CallManager.getCurrentCall();

        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-unmute
        currentCall.unmute();
        showInfoMessage('Call is unmuted!');
        $(btnUnMute).hide();
        $(btnMute).show();
    });

    confDestination.addEventListener('keypress', function (e) {
        var charCode = e.which || e.charCode || e.keyCode || 0;
        if (charCode !== 13) { //Not enter
            var keyStr = String.fromCharCode(charCode);
            var regexKey = /[0-9]|[#]|[*]/;
            if (regexKey.test(keyStr)) {
                var currentCall = CtlSpeakEasy.CallManager.getCurrentCall();
                if(currentCall != null && !currentCall.isOnHold()) {
                    // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.BaseCall-method-sendDigits
                    currentCall.sendDigits(keyStr);
                }
                else {
                    CtlSpeakEasy.CallManager.dialTonePlay(keyStr);
                }
            }
            else {
                e.preventDefault();
                e.stopPropagation();
            }
        }
    }, false);

    btnLogout.addEventListener('click', function (e) {
        $('#progressLogout').show();

        // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.speakeasy.SpeakEasy-method-logout
        CtlSpeakEasy.logout(function() {
                showInfoMessage('SpeakEasy logout succeed!');
                // For more info reference to http://[documentation-domain]/docs/#!/api/Ctl.Auth-method-logout
                CtlSpeakEasy.logout();
                $('#progressLogout').hide();
                window.location.href = 'index.html';
            },
            function() {
                showErrorMessage('SpeakEasy logout has failed!');
                CtlSpeakEasy.logout();
                $('#progressLogout').hide();
                window.location.href = 'index.html';
            });
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
        CtlSpeakEasy.CallManager.switchTo(callId, function() {
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
    if(CtlSpeakEasy.CallManager.getCallsCount() === 0) {
        $('#noCallsRow').show();
    }
}

function updateCallButtonsGroup() {

    var callsCount = CtlSpeakEasy.CallManager.getCallsCount();

    if(callsCount > 0) {
        var call = CtlSpeakEasy.CallManager.getCurrentCall();

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
