require.config({
    baseUrl: './',
    'paths': {
        'Ctl':                  '../',
        'Ctl.model.request':    '../model/request',
        'Ctl.ctlapiloader':        './',
        'Ctl.ctlapiloader.config':        './Config.cert'
    },
    name: 'CtlApiLoader',
    out: '../../dist/ctlapi.js',
    optimize: 'none'
});
