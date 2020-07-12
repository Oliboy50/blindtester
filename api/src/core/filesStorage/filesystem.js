const { promisify } = require('util');
const fs = require('fs');
const access = promisify(fs.access);
const { FILES_STORAGE_TYPE_FILESYSTEM } = require('../../../config/const');

module.exports = {
  async storeFileAndReturnItsStorageInfo(filePath) {
    return {
      type: FILES_STORAGE_TYPE_FILESYSTEM,
      path: filePath,
    };
  },
  async isValidFileStorage({ path }) {
    if (!path) {
      return false;
    }

    try {
      await access(path, fs.constants.R_OK);
    } catch (e) {
      return false;
    }

    return true;
  },
};
