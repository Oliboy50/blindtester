const { promisify } = require('util');
const { basename } = require('path');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const axios = require('axios');
const config = require('../../../config');
const { FILES_STORAGE_TYPE_BACKBLAZEB2 } = require('../../../config/const');
const { getSha1FromBuffer } = require('../hasher');
const { extractAudioFileFromUrlAndReturnItsFilesystemPath } = require('../extractor');

module.exports = {
  async storeNewFileForUrlAndId(url, id) {
    const filePath = await extractAudioFileFromUrlAndReturnItsFilesystemPath(url, id);

    let authorizeAccountData;
    try {
      authorizeAccountData = (await axios.get(
        'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
        {
          auth: {
            username: config.filesStorage[FILES_STORAGE_TYPE_BACKBLAZEB2].keyId,
            password: config.filesStorage[FILES_STORAGE_TYPE_BACKBLAZEB2].applicationKey,
          },
        },
      )).data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      throw e;
    }

    let getUploadUrlData;
    try {
      getUploadUrlData = (await axios.post(
        `${authorizeAccountData.apiUrl}/b2api/v2/b2_get_upload_url`,
        {
          bucketId: config.filesStorage[FILES_STORAGE_TYPE_BACKBLAZEB2].bucketId,
        },
        {
          headers: {
            Authorization: authorizeAccountData.authorizationToken,
          },
        },
      )).data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      throw e;
    }

    const fileBuffer = await readFile(filePath);
    let uploadData;
    try {
      uploadData = (await axios.post(
        getUploadUrlData.uploadUrl,
        fileBuffer,
        {
          headers: {
            Authorization: getUploadUrlData.authorizationToken,
            'X-Bz-File-Name': basename(filePath),
            'Content-Type': 'audio/mpeg',
            'X-Bz-Content-Sha1': await getSha1FromBuffer(fileBuffer),
          },
        },
      )).data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(e);
      throw e;
    }

    if (uploadData.action !== 'upload') {
      throw new Error(`Unexpected "action" value [${uploadData.action}] from upload response`);
    }

    return {
      type: FILES_STORAGE_TYPE_BACKBLAZEB2,
      url: `${authorizeAccountData.downloadUrl}/b2api/v2/b2_download_file_by_id?fileId=${uploadData.fileId}`,
    };
  },
};
