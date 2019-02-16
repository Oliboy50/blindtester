const getFallbackIfNotAllowedDatabaseType = (type) => ['filesystem'].includes(type) ? type : 'filesystem';
const getFallbackIfNotAllowedFilesStorageType = (type) => ['filesystem'].includes(type) ? type : 'filesystem';

module.exports = {
  port: process.env.PORT,
  realBaseUrl: process.env.API_BASE_URL,
  database: {
    type: getFallbackIfNotAllowedDatabaseType(process.env.DATABASE_TYPE),
    filesystem: {
      path: process.env.DATABASE_FILESYSTEM_PATH,
    },
  },
  filesStorage: {
    type: getFallbackIfNotAllowedFilesStorageType(process.env.FILES_STORAGE_TYPE),
    filesystem: {
      path: process.env.FILES_STORAGE_FILESYSTEM_PATH,
    },
  },
  slack: {
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
    verificationToken: process.env.SLACK_VERIFICATION_TOKEN,
    slackButtonState: process.env.SLACK_SLACK_BUTTON_STATE,
  },
};
