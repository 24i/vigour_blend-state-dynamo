'use strict'
const State = require('vigour-state')
const test = require('tape')

test('set data', (t) => {
  const state = new State({ inject: require('../') })
  state.set({
    db: {
      id: process.env.AMAZON_ID,
      secret: process.env.AMAZON_SECRET,
      table: 'test-table-' + Date.now()
    },
    on: {
      error (err) {
        console.log(err)
      }
    }
  })

  state.db.hasTable.is(true).then(() => {
    console.log('yo')
    state.db.table.remove()
  })
  t.end()
})
