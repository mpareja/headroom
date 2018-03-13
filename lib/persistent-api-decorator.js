const path = require('path')
const promisify = require('util').promisify

module.exports = (api, directory, fs) => {
  const writeFile = promisify(fs.writeFile)

  return {
    getGroupCollections: async (...args) => {
      const result = await api.getGroupCollections(...args)

      const filename = path.join(directory, 'group-collections.json')
      await writeFile(filename, JSON.stringify(result, null, 2))

      return result
    },
    getActivityGroup: async (id, ...args) => {
      const result = await api.getActivityGroup(id, ...args)

      const filename = path.join(directory, `activity-group-${id}.json`)
      await writeFile(filename, JSON.stringify(result, null, 2))

      return result
    },
    getActivitiesInGroup: async (id, ...args) => {
      const result = await api.getActivitiesInGroup(id, ...args)

      const filename = path.join(directory, `activities-in-group-${id}.json`)
      await writeFile(filename, JSON.stringify(result, null, 2))

      return result
    }
  }
}
