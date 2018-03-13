const assert = require('chai').assert
const stubApi = require('../lib/stub-api.js')()

module.exports = async (decorate, it) => {
  let api
  beforeEach(async () => {
    api = await decorate(stubApi)
  })

  it('forwards getGroupCollections calls', async () => {
    const result = await api.getGroupCollections()
    assert.equal(result, 'the group-collection')
  })

  it('forwards getActivityGroup calls', async () => {
    const result = await api.getActivityGroup(8)
    assert.equal(result, 'the activity-group 8')
  })

  it('forwards getActivitiesInGroup calls', async () => {
    const result = await api.getActivitiesInGroup(8)
    assert.equal(result, 'the activities in the group 8')
  })
}
