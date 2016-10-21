'use strict'

// require('repl').start({
//   prompt: '> ',
//   useGlobal: true
// })

const State = require('vigour-state')
const test = require('tape')
const expected = require('./timeline-expected.json')
const testTable = 'blend-state-dynamo-test-tl'
const AMAZON_ID = process.env.AMAZON_ID
const AMAZON_SECRET = process.env.AMAZON_SECRET
const timeout = 60e3

const shortPause = () => new Promise(resolve => {
  setTimeout(resolve, 550)
})

test('timeline - write - sets creating records', { timeout }, t => {
  const state = new State({
    inject: require('../')
  })
  state.set({
    db: {
      id: AMAZON_ID,
      secret: AMAZON_SECRET,
      timeline: true,
      table: testTable
    }
  })
  state.db.hasTable.is(true)
  .then(() => {
    t.pass('acquired a table')
    state.set({
      shine: {
        nest: true,
        deep: {
          prop: 5
        }
      }
    })
  })
  .then(shortPause).then(() => state.set({
    shine: {
      deep: {
        prop: 2
      }
    },
    unshine: false
  }))
  .then(shortPause).then(() => state.set({
    shine: {
      nest: false,
      deep: {
        prop: 5,
        otherprop: 'slark'
      }
    },
    unshine: null
  }))
  .then(() => state.db.writing)
  .then(() => new Promise((resolve, reject) => {
    t.pass('wrote some intermittent sets to db')
    state.db.db.scan({
      TableName: `${testTable}-timeline`
    }, (err, data) => err ? reject(err) : resolve(data))
  }))
  .then(data => {
    global.data = data
    t.same(data, expected, 'timeline data looks good')
    t.end()
  })
  .catch(err => {
    console.log(JSON.stringify(global.data, false, 2))
    t.end(err)
  })
})
