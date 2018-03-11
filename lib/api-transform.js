module.exports = (api) => {
  return {
    getGroupCollections: async (...args) => {
      const { data } = await api.getGroupCollections(...args)
      return data.map(item => ({
        id: item.id,
        category: item.attributes.category,
        name: item.attributes.name
      }))
    },

    getActivityGroup: async (...args) => {
      const item = (await api.getActivityGroup(...args)).data
      return {
        id: item.id,
        name: item.attributes.name,
        description: item.attributes.description,
        orderedActivities: item.relationships.orderedActivities.data.map(a => a.id)
      }
    },

    getActivitiesInGroup: async (...args) => {
      const json = await api.getActivitiesInGroup(...args)
      return json.data.map(item => ({
        id: item.id,
        name: item.attributes.name,
        format: item.attributes.format
      }))
    }
  }
}
