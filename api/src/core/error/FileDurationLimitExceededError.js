class FileDurationLimitExceededError extends Error {
  constructor(params) {
    super(params);
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, FileDurationLimitExceededError);
    }
    this.name = 'FileDurationLimitExceededError';
  }
}

module.exports = FileDurationLimitExceededError;
