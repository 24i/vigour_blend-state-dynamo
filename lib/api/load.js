'use strict'
const vstamp = require('vigour-stamp')

module.exports = function (context, done) {
  if (typeof context === 'function') {
    done = context
  }

  if (!context) {
    context === false
  }

  const db = this
  const state = this.root
  // var lek // { exclusiveStartKey: lek } for large sets (latest ending key)
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
        done()
      }
    })
  })
}

function parse (val) {
  for (let field in val) {
    for (let key in val[field]) {
      val[field] = val[field][key]
    }
  }
  return val
}
