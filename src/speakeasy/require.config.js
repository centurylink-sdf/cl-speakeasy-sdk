require.config({
    baseUrl: './',
    'paths': {
        'Ctl':                      '../',
        'fcs':                      '../lib/fcs-jsl-4.1.1',
        'Ctl.speakeasy':            './',
        'Ctl.model.request':        '../model/request',
        'Ctl.ctlapiloader':         '../ctlapiloader/'
    },
    name: 'SpeakEasy',
    out: '../../dist/speakeasy.js',
    optimize: 'none'
});
