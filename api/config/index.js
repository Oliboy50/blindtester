const endpoint = require('./endpoint');
const database = require('./database');
const filesStorage = require('./filesStorage');
const slack = require('./slack');

module.exports = {
  port: process.env.PORT,
  realBaseUrl: process.env.API_BASE_URL,
  endpoint,
  database,
  filesStorage,
  slack,
};
