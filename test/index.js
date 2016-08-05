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
      table: testTable
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
  // also needs a queue
})


test('set a field, ', (t) => {
  // state.db.
  // set a field before being connected
})

/*
  state.db.table.remove()
    state.db.hasTable.is(false, () => {
      console.log('REMOVED')
      t.end()
    })
*/