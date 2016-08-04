'use strict'
const State = require('vigour-state')
const test = require('tape')

test('set data', (t) => {
  const state = new State({ inject: require('../') })
  state.set({
    db: {
      id: process.env.AMAZON_ID,
      secret: process.env.AMAZON_SECRET,
      // need to add a remove api as well!
      table: 'test-table'
    }
  })
  console.log('____X____')
  console.log('yo yo yo')
  t.end()
})