'use strict'
const AWS = require('aws-sdk')
const dynamodb = new AWS.DynamoDB()

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

module.exports = function table (TableName, capacity) {
  if (!capacity) { capacity = 10 }
  const createParams = {
    TableName,
    KeySchema: [
      { AttributeName: 'key', KeyType: 'HASH' }
    ],
    AttributeDefinitions: [
      { AttributeName: 'key', AttributeType: 'S' }
    ],
    ProvisionedThroughput: {
      ReadCapacityUnits: 10,
      WriteCapacityUnits: 10
    }
  }
  const updateParams = {
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
            ReadCapacityUnits: 10,
            WriteCapacityUnits: 10
          }
        }
      }
    ]
  }

  function make (params, del) {
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
