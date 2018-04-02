'use strict'
const magic = require('../lib/magic')

describe('headroom', () => {
  it('finds the token that should not be', function (done) {
    this.timeout(20000)
    const { exec } = require('child_process')
    exec(`grep --exclude-dir datastore -r ${magic} .`, (err) => {
      if (!err) {
        throw new Error(`${magic} found in source code`)
      }
      done()
    })
  })
})
