'use strict'
const AWS = require('aws-sdk')
module.exports = function init (key, secret, region, state) {
  if (!region) { region = 'eu-central-1' }
  if (key && secret) {
    AWS.config.update({
      region: region,
      accessKeyId: key,
      secretAccessKey: secret,
      endpoint: `https://dynamodb.${region}.amazonaws.com`
    })
    state.set({ config: true, db: new AWS.DynamoDB({apiVersion: '2012-08-10'}) })
  }
}
