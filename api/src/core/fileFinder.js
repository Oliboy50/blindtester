const { GeneralError } = require('@feathersjs/errors');
const uniqid = require('uniqid');
const { storeNewFileForUrlAndId } = require('./filesStorage');
const { getFiles, saveFiles } = require('./database');

module.exports = {
  getFileDataForUrl: async (url) => {
    // check if file already exists
    const files = await getFiles();
    let file = files.find((file) => file.url === url);
    if (file) {
      return file;
    }

    const id = uniqid();

    // extract audio from url
    const storage = await storeNewFileForUrlAndId(url, id);

    // create new file ref
    file = {
      id,
      url,
      storage,
    };

    // save new file ref
    files.push(file);
    try {
      await saveFiles(files);
    } catch (err) {
      return new GeneralError(err);
    }

    return file;
  },
};
