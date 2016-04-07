require.config({
    baseUrl: "js/lib",
    paths: {
      "app": "../app",
      "ApiLoader": "../../../../dist/ctlapi-0.1.4"
    },
    shim: {
        "app": ["jquery"]
    }
});
