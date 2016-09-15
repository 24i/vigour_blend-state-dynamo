'use strict'
const config = require('./api/config')
const table = require('./api/table')
const removeTable = require('./api/table/remove')
const update = require('./api/update')
const load = require('./api/load')
const set = require('lodash.set')
const vstamp = require('vigour-stamp')
const is = require('vigour-is')

exports.properties = {
  db: {
    type: 'observable',
    child: {
      inject: is,
      child: 'Constructor'
    },
    define: { load },
    properties: {
      db: true,
      out: true,
      in: true
    },
    hasTable: false,
    // @todo: default behevaiour for state that has context fields (hubs)
    in (val) {
      const obj = {}
      val.key = val.key.split('.')
      if (val.key[0] === 'no-context') {
        val.key.shift()
      }
      set(obj, val.key, { val: val.val, stamp: val.stamp })
      return obj
    },
    out (state, context, key, val, stamp) {
      const path = state.path()
      context = context || this.root.context && this.root.context.compute()
      if (!context || typeof context === 'object') {
        if (path.length === 1) {
          context = 'no-context'
          path.unshift(context)
        } else {
          context = path[0]
        }
      } else {
        path.unshift(context)
      }
      const obj = {
        context,
        key: path,
        stamp: stamp || state.stamp,
        val: val || state.val
      }
      return obj
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
      db (val, stamp) {
        if (this.val !== void 0 && vstamp.type(stamp) !== 'db') {
          const db = this.root.db
          update(db, db.out(this))
        }
      }
    }
  },
  child: 'Constructor'
}
