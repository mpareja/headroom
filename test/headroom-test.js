'use strict'
const assert = require('chai').assert
const nock = require('nock')

const magic = String.fromCharCode(104, 101, 97, 100, 115, 112, 97, 99, 101)
const url = `https://api.prod.${magic}.com`
const rawApi = require('../lib/http-api')(magic)
const api = require('../lib/api-transform')(rawApi)

describe('headroom', () => {
  it('fetches group collections', async () => {
    nock(url, {'encodedQueryParams': true})
      .get('/content/group-collections')
      .query({'limit': '-1'})
      .reply(200, require('./data/group-collections.json'))

    const results = await api.getGroupCollections()

    assert.deepEqual(results, [ { id: '8', category: 'PACK_GROUP', name: 'Work & Performance' } ])
  })

  it('fetches activities groups', async () => {
    nock(url, {'encodedQueryParams': true})
      .get('/content/activity-groups/8')
      .reply(200, require('./data/activity-group-8.json'))

    const result = await api.getActivityGroup('8')

    assert.deepEqual(result, {
      id: '8',
      name: 'Focus',
      description: 'Familiarize yourself with a relaxed, precise kind of focus. Neither too intense, nor too loose.',
      orderedActivities: [
        '111', '112', '113', '114', '115', '116', '117', '118', '119', '120', '121', '122', '123',
        '124', '125', '126', '127', '128', '129', '130', '131', '132', '133', '134', '135', '136',
        '137', '138', '139', '140'
      ]
    })
  })

  it('fetches activities in activity group', async () => {
    nock(url)
      .get('/content/activities?activityGroupIds=8&limit=-1')
      .reply(200, require('./data/activities-in-group-8.json'))

    const result = await api.getActivitiesInGroup(8)
    assert.deepEqual(result, [
      { id: '111', name: 'Session 1', format: 'AUDIO' },
      { id: '112', name: 'Session 2', format: 'AUDIO' },
      { id: '113', name: 'Session 3', format: 'AUDIO' },
      { id: '114', name: 'Session 4', format: 'AUDIO' },
      { id: '115', name: 'Session 5', format: 'AUDIO' },
      { id: '116', name: 'Session 6', format: 'AUDIO' },
      { id: '117', name: 'Session 7', format: 'AUDIO' },
      { id: '118', name: 'Session 8', format: 'AUDIO' },
      { id: '119', name: 'Session 9', format: 'AUDIO' },
      { id: '120', name: 'Session 10', format: 'AUDIO' },
      { id: '121', name: 'Session 11', format: 'AUDIO' },
      { id: '122', name: 'Session 12', format: 'AUDIO' },
      { id: '123', name: 'Session 13', format: 'AUDIO' },
      { id: '124', name: 'Session 14', format: 'AUDIO' },
      { id: '125', name: 'Session 15', format: 'AUDIO' },
      { id: '126', name: 'Session 16', format: 'AUDIO' },
      { id: '127', name: 'Session 17', format: 'AUDIO' },
      { id: '128', name: 'Session 18', format: 'AUDIO' },
      { id: '129', name: 'Session 19', format: 'AUDIO' },
      { id: '130', name: 'Session 20', format: 'AUDIO' },
      { id: '131', name: 'Session 21', format: 'AUDIO' },
      { id: '132', name: 'Session 22', format: 'AUDIO' },
      { id: '133', name: 'Session 23', format: 'AUDIO' },
      { id: '134', name: 'Session 24', format: 'AUDIO' },
      { id: '135', name: 'Session 25', format: 'AUDIO' },
      { id: '136', name: 'Session 26', format: 'AUDIO' },
      { id: '137', name: 'Session 27', format: 'AUDIO' },
      { id: '138', name: 'Session 28', format: 'AUDIO' },
      { id: '139', name: 'Session 29', format: 'AUDIO' },
      { id: '140', name: 'Session 30', format: 'AUDIO' }
    ])
  })

  it('finds the token that should not be', function (done) {
    this.timeout(20000)
    const { exec } = require('child_process')
    exec(`grep -r ${magic} .`, (err) => {
      if (!err) {
        throw new Error(`${magic} found in source code`)
      }
      done()
    })
  })
})
