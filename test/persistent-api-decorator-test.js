const assert = require('assert')
const {createFsFromVolume, Volume} = require('memfs')
const promisify = require('util').promisify

const createPersistentApi = require('../lib/persistent-api-decorator')

const bogusApi = {
  getGroupCollections: async () => {
    return 'the group-collection'
  },
  getActivityGroup: async (id) => {
    return `the activity-group ${id}`
  },
  getActivitiesInGroup: async (id) => {
    return `the activities in the group ${id}`
  }
}

describe('persistent-api-decorator', () => {
  let api, fs, readFile
  beforeEach(async () => {
    const vol = new Volume()
    fs = createFsFromVolume(vol)
    readFile = promisify(fs.readFile)
    api = await createPersistentApi(bogusApi, '/data', fs)
  })

  it('persists fetched group collection to disk', async () => {
    await api.getGroupCollections()

    const file = await readFile('/data/group-collections.json')
    assert.equal(file, 'the group-collection')
  })

  it('persists fetched activity groups', async () => {
    await api.getActivityGroup('7')

    const file = await readFile('/data/activity-group-7.json')
    assert.equal(file, 'the activity-group 7')
  })

  it('persists fetched activities', async () => {
    await api.getActivitiesInGroup('8')

    const file = await readFile('/data/activities-in-group-8.json')
    assert.equal(file, 'the activities in the group 8')
  })
})