define(['jquery', 'materialize', 'ApiLoader'], function($, materialize, Ctl) {

    var btnLogin = $('.btn-login');
    var btnLogout = $('.btn-logout');

    console.log('Running CtlApi v' + Ctl.getVersion());

    if (Ctl.Auth.isAuthenticated()) {
        window.location.href = 'speakeasy.html';
    }

    $('#formLogin').submit(function(e) {
        e.preventDefault();
        blockUI();
        submitLogin();
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

    function submitLogin() {

        var username = $('#login').val();
        var password = $('#password').val();

        Ctl.Auth.login(username, password, function(error, response) {
            if (!error) {
                console.info('Successfully authenticated. Now you can load any CenturyLink API.');
                window.location.href = 'speakeasy.html';
            } else {
                console.error('Authentication failed: ', error);
                unBlockUI();
                showLoginError(error.responseMessage);
            }
        });

    }

    function showLoginError(message) {
        $('#cardLoginError').append(message);
        $('#cardLoginError').show();
    }


});
