const DATABASE_KEY_FILES = 'files';
const DATABASE_DEFAULT_FILES = [];
const DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS = 'authenticatedSlackTeams';
const DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS = [];

module.exports = {
  EMPTY_DATABASE: {
    [DATABASE_KEY_FILES]: DATABASE_DEFAULT_FILES,
    [DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS]: DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS,
  },
  DATABASE_KEY_FILES,
  DATABASE_KEY_AUTHENTICATED_SLACK_TEAMS,
  DATABASE_DEFAULT_FILES,
  DATABASE_DEFAULT_AUTHENTICATED_SLACK_TEAMS,
};
