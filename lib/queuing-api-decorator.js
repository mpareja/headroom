const { default: PQueue } = require('p-queue')
module.exports = (api, concurrency) => {
  const queue = new PQueue({ concurrency })
  return {
    getGroupCollections: (...args) => {
      return queue.add(() => api.getGroupCollections(...args))
    },
    getActivityGroup: (...args) => {
      return queue.add(() => api.getActivityGroup(...args))
    },
    getActivitiesInGroup: (...args) => {
      return queue.add(() => api.getActivitiesInGroup(...args))
    },
    getAnimationGroups: async (...args) => {
      return queue.add(() => api.getAnimationGroups(...args))
    }
  }
}
