var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push(file);
    }
  }
}

require.config({
    // Karma serves files from '/base'
    baseUrl: '/base/src/',
    paths: {
        'Ctl.model.request':    '../src/model/request',
        'Ctl.apiloader':        '../src/apiloader',
        "Ctl":                  '../src',
    },
    shim: {
    },

    // ask Require.js to load these files (all our tests)
    deps: tests,

    // start test run, once Require.js is done
    callback: window.__karma__.start
});
