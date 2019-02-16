const { resolve } = require('path');
const { createReadStream } = require('fs');

module.exports = {
  streamResponseFile(req, res, next) {
    // Supports only string data
    if (typeof res.data !== 'string') {
      next();
      return;
    }

    res.set('Content-Type', 'audio/mpeg');

    createReadStream(
      resolve(__dirname, '../../data/audio', res.data)
    ).pipe(res);
  },
};
