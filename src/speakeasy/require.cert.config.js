require.config({
    baseUrl: './',
    'paths': {
        'Ctl':                      '../',
        'fcs':                      '../lib/fcs-jsl-4.1.1',
        'base64':                   '../lib/base64',
        'sha256':                   '../lib/sha256',
        'Ctl.speakeasy':            './',
        'Ctl.speakeasy.config':     './Config.cert',
        'Ctl.model.request':        '../model/request',
        'Ctl.ctlapiloader':         '../ctlapiloader/',
        'Ctl.ctlapiloader.config':  '../ctlapiloader/Config.cert'
    },
    name: 'SpeakEasy',
    out: '../../dist/speakeasy.js',
    optimize: 'none'
});
