const createQueuingApi = require('../lib/queuing-api-decorator.js')
const promisify = require('util').promisify
const sinon = require('sinon')

const delay = promisify(setTimeout)

describe('queuing-api-decorator', () => {
  let stubApi
  beforeEach(() => {
    stubApi = {
      getGroupCollections: sinon.spy(async () => delay(10)),
      getActivityGroup: sinon.spy(async () => delay(10)),
      getActivitiesInGroup: sinon.spy(async () => delay(10)),
      getAnimationGroups: sinon.spy(async () => delay(10))
    }
  })

  it('supports limitting concurrency to 1 at a time', async () => {
    const api = createQueuingApi(stubApi, 1)
    api.getGroupCollections()
    api.getActivityGroup()
    api.getActivitiesInGroup()
    api.getAnimationGroups()

    await delay(5) // t = 5

    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.notCalled(stubApi.getActivityGroup)
    sinon.assert.notCalled(stubApi.getActivitiesInGroup)
    sinon.assert.notCalled(stubApi.getAnimationGroups)

    await delay(6) // t = 11

    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.calledOnce(stubApi.getActivityGroup)
    sinon.assert.notCalled(stubApi.getActivitiesInGroup)
    sinon.assert.notCalled(stubApi.getAnimationGroups)

    await delay(11) // t = 22
    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.calledOnce(stubApi.getActivityGroup)
    sinon.assert.calledOnce(stubApi.getActivitiesInGroup)
    sinon.assert.notCalled(stubApi.getAnimationGroups)

    await delay(16) // t = 22
    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.calledOnce(stubApi.getActivityGroup)
    sinon.assert.calledOnce(stubApi.getActivitiesInGroup)
    sinon.assert.calledOnce(stubApi.getAnimationGroups)
  })

  it('supports limitting concurrency to 2 at a time', async () => {
    const api = createQueuingApi(stubApi, 2)
    api.getGroupCollections()
    api.getActivityGroup()
    api.getActivitiesInGroup()
    api.getAnimationGroups()

    await delay(5) // t = 5

    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.calledOnce(stubApi.getActivityGroup)
    sinon.assert.notCalled(stubApi.getActivitiesInGroup)

    await delay(6) // t = 11

    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.calledOnce(stubApi.getActivityGroup)
    sinon.assert.calledOnce(stubApi.getActivitiesInGroup)
    sinon.assert.calledOnce(stubApi.getAnimationGroups)
  })

  describe('api-decorator contract tests', () => {
    const decorate = (api) => createQueuingApi(api, 1)

    require('./api-decorator-contract-test.js')(decorate, it)
  })
})
