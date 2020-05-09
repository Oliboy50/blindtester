const { FILES_STORAGE_TYPE_FILESYSTEM, FILES_STORAGE_TYPE_BACKBLAZEB2 } = require('./const');

describe(`filesStorage config`, () => {
  beforeEach(() => {
    jest.resetModules();
    process.env = {};
  });

  it(`throws if FILES_STORAGE_TYPE is empty`, () => {
    process.env = {
      ...process.env,
      FILES_STORAGE_TYPE: '',
    };

    expect(() => {
      require('./filesStorage');
    }).toThrowError(`Invalid "FILES_STORAGE_TYPE"`);
  });

  describe(`FILES_STORAGE_TYPE is ${FILES_STORAGE_TYPE_FILESYSTEM}`, () => {
    beforeEach(() => {
      process.env = {
        ...process.env,
        FILES_STORAGE_TYPE: FILES_STORAGE_TYPE_FILESYSTEM,
      };
    });

    it(`throws if FILES_STORAGE_FILESYSTEM_PATH is empty`, () => {
      process.env = {
        ...process.env,
        FILES_STORAGE_FILESYSTEM_PATH: '',
      };

      expect(() => {
        require('./filesStorage');
      }).toThrowError(`Invalid "FILES_STORAGE_FILESYSTEM_PATH"`);
    });

    it(`returns filesStorage config`, () => {
      process.env = {
        ...process.env,
        FILES_STORAGE_FILESYSTEM_PATH: '/home/node/app/data/audio',
      };

      expect(require('./filesStorage')).toEqual({
        type: FILES_STORAGE_TYPE_FILESYSTEM,
        [FILES_STORAGE_TYPE_FILESYSTEM]: {
          path: '/home/node/app/data/audio',
        },
        [FILES_STORAGE_TYPE_BACKBLAZEB2]: {
          keyId: undefined,
          applicationKey: undefined,
          bucketId: undefined,
        },
      });
    });
  });

  describe(`FILES_STORAGE_TYPE is ${FILES_STORAGE_TYPE_BACKBLAZEB2}`, () => {
    beforeEach(() => {
      process.env = {
        ...process.env,
        FILES_STORAGE_TYPE: FILES_STORAGE_TYPE_BACKBLAZEB2,
      };
    });

    it(`throws if FILES_STORAGE_BACKBLAZEB2_KEY_ID is empty`, () => {
      process.env = {
        ...process.env,
        FILES_STORAGE_BACKBLAZEB2_KEY_ID: '',
        FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY: 'not empty',
        FILES_STORAGE_BACKBLAZEB2_BUCKET_ID: 'not empty',
      };

      expect(() => {
        require('./filesStorage');
      }).toThrowError(`Invalid "FILES_STORAGE_BACKBLAZEB2_KEY_ID"`);
    });

    it(`throws if FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY is empty`, () => {
      process.env = {
        ...process.env,
        FILES_STORAGE_BACKBLAZEB2_KEY_ID: 'not empty',
        FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY: '',
        FILES_STORAGE_BACKBLAZEB2_BUCKET_ID: 'not empty',
      };

      expect(() => {
        require('./filesStorage');
      }).toThrowError(`Invalid "FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY"`);
    });

    it(`throws if FILES_STORAGE_BACKBLAZEB2_BUCKET_ID is empty`, () => {
      process.env = {
        ...process.env,
        FILES_STORAGE_BACKBLAZEB2_KEY_ID: 'not empty',
        FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY: 'not empty',
        FILES_STORAGE_BACKBLAZEB2_BUCKET_ID: '',
      };

      expect(() => {
        require('./filesStorage');
      }).toThrowError(`Invalid "FILES_STORAGE_BACKBLAZEB2_BUCKET_ID"`);
    });

    it(`returns filesStorage config`, () => {
      process.env = {
        ...process.env,
        FILES_STORAGE_BACKBLAZEB2_KEY_ID: 'not empty',
        FILES_STORAGE_BACKBLAZEB2_APPLICATION_KEY: 'not empty',
        FILES_STORAGE_BACKBLAZEB2_BUCKET_ID: 'not empty',
      };

      expect(require('./filesStorage')).toEqual({
        type: FILES_STORAGE_TYPE_BACKBLAZEB2,
        [FILES_STORAGE_TYPE_FILESYSTEM]: {
          path: undefined,
        },
        [FILES_STORAGE_TYPE_BACKBLAZEB2]: {
          keyId: 'not empty',
          applicationKey: 'not empty',
          bucketId: 'not empty',
        },
      });
    });
  });
});
