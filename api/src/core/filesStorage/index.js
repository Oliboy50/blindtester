const config = require('../../../config');
const { storeNewFileForUrlAndId, isValidFileStorage } = require(`./${config.filesStorage.type}`);

module.exports = {
  storeNewFileForUrlAndId,
  isValidFileStorage,
};
