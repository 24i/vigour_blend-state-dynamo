'use strict'
const s = require('vigour-state/s')
const test = require('tape')

test('set data', (t) => {
  const state = s({
    inject: require('../'),
    db: {
      id: process.env.AMAZON_ID,
      secret: process.env.AMAZON_SECRET
    }
  })
  console.log('yo yo yo', state)
  t.end()
})
