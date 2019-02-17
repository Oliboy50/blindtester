// const config = require('../../../../config');
// const { DATABASE_TYPE_JSON } = require('../../../../config/const');
const { EMPTY_DATABASE } = require('./const');

const getDatabase = async () => {
  let database;
  try {
    // @TODO
  } catch (e) {
    return EMPTY_DATABASE;
  }

  return database;
};

module.exports = {
  getDatabase,
  // assignDataToDatabase: async (data) => {
  //   // @TODO
  // },
};
