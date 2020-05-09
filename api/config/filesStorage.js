const { FILES_STORAGE_TYPE_FILESYSTEM, FILES_STORAGE_TYPE_BACKBLAZEB2 } = require('./const');

if (![FILES_STORAGE_TYPE_FILESYSTEM, FILES_STORAGE_TYPE_BACKBLAZEB2].includes(process.env.FILES_STORAGE_TYPE)) {
  throw new Error('Invalid "FILES_STORAGE_TYPE" environment variable value');
}

if (process.env.FILES_STORAGE_TYPE === FILES_STORAGE_TYPE_FILESYSTEM && !process.env.FILES_STORAGE_FILESYSTEM_PATH) {
  throw new Error('Invalid "FILES_STORAGE_FILESYSTEM_PATH" environment variable value');
}

if (process.env.FILES_STORAGE_TYPE === FILES_STORAGE_TYPE_BACKBLAZEB2) {
  if (!process.env.FILES_STORAGE_BACKBLAZEB2_KEY_ID) {
    throw new Error('Invalid "FILES_STORAGE_BACKBLAZEB2_KEY_ID" environment variable value');
  }

  if (!process.env.FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY) {
    throw new Error('Invalid "FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY" environment variable value');
  }

  if (!process.env.FILES_STORAGE_BACKBLAZEB2_BUCKET_ID) {
    throw new Error('Invalid "FILES_STORAGE_BACKBLAZEB2_BUCKET_ID" environment variable value');
  }
}

module.exports = {
  type: process.env.FILES_STORAGE_TYPE,
  [FILES_STORAGE_TYPE_FILESYSTEM]: {
    path: process.env.FILES_STORAGE_FILESYSTEM_PATH,
  },
  [FILES_STORAGE_TYPE_BACKBLAZEB2]: {
    keyId: process.env.FILES_STORAGE_BACKBLAZEB2_KEY_ID,
    applicationKey: process.env.FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY,
    bucketId: process.env.FILES_STORAGE_BACKBLAZEB2_BUCKET_ID,
  },
};
