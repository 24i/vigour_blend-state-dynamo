'use strict'
module.exports = (name, db, state) => new Promise((resolve, reject) => {
  retry(name, db, { val: 1 }, resolve, reject, state)
})

function retry (name, db, retries, resolve, reject, state) {
  setTimeout(() => remove(name, db)
    .then(() => {
      resolve()
      state.hasTable.set(false)
    })
    .catch((err) => {
      retries.val++
      if (retries.val > 100) {
        reject(err)
      } else {
        retry(name, db, retries, resolve, reject)
      }
    })
  , retries.val * 150 + 500)
}

function remove (TableName, db) {
  return new Promise((resolve, reject) => {
    db.deleteTable({ TableName }, (err) => err ? reject(err) : resolve())
  })
}
