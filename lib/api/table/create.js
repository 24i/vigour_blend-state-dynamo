'use strict'

const createTable = (db, opts) => new Promise((resolve, reject) => {
  /* promisified db.createTable */
  db.createTable(opts, (err, data) => err ? reject(err) : resolve(data))
})

module.exports = (db, name, capacity, timeline) => timeline
  ? createTable(db, { /* timeline table */
    TableName: name,
    AttributeDefinitions: [
      { AttributeName: 'key', AttributeType: 'S' },
      { AttributeName: 'context', AttributeType: 'S' },
      { AttributeName: 'path', AttributeType: 'S' },
      { AttributeName: 'time', AttributeType: 'N' }
    ],
    KeySchema: [
      { AttributeName: 'key', KeyType: 'HASH' },
      { AttributeName: 'time', KeyType: 'RANGE' },
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'context-time',
      KeySchema: [
        { AttributeName: 'context', KeyType: 'HASH' },
        { AttributeName: 'time', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: capacity,
        WriteCapacityUnits: capacity
      }
    }, {
      IndexName: 'path-time',
      KeySchema: [
        { AttributeName: 'path', KeyType: 'HASH' },
        { AttributeName: 'time', KeyType: 'RANGE' }
      ],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: capacity,
        WriteCapacityUnits: capacity
      }
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: capacity,
      WriteCapacityUnits: capacity
    }
  })
  : createTable(db, { /* snapshot table */
    TableName: name,
    KeySchema: [
      { AttributeName: 'key', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'key', AttributeType: 'S' },
      { AttributeName: 'context', AttributeType: 'S' }
    ],
    GlobalSecondaryIndexes: [{
      IndexName: 'context',
      KeySchema: [{
        AttributeName: 'context',
        KeyType: 'HASH'
      }],
      Projection: {
        ProjectionType: 'ALL'
      },
      ProvisionedThroughput: {
        ReadCapacityUnits: capacity,
        WriteCapacityUnits: capacity
      }
    }],
    ProvisionedThroughput: {
      ReadCapacityUnits: capacity,
      WriteCapacityUnits: capacity
    }
  })
