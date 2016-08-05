'use strict'
const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dyanamo-test'
const state = new State({ inject: require('../') })

test('initialize, create table', (t) => {
  state.set({
    db: {
      id: process.env.AMAZON_ID,
      secret: process.env.AMAZON_SECRET,
      table: testTable,
      in (val) {
        console.log(val)
      },
      out (state) {
        const path = state.path()
        const context = path[0]
        path.shift()
        return {
          key: path,
          context: context,
          val: state.val,
          stamp: state.stamp
        }
      }
    },
    on: {
      error (err) {
        console.log(err)
      }
    }
  })
  state.db.hasTable.is(true).then(() => {
    t.ok(true, 'hasTable')
    t.end()
  })
})

test('set a field', (t) => {
  state.set({
    token: {
      field: 'hello',
      other: '$root.token.bla'
    }
  })
  // set a field before being ready
  t.end()
})

/*
  state.db.table.remove()
    state.db.hasTable.is(false, () => {
      console.log('REMOVED')
      t.end()
    })
*/
