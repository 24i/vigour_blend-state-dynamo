'use strict'
var queue = {}
var inProgress

module.exports = function (state, val) {
  const db = state.root.db
  if (val.val && typeof val.val === 'object' && val.val.isBase) {
    val.val = db.out(val.val).key.length ? '$root.' + db.out(val.val).key.join('.') : '$root'
  }
  queue[val.key.join('.')] = val
  if (!inProgress) {
    db.hasTable.is(true, () => {
      inProgress = true
      setTimeout(() => {
        dbWrite(db, queue).catch((err) => state.root.emit('error', err))
        queue = {}
        inProgress = false
      }, 500)
    })
  }
}

function dbWrite (db, queue) {
  return new Promise((resolve, reject) => {
    const name = db.table.compute()
    const params = { RequestItems: { [name]: [] } }
    const items = params.RequestItems[name]
    for (let i in queue) {
      if (queue[i].val === null) {
        items.push({ DeleteRequest: { Key: queue[i].key.join('.') } })
      } else {
        queue[i].key = { S: queue[i].key.join('.') }
        queue[i].stamp = type(queue[i].stamp)
        queue[i].val = type(queue[i].val)
        queue[i].context = { S: String(queue[i].context) }
        items.push({ PutRequest: { Item: queue[i] } })
      }
    }
    db.db.batchWriteItem(params, (err) => err ? reject(err) : resolve())
  })
}

function type (val) {
  const type = typeof val
  return {
    [type === 'number' ? 'N' : type === 'boolean' ? 'BOOL' : 'S']: type === 'boolean' ? val : val + ''
  }
}
