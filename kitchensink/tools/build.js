{
    appDir: '../www',
    mainConfigFile: '../www/js/common.js',
    dir: '../www-built',
    modules: [
        {
            name: '../common',
            include: [
                'jquery'
            ]
        },
        {
            name: '../index',
            include: ['app/index'],
            exclude: ['../common']
        },
        {
            name: '../call',
            include: ['app/call'],
            exclude: ['../common']
        }

    ]
}
