'use strict'

const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dynamo-test'
const state = new State({
  properties: {
    context: true
  },
  inject: require('../')
})
const AMAZON_ID = process.env.AMAZON_ID
const AMAZON_SECRET = process.env.AMAZON_SECRET

test('initialize, create table', (t) => {
  state.set({
    db: {
      id: AMAZON_ID,
      secret: AMAZON_SECRET,
      table: testTable
    }
  })

  state.db.hasTable.is(true).then(
    () => t.end(),
    err => t.end(err)
  )
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
  state.db.writing.then(
    () => t.end(),
    err => t.end(err)
  )
})

test('set a field (fake context X)', (t) => {
  state.set({
    context: {
      compute: () => 'context-X'
    },
    token: {
      field: 'X val 1',
      deeper: { hello: 'X val 2' }
    },
    field: 'X val 3'
  })

  state.set({
    token: {
      field: 'X val 1 -> 4'
    }
  })

  state.db.writing.then(
    () => t.end(),
    err => t.end(err)
  )
})
