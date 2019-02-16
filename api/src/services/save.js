const { BadRequest } = require('@feathersjs/errors');
const { getFileDataForUrl } = require('../core/fileFinder');

module.exports = function (app) {
  app.use('save', {
    async find({ query }) {
      const url = query.url;
      if (!url) {
        return new BadRequest('Missing required query params "url"');
      }

      return await getFileDataForUrl(url, app);
    },
  });
};
