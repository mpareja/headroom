const createFileApi = require('../lib/file-api.js')
const path = require('path')
const scrape = require('../lib/scrape-api.js')
const sinon = require('sinon')

describe('scrape-api', () => {
  it('all api objects are visited', async () => {
    const api = createFileApi(path.join(__dirname, 'data'))

    sinon.spy(api, 'getGroupCollections')
    sinon.spy(api, 'getActivityGroup')
    sinon.spy(api, 'getActivitiesInGroup')

    await scrape(api)

    sinon.assert.calledOnce(api.getGroupCollections)
    sinon.assert.calledOnce(api.getActivityGroup)
    sinon.assert.calledWith(api.getActivityGroup, '8')
    sinon.assert.calledOnce(api.getActivitiesInGroup)
    sinon.assert.calledWith(api.getActivitiesInGroup, '8')
  })
})
