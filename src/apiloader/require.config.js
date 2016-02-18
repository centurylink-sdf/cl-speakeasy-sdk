require.config({
    baseUrl: "./",
    "paths": {
        "Ctl.common.Logger":   "../common/Logger",
        "Ctl.common.Utils":    "../common/Utils",
        "Ctl.common.Ajax":     "../common/Ajax",
        "Ctl.common.Promise":  "../common/Promise",
        "Ctl.apiloader.Version": "Version",
        "Ctl.apiloader.Config": "Config"
    },
    name: "Ctl",
    out: "../../dist/ctlapi.js",
    optimize: "none",
    include: ["../lib/require", "Services"]
});
