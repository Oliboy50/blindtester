const { promisify } = require('util');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const databasePath = path.resolve(__dirname, '../../data/database.json');

const DATABASE_KEY_FILES = 'files';
const DATABASE_DEFAULT_FILES = [];
const DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS = 'authenticatedSlackTeams';
const DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS = [];

const getDatabase = async () => {
  const defaultDatabase = {
    [DATABASE_KEY_FILES]: DATABASE_DEFAULT_FILES,
    [DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS]: DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS,
  };
  let database;
  try {
    database = JSON.parse(await readFile(databasePath));
    if (!database) {
      return defaultDatabase;
    }
  } catch (e) {
    return defaultDatabase;
  }

  return database;
};

const assignDataToDatabase = async (data) => {
  mkdirp(path.dirname(databasePath), async (err) => {
    if (err) {
      throw err;
    }

    await writeFile(databasePath, JSON.stringify(
      Object.assign({}, await getDatabase(), data),
      null,
      2
    ));
  });
};

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
