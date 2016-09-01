'use strict'
const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dyanamo-test'
const AMAZON_ID = process.env.AMAZON_ID
const AMAZON_SECRET = process.env.AMAZON_SECRET
const out = require('./util').out

// inject issues -- fix in observable
test('load context', (t) => {
  const state = new State({ inject: require('../') })
  // loads whole table
  state.set({
    db: {
      id: AMAZON_ID,
      secret: AMAZON_SECRET,
      table: testTable,
      out,
      define: {
        extend: {
          in (parse, val) {
            val.key = val.context + '.' + val.key
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
  state.db.load(() => {
    t.same(state.token.deeper.hello.val, true, 'returns correct data')
    t.end()
  })
})

test('load a whole table', (t) => {
  const state = new State({ inject: require('../') })
  // loads whole table
  state.set({
    db: {
      id: AMAZON_ID,
      secret: AMAZON_SECRET,
      table: testTable,
      out,
      define: {
        extend: {
          in (parse, val) {
            val.key = val.context + '.' + val.key
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
    t.end()
  })
})
