const path = require('path')
const promisify = require('util').promisify
const readFile = promisify(require('fs').readFile)

module.exports = (dir) => ({
  getGroupCollections: async () => {
    const raw = await readFile(path.join(dir, 'group-collections.json'), 'utf8')
    return JSON.parse(raw)
  },

  getActivityGroup: async (activityGroupId) => {
    const raw = await readFile(path.join(dir, `activity-group-${activityGroupId}.json`), 'utf8')
    return JSON.parse(raw)
  },

  getActivitiesInGroup: async (activityGroupId) => {
    const raw = await readFile(path.join(dir, `activities-in-group-${activityGroupId}.json`), 'utf8')
    return JSON.parse(raw)
  }
})
