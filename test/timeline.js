'use strict'

const State = require('vigour-state')
const test = require('tape')
const testTable = 'blend-state-dynamo-test-tl'
const AMAZON_ID = process.env.AMAZON_ID
const AMAZON_SECRET = process.env.AMAZON_SECRET
const timeout = 60e3
require('repl').start({
  prompt: '> ',
  useGlobal: true
})
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
    }, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  }))
  .then(data => {
    console.log('ok got some timeline data from that table wadap', data)
    t.pass('got data its all good')
    t.end()
  })
  .catch(err => {
    t.end(err)
  })
})
