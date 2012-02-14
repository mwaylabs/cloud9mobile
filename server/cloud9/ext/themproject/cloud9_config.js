// this is just an idea...
// use this config with `node cloud9/bin/cloud9.js -c jim/cloud9_config.js`
//
// original is here github.com/ajaxorg/cloud9/blob/master/server/cloud9/ide.js
// this just adds Jim
var staticUrl = "/static",
  requirejsConfig = {
    paths: {
      "pilot": staticUrl + "/support/ace/support/pilot/lib/pilot",
      "ace": staticUrl + "/support/ace/lib/ace",
      "debug": staticUrl + "/support/lib-v8debug/lib/v8debug",
      "apf": staticUrl + "/support/apf",
      "tmp": staticUrl + "/ext/themproject"
    },
    waitSeconds: 30
  };

exports.Config = {
  requirejsConfig: requirejsConfig,
  plugins: require('cloud9/ide').DEFAULT_PLUGINS.concat('ext/tmpproject')
};
/*
exports.Config = {
    workspace: "/Applications/MAMP/htdocs/wordpress/wp-content/",
    ip: "127.0.0.1",
    port: 2020
};
*/