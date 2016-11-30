'use strict'
const vstamp = require('vigour-stamp')
  // var lek // { exclusiveStartKey: lek } for large sets (latest ending key)

/* promisified query */
const dbQuery = (db, query) => new Promise(
  (resolve, reject) => db.query(query, (err, data) => err ? reject(err) : resolve(data))
)

const load = (db, context, ExclusiveStartKey, previousItems) => dbQuery(db.aws, {
  TableName: db.table.compute(),
  IndexName: 'context',
  'KeyConditionExpression': 'context = :v_title',
  'ExpressionAttributeValues': {
    ':v_title': { 'S': context }
  },
  ExclusiveStartKey
})
  .then(result => {
    if (previousItems) {
      result.Items = previousItems.concat(result.Items)
    }
    if (result.LastEvaluatedKey) {
      return load(db, context, result.LastEvaluatedKey, result.Items)
    } else {
      return result.Items
    }
  })

module.exports = function (context) {
  if (!context) {
    context = 'false'
  }
  const db = this
  const state = this.root

  return db.hasTable.is(true)
  .then(() => load(db, context))
  .then(items => {
    const stamp = vstamp.create('db')
    for (var key in items) {
      parse(items[key])
      const val = db.in(items[key].val)
      if (val === undefined) {
        continue
      }
      const got = state.get(JSON.parse(items[key].key).slice(1), val, stamp)
      if (got === undefined) {
        continue
      }
      got.set(val, stamp)
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
}
