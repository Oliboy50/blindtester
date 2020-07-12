const { promisify } = require('util');
const { basename } = require('path');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const config = require('../../../config');
const { FILES_STORAGE_TYPE_BACKBLAZEB2 } = require('../../../config/const');
const { authorizeAccount, getUploadUrl, upload } = require('../api/backblazeb2');

module.exports = {
  async storeFileAndReturnItsStorageInfo(filePath) {
    const authorizeAccountData = await authorizeAccount(
      config.filesStorage[FILES_STORAGE_TYPE_BACKBLAZEB2].keyId,
      config.filesStorage[FILES_STORAGE_TYPE_BACKBLAZEB2].applicationKey,
    );

    const getUploadUrlData = await getUploadUrl(
      authorizeAccountData.apiUrl,
      authorizeAccountData.authorizationToken,
      config.filesStorage[FILES_STORAGE_TYPE_BACKBLAZEB2].bucketId,
    );

    const uploadData = await upload(
      getUploadUrlData.uploadUrl,
      getUploadUrlData.authorizationToken,
      await readFile(filePath),
      basename(filePath),
      'audio/mpeg',
    );

    if (uploadData.action !== 'upload') {
      throw new Error(`Unexpected "action" value [${uploadData.action}] from upload response`);
    }

    return {
      type: FILES_STORAGE_TYPE_BACKBLAZEB2,
      url: `${authorizeAccountData.downloadUrl}/b2api/v2/b2_download_file_by_id?fileId=${uploadData.fileId}`,
    };
  },
  async isValidFileStorage({ url }) {
    if (!url) {
      return false;
    }

    // @TODO check if url is OK

    return true;
  },
};
