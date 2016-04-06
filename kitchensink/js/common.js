require.config({
    "baseUrl": "js/lib",
    "paths": {
      "app": "../app"
    },
    "shim": {
        "app": ["jquery", "materialize"],
        "materialize": ["jquery"]
    }
});
