const { resolve } = require('path');
const { exec, spawn } = require('child_process');
const config = require('../../config');
const { FILES_STORAGE_TYPE_FILESYSTEM } = require('../../config/const');
const { convertDurationFromTimecodeToNumberOfSeconds } = require('./durationConverter');
const { ExtractionError } = require('./error');

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
        const errorMessage = `Failed to extract audio file for url [${url}] and id [${id}]. Error: ${err.message}`;
        // eslint-disable-next-line no-console
        console.log(errorMessage);
        reject(new ExtractionError(errorMessage));
      });

      extractionCommand.on('exit', (code) => {
        if (code !== 0) {
          const errorMessage = `Audio file extraction exit code [${code}] for url [${url}] and id [${id}]`;
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
  async getFileDurationInSecondsFromUrl(url) {
    const durationAsTimecode = await new Promise((resolve, reject) => {
      exec(`youtube-dl --skip-download --get-duration ${url}`, (err, stdout, stderr) => {
        if (stderr) {
          const errorMessage = `Failed to compute file duration for url [${url}]. Error: ${String(stderr).trim()}`;
          // eslint-disable-next-line no-console
          console.log(errorMessage);
          reject(new Error(errorMessage));
          return;
        }

        if (err) {
          const errorMessage = `Error while computing file duration for url [${url}]. Error: ${err.message}`;
          // eslint-disable-next-line no-console
          console.log(errorMessage);
          reject(new Error(errorMessage));
          return;
        }

        resolve(String(stdout).trim());
      });
    });

    return convertDurationFromTimecodeToNumberOfSeconds(durationAsTimecode);
  },
};
