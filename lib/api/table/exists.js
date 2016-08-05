'use strict'
  // not bullet proof but can add more pages or something
module.exports = (name, db) => new Promise((resolve, reject) => {
  db.listTables({ Limit: 100 }, (err, data) => {
    if (err) {
      reject(err)
    } else {
      const list = data.TableNames
      let exists = false
      for (let i = 0, len = list.length; i < len; i++) {
        let val = list[i]
        if (val === name) {
          exists = true
          break
        }
      }
      resolve(exists)
    }
  })
})
