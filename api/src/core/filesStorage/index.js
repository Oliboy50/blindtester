const config = require('../../../config');
const { storeFileAndReturnItsStorageInfo, isValidFileStorage } = require(`./${config.filesStorage.type}`);

module.exports = {
  /**
   * @param {string} filePath The extracted file path on filesystem.
   *
   * @return {object}
   */
  storeFileAndReturnItsStorageInfo,
  /**
   * @param {object} storageInfo The data returned by storeFileAndReturnItsStorageInfo.
   *
   * @return {boolean}
   */
  isValidFileStorage,
};
