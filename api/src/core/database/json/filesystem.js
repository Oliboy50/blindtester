const { promisify } = require('util');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const config = require('../../../../config');
const { DATABASE_TYPE_JSON, DATABASE_JSON_TYPE_FILESYSTEM } = require('../../../../config/const');
const { EMPTY_DATABASE } = require('./const');

const getDatabase = async () => {
  let database;
  try {
    database = JSON.parse(await readFile(config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_FILESYSTEM].path));
    if (!database) {
      return EMPTY_DATABASE;
    }
  } catch (e) {
    return EMPTY_DATABASE;
  }

  return database;
};

module.exports = {
  getDatabase,
  assignDataToDatabase: async (data) => {
    mkdirp(path.dirname(config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_FILESYSTEM].path), async (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.log(`Unable to create database directory [${path.dirname(config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_FILESYSTEM].path)}]`, err);
        throw new Error('Unable to create database directory');
      }

      await writeFile(config.database[DATABASE_TYPE_JSON][DATABASE_JSON_TYPE_FILESYSTEM].path, JSON.stringify(
        Object.assign({}, await getDatabase(), data),
        null,
        2
      ));
    });
  },
};
