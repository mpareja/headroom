const assert = require('assert')
const { createFsFromVolume, Volume } = require('memfs')
const promisify = require('util').promisify

const createPersistentApi = require('../lib/persistent-api-decorator')

const bogusApi = require('../lib/stub-api.js')()

describe('persistent-api-decorator', () => {
  let api, fs, readFile
  beforeEach(async () => {
    const vol = new Volume()
    fs = createFsFromVolume(vol)
    readFile = promisify(fs.readFile)
    api = createPersistentApi(bogusApi, '/data', fs)
    await promisify(fs.mkdir)('/data')
  })

  it('persists fetched group collection to disk', async () => {
    await api.getGroupCollections()

    const file = await readFile('/data/group-collections.json', 'utf8')
    assert.strictEqual(file, '"the group-collection"')
  })

  it('persists fetched activity groups', async () => {
    await api.getActivityGroup('7')

    const file = await readFile('/data/activity-group-7.json', 'utf8')
    assert.strictEqual(file, '"the activity-group 7"')
  })

  it('persists fetched activities', async () => {
    await api.getActivitiesInGroup('8')

    const file = await readFile('/data/activities-in-group-8.json', 'utf8')
    assert.strictEqual(file, '"the activities in the group 8"')
  })

  it('persists fetched animation group', async () => {
    await api.getAnimationGroups()

    const file = await readFile('/data/animation-group.json', 'utf8')
    assert.strictEqual(file, '"the animation groups"')
  })

  describe('api-decorator contract tests', () => {
    const decorate = async (api) => {
      const vol = new Volume()
      const fs = createFsFromVolume(vol)
      await promisify(fs.mkdir)('/data')
      return createPersistentApi(api, '/data', fs)
    }

    require('./api-decorator-contract-test.js')(decorate, it)
  })
})
