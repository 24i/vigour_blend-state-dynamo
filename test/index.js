'use strict'
const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dyanamo-test'

test('initialize, create table', (t) => {
  const state = new State({ inject: require('../') })

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

  // also needs a queue
  state.db.hasTable.is(true).then(() => {
    console.log('yo')
    state.db.table.remove()
  })

  // t.end()
})
