'use strict'
const config = require('./api/config')

exports.properties = {
  db: {
    id: {
      $type: 'string',
      on: {
        data: {
          id (val, stamp) {
            config(this.compute(), this.parent.secret.compute())
          }
        }
      }
    },
    secret: {
      $type: 'string',
      on: {
        data: {
          secret (val, stamp) {
            config(this.compute(), this.parent.secret.compute())
          }
        }
      }
    }
  }
}
