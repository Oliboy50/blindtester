const { resolve } = require('path');
const { spawn } = require('child_process');
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
        }
      );

      extractionCommand.on('error', (err) => {
        // eslint-disable-next-line no-console
        console.log(`Audio file extraction failed for url [${url}] and id [${id}]`, err);

        reject(err);
      });

      extractionCommand.on('exit', (code) => {
        if (code !== 0) {
          // eslint-disable-next-line no-console
          console.log(`Exit code [${code}] for url [${url}] and id [${id}]`);

          reject(code);
          return;
        }

        resolve();
      });
    });

    return `${audioFilePathWithoutExtension}.mp3`;
  },
};
