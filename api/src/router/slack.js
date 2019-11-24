const router = require('express').Router();
const { stringify } = require('querystring');
const axios = require('axios');
const config = require('../../config');
const { addAuthenticatedSlackTeam } = require('../core/database');
const { getFileDataForUrl } = require('../core/fileFinder');
const { getListeningUrlForFile } = require('../core/urlFinder');

router.get('/slack-oauth-slack-button', async (req, res, next) => {
  try {
    if (config.slack.slackButtonState && (req.query.state !== config.slack.slackButtonState)) {
      return res.status(503).json({
        message: 'Slack Button state is invalid',
      });
    }

    if (req.query.error) {
      return res.status(503).json({
        message: 'You have to authorize this application to access some data in order to use it',
      });
    }

    const code = req.query.code;
    if (!code) {
      return res.status(400).json({
        message: 'Missing required query params "code"',
      });
    }

    let oauthAccessData;
    try {
      oauthAccessData = (await axios.post(
        'https://slack.com/api/oauth.access',
        stringify({
          client_id: config.slack.clientId,
          client_secret: config.slack.clientSecret,
          code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        },
      )).data;
    } catch (e) {
      const errMessage = `[slack] "oauth.access" failed`;
      // eslint-disable-next-line no-console
      console.log(errMessage, e);
      return res.status(500).json({
        message: errMessage,
      });
    }

    if (oauthAccessData.error || !oauthAccessData.team_id || !oauthAccessData.team_name || !oauthAccessData.user_id || !oauthAccessData.access_token) {
      const errMessage = `[slack] "oauth.access" invalid response`;
      // eslint-disable-next-line no-console
      console.log(errMessage, oauthAccessData);
      return res.status(500).json({
        message: errMessage,
      });
    }

    await addAuthenticatedSlackTeam({
      id: oauthAccessData.team_id,
      name: oauthAccessData.team_name,
      userId: oauthAccessData.user_id,
      token: oauthAccessData.access_token,
    });

    return res.status(200).json({
      success: 'Your team can start using this application right now!',
    });
  } catch (e) {
    next(e);
  }
});

router.post('/slack-command', async (req, res, next) => {
  try {
    if (typeof req.body !== 'object') {
      return res.status(400).json({
        message: 'Missing body',
      });
    }

    if (config.slack.verificationToken && (req.body.token !== config.slack.verificationToken)) {
      return res.status(403).json({
        message: 'Slack verification token is invalid',
      });
    }

    // @TODO support something else than YouTube
    let matchedParams;
    try {
      matchedParams = req.body.text.match(
        new RegExp([
          /^/,
          /<((?:https?:\/\/)?(?:(?:www\.)?youtube\.com|youtu\.?be)\/.+)>/, // required url
          /(?: (?:"(.*?)"|(\S+)))?/, // optional difficulty
          /(?: (?:"(.*?)"|(\S+)))?/, // optional date
          /$/,
        ].map(r => r.source).join('')),
      );
    } catch (e) {} // eslint-disable-line no-empty

    if(!matchedParams || !matchedParams[1]) {
      return res.status(200).json({
        response_type: 'ephemeral',
        text: `Paste a YouTube video URL and optionally include difficulty and/or date information.
Examples:
${req.body.command} https://www.youtube.com/watch?v=dQw4w9WgXcQ
${req.body.command} https://www.youtube.com/watch?v=dQw4w9WgXcQ :egg: 1992
${req.body.command} https://www.youtube.com/watch?v=dQw4w9WgXcQ "difficulty wrapped in double quotes" "date wrapped in double quotes"
${req.body.command} https://www.youtube.com/watch?v=dQw4w9WgXcQ "only difficulty"
${req.body.command} https://www.youtube.com/watch?v=dQw4w9WgXcQ "" "only date"
`,
      });
    }

    getFileDataForUrl(matchedParams[1]).then(async (file) => {
      const difficulty = matchedParams[2] || matchedParams[3];
      const date = matchedParams[4] || matchedParams[5];

      const urlToAudioFile = await getListeningUrlForFile(file);

      // send response to response_url to avoid showing original slash command message
      try {
        await axios.post(req.body.response_url, {
          response_type: 'in_channel',
          attachments: [
            {
              color: '#11aadd',
              author_name: `<@${req.body.user_name}> made a blind test`,
              title: ':point_right: CLICK HERE TO LISTEN :point_left:',
              title_link: urlToAudioFile,
              fields: [
                ...(difficulty ? [{
                  title: 'Difficulty',
                  value: difficulty,
                  short: true,
                }] : []),
                ...(date ? [{
                  title: 'Date',
                  value: date,
                  short: true,
                }] : []),
              ],
              footer: 'please answer in thread to avoid spoiling everyone',
              fallback: `NEW BLIND TEST -> ${urlToAudioFile}`,
            },
          ],
        });
      } catch (e) {
        // eslint-disable-next-line no-console
        console.log(`[slack] "blindtest callback" failed`, e);
      }
    });

    // send back ephemeral response to remove original slash command message
    return res.status(200).json({
      response_type: 'ephemeral',
      attachments: [
        {
          color: 'good',
          text: `Success! I'll post back your blind test in a few seconds :smile_cat:`,
        },
      ],
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
