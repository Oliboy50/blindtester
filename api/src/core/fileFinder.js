const uniqid = require('uniqid');
const config = require('../../config');
const { storeFileAndReturnItsStorageInfo, isValidFileStorage } = require('./filesStorage');
const { getFiles, saveFiles } = require('./database');
const { FileDurationLimitExceededError, FileNotFoundError } = require('./error');
const { extractAudioFileFromUrlAndReturnItsFilesystemPath, getFileDurationInSecondsFromUrl } = require('./extractor');

const extractAudioFileFromUrlAndReturnStorageInfo = async (url, id) => {
  if (config.validate.maxFileDurationInSeconds) {
    const fileDurationInSeconds = await getFileDurationInSecondsFromUrl(url);
    if (fileDurationInSeconds > config.validate.maxFileDurationInSeconds) {
      throw new FileDurationLimitExceededError(`The video duration must be less than ${config.validate.maxFileDurationInSeconds} seconds.`);
    }
  }

  return storeFileAndReturnItsStorageInfo(
    await extractAudioFileFromUrlAndReturnItsFilesystemPath(url, id),
  );
};

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
    file.storage = await extractAudioFileFromUrlAndReturnStorageInfo(file.url, file.id);
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
      throw new FileNotFoundError(`No file corresponding to "${id}"`);
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
      storage: await extractAudioFileFromUrlAndReturnStorageInfo(url, id),
    };
    files.push(file);
    await saveFiles(files);

    return file;
  },
};
