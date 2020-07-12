module.exports = {
  convertDurationFromTimecodeToNumberOfSeconds: (timecode) => {
    if (typeof timecode !== 'string') {
      throw new Error('Timecode must be a string');
    }

    const matchedHoursMinutesSeconds = timecode.match(new RegExp([
      /^/,
      /(\d+)/, // hours (if "h:m:s") or minutes (if "m:s") or seconds (if "s")
      /(?::(\d+))?/, // minutes (if "h:m:s") or seconds (if "m:s")
      /(?::(\d+))?/, // seconds (if "h:m:s")
      /$/,
    ].map(r => r.source).join('')));

    if (!matchedHoursMinutesSeconds || !matchedHoursMinutesSeconds[1]) {
      throw new Error(`Cannot convert timecode [${timecode}] to number of seconds`);
    }

    if (matchedHoursMinutesSeconds[2] && matchedHoursMinutesSeconds[3]) {
      return parseInt(matchedHoursMinutesSeconds[3], 10) + (parseInt(matchedHoursMinutesSeconds[2], 10) * 60) + (parseInt(matchedHoursMinutesSeconds[1], 10) * 3600);
    }

    if (matchedHoursMinutesSeconds[2]) {
      return parseInt(matchedHoursMinutesSeconds[2], 10) + (parseInt(matchedHoursMinutesSeconds[1], 10) * 60);
    }

    return parseInt(matchedHoursMinutesSeconds[1], 10);
  },
};
