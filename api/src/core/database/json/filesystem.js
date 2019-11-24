const cache = require('memory-cache');
const { promisify } = require('util');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const existsSync = fs.existsSync;
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const config = require('../../../../config');
const { DATABASE_TYPE_JSON, DATABASE_JSON_TYPE_FILESYSTEM } = require('../../../../config/const');
const { CACHE_DATABASE_KEY, EMPTY_DATABASE } = require('./const');

module.exports = {
  getDatabase: async () => {
    const cachedDatabase = cache.get(CACHE_DATABASE_KEY);
    if (cachedDatabase) {
      return cachedDatabase;
    }

    if (!existsSync(config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_FILESYSTEM].path)) {
      return EMPTY_DATABASE;
    }

    const filesystemDatabase = JSON.parse(
      await readFile(config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_FILESYSTEM].path),
    );
    if (filesystemDatabase) {
      return cache.put(
        CACHE_DATABASE_KEY,
        filesystemDatabase,
      );
    }

    return EMPTY_DATABASE;
  },
  setDatabase: async (data) => {
    mkdirp(path.dirname(config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_FILESYSTEM].path), async (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(`Unable to create database directory [${path.dirname(config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_FILESYSTEM].path)}]`, err);
        throw new Error('Unable to create database directory');
      }

      await writeFile(
        config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_FILESYSTEM].path,
        JSON.stringify(
          cache.put(CACHE_DATABASE_KEY, data),
          null,
          2,
        ),
      );
    });
  },
};
