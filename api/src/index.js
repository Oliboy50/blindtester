// catch unhandled promise rejections if any
process.on('unhandledRejection', (reason, p) => {
  // eslint-disable-next-line no-console
  console.log('Unhandled Rejection at: Promise ', p, ' reason: ', reason);
});

const app = require('./app');
const config = require('../config');

app.listen(config.port);

// eslint-disable-next-line no-console
console.log(`listening on port ${config.port}`);
