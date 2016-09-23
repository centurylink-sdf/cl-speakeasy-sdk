var accessToken = '77c8787aff45466a28082b6647c90e38389c2f7e936f630cbb7ce553b4aadf95';
var refreshToken = '77c8787aff45466a28082b6647c90e38389c2f7e936f630cbb7ce553b4aadf95';
var publicId = '3031093013';

SpeakEasy.init(accessToken, refreshToken, publicId, function(error) {
    if (!error) {
        console.log('SpeakEasy has been succesfully initialized!');
    } else {
        console.error('SpeakEasy could not be initialized!');
    }
});
