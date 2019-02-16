const { resolve } = require('path');
const { spawn } = require('child_process');

module.exports = {
  async extractAudioFromUrl(url, id, filesStorageConfig) {
    // extract audio from url in a detached process
    // using spawn without shell mode to avoid command injection
    spawn(
      'youtube-dl',
      [
        '--output',
        `${resolve(filesStorageConfig.filesystem.path, id)}.%(ext)s`,
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
    ).unref();
  },
};
