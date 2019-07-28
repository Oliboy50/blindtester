const uniqid = require('uniqid');
const { storeNewFileForUrlAndId, isValidFileStorage } = require('./filesStorage');
const { getFiles, saveFiles } = require('./database');

const findExistingFile = async (files, {id, url}) => {
  const matcherField = id ? 'id' : 'url';
  const matcherValue = matcherField === 'id' ? id : url;

  const fileIndex = files.findIndex((file) => file[matcherField] === matcherValue);
  if (fileIndex < 0) {
    return;
  }

  const file = files[fileIndex];

  if (!(await isValidFileStorage(file.storage))) {
    // replace existing file with a valid one
    file.storage = await storeNewFileForUrlAndId(file.url, file.id);
    files.splice(fileIndex, 1, file);
    await saveFiles(files);
  }

  return file;
};

module.exports = {
  getFileDataForId: async (id) => {
    const files = await getFiles();

    const existingFile = await findExistingFile(files, {id});
    if (!existingFile) {
      throw new Error(`File with id ${id} was not found`);
    }

    return existingFile;
  },
  getFileDataForUrl: async (url) => {
    const files = await getFiles();

    const existingFile = await findExistingFile(files, {url});
    if (existingFile) {
      return existingFile;
    }

    const id = uniqid();
    const file = {
      id,
      url,
      storage: await storeNewFileForUrlAndId(url, id),
    };
    files.push(file);
    await saveFiles(files);

    return file;
  },
};
