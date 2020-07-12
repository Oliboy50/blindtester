const router = require('express').Router();
const { FileDurationLimitExceededError } = require('../core/error');
const { getFileDataForUrl } = require('../core/fileFinder');
const { getListeningUrlForFile } = require('../core/urlFinder');

router.get('/save', async (req, res, next) => {
  try {
    const url = req.query.url;
    // @TODO make sure url is valid (see slack URL matcher)
    if (!url) {
      return res.status(400).json({
        message: 'Missing required query params "url"',
      });
    }

    const file = await getFileDataForUrl(url);

    return res.redirect(301, await getListeningUrlForFile(file));
  } catch (e) {
    if (e instanceof FileDurationLimitExceededError) {
      return res.status(400).json({
        message: `${e.name}: ${e.message}`,
      });
    }

    if (e instanceof Error) {
      return res.status(500).json({
        message: `${e.name}: ${e.message}`,
      });
    }

    next(e);
  }
});

module.exports = router;
