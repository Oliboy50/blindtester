const router = require('express').Router();
const { createReadStream } = require('fs');
const { FILES_STORAGE_TYPE_FILESYSTEM, FILES_STORAGE_TYPE_BACKBLAZEB2 } = require('../../config/const');
const { getFileDataForId } = require('../core/fileFinder');

router.get('/stream/:id', async (req, res) => {
  const id = req.params.id;
  let file;
  try {
    file = await getFileDataForId(id);
  } catch (e) {
    return res.status(404).json({
      message: `No file corresponding to "${id}"`,
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
