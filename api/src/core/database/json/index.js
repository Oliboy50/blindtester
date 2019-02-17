const config = require('../../../../config');
const { DATABASE_TYPE_JSON } = require('../../../../config/const');
const { getDatabase, assignDataToDatabase } = require(`./${config.database[DATABASE_TYPE_JSON].type}`);
const { DATABASE_KEY_FILES, DATABASE_DEFAULT_FILES, DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS, DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS } = require('./const');

const getFiles = async () => {
  const database = await getDatabase();
  if (!database[DATABASE_KEY_FILES] || !Array.isArray(database[DATABASE_KEY_FILES])) {
    return DATABASE_DEFAULT_FILES;
  }

  return database[DATABASE_KEY_FILES];
};

const saveFiles = async (files) => {
  await assignDataToDatabase({
    [DATABASE_KEY_FILES]: files,
  });
};

const getAuthenticatedSlackTeams = async () => {
  const database = await getDatabase();
  if (!database[DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS] || !Array.isArray(database[DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS])) {
    return DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS;
  }

  return database[DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS];
};

const addAuthenticatedSlackTeam = async (team) => {
  const teams = await getAuthenticatedSlackTeams();
  teams.push(team);
  await assignDataToDatabase({
    [DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS]: teams,
  });
};

module.exports = {
  getFiles,
  saveFiles,
  addAuthenticatedSlackTeam,
};
