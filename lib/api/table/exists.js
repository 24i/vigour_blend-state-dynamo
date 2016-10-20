'use strict'

const wait = () => new Promise(resolve => setTimeout(resolve, 2000))
const getTable = (TableName, db) => new Promise((resolve, reject) => {
  db.describeTable({ TableName }, (err, data) => {
    if (err || data.Table.TableStatus !== 'ACTIVE') {
      reject(err)
    } else {
      resolve(data.Table)
    }
  })
})
const NOTFOUND = 'ResourceNotFoundException'

module.exports = function exists (TableName, db, retries) {
  return check()

  function check () {
    return getTable(TableName, db).catch(err => {
      if (err) {
        /* failed to get */
        if (retries-- && err.code === NOTFOUND) {
          return wait().then(check)
        } else {
          throw err
        }
      } else {
        /* exists but not active yet */
        return wait().then(check)
      }
    })
  }
}
