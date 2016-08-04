'use strict'
const config = require('./api/config')
const table = require('./api/table')

exports.properties = {
  db: {
    properties: { db: true },
    id: {
      $type: 'string',
      on: {
        data: {
          id (val, stamp) {
            config(this.compute(), this.parent.secret.compute(), false, this.parent)
          }
        }
      }
    },
    secret: {
      $type: 'string',
      on: {
        data: {
          secret (val, stamp) {
            config(this.compute(), this.parent.secret.compute(), false, this.parent)
          }
        }
      }
    },
    config: false,
    table: {
      $type: 'string',
      on: {
        data: {
          table (val, stamp) {
            this.parent.config.is(true, () => table(val, this.parent))
          }
        }
      }
    }
  }
}
