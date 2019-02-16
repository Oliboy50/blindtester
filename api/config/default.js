module.exports = {
  port: process.env.PORT,
  realBaseUrl: process.env.API_BASE_URL,
  slack: {
    verificationToken: process.env.SLACK_VERIFICATION_TOKEN,
    slackButtonState: process.env.SLACK_SLACK_BUTTON_STATE,
    clientId: process.env.SLACK_CLIENT_ID,
    clientSecret: process.env.SLACK_CLIENT_SECRET,
  },
};
