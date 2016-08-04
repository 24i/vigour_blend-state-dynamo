'use strict'

/*
var params = {
    ExclusiveStartTableName: 'table_name', // optional (for pagination, returned as LastEvaluatedTableName)
    Limit: 0, // optional (to further limit the number of table names returned per page)
};
dynamodb.listTables(params, function(err, data) {
    if (err) console.log(err); // an error occurred
    else console.log(data); // successful response
});
*/

module.exports = function table (name, state, capacity) {
  const dynamodb = state.db
  if (!capacity) { capacity = 10 }
  console.log('go table!')
  const params = {
    ExclusiveStartTableName: name, // optional (for pagination, returned as LastEvaluatedTableName)
    Limit: 0 // optional (to further limit the number of table names returned per page)
  }
  dynamodb.listTables(params, (err, data) => {
    if (err) console.log('listTables', err) // an error occurred
    else console.log(data) // successful response
  })

  const createParams = {
    name,
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
  }

  const updateParams = {
    name,
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
  }

  function create (params, del) {
    return new Promise(function (resolve, reject) {
      dynamodb.createTable(params, function (err, data) {
        if (err) {
          console.error('Unable to create table. Error JSON:', JSON.stringify(err, null, 2))
          if (del) {
            dynamodb.deleteTable({ TableName: params.TableName }, (err) => {
              if (err) {
                console.log('cant delete table')
              } else {
                console.log('removed table')
              }
              setTimeout(() => make(params).then(() =>
                setTimeout(resolve, 5e3)
              ), 5e3)
            })
          } else {
            resolve(err)
          }
        } else {
          console.log('Created table. Table description JSON:', JSON.stringify(data, null, 2))
          resolve(data)
        }
      })
    })
  }

  function updateTable (params) {
    console.log('put')
    return new Promise(function (resolve, reject) {
      dynamodb.updateTable(params, function (err, data) {
        if (err) {
          console.error('Unable to update', '. Error JSON:', JSON.stringify(err, null, 2))
          resolve(data)
        } else {
          console.log('update succeeded')
          resolve(data)
        }
      })
    })
  }
}
