'use strict'
const update = require('./update')

module.exports = (name, capacity, db) => new Promise((resolve, reject) => {
  const retries = { val: 1 }
  db.createTable({
    TableName: name,
    KeySchema: [
      { AttributeName: 'key', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'key', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: capacity,
      WriteCapacityUnits: capacity
    }
  }, (err) => err
    ? reject(err)
    : decayUpdate(name, capacity, db, retries, resolve, reject)
  )
})

function decayUpdate (name, capacity, db, retries, resolve, reject) {
  setTimeout(() => update(name, capacity, db)
    .then(() => resolve())
    .catch((err) => {
      retries.val++
      if (retries.val > 10) {
        reject(err)
      } else {
        decayUpdate(name, capacity, db, retries, resolve, reject)
      }
    })
  , retries.val * 150 + 500)
}
