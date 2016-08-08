'use strict'
const exists = require('./exists')
const create = require('./create')

module.exports = function table (name, state, capacity) {
  const db = state.db
  if (!capacity) { capacity = 5 }
  exists(name, db)
    .then((exists) => {
      if (exists) {
        state.set({ hasTable: true })
      } else {
        create(name, capacity, db)
          .then(() => state.set({ hasTable: true }))
          .catch((err) => state.root.emit('error', err))
      }
    })
    .catch((err) => state.root.emit('error', err))
}
