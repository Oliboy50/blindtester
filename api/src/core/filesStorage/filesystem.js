const { FILES_STORAGE_TYPE_FILESYSTEM } = require('../../../config/const');
const { extractAudioFileFromUrlAndReturnItsFilesystemPath } = require('../extractor');

module.exports = {
  async storeNewFileForUrlAndId(url, id) {
    return {
      type: FILES_STORAGE_TYPE_FILESYSTEM,
      path: await extractAudioFileFromUrlAndReturnItsFilesystemPath(url, id),
    };
  },
};
