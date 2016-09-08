# Versioning

The second parameter of {@link Ctl.ctlapiloader.CtlApiLoader#load Ctl.load}
 is the version of the API. Every API has a major
version and revision number, of the form VERSION.REVISION. Every time an an API
introduces new JavaScript, the revision number increases. So if an API is
currently on version *2.2.3*, and the team does an update, the next version becomes *2.2.4*.

Our APIs are updated frequently, so to ensure stability, all of our APIs have
an active stable version as well as a test version. Every time a team introduces
a new API version, the previous version becomes the stable version of the API,
and the most recent becomes the test version.

The usage model CenturyLink encourages is:

- Use the stable version of each API in the production HTML.
- Use the test version of each API (e.g., 2.x) on your development machines, and
report any issues you find in the developer forum for that API. If many users
encounter serious issues with a particular API revision, CenturyLink will revert
or hold back the revision.

While you can technically request any older version of an API at any time, old
versions of APIs are not officially supported. In many cases, server-side
changes will require that you stop using old versions of the API. However,
CenturyLink tries try to keep old versions of each API for long periods of time,
so you have ample time to upgrade.
