require.config({
    baseUrl: './',
    'paths': {
        'Ctl':                  '../',
        'Ctl.model.request':    '../model/request',
        'Ctl.ctlapiloader':        './',
        'Ctl.ctlapiloader.config':        './Config'
    },
    name: 'CtlApiLoader',
    out: '../../dist/ctlapi.js',
    optimize: 'none'
});
