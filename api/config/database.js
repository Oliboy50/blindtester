const { DATABASE_TYPE_JSON, DATABASE_JSON_TYPE_FILESYSTEM, DATABASE_JSON_TYPE_BACKBLAZEB2 } = require('./const');

if (![DATABASE_TYPE_JSON].includes(process.env.DATABASE_TYPE)) {
  throw new Error('Invalid "DATABASE_TYPE" environment variable value');
}

if (process.env.DATABASE_TYPE === DATABASE_TYPE_JSON && ![DATABASE_JSON_TYPE_FILESYSTEM, DATABASE_JSON_TYPE_BACKBLAZEB2].includes(process.env.DATABASE_JSON_TYPE)) {
  throw new Error('Invalid "DATABASE_JSON_TYPE" environment variable value');
}

if (process.env.DATABASE_JSON_TYPE === DATABASE_JSON_TYPE_FILESYSTEM && !process.env.DATABASE_JSON_FILESYSTEM_PATH) {
  throw new Error('Invalid "DATABASE_JSON_FILESYSTEM_PATH" environment variable value');
}

if (process.env.DATABASE_JSON_TYPE === DATABASE_JSON_TYPE_BACKBLAZEB2) {
  if (!process.env.DATABASE_JSON_BACKBLAZEB2_KEY_ID) {
    throw new Error('Invalid "DATABASE_JSON_BACKBLAZEB2_KEY_ID" environment variable value');
  }

  if (!process.env.DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY) {
    throw new Error('Invalid "DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY" environment variable value');
  }

  if (!process.env.DATABASE_JSON_BACKBLAZEB2_BUCKET_ID) {
    throw new Error('Invalid "DATABASE_JSON_BACKBLAZEB2_BUCKET_ID" environment variable value');
  }

  if (!process.env.DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME) {
    throw new Error('Invalid "DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME" environment variable value');
  }

  if (!process.env.DATABASE_JSON_BACKBLAZEB2_FILE_NAME) {
    throw new Error('Invalid "DATABASE_JSON_BACKBLAZEB2_FILE_NAME" environment variable value');
  }
}

module.exports = {
  type: process.env.DATABASE_TYPE,
  [DATABASE_TYPE_JSON]: {
    type: process.env.DATABASE_JSON_TYPE,
    [DATABASE_JSON_TYPE_FILESYSTEM]: {
      path: process.env.DATABASE_JSON_FILESYSTEM_PATH,
    },
    [DATABASE_JSON_TYPE_BACKBLAZEB2]: {
      keyId: process.env.DATABASE_JSON_BACKBLAZEB2_KEY_ID,
      applicationKey: process.env.DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY,
      bucketId: process.env.DATABASE_JSON_BACKBLAZEB2_BUCKET_ID,
      bucketName: process.env.DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME,
      fileName: process.env.DATABASE_JSON_BACKBLAZEB2_FILE_NAME,
    },
  },
};
