const config = require('../../../config');
const { getFiles, saveFiles, addAuthenticatedSlackTeam } = require(`./${config.database.type}`);

module.exports = {
  getFiles,
  saveFiles,
  addAuthenticatedSlackTeam,
};
