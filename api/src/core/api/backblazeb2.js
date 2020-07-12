const axios = require('axios').create({
  maxContentLength: Infinity,
});
const axiosRetry = require('axios-retry');
const { getSha1FromBuffer } = require('../hasher');

// retry policy for backblazeb2 requests
axiosRetry(axios, {
  retries: 3,
  retryDelay: () => 1000,
  retryCondition: (error) => {
    if (!error.config) {
      return false;
    }

    // eslint-disable-next-line no-console
    console.log(`[backblazeb2] retrying ${error.config.method} ${error.config.url}`);

    return axiosRetry.isRetryableError(error);
  },
});

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
      const errMessage = `[backblazeb2] "b2_authorize_account" failed`;
      // eslint-disable-next-line no-console
      console.log(errMessage, e);
      throw new Error(errMessage);
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
      const errMessage = `[backblazeb2] "b2_download_file_by_name" failed`;
      // eslint-disable-next-line no-console
      console.log(errMessage, e);
      throw new Error(errMessage);
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
      const errMessage = `[backblazeb2] "b2_get_upload_url" failed`;
      // eslint-disable-next-line no-console
      console.log(errMessage, e);
      throw new Error(errMessage);
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
      const errMessage = `[backblazeb2] b2 file upload failed`;
      // eslint-disable-next-line no-console
      console.log(errMessage, e);
      throw new Error(errMessage);
    }
    return uploadData;
  },
};
