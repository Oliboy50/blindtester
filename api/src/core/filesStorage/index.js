const config = require('../../../config');
const { storeNewFileForUrlAndId } = require(`./${config.filesStorage.type}`);

module.exports = {
  storeNewFileForUrlAndId,
};
