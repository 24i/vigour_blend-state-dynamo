'use strict'
const vstamp = require('vigour-stamp')
  // var lek // { exclusiveStartKey: lek } for large sets (latest ending key)

/* promisified query */
const dbQuery = (db, query) => new Promise(
  (resolve, reject) => db.query(query, (err, data) => err ? reject(err) : resolve(data))
)
const load = (db, context, ExclusiveStartKey) => dbQuery(db.db, { // @TODO: make db.db into db.aws
  TableName: db.table.compute(),
  IndexName: 'context',
  'KeyConditionExpression': 'context = :v_title',
  'ExpressionAttributeValues': {
    ':v_title': { 'S': context }
  },
  ExclusiveStartKey
})

module.exports = function (context) {
  if (!context) {
    context = 'false'
  }
  const db = this
  const state = this.root

  return db.hasTable.is(true)
  .then(() => load(db, context))
  .then(result => {
    const items = result.Items
    const stamp = vstamp.create('db')
    for (var key in items) {
      state.set(db.in(parse(items[key])), stamp)
    }
    vstamp.close(stamp)
  })
  .catch(err => db.root.emit('error', err))
}

function parse (val) {
  for (let field in val) {
    for (let key in val[field]) {
      val[field] = val[field][key]
    }
  }
  return val
}
