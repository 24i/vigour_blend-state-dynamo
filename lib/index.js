'use strict'
const config = require('./api/config')
const table = require('./api/table')
const removeTable = require('./api/table/remove')

exports.properties = {
  db: {
    properties: { db: true },
    hasTable: false,
    define: {
      in (state) {

      },
      out (state) {
        console.log('here we find the context')
      }
    },
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
            config(this.parent.id.compute(), this.compute(), false, this.parent)
          }
        }
      }
    },
    config: false,
    table: {
      $type: 'string',
      properties: { last: true },
      on: {
        remove: {
          table (val, stamp) {
            removeTable(this.last, this.parent.db, this.parent)
          }
        },
        data: {
          table (val, stamp) {
            if (val !== null) {
              this.last = val
              this.parent.config.is(true, () => table(val, this.parent))
            }
          }
        }
      }
    }
  }
}
