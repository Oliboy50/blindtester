const maxFileDurationInSeconds = parseInt(process.env.VALIDATE_MAX_FILE_DURATION_IN_SECONDS, 10);

module.exports = {
  maxFileDurationInSeconds: maxFileDurationInSeconds > 0 ? maxFileDurationInSeconds : undefined,
};
