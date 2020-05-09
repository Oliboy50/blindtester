const { DATABASE_TYPE_JSON, DATABASE_JSON_TYPE_FILESYSTEM, DATABASE_JSON_TYPE_BACKBLAZEB2 } = require('./const');

describe(`database config`, () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it(`throws if DATABASE_TYPE is empty`, () => {
    process.env = {
      ...process.env,
      DATABASE_TYPE: '',
    };

    expect(() => {
      require('./database');
    }).toThrowError(`Invalid "DATABASE_TYPE"`);
  });

  describe(`DATABASE_TYPE is ${DATABASE_TYPE_JSON}`, () => {
    beforeEach(() => {
      process.env = {
        ...process.env,
        DATABASE_TYPE: DATABASE_TYPE_JSON,
      };
    });

    it(`throws if DATABASE_JSON_TYPE is invalid`, () => {
      process.env = {
        ...process.env,
        DATABASE_JSON_TYPE: 'invalid',
      };

      expect(() => {
        require('./database');
      }).toThrowError(`Invalid "DATABASE_JSON_TYPE"`);
    });

    describe(`DATABASE_JSON_TYPE is ${DATABASE_JSON_TYPE_FILESYSTEM}`, () => {
      beforeEach(() => {
        process.env = {
          ...process.env,
          DATABASE_JSON_TYPE: DATABASE_JSON_TYPE_FILESYSTEM,
        };
      });

      it(`throws if DATABASE_JSON_FILESYSTEM_PATH is empty`, () => {
        process.env = {
          ...process.env,
          DATABASE_JSON_FILESYSTEM_PATH: '',
        };

        expect(() => {
          require('./database');
        }).toThrowError(`Invalid "DATABASE_JSON_FILESYSTEM_PATH"`);
      });

      it(`returns database config`, () => {
        process.env = {
          ...process.env,
          DATABASE_JSON_FILESYSTEM_PATH: 'not empty',
        };

        expect(require('./database')).toEqual({
          [DATABASE_TYPE_JSON]: {
            [DATABASE_JSON_TYPE_BACKBLAZEB2]: {
              applicationKey: undefined,
              bucketId: undefined,
              bucketName: undefined,
              fileName: undefined,
              keyId: undefined,
            },
            [DATABASE_JSON_TYPE_FILESYSTEM]: {
              path: 'not empty',
            },
            type: DATABASE_JSON_TYPE_FILESYSTEM,
          },
          type: DATABASE_TYPE_JSON,
        });
      });
    });

    describe(`DATABASE_JSON_TYPE is ${DATABASE_JSON_TYPE_BACKBLAZEB2}`, () => {
      beforeEach(() => {
        process.env = {
          ...process.env,
          DATABASE_JSON_TYPE: DATABASE_JSON_TYPE_BACKBLAZEB2,
        };
      });

      it(`throws if DATABASE_JSON_BACKBLAZEB2_KEY_ID is empty`, () => {
        process.env = {
          ...process.env,
          DATABASE_JSON_BACKBLAZEB2_KEY_ID: '',
          DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_FILE_NAME: 'not empty',
        };

        expect(() => {
          require('./database');
        }).toThrowError(`Invalid "DATABASE_JSON_BACKBLAZEB2_KEY_ID"`);
      });

      it(`throws if DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY is empty`, () => {
        process.env = {
          ...process.env,
          DATABASE_JSON_BACKBLAZEB2_KEY_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY: '',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_FILE_NAME: 'not empty',
        };

        expect(() => {
          require('./database');
        }).toThrowError(`Invalid "DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY"`);
      });

      it(`throws if DATABASE_JSON_BACKBLAZEB2_BUCKET_ID is empty`, () => {
        process.env = {
          ...process.env,
          DATABASE_JSON_BACKBLAZEB2_KEY_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_ID: '',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_FILE_NAME: 'not empty',
        };

        expect(() => {
          require('./database');
        }).toThrowError(`Invalid "DATABASE_JSON_BACKBLAZEB2_BUCKET_ID"`);
      });

      it(`throws if DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME is empty`, () => {
        process.env = {
          ...process.env,
          DATABASE_JSON_BACKBLAZEB2_KEY_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME: '',
          DATABASE_JSON_BACKBLAZEB2_FILE_NAME: 'not empty',
        };

        expect(() => {
          require('./database');
        }).toThrowError(`Invalid "DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME"`);
      });

      it(`throws if DATABASE_JSON_BACKBLAZEB2_FILE_NAME is empty`, () => {
        process.env = {
          ...process.env,
          DATABASE_JSON_BACKBLAZEB2_KEY_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_FILE_NAME: '',
        };

        expect(() => {
          require('./database');
        }).toThrowError(`Invalid "DATABASE_JSON_BACKBLAZEB2_FILE_NAME"`);
      });

      it(`returns database config`, () => {
        process.env = {
          ...process.env,
          DATABASE_JSON_BACKBLAZEB2_KEY_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_APPLICATION_KEY: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_ID: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_BUCKET_NAME: 'not empty',
          DATABASE_JSON_BACKBLAZEB2_FILE_NAME: 'not empty',
        };

        expect(require('./database')).toEqual({
          [DATABASE_TYPE_JSON]: {
            [DATABASE_JSON_TYPE_BACKBLAZEB2]: {
              applicationKey: 'not empty',
              bucketId: 'not empty',
              bucketName: 'not empty',
              fileName: 'not empty',
              keyId: 'not empty',
            },
            [DATABASE_JSON_TYPE_FILESYSTEM]: {
              path: undefined,
            },
            type: DATABASE_JSON_TYPE_BACKBLAZEB2,
          },
          type: DATABASE_TYPE_JSON,
        });
      });
    });
  });
});
