const crypto = require('crypto');

module.exports = {
  getSha1FromBuffer: async (buffer) => {
    const hash = crypto.createHash('sha1');
    hash.update(buffer);

    return hash.digest('hex');
  },
};
