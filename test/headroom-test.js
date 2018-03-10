'use strict'
const assert = require('chai').assert
const fetch = require('isomorphic-unfetch')
const nock = require('nock')

const groups = require('./data/group-collections.json')

const authorization = process.env.HEADROOM_BEARER

const magic = String.fromCharCode(104, 101, 97, 100, 115, 112, 97, 99, 101)
const url = `https://api.prod.${magic}.com`

const api = ((magic) => {
  async function get (path) {
    const url = `https://api.prod.${magic}.com${path}`
    const res = await fetch(url, { headers: { authorization } })

    if (res.status !== 200) {
      const error = new Error(`unexpected ${res.status} http status`)
      error.status = 200
      throw error
    }

    return res.json()
  }

  return {
    getGroupCollections: async () => {
      const json = await get('/content/group-collections?limit=-1')

      const { data } = json
      return data.map(item => ({
        id: item.id,
        category: item.attributes.category,
        name: item.attributes.name
      }))
    },

    getActivityGroup: async (activityGroupId) => {
      const json = await get(`/content/activity-groups/${activityGroupId}`)
      const item = json.data
      return {
        id: item.id,
        name: item.attributes.name,
        description: item.attributes.description,
        orderedActivities: item.relationships.orderedActivities.data.map(a => a.id)
      }
    },

    getActivitiesInGroup: async (activityGroupId) => {
      const json = await get(`/content/activities?activityGroupIds=${activityGroupId}&limit=-1`)
      return json.data.map(item => ({
        id: item.id,
        name: item.attributes.name,
        format: item.attributes.format
      }))
    }
  }
})(magic)

describe('headroom', () => {
  it('fetches group collections', async () => {
    nock(url, {'encodedQueryParams': true})
      .get('/content/group-collections')
      .query({'limit': '-1'})
      .reply(200, groups)

    const results = await api.getGroupCollections()

    assert.deepEqual(results[0], { id: '1', category: 'MINIS', name: 'Minis' })
  })

  it('handles errors fetching group collections', async () => {
    nock(url, {'encodedQueryParams': true})
      .get('/content/group-collections')
      .query({'limit': '-1'})
      .reply(500, groups)

    try {
      await api.getGroupCollections()
    } catch (e) {
      assert.instanceOf(e, Error)
      assert.equal(e.message, 'unexpected 500 http status')
    }
  })

  it('fetches activities groups', async () => {
    nock(url, {'encodedQueryParams': true})
      .get('/content/activity-groups/8')
      .reply(200, require('./data/activity-group.json'))

    const result = await api.getActivityGroup(8)

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
      .get('/content/activities?activityGroupIds=16&limit=-1')
      .reply(200, require('./data/activities-in-group.json'))

    const result = await api.getActivitiesInGroup(16)
    assert.deepEqual(result, [
      { id: '251', name: 'Session 1', format: 'AUDIO' },
      { id: '252', name: 'Session 2', format: 'AUDIO' },
      { id: '253', name: 'Session 3', format: 'AUDIO' },
      { id: '254', name: 'Session 4', format: 'AUDIO' },
      { id: '255', name: 'Session 5', format: 'AUDIO' },
      { id: '256', name: 'Session 6', format: 'AUDIO' },
      { id: '257', name: 'Session 7', format: 'AUDIO' },
      { id: '258', name: 'Session 8', format: 'AUDIO' },
      { id: '259', name: 'Session 9', format: 'AUDIO' },
      { id: '260', name: 'Session 10', format: 'AUDIO' }
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
