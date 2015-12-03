require.config({
    baseUrl: "src",
    "paths": {
        "Version": "Version",
        "Config": "Config",
        "Logger": "Logger",
        "Utils": "Utils",
        "Ajax": "Ajax",
        "Promise": "Promise",
        "CtlApiLoader": "CtlApiLoader"
    },
    name: "CtlApiLoader",
    out: "../dist/ctlapi.js",
    optimize: "none"
});
