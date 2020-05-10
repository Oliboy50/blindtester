describe(`endpoint config`, () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it(`returns endpoint config with disabled endpoints when no env vars`, () => {
    process.env = {};

    expect(require('./endpoint')).toEqual({
      save: {
        enabled: false,
      },
      stream: {
        enabled: false,
      },
      slack: {
        enabled: false,
      },
    });
  });

  it(`returns endpoint config with enabled endpoints when all env vars are "true"`, () => {
    process.env = {
      ...process.env,
      ENDPOINT_SAVE_ENABLED: 'true',
      ENDPOINT_STREAM_ENABLED: 'true',
      ENDPOINT_SLACK_ENABLED: 'true',
    };

    expect(require('./endpoint')).toEqual({
      save: {
        enabled: true,
      },
      stream: {
        enabled: true,
      },
      slack: {
        enabled: true,
      },
    });
  });
});
