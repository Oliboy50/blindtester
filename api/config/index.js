const endpoint = require('./endpoint');
const validate = require('./validate');
const database = require('./database');
const filesStorage = require('./filesStorage');
const slack = require('./slack');

module.exports = {
  port: process.env.PORT,
  apiBaseUrl: process.env.API_BASE_URL,
  endpoint,
  validate,
  database,
  filesStorage,
  slack,
};
