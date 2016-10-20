'use strict'
const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dynamo-test'
const state = new State({ inject: require('../') })
const AMAZON_ID = process.env.AMAZON_ID
const AMAZON_SECRET = process.env.AMAZON_SECRET
// no mapping just straight
// lets make that keystore server for this

test('initialize, create table', (t) => {
  t.plan(1)
  state.set({
    db: {
      id: AMAZON_ID,
      secret: AMAZON_SECRET,
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
  })
})

test('set a field', (t) => {
  state.set({
    token: {
      field: 'bye',
      other: '$root.token.bla',
      deeper: { hello: true }
    },
    field: true
  })

  state.set({
    token: {
      field: 'hello'
    }
  })

  setTimeout(() => {
    t.ok(true, 'does not throw error')
    t.end()
  }, 1e3)
})

test('set a field (default out)', (t) => {
  state.set({
    token: {
      field: 'bye',
      other: '$root.token.bla',
      deeper: { hello: true }
    },
    field: true
  })

  state.set({
    token: {
      field: 'hello2'
    }
  })

  setTimeout(() => {
    t.ok(true, 'does not throw error')
    t.end()
  }, 1e3)
})
