const formatVersion = (data) => {
  return `${data.major}.${data.minor}.${data.patch}`;
};

module.exports = formatVersion;
