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
      getActivitiesInGroup: sinon.spy(async () => delay(10))
    }
  })

  it('supports limitting concurrency to 1 at a time', async () => {
    const api = createQueuingApi(stubApi, 1)
    api.getGroupCollections()
    api.getActivityGroup()
    api.getActivitiesInGroup()

    await delay(5) // t = 5

    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.notCalled(stubApi.getActivityGroup)
    sinon.assert.notCalled(stubApi.getActivitiesInGroup)

    await delay(6) // t = 11

    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.calledOnce(stubApi.getActivityGroup)
    sinon.assert.notCalled(stubApi.getActivitiesInGroup)

    await delay(11) // t = 22
    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.calledOnce(stubApi.getActivityGroup)
    sinon.assert.calledOnce(stubApi.getActivitiesInGroup)
  })

  it('supports limitting concurrency to 2 at a time', async () => {
    const api = createQueuingApi(stubApi, 2)
    api.getGroupCollections()
    api.getActivityGroup()
    api.getActivitiesInGroup()

    await delay(5) // t = 5

    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.calledOnce(stubApi.getActivityGroup)
    sinon.assert.notCalled(stubApi.getActivitiesInGroup)

    await delay(6) // t = 11

    sinon.assert.calledOnce(stubApi.getGroupCollections)
    sinon.assert.calledOnce(stubApi.getActivityGroup)
    sinon.assert.calledOnce(stubApi.getActivitiesInGroup)
  })

  describe('api-decorator contract tests', () => {
    const decorate = (api) => createQueuingApi(api, 1)

    require('./api-decorator-contract-test.js')(decorate, it)
  })
})
