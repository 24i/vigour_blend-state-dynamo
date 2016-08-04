'use strict'
const AWS = require('aws-sdk')
module.exports = function init (key, secret, region) {
  if (region) { region = 'eu-central-1' }
  AWS.config.update({
    region: region,
    accessKeyId: key,
    secretAccessKey: secret,
    endpoint: `https://dynamodb.${region}.amazonaws.com`
  })
}
