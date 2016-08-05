'use strict'
module.exports = (TableName, db) => new Promise((resolve, reject) => {
  db.deleteTable({ TableName }, (err, data) => err ? reject(err) : resolve(data))
})
