'use strict'
const config = require('./api/config')
const table = require('./api/table')
const removeTable = require('./api/table/remove')
const update = require('./api/update')

exports.properties = {
  db: {
    properties: {
      db: true,
      out: true,
      in: true
    },
    hasTable: false,
    in (state) {

    },
    out (state, context, key, val, stamp) {
      return {
        context: context || this.root.get('context', false).compute(),
        key: key || state.path().join('.'),
        stamp: stamp || state.stamp,
        val: val || state.val
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

exports.child = {
  on: {
    data: {
      db () {
        if (this.val !== void 0) {
          const db = this.root.db
          update(db, db.out(this))
        }
      }
    }
  },
  child: 'Constructor'
}
