module.exports = {
  save: {
    enabled: process.env.ENDPOINT_SAVE_ENABLED === 'true',
  },
  stream: {
    enabled: process.env.ENDPOINT_STREAM_ENABLED === 'true',
  },
  slack: {
    enabled: process.env.ENDPOINT_SLACK_ENABLED === 'true',
  },
};
