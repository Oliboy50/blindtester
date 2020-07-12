const { convertDurationFromTimecodeToNumberOfSeconds } = require('./durationConverter');

describe(`durationConverter`, () => {
  describe(`convertDurationFromTimecodeToNumberOfSeconds`, () => {
    it(`throws if timecode is not a string`, () => {
      expect(() => {
        convertDurationFromTimecodeToNumberOfSeconds(0);
      }).toThrow();
    });

    it(`throws if timecode is does not contain any number`, () => {
      expect(() => {
        convertDurationFromTimecodeToNumberOfSeconds('abc');
      }).toThrow();
    });

    [
      {
        input: '0',
        output: 0,
      },
      {
        input: '59',
        output: 59,
      },
      {
        input: '0:00',
        output: 0,
      },
      {
        input: '00:59',
        output: 59,
      },
      {
        input: '59:00',
        output: 3540,
      },
      {
        input: '0:00:00',
        output: 0,
      },
      {
        input: '0:00:59',
        output: 59,
      },
      {
        input: '0:59:00',
        output: 3540,
      },
      {
        input: '1234:00:00',
        output: 4442400,
      },
      {
        input: '1:01:01',
        output: 3661,
      },
    ].forEach(({input, output}) => {
      it(`returns ${output} for ${input}`, () => {
        expect(convertDurationFromTimecodeToNumberOfSeconds(input)).toBe(output);
      });
    });
  });
});
