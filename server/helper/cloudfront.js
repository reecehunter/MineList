const { getSignedUrl } = require("@aws-sdk/cloudfront-signer");
const config = require("../config/config");

function getCloudfrontSignedUrl(path) {
  return getSignedUrl({
    url: config.aws.cloudfront.url + path,
    dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 1), // 1 day
    privateKey: config.aws.cloudfront.privateKey,
    keyPairId: config.aws.cloudfront.keyPairId,
  });
}

module.exports = { getCloudfrontSignedUrl };
