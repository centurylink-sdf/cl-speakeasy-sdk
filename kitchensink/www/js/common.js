require.config({
    baseUrl: "js/lib",
    paths: {
      "app": "../app",
      "CtlApiLoader": "../../../../dist/ctlapi-0.1.4"
    },
    shim: {
        "app": ["jquery"]
    }
});
