const assert = require('assert')
const path = require('path')
const createApi = require('../lib/file-api')

describe('file-api', () => {
  let api
  before(() => {
    api = createApi(path.join(__dirname, 'data'))
  })

  it('retrieves group collections', async () => {
    const result = await api.getGroupCollections()

    assert.deepEqual(result, require('./data/group-collections.json'))
  })

  it('retrieves activity group', async () => {
    const result = await api.getActivityGroup(8)

    assert.deepEqual(result, require('./data/activity-group-8.json')) // diff can take long on fail
  })

  it('retrieves activities in group', async () => {
    const result = await api.getActivitiesInGroup(8)

    assert.deepEqual(result, require('./data/activities-in-group-8.json')) // diff can take long on fail
  })
})
