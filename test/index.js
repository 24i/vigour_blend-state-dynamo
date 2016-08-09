'use strict'
const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dyanamo-test'
const state = new State({ inject: require('../') })
const AMAZON_ID = process.env.AMAZON_ID
const AMAZON_SECRET = process.env.AMAZON_SECRET

function out (state) {
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

test('initialize, create table', (t) => {
  state.set({
    db: {
      id: AMAZON_ID,
      secret: AMAZON_SECRET,
      table: testTable,
      out
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
      other: '$root.token.bla',
      deeper: { hello: true }
    }
  })
  state.on('error', () => t.fail('throws error'))
  t.ok(true, 'does not throw error')
  t.end()
})

test('load a table', (t) => {
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
