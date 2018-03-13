#!/usr/bin/env node
const fs = require('fs')
const httpApi = require('../lib/http-api.js')
const path = require('path')
const promisify = require('util').promisify
const scrape = require('../lib/scrape-api.js')
const withPersistence = require('../lib/persistent-api-decorator.js')
const withQueuing = require('../lib/queuing-api-decorator.js')

function withTracing (obj) {
  const handler = {
    get (target, propKey, receiver) {
      const origMethod = target[propKey]
      return function (...args) {
        const result = origMethod.apply(this, args)
        console.log(propKey + JSON.stringify(args) + ' -> ' + JSON.stringify(result))
        return result
      }
    }
  }
  return new Proxy(obj, handler)
}

async function go (dirParam) {
  const dir = path.resolve(process.cwd(), dirParam)
  const magic = String.fromCharCode(104, 101, 97, 100, 115, 112, 97, 99, 101)
  const api = withQueuing(withPersistence(withTracing(httpApi(magic)), dir, fs), 15)

  await promisify(fs.mkdir)(dir)
  await scrape(api)
}

const dirParam = process.argv[2]
if (dirParam) {
  go(dirParam)
} else {
  console.log('SYNTAX: <output directory>')
  process.exit(1)
}
