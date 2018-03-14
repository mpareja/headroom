const assert = require('chai').assert
const fileApi = require('../lib/file-api.js')
const path = require('path')
const sinon = require('sinon')

const createVisitor = require('../lib/api-visitor.js')

function getFileApi () {
  return fileApi(path.join(__dirname, 'data'))
}

describe('api-visitor', () => {
  let gcspy, agspy, mispy, visitor
  beforeEach(() => {
    gcspy = sinon.spy()
    agspy = sinon.spy()
    mispy = sinon.spy()

    visitor = createVisitor()
    visitor.on('group-collection', gcspy)
    visitor.on('activity-group', agspy)
    visitor.on('media-item', mispy)
  })

  it('raises events for each response from api', async () => {
    await visitor.visit(getFileApi())

    sinon.assert.calledOnce(gcspy)
    sinon.assert.calledOnce(agspy)
    assert.equal(mispy.callCount, 30 * 3) // 30 episodes 3 lengths
  })

  it('handles errors in getActivityGroup', async () => {
    const bogusError = new Error('bogus')
    const api = getFileApi()
    api.getActivityGroup = async () => { throw bogusError }

    const errorSpy = sinon.spy()
    visitor.on('error', errorSpy)

    await visitor.visit(api)

    sinon.assert.calledOnce(errorSpy)
    const err = errorSpy.args[0][0]
    assert.instanceOf(err, Error)
    assert.isDefined(err.activityGroupId)
    assert.equal(err.inner, bogusError)
  })

  it('handles errors in getActivitiesInGroup', async () => {
    const bogusError = new Error('bogus')
    const api = getFileApi()
    api.getActivitiesInGroup = async () => { throw bogusError }

    const errorSpy = sinon.spy()
    visitor.on('error', errorSpy)

    await visitor.visit(api)

    sinon.assert.calledOnce(errorSpy)
    const err = errorSpy.args[0][0]
    assert.instanceOf(err, Error)
    assert.isDefined(err.activityGroupId)
    assert.equal(err.inner, bogusError)
  })
})
