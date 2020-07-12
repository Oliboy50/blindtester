const router = require('express').Router();
const { createReadStream } = require('fs');
const { FILES_STORAGE_TYPE_FILESYSTEM, FILES_STORAGE_TYPE_BACKBLAZEB2 } = require('../../config/const');
const { FileDurationLimitExceededError, FileNotFoundError } = require('../core/error');
const { getFileDataForId } = require('../core/fileFinder');

router.get('/stream/:id', async (req, res) => {
  const id = req.params.id;
  let file;
  try {
    file = await getFileDataForId(id);
  } catch (e) {
    if (e instanceof FileNotFoundError) {
      return res.status(404).json({
        message: `${e.name}: ${e.message}`,
      });
    }

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

    return res.status(500).json({
      message: JSON.stringify(e),
    });
  }

  if (file.storage.type === FILES_STORAGE_TYPE_FILESYSTEM) {
    res.status(200).set('Content-Type', 'audio/mpeg');
    return createReadStream(file.storage.path).pipe(res);
  }

  if (file.storage.type === FILES_STORAGE_TYPE_BACKBLAZEB2) {
    return res.redirect(301, file.storage.url);
  }
});

module.exports = router;
