'use strict'
const AWS = require('aws-sdk')
module.exports = function init (key, secret, region) {
  if (region) { region = 'eu-central-1' }
  if (key && secret) {
    console.log('config!')
    AWS.config.update({
      region: region,
      accessKeyId: key,
      secretAccessKey: secret,
      endpoint: `https://dynamodb.${region}.amazonaws.com`
    })
  }
}
