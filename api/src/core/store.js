const { promisify } = require('util');
const path = require('path');
const mkdirp = require('mkdirp');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

const DATABASE_KEY_FILES = 'files';
const DATABASE_DEFAULT_FILES = [];
const DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS = 'authenticatedSlackTeams';
const DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS = [];

const getDatabase = async (databaseConfig) => {
  const defaultDatabase = {
    [DATABASE_KEY_FILES]: DATABASE_DEFAULT_FILES,
    [DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS]: DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS,
  };
  let database;
  try {
    database = JSON.parse(await readFile(databaseConfig.filesystem.path));
    if (!database) {
      return defaultDatabase;
    }
  } catch (e) {
    return defaultDatabase;
  }

  return database;
};

const assignDataToDatabase = async (databaseConfig, data) => {
  mkdirp(path.dirname(databaseConfig.filesystem.path), async (err) => {
    if (err) {
      throw err;
    }

    await writeFile(databaseConfig.filesystem.path, JSON.stringify(
      Object.assign({}, await getDatabase(databaseConfig), data),
      null,
      2
    ));
  });
};

const getFiles = async (databaseConfig) => {
  const database = await getDatabase(databaseConfig);
  if (!database[DATABASE_KEY_FILES] || !Array.isArray(database[DATABASE_KEY_FILES])) {
    return DATABASE_DEFAULT_FILES;
  }

  return database[DATABASE_KEY_FILES];
};

const saveFiles = async (databaseConfig, files) => {
  await assignDataToDatabase(databaseConfig, {
    [DATABASE_KEY_FILES]: files,
  });
};

const getAuthenticatedSlackTeams = async (databaseConfig) => {
  const database = await getDatabase(databaseConfig);
  if (!database[DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS] || !Array.isArray(database[DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS])) {
    return DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS;
  }

  return database[DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS];
};

const addAuthenticatedSlackTeam = async (databaseConfig, team) => {
  const teams = await getAuthenticatedSlackTeams();
  teams.push(team);
  await assignDataToDatabase(databaseConfig, {
    [DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS]: teams,
  });
};

module.exports = {
  getFiles,
  saveFiles,
  addAuthenticatedSlackTeam,
};
