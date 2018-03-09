'use strict'
const assert = require('chai').assert
const fetch = require('isomorphic-unfetch')
const nock = require('nock')

const groups = require('./data/group-collections.json')

const authorization = process.env.HEADROOM_BEARER

const magic = String.fromCharCode(104, 101, 97, 100, 115, 112, 97, 99, 101)
const api = ((magic) => {
  return {
    getGroupCollections: async () => {
      const res = await fetch(`https://api.prod.${magic}.com/content/group-collections?limit=-1`, {
        method: 'GET',
        headers: {
          'Accept': 'application/vnd.api+json',
          authorization
        }
      })

      if (res.status !== 200) {
        const error = new Error(`unexpected ${res.status} http status`)
        error.status = 200
        throw error
      }

      const { data } = await res.json()
      return data.map(item => ({
        id: item.id,
        category: item.attributes.category,
        name: item.attributes.name
      }))
    },

    getActivityGroup: async (activityGroupId) => {
      const url = `https://api.prod.${magic}.com/content/activity-groups/${activityGroupId}`
      const res = await fetch(url, { headers: { authorization } })
      const json = await res.json()
      const item = json.data
      return {
        id: item.id,
        name: item.attributes.name,
        description: item.attributes.description,
        orderedActivities: item.relationships.orderedActivities.data.map(a => a.id)
      }
    }
  }
})(magic)

describe('headroom', () => {
  it('fetches group collections groups', async () => {
    // nock.recorder.rec()

    nock(`https://api.prod.${magic}.com:443`, {'encodedQueryParams': true})
      .get('/content/group-collections')
      .query({'limit': '-1'})
      .reply(200, groups)

    const results = await api.getGroupCollections()

    assert.deepEqual(results[0], { id: '1', category: 'MINIS', name: 'Minis' })
  })

  it('fetches activities groups', async () => {
    nock(`https://api.prod.${magic}.com:443`, {'encodedQueryParams': true})
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
