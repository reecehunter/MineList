const formatVersion = (major, minor, patch) => {
  if (major.startsWith("0")) major = major.slice(1, 2);
  if (minor.startsWith("0")) minor = minor.slice(1, 2);
  if (patch.startsWith("0")) patch = patch.slice(1, 2);
  return `v${major}.${minor}.${patch}`;
};

module.exports = formatVersion;
