'use strict'
const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dynamo-test'
const AMAZON_ID = process.env.AMAZON_ID
const AMAZON_SECRET = process.env.AMAZON_SECRET

require('repl').start({prompt: '> ', useGlobal: true})

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
  state.db.load('false')
  .then(() => {
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
  .catch(err => t.end(err))
})

test('load specific context', (t) => {
  const state = new State({ inject: require('../') })
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

  state.db.load('context-X')
  .then(() => {
    t.same(state.serialize(), {
      token: {
        field: 'X val 1 -> 4',
        deeper: { hello: 'X val 2' }
      },
      field: 'X val 3'
    }, 'correct state')
    t.end()
  })
  .catch(err => t.end(err))
})

test('remove field', (t) => {
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
  state.db.load('false')
  .then(() => {
    state.token.deeper.remove()
    return state.db.writing
  })
  .then(() => state.db.load('false'))
  .then(() => {
    t.equal(state.token.deeper, null, 'field is removed')
  })
  .catch(err => t.fail(err))
  .then(() => {
    console.log('remove state')
    global.state = state
    global.db = state.db
    state.remove()
    t.end()
  })
  .catch(err => t.end(err))
})

// function removeTable (db) {
//
// }
