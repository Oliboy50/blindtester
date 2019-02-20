const cache = require('memory-cache');
const config = require('../../../../config');
const { DATABASE_TYPE_JSON, DATABASE_JSON_TYPE_BACKBLAZEB2 } = require('../../../../config/const');
const { CACHE_DATABASE_KEY, EMPTY_DATABASE } = require('./const');
const { authorizeAccount, downloadFileByName, getUploadUrl, upload } = require('../../api/backblazeb2');

const CACHE_DATABASE_BACKBLAZEB2_AUTHORIZE_ACCOUNT_DATA_KEY = 'database-json-backblazeb2-authorizeAccountData';
const CACHE_DATABASE_BACKBLAZEB2_AUTHORIZE_ACCOUNT_DATA_TTL = 12 * 60 * 60 * 1000; // 12 hours
const CACHE_DATABASE_BACKBLAZEB2_GET_UPLOAD_URL_DATA_KEY = 'database-json-backblazeb2-getUploadUrlData';
const CACHE_DATABASE_BACKBLAZEB2_GET_UPLOAD_URL_DATA_TTL = 12 * 60 * 60 * 1000; // 12 hours

const getAuthorizeAccountData = async () => {
  const authorizeAccountData = cache.get(CACHE_DATABASE_BACKBLAZEB2_AUTHORIZE_ACCOUNT_DATA_KEY);
  if (authorizeAccountData) {
    return authorizeAccountData;
  }

  return cache.put(
    CACHE_DATABASE_BACKBLAZEB2_AUTHORIZE_ACCOUNT_DATA_KEY,
    await authorizeAccount(
      config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_BACKBLAZEB2].keyId,
      config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_BACKBLAZEB2].applicationKey,
    ),
    CACHE_DATABASE_BACKBLAZEB2_AUTHORIZE_ACCOUNT_DATA_TTL,
  );
};

module.exports = {
  getDatabase: async () => {
    const cachedDatabase = cache.get(CACHE_DATABASE_KEY);
    if (cachedDatabase) {
      return cachedDatabase;
    }

    const authorizeAccountData = await getAuthorizeAccountData();

    const remoteDatabase = await downloadFileByName(
      authorizeAccountData.downloadUrl,
      config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_BACKBLAZEB2].bucketName,
      config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_BACKBLAZEB2].fileName
    );
    if (remoteDatabase) {
      return cache.put(
        CACHE_DATABASE_KEY,
        remoteDatabase
      );
    }

    return EMPTY_DATABASE;
  },
  setDatabase: async (data) => {
    const authorizeAccountData = await getAuthorizeAccountData();

    let getUploadUrlData = cache.get(CACHE_DATABASE_BACKBLAZEB2_GET_UPLOAD_URL_DATA_KEY);
    if (!getUploadUrlData) {
      getUploadUrlData = cache.put(
        CACHE_DATABASE_BACKBLAZEB2_GET_UPLOAD_URL_DATA_KEY,
        await getUploadUrl(
          authorizeAccountData.apiUrl,
          authorizeAccountData.authorizationToken,
          config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_BACKBLAZEB2].bucketId,
        ),
        CACHE_DATABASE_BACKBLAZEB2_GET_UPLOAD_URL_DATA_TTL,
      );
    }

    const uploadData = await upload(
      getUploadUrlData.uploadUrl,
      getUploadUrlData.authorizationToken,
      JSON.stringify(
        cache.put(CACHE_DATABASE_KEY, data),
        null,
        2,
      ),
      config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_BACKBLAZEB2].fileName
    );

    if (uploadData.action !== 'upload') {
      throw new Error(`Unexpected "action" value [${uploadData.action}] from upload response`);
    }
  },
};
