class ExtractionError extends Error {
  constructor(params) {
    super(params);
    if(Error.captureStackTrace) {
      Error.captureStackTrace(this, ExtractionError);
    }
    this.name = 'ExtractionError';
  }
}

module.exports = ExtractionError;
