var CtlSpeakEasy = SpeakEasy;

console.log('Running CenuryLink SpeakEasy v' + CtlSpeakEasy.version());

if (CtlSpeakEasy.Auth.isAuthenticated()) {
    window.location.href = 'call.html';
}

$('#formLogin').submit(function(e) {
    e.preventDefault();
    blockUI();
    submitLogin();
});

$('#btnSelectService').click(function(e) {
    var selectedService = $("input:radio[name ='service']:checked").val();
    if (selectedService) {
        var publicId = selectedService.substr(0, selectedService.indexOf(' '));
        var serviceName = selectedService.substr(selectedService.indexOf('-')+2, selectedService.length-1);
        CtlSpeakEasy.Auth.setDefaultSubscriptionService(serviceName, publicId, function(error, response) {
            if (!error && response) {
                console.info('Successfully set default service.');
                window.location.href = 'call.html';
            } else {
                console.error('Service subscription details retrieval failed: ', error);
                unBlockUI();
                if (error) {
                    showLoginError(error.message);
                }
            }

        });
    }
});

function blockUI() {
    $('#login').prop({
        disabled: true
    });
    $('#password').prop({
        disabled: true
    });
    $('#password').prop({
        disabled: true
    });
    $('#btnLogin').prop({
        disabled: true
    });
    $('#progressLogin').show();
}

function unBlockUI() {
    $('#login').prop({
        disabled: false
    });
    $('#password').prop({
        disabled: false
    });
    $('#password').prop({
        disabled: false
    });
    $('#btnLogin').prop({
        disabled: false
    });
    $('#progressLogin').hide();
}

function populateSubscriptionServices(services) {

    var index = 0;
    for(var i = 0; i < services.length; i++) {
        for (var publicId in services[i]) {
            if(services[i].hasOwnProperty(publicId)) {
                for (var serviceName in services[i][publicId]) {
                    if(services[i][publicId].hasOwnProperty(serviceName)) {
                        $('#subscriptionTable').append('<p><input name="service" type="radio" id="' + index + '" value="' + publicId + ' - ' + services[i][publicId][serviceName] + '" /><label for="' + index + '">' + publicId + ' - ' + services[i][publicId][serviceName] + '</label></p>');
                        index++;
                    }
                }
            }
        }
    }
}

function submitLogin() {

    var username = $('#login').val();
    var password = $('#password').val();

    CtlSpeakEasy.Auth.login(username, password, function(error, response) {
        if (!error && response) {

            if(response.loginType === 'oauth') {
                console.info('Successfully authenticated. Exposing subscription services selection.');
                populateSubscriptionServices(response.response);
                $('#subscriptionServicesModal').openModal();
            }
            else {
                window.location.href = 'call.html';
            }

        } else {
            console.error('Authentication failed: ', error);
            unBlockUI();
            if (error) {
                showLoginError(error.message);
            }
        }
    });

}

function showLoginError(message) {

    if($('#cardLoginError').text() != '') {
        $('#cardLoginError').append('<br/>');
    }

    $('#cardLoginError').append(message);
    $('#cardLoginError').show();
}
