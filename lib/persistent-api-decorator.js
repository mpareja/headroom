const path = require('path')
const promisify = require('util').promisify

module.exports = async (api, directory, fs) => {
  await promisify(fs.mkdir)(directory)

  return {
    getGroupCollections: async (...args) => {
      const result = await api.getGroupCollections(...args)

      const filename = path.join(directory, 'group-collections.json')
      await promisify(fs.writeFile)(filename, result)
    },
    getActivityGroup: async (id, ...args) => {
      const result = await api.getActivityGroup(id, ...args)

      const filename = path.join(directory, `activity-group-${id}.json`)
      await promisify(fs.writeFile)(filename, result)
    },
    getActivitiesInGroup: async (id, ...args) => {
      const result = await api.getActivitiesInGroup(id, ...args)

      const filename = path.join(directory, `activities-in-group-${id}.json`)
      await promisify(fs.writeFile)(filename, result)
    }
  }
}
