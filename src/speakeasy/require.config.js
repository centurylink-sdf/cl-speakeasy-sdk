require.config({
    baseUrl: "./",
    "paths": {
        "fcs":                          "../lib/fcs-jsl-3.1.3",
        "Ctl.common.Logger":            "../common/Logger",
        "Ctl.common.Utils":             "../common/Utils",
        "Ctl.common.Ajax":              "../common/Ajax",
        "Ctl.common.Promise":           "../common/Promise",
        "Ctl.speakeasy.Version":        "Version",
        "Ctl.speakeasy.Config":         "Config",
        "Ctl.speakeasy.CallManager":    "CallManager",
        "Ctl.speakeasy.Call":           "Call"
    },
    name: "SpeakEasy",
    out: "../../dist/speakeasy.js",
    optimize: "none"
});
