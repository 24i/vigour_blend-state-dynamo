'use strict'
const exists = require('./exists')
const create = require('./create')

const NOTFOUND = 'ResourceNotFoundException'
const acquireTable = (db, name, capacity, timeline) => exists(name, db)
  .catch(err => {
    if (err.code === NOTFOUND) {
      console.log('does not exist, lets create it!')
      if (!capacity) { capacity = 1 }
      return create(db, name, capacity, timeline)
        .then(() => exists(name, db, 2))
    } else {
      console.log('could not do exist, some other error its bad!')
      throw err
    }
  })

module.exports = function table (name, state, capacity) {
  console.log('table called!', state)
  const db = state.db
  const snapshotTable = acquireTable(db, name, capacity)
  const acquire = !state.timeline
    ? snapshotTable
    : Promise.all([
      snapshotTable,
      acquireTable(db, `${name}-timeline`, capacity, true)
    ])
  return acquire.then(() => state.set({ hasTable: true }))
    .catch(err => state.root.emit('error', err))
}
