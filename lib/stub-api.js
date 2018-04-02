module.exports = () => ({
  getGroupCollections: async () => {
    return 'the group-collection'
  },
  getActivityGroup: async (id) => {
    return `the activity-group ${id}`
  },
  getActivitiesInGroup: async (id) => {
    return `the activities in the group ${id}`
  },
  getAnimationGroups: async () => {
    return 'the animation groups'
  }
})
