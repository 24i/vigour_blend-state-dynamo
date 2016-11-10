'use strict'

const vstamp = require('vigour-stamp')

var queue = {}

const shortPause = () => new Promise(resolve => setTimeout(resolve, 500))
const writeBatch = (db, batch) => new Promise(
  (resolve, reject) => db.batchWriteItem(batch, (err, data) => err ? reject(err) : resolve())
)
const dbWrite = (db, writeQueue) => {
  const tableName = db.table.compute()
  const timelineTableName = db.timeline ? `${tableName}-timeline` : false
  var i = 0
  var batch = { RequestItems: {} }
  const batches = []
  for (let key in writeQueue) {
    let item = writeQueue[key]
    toBatch(item, tableName)
    if (db.timeline) {
      toBatch(item, timelineTableName, true)
    }
  }
  if (i !== 0) {
    batches.push(writeBatch(db.aws, batch))
  }

  return Promise.all(batches)

  function toBatch (item, tableName, timeline) {
    addItem(batch, item, tableName, timeline)
    i++
    if (i === 25) {
      batches.push(writeBatch(db.aws, batch))
      batch = { RequestItems: {} }
      i = 0
    }
  }
}

module.exports = function (state, val) {
  const db = state.root.db
  queue[val.key] = val
  if (!db.writing) {
    db.writing = db.hasTable.is(true)
      .then(shortPause)
      .then(() => {
        db.writing = false
        var q = queue
        queue = {}
        return dbWrite(db, q)
      })
      .catch(err => {
        state.root.emit('error', err)
        throw err
      })
  }
  return db.writing
}

function addItem (batch, item, TableName, timeline) {
  const tableItems = batch.RequestItems[TableName] || (batch.RequestItems[TableName] = [])
  tableItems.push(makeRequest(item, timeline))
}

function makeRequest (item, timeline) {
  if (!timeline && item.val === null) {
    return { DeleteRequest: { Key: { key: { S: item.key } } } }
  } else {
    const reqItem = {}
    if (timeline) {
      reqItem.time = { N: String(vstamp.val(item.stamp)) }
      reqItem.path = { S: item.path }
    }
    reqItem.key = { S: item.key }
    reqItem.val = type(item.val)
    reqItem.stamp = type(item.stamp)
    reqItem.context = { S: String(item.context) }
    return { PutRequest: { Item: reqItem } }
  }
}

function type (val) {
  const type = typeof val
  const key = (type === 'number')
    ? 'N'
    : (type === 'boolean')
      ? 'BOOL'
      : 'S'
  val = (type === 'boolean')
    ? val
    : val + ''
  return { [key]: val }
}
