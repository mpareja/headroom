const PQueue = require('p-queue')
module.exports = (api, concurrency) => {
  const queue = new PQueue({ concurrency })
  return {
    getGroupCollections: (...args) => {
      queue.add(() => api.getGroupCollections(...args))
    },
    getActivityGroup: (...args) => {
      queue.add(() => api.getActivityGroup(...args))
    },
    getActivitiesInGroup: (...args) => {
      queue.add(() => api.getActivitiesInGroup(...args))
    }
  }
}
