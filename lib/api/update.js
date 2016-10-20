'use strict'

const vstamp = require('vigour-stamp')
const batches = []

var queue = {}
var inProgress

const shortPause = () => new Promise(resolve => setTimeout(resolve, 500))
const dbWrite = (db, queue) => new Promise((resolve, reject) => {
  const name = db.table.compute()
  const params = { RequestItems: { [name]: [] } }
  const items = params.RequestItems[name]
  for (let i in queue) {
    if (queue[i].val === null) {
      items.push({ DeleteRequest: { Key: { key: { S: queue[i].key.join('.') } } } })
    } else {
      queue[i].key = { S: queue[i].key.join('.') }
      queue[i].stamp = type(queue[i].stamp)
      queue[i].val = type(queue[i].val)
      queue[i].context = { S: String(queue[i].context) }
      items.push({ PutRequest: { Item: queue[i] } })
    }
  }
  db.db.batchWriteItem(params, err => err ? reject(err) : resolve())
})

module.exports = function (state, val) {
  const db = state.root.db
  queue[val.key] = val
  if (!inProgress) {
    inProgress = db.hasTable.is(true)
      .then(shortPause)
      .then(() => {
        let q = queue
        queue = {}
        inProgress = false
        return dbWrite(db, q)
      })
      .catch(err => state.root.emit('error', err))
  }
  return inProgress
}

function queueItem (TableName, val, timeline) {
  const batch = getBatch()
  addItem(batch, TableName, val, timeline)
}

function getBatch () {
  var batch
  var i = 0
  while (!batch) {
    let next = batches[i++]
    if (next) {
      if (next.items < 25) {
        batch = next
      }
    } else {
      batch = makeBatch()
      batches.push(batch)
    }
  }
  return batch
}

function makeBatch () {
  return {
    items: 0,
    RequestItems: {}
  }
}

function addItem (batch, TableName, val, timeline) {
  batch.items++
  const tableItems = batch.RequestItems[TableName] || (batch.RequestItems[TableName] = [])
  tableItems.push(val)
}

function makeRequest (item, timeline) {
  if (!timeline && item.val === null) {
    return { DeleteRequest: { Key: { key: { S: item.key.join('.') } } } }
  } else {
    if (timeline) {
      item.time = Number(vstamp.val(item.stamp))
      item.path = { S: item.path }
    }
    item.val = type(item.val)
    item.stamp = type(item.stamp)
    item.context = { S: String(item.context) }
  }
  return item
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
