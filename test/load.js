'use strict'
const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dyanamo-test'
const AMAZON_ID = process.env.AMAZON_ID
const AMAZON_SECRET = process.env.AMAZON_SECRET

test('load a whole table', (t) => {
  const state = new State({ inject: require('../') })
  // loads whole table
  state.set({
    db: {
      id: AMAZON_ID,
      secret: AMAZON_SECRET,
      table: testTable,
      define: {
        extend: {
          in (parse, val) {
            return parse(val)
          }
        }
      }
    },
    on: {
      error (err) {
        console.log(err)
      }
    }
  })
  state.db.load('*', () => {
    t.same(state.token.deeper.hello.val, true, 'returns correct data')
    t.same(state.serialize(), {
      'field': true,
      'token': {
        'deeper': {
          'hello': true
        },
        'bla': {},
        field: 'hello',
        'other': '$root.token.bla'
      }
    }, 'correct state')
    t.end()
  })
})

test('load specific context', (t) => {
  const state = new State({ inject: require('../') })
  // loads whole table
  state.set({
    db: {
      id: AMAZON_ID,
      secret: AMAZON_SECRET,
      table: testTable,
      define: {
        extend: {
          in (parse, val) {
            return parse(val)
          }
        }
      }
    },
    on: {
      error (err) {
        console.log(err)
      }
    }
  })
  state.db.load('token', () => {
    t.same(state.serialize(), {
      'token': {
        'deeper': {
          'hello': true
        },
        field: 'hello',
        'bla': {},
        'other': '$root.token.bla'
      }
    }, 'correct state')
    t.end()
  })
})

test('load specific context - default parser', (t) => {
  const state = new State({ inject: require('../') })
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
  state.db.load('token', () => {
    t.same(state.serialize(), {
      'token': {
        'deeper': {
          'hello': true
        },
        'bla': {},
        'other': '$root.token.bla',
        field: 'hello'
      }
    }, 'correct state')
    t.end()
  })
})

test('remove fields', (t) => {
  const state = new State({ inject: require('../') })
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
  state.db.load('token', () => {
    state.token.deeper.remove()
    setTimeout(() => {
      state.db.load('token', () => {
        t.equal(state.token.deeper, null, 'field is removed')
        t.end()
      })
    }, 1e3)
  })
})
