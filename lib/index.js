'use strict'

process.on('unhandledRejection', r => { throw r })

const config = require('./api/config')
const table = require('./api/table')
const update = require('./api/update')
const load = require('./api/load')
const deleteTable = require('./api/table/delete')
const vstamp = require('vigour-stamp')
const is = require('vigour-is')

const CONTEXT = ['root', 'context', 'compute']

exports.properties = {
  db: {
    type: 'observable',
    child: {
      inject: is,
      child: 'Constructor'
    },
    define: { load },
    properties: {
      aws: true,
      out: true,
      in: true,
      timeline: true,
      writing: true
    },
    hasTable: false,
    // @todo: default behaviour for state that has context fields (hubs)
    in (val) { /* from db to state */
      if (val === '<script type="EMPTY-STRING"></script>') {
        val = ''
      }
      return val
    },
    out (state) { /* from state to db */
      const context = this.get(CONTEXT) || false
      var val = state.val
      if (val && val.isBase) {
        // STRUCT CONVERSION REFPATH WILL BE AN ARRAY
        const refPath = val.path()
        val = '$root'
        if (refPath.length) {
          val += '.' + refPath.join('.')
        }
      } else if (val === '') {
        val = '<script type="EMPTY-STRING"></script>'
      }
      return {
        key: JSON.stringify([context].concat(state.path())),
        context,
        path: JSON.stringify(state.path()),
        stamp: state.stamp,
        val
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
        data: {
          table (val, stamp) {
            if (val !== null) {
              this.last = val
              this.parent.config.is(true, () => table(val, this.parent))
            }
          }
        }
      },
      define: {
        delete: deleteTable
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
