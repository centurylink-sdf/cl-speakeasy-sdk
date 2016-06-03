require.config({
    baseUrl: './',
    'paths': {
        'Ctl':                  '../',
        'Ctl.model.request':    '../model/request',
        'Ctl.ctlapiloader':        './'
    },
    name: 'CtlApiLoader',
    out: '../../dist/ctlapi.js',
    optimize: 'none',
    include: ['../lib/require', 'Services']
});
