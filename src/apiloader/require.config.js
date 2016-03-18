require.config({
    baseUrl: './',
    'paths': {
        'Ctl':                  '../',
        'Ctl.model.request':    '../model/request',
        'Ctl.apiloader':        './'
    },
    name: 'ApiLoader',
    out: '../../dist/ctlapi.js',
    optimize: 'none',
    include: ['../lib/require', 'Services']
});
