const config = require('../../config');

module.exports = {
  getListeningUrlForFile: async (file) => {
    // always prefer direct storage url when possible
    return file.storage.url ? file.storage.url : `${config.apiBaseUrl}/stream/${file.id}`;
  },
};
