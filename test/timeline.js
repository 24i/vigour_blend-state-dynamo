'use strict'
const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dynamo-test-timeline'
const state = new State({ inject: require('../') })
const AMAZON_ID = process.env.AMAZON_ID
const AMAZON_SECRET = process.env.AMAZON_SECRET
const timeout = 10e3

const shortPause = () => new Promise(resolve => {
  setTimeout(resolve, 100)
})

test('timeline - connect to table', { timeout }, t => {
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

  state.db.hasTable.is(true).then(() => t.end('connected'))
})

test('timeline - set some values', { timeout }, t => {
  state.set({
    shine: {
      nest: true,
      deep: {
        prop: 5
      }
    }
  })
  shortPause().then(
    () => state.set({
      shine: {
        deep: {
          prop: 2
        }
      },
      unshine: false
    })
  ).then(shortPause).then(
    () => state.set({
      shine: {
        nest: false,
        deep: {
          prop: 5,
          otherprop: 'slark'
        }
      },
      unshine: null
    })
  ).then(() => t.end('did some intermittent sets'))
})
