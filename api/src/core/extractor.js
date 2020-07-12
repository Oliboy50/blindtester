const { resolve } = require('path');
const { spawn } = require('child_process');
const { ExtractionError } = require('./error');
const config = require('../../config');
const { FILES_STORAGE_TYPE_FILESYSTEM } = require('../../config/const');

module.exports = {
  async extractAudioFileFromUrlAndReturnItsFilesystemPath(url, id) {
    const audioFilePathWithoutExtension = resolve(config.filesStorage[FILES_STORAGE_TYPE_FILESYSTEM].path, id);

    await new Promise((resolve, reject) => {
      const extractionCommand = spawn(
        'youtube-dl',
        [
          '--output',
          `${audioFilePathWithoutExtension}.%(ext)s`,
          '--prefer-ffmpeg',
          '--ffmpeg-location',
          '/usr/bin',
          '--no-playlist',
          '--extract-audio',
          '--audio-format',
          'mp3',
          url,
        ],
        {
          stdio: 'ignore',
          detached: true,
        },
      );

      extractionCommand.on('error', (err) => {
        const errorMessage = `Audio file extraction failed for url [${url}] and id [${id}]. Error: ${err.message}`;
        // eslint-disable-next-line no-console
        console.log(errorMessage);
        reject(new ExtractionError(errorMessage));
      });

      extractionCommand.on('exit', (code) => {
        if (code !== 0) {
          const errorMessage = `Exit code [${code}] for url [${url}] and id [${id}]`;
          // eslint-disable-next-line no-console
          console.log(errorMessage);
          reject(new ExtractionError(errorMessage));
          return;
        }

        resolve();
      });
    });

    return `${audioFilePathWithoutExtension}.mp3`;
  },
};
