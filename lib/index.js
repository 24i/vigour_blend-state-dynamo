'use strict'

exports.properties = {
  db: {
    id: {
      on: {
        data: {
          key (val, stamp) {
            console.log('id')
          }
        }
      }
    },
    secret: {
      on: {
        data: {
          secret (val, stamp) {
            console.log('secret')
          }
        }
      }
    }
  }
}
