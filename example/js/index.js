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
                    showLoginError(error.responseMessage);
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
    var publicIds = Object.keys(services);
    var i = 0;
    for (var val in services) {
        if(services.hasOwnProperty(val)) {
            for (var serviceName in services[val]) {
                if(services[val].hasOwnProperty(serviceName)) {
                    $('#subscriptionTable').append('<p><input name="service" type="radio" id="' + i + '" value="' + val + ' - ' + services[val][serviceName] + '" /><label for="' + i + '">' + val + ' - ' + services[val][serviceName] + '</label></p>');
                    i++;
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
            console.info('Successfully authenticated. Exposing subscription services selection.');
            populateSubscriptionServices(response);
            $('#subscriptionServicesModal').openModal();
        } else {
            console.error('Authentication failed: ', error);
            unBlockUI();
            if (error) {
                showLoginError(error.responseMessage);
            }
        }
    });

}

function showLoginError(message) {
    $('#cardLoginError').append(message);
    $('#cardLoginError').show();
}
