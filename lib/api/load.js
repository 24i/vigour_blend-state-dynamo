'use strict'
const vstamp = require('vigour-stamp')
  // var lek // { exclusiveStartKey: lek } for large sets (latest ending key)

module.exports = function (context, done) {
  if (typeof context === 'function') {
    done = context
  }
  const db = this
  const state = this.root
  if (!context) {
    context === false
  }
  if (context === '*') {
    all(db, state, done)
  } else {
    filter(context, db, state, done)
  }
}

function parse (val) {
  for (let field in val) {
    for (let key in val[field]) {
      val[field] = val[field][key]
    }
  }
  return val
}

function all (db, state, done) {
  db.hasTable.is(true, () => {
    db.db.scan({
      TableName: db.table.compute()
    }, (err, result) => {
      if (err) {
        state.emit('error', err)
      } else {
        const items = result.Items
        const stamp = vstamp.create('db')
        for (var key in items) {
          state.set(db.in(parse(items[key])), stamp)
        }
        vstamp.close(stamp)
        if (done) { done() }
      }
    })
  })
}

function filter (context, db, state, done) {
  db.hasTable.is(true, () => {
    db.db.query({
      TableName: db.table.compute(),
      IndexName: 'context',
      'KeyConditionExpression': 'context = :v_title',
      'ExpressionAttributeValues': {
        ':v_title': { 'S': context } // not only string ofcourse...
      }
    }, (err, result) => {
      if (err) {
        state.emit('error', err)
      } else {
        const items = result.Items
        const stamp = vstamp.create('db')
        for (var key in items) {
          state.set(db.in(parse(items[key])), stamp)
        }
        vstamp.close(stamp)
        if (done) { done() }
      }
    })
  })
}
