const { resolve } = require('path');
const { existsSync } = require('fs');
const { BadRequest, Forbidden, NotFound, Unavailable, GeneralError } = require('@feathersjs/errors');
const uniqid = require('uniqid');
const axios = require('axios');
const { stringify } = require('querystring');

const { extractAudioFromUrl } = require('../core/extractor');
const { getFiles, saveFiles, addAuthenticatedSlackTeam } = require('../core/store');
const { streamResponseFile } = require('../middlewares/stream');

const getFileForUrl = async (url, app) => {
  // check if file already exists
  const files = await getFiles(app.get('database'));
  let file = files.find((file) => file.url === url);
  if (file) {
    return file;
  }

  // create new file ref
  file = {
    id: uniqid(),
    url,
  };

  // extract audio from url without waiting for the response
  extractAudioFromUrl(url, file.id, app.get('filesStorage'));

  // save new file ref
  files.push(file);
  try {
    await saveFiles(app.get('database'), files);
  } catch (err) {
    return new GeneralError(err);
  }

  return file;
};

module.exports = function (app) {
  app.use('slack-oauth-slack-button', {
    async find({ query }) {
      const slackConfig = app.get('slack');
      if (slackConfig.slackButtonState && (query.state !== slackConfig.slackButtonState)) {
        return new Forbidden('Slack Button state is invalid');
      }

      if (query.error) {
        return new Forbidden('You have to authorize this application to access some data in order to use it');
      }

      const code = query.code;
      if (!code) {
        return new BadRequest('Missing required query params "code"');
      }

      const { data } = await axios.post(
        'https://slack.com/api/oauth.access',
        stringify({
          client_id: slackConfig.clientId,
          client_secret: slackConfig.clientSecret,
          code,
        }),
        {
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        }
      );

      if (data.error) {
        return new GeneralError(data.error);
      }

      await addAuthenticatedSlackTeam(app.get('database'), {
        id: data.team_id,
        name: data.team_name,
        userId: data.user_id,
        token: data.access_token,
      });

      return {
        success: 'Your team can start to use this application right now!',
      };
    },
  });

  app.use('save', {
    async find({ query }) {
      const url = query.url;
      if (!url) {
        return new BadRequest('Missing required query params "url"');
      }

      return await getFileForUrl(url, app);
    },
  });

  app.use('slack-command', {
    async create({ token, text, response_url, user_name }) {
      const slackConfig = app.get('slack');
      if (slackConfig.verificationToken && (token !== slackConfig.verificationToken)) {
        return new Forbidden('Slack verification token is invalid');
      }

      const matchedParams = text.match(
        new RegExp([
          /^/,
          /<((?:https?:\/\/)?(?:(?:www\.)?youtube\.com|youtu\.?be)\/.+)>/, // required url
          /(?: (?:"(.*?)"|(\S+)))?/, // optional difficulty
          /(?: (?:"(.*?)"|(\S+)))?/, // optional date
          /$/,
        ].map(r => r.source).join(''))
      );
      if(!matchedParams || !matchedParams[1]) {
        return {
          response_type: 'ephemeral',
          text: `Sorry, I didn't understand. Please paste a YouTube video URL and optionally include difficulty and/or date information.
Examples:
/blindtest https://www.youtube.com/watch?v=dQw4w9WgXcQ
/blindtest https://www.youtube.com/watch?v=dQw4w9WgXcQ :egg: 1992
/blindtest https://www.youtube.com/watch?v=dQw4w9WgXcQ "difficulty wrapped in double quotes" "date wrapped in double quotes"
/blindtest https://www.youtube.com/watch?v=dQw4w9WgXcQ "only difficulty"
/blindtest https://www.youtube.com/watch?v=dQw4w9WgXcQ "" "only date"
`,
        };
      }

      const { id } = await getFileForUrl(matchedParams[1], app);
      const difficulty = matchedParams[2] || matchedParams[3];
      const date = matchedParams[4] || matchedParams[5];
      const streamUrl = `${app.get('realBaseUrl')}/stream/${id}`;

      // send response to response_url to avoid showing original slash command message
      axios.post(response_url, {
        response_type: 'in_channel',
        attachments: [
          {
            color: '#11aadd',
            author_name: `<@${user_name}> just slacked a new blind test`,
            title: ':point_right: CLICK HERE TO LISTEN :point_left:',
            title_link: streamUrl,
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
            fallback: `NEW BLIND TEST -> ${streamUrl}`,
          },
        ],
      });

      // send back ephemeral response to remove original slash command message
      return {
        response_type: 'ephemeral',
        attachments: [
          {
            color: 'good',
            text: 'Blind test successfully created',
          },
        ],
      };
    },
  });

  app.use('stream', {
    async get(id) {
      const file = (await getFiles(app.get('database'))).find((file) => file.id === id);
      if (!file) {
        return new NotFound(`No file corresponding to "${id}"`);
      }

      const fileName = `${id}.mp3`;
      if (!existsSync(resolve(app.get('filesStorage').filesystem.path, fileName))) {
        return new Unavailable('The audio file is being extracted and should be available within a few seconds');
      }

      return fileName;
    },
  }, streamResponseFile(app.get('filesStorage')));
};
