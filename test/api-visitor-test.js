const assert = require('chai').assert
const fileApi = require('../lib/file-api.js')
const path = require('path')
const sinon = require('sinon')

const createVisitor = require('../lib/api-visitor.js')

describe('api-visitor', () => {
  it('raises events for each response from api', async () => {
    const gcspy = sinon.spy()
    const agspy = sinon.spy()
    const mispy = sinon.spy()

    const visitor = createVisitor()
    visitor.on('group-collection', gcspy)
    visitor.on('activity-group', agspy)
    visitor.on('media-item', mispy)

    await visitor.visit(fileApi(path.join(__dirname, 'data')))

    sinon.assert.calledOnce(gcspy)
    sinon.assert.calledOnce(agspy)
    assert.equal(mispy.callCount, 30 * 3) // 30 episodes 3 lengths
  })
})
