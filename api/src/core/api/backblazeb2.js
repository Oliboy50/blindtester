const axios = require('axios');
const { getSha1FromBuffer } = require('../hasher');

module.exports = {
  async authorizeAccount(keyId, applicationKey) {
    let authorizeAccountData;
    try {
      authorizeAccountData = (await axios.get(
        'https://api.backblazeb2.com/b2api/v2/b2_authorize_account',
        {
          auth: {
            username: keyId,
            password: applicationKey,
          },
        },
      )).data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`"b2_authorize_account" failed`, e);
      throw new Error(`"b2_authorize_account" failed`);
    }
    return authorizeAccountData;
  },
  async downloadFileByName(downloadUrl, bucketName, fileName) {
    let downloadFileByNameData;
    try {
      downloadFileByNameData = (await axios.get(
        `${downloadUrl}/file/${bucketName}/${fileName}`,
      )).data;
    } catch (e) {
      if (e.response && e.response.status === 404) {
        return null;
      }
      // eslint-disable-next-line no-console
      console.log(`"b2_download_file_by_name" failed`, e);
      throw new Error(`"b2_download_file_by_name" failed`);
    }
    return downloadFileByNameData;
  },
  async getUploadUrl(apiUrl, authorizationToken, bucketId) {
    let getUploadUrlData;
    try {
      getUploadUrlData = (await axios.post(
        `${apiUrl}/b2api/v2/b2_get_upload_url`,
        {
          bucketId,
        },
        {
          headers: {
            Authorization: authorizationToken,
          },
        },
      )).data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`"b2_get_upload_url" failed`, e);
      throw new Error(`"b2_get_upload_url" failed`);
    }
    return getUploadUrlData;
  },
  async upload(uploadUrl, authorizationToken, fileBuffer, fileName, fileContentType = 'b2/x-auto') {
    let uploadData;
    try {
      uploadData = (await axios.post(
        uploadUrl,
        fileBuffer,
        {
          headers: {
            Authorization: authorizationToken,
            'X-Bz-File-Name': fileName,
            'Content-Type': fileContentType,
            'X-Bz-Content-Sha1': await getSha1FromBuffer(fileBuffer),
          },
        },
      )).data;
    } catch (e) {
      // eslint-disable-next-line no-console
      console.log(`b2 file upload failed`, e);
      throw new Error(`b2 file upload failed`);
    }
    return uploadData;
  },
};
