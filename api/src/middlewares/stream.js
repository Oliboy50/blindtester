const { resolve } = require('path');
const { createReadStream } = require('fs');

module.exports = {
  streamResponseFile(filesStorageConfig) {
    return (req, res, next) => {
      // Supports only string data
      if (typeof res.data !== 'string') {
        next();
        return;
      }

      res.set('Content-Type', 'audio/mpeg');

      createReadStream(
        resolve(filesStorageConfig.filesystem.path, res.data)
      ).pipe(res);
    };
  },
};
