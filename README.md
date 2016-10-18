# blend-state-dynamo
dynamo - db integration for vigour-hub

[![Build Status](https://travis-ci.org/vigour-io/boilerplate-module.svg?branch=master)](https://travis-ci.org/vigour-io/blend-state-dynamo)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![npm version](https://badge.fury.io/js/blend-state-dynamo.svg)](https://badge.fury.io/js/vigour-base)
[![Coverage Status](https://coveralls.io/repos/github/vigour-io/blend-state-dynamo/badge.svg?branch=master)](https://coveralls.io/github/vigour-io/blend-state-dynamo?branch=master)

### Usage

#### Connecting to a table

```javascript
state.set({
  inject: require('blend-state-dynamo')
  db: {
    id: AMAZON_ID,
    secret: AMAZON_SECRET,
    table: testTable
  },
  on: {
    error (err) {
      console.log(err)
    }
  }
})

state.db.hasTable.is(true).then(() => {
  console.log('got a table!')
})
```

#### Loading data

```javascript
state.db.load() // loads all data without context
state.db.load('somecontextid') // loads all data with somecontextid
state.db.load('*') //loads all data of all contexts -- warn maybe very heavy
```

### Snapshot and Timeline

##### Snapshot

##### Timeline
