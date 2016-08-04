'use strict'
const s = require('vigour-state/s')
const test = require('tape')

test('set data', (t) => {
  const state = s({
    inject: require('../')
  })
  console.log('yo yo yo')
  t.end()
})
