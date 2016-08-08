'use strict'
module.exports = (TableName, capacity, db) => new Promise((resolve, reject) => {
  db.updateTable(
    {
      TableName,
      AttributeDefinitions: [
        { AttributeName: 'context', AttributeType: 'S' }
      ],
      GlobalSecondaryIndexUpdates: [
        {
          Create: {
            IndexName: 'context',
            KeySchema: [
              { AttributeName: 'context', KeyType: 'HASH' }
            ],
            Projection: {
              ProjectionType: 'ALL'
            },
            ProvisionedThroughput: {
              ReadCapacityUnits: capacity,
              WriteCapacityUnits: capacity
            }
          }
        }
      ]
    },
    (err) => err ? reject(err) : resolve()
  )
})
