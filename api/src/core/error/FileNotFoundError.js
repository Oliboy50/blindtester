class FileNotFoundError extends Error {
  constructor(params) {
    super(params);
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, FileNotFoundError);
    }
    this.name = 'FileNotFoundError';
  }
}

module.exports = FileNotFoundError;
