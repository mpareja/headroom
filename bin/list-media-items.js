#!/usr/bin/env node
const createVisitor = require('../lib/api-visitor.js')
const fileApi = require('../lib/file-api.js')
const path = require('path')

function go (dirParam, duration) {
  const dir = path.resolve(process.cwd(), dirParam)
  const api = fileApi(dir)

  const mediaFilter = (item) => duration === -1 || item.duration === duration

  const visitor = createVisitor()
  visitor.on('media-item', (mi) => mediaFilter(mi) && console.log(JSON.stringify(mi)))
  visitor.on('error', console.error)
  visitor.visit(api)
}

const dirParam = process.argv[2]
if (dirParam && process.argv[3]) {
  go(dirParam, Number(process.argv[3]))
} else {
  console.error('SYNTAX: <output directory> <duration>')
  process.exit(1)
}
