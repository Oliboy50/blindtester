const { DATABASE_TYPE_FILESYSTEM } = require('./const');

if (![DATABASE_TYPE_FILESYSTEM].includes(process.env.DATABASE_TYPE)) {
  throw new Error('Invalid "DATABASE_TYPE" environment variable value');
}

if (process.env.DATABASE_TYPE === DATABASE_TYPE_FILESYSTEM && !process.env.DATABASE_FILESYSTEM_PATH) {
  throw new Error('Invalid "DATABASE_FILESYSTEM_PATH" environment variable value');
}

module.exports = {
  type: process.env.DATABASE_TYPE,
  [DATABASE_TYPE_FILESYSTEM]: {
    path: process.env.DATABASE_FILESYSTEM_PATH,
  },
};
