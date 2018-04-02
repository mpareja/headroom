'use strict'
const assert = require('chai').assert
const nock = require('nock')

const magic = String.fromCharCode(104, 101, 97, 100, 115, 112, 97, 99, 101)
const url = `https://api.prod.${magic}.com`
const api = require('../lib/http-api')(magic)

describe('http-api', () => {
  it('fetches group collections', async () => {
    const groupCollectionsData = require('./data/group-collections.json')

    nock(url, {'encodedQueryParams': true})
      .get('/content/group-collections')
      .query({'limit': '-1'})
      .reply(200, groupCollectionsData)

    const results = await api.getGroupCollections()
    assert.deepEqual(results, groupCollectionsData)
  })

  it('handles errors fetching group collections', async () => {
    nock(url, {'encodedQueryParams': true})
      .get('/content/group-collections')
      .query({'limit': '-1'})
      .reply(500)

    try {
      await api.getGroupCollections()
    } catch (e) {
      assert.instanceOf(e, Error)
      assert.equal(e.message, 'unexpected 500 http status: /content/group-collections?limit=-1')
    }
  })

  it('fetches activities groups', async () => {
    const activityGroupData = require('./data/activity-group-8.json')

    nock(url, {'encodedQueryParams': true})
      .get('/content/activity-groups/8')
      .reply(200, activityGroupData)

    const result = await api.getActivityGroup('8')
    assert.deepEqual(activityGroupData, result)
  })

  it('fetches activities in activity group', async () => {
    const activitiesInGroupData = require('./data/activities-in-group-8.json')

    nock(url)
      .get('/content/activities?activityGroupIds=8&limit=-1')
      .reply(200, activitiesInGroupData)

    const result = await api.getActivitiesInGroup(8)
    assert.deepEqual(result, activitiesInGroupData)
  })

  it('fetches signed-urls for downloading audio', async () => {
    nock(url, {'encodedQueryParams': true})
      .get('/content/media-items/5267/make-signed-url')
      .query({'mp3': 'true'})
      .reply(200, { url: 'https://some-download-url' })

    const result = await api.makeSignedUrl('5267')
    assert.deepEqual(result, {
      url: 'https://some-download-url'
    })
  })

  it('fetches animation groups', async () => {
    const animationGroupJson = require('./data/animation-group.json')

    nock(url, {'encodedQueryParams': true})
      .get('/content/view-models/animation-group')
      .query({ userId: process.env.HEADROOM_USERID })
      .reply(200, animationGroupJson)

    const result = await api.getAnimationGroups()
    assert.deepEqual(result, animationGroupJson)
  })
})
