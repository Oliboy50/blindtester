const { promisify } = require('util');
const fs = require('fs');
const access = promisify(fs.access);
const { FILES_STORAGE_TYPE_FILESYSTEM } = require('../../../config/const');
const { extractAudioFileFromUrlAndReturnItsFilesystemPath } = require('../extractor');

module.exports = {
  async storeNewFileForUrlAndId(url, id) {
    return {
      type: FILES_STORAGE_TYPE_FILESYSTEM,
      path: await extractAudioFileFromUrlAndReturnItsFilesystemPath(url, id),
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
