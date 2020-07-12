describe(`validate config`, () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it(`returns empty validate config when no env vars`, () => {
    process.env = {};

    expect(require('./validate')).toEqual({
      maxFileDurationInSeconds: undefined,
    });
  });

  it(`returns empty validate config when invalid env vars`, () => {
    process.env = {
      ...process.env,
      VALIDATE_MAX_FILE_DURATION_IN_SECONDS: -1,
    };

    expect(require('./validate')).toEqual({
      maxFileDurationInSeconds: undefined,
    });
  });

  it(`returns not empty validate config when all env vars`, () => {
    process.env = {
      ...process.env,
      VALIDATE_MAX_FILE_DURATION_IN_SECONDS: 1234,
    };

    expect(require('./validate')).toEqual({
      maxFileDurationInSeconds: 1234,
    });
  });
});
