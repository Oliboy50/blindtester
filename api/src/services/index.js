const config = require('../../config');

module.exports = function (app) {
  if (config.endpoint.save.enabled) {
    app.configure(require('./save'));
  }

  if (config.endpoint.stream.enabled) {
    app.configure(require('./stream'));
  }

  if (config.slack.enabled) {
    app.configure(require('./slack'));
  }
};
