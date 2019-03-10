const compress = require('compression');
const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const config = require('../config');

const app = express();

// Enable CORS, security, compression and body parsing
app.use(cors());
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up endpoints
if (config.endpoint.save.enabled) {
  app.use(require('./router/save'));
}
if (config.endpoint.stream.enabled) {
  app.use(require('./router/stream'));
}
if (config.endpoint.slack.enabled) {
  app.use(require('./router/slack'));
}

// Set up error handling
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  const errMessage = `Unhandled error`;
  // eslint-disable-next-line no-console
  console.log(errMessage, err);
  return res.status(500).json({
    message: errMessage,
  });
});

module.exports = app;
