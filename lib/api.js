const authorization = process.env.HEADROOM_BEARER

module.exports = (magic) => {
  async function get (path) {
    const url = `https://api.prod.${magic}.com${path}`
    const res = await fetch(url, { headers: { authorization } })

    if (res.status !== 200) {
      const error = new Error(`unexpected ${res.status} http status`)
      error.status = 200
      throw error
    }

    return res.json()
  }

  return {
    getGroupCollections: async () => {
      const json = await get('/content/group-collections?limit=-1')

      const { data } = json
      return data.map(item => ({
        id: item.id,
        category: item.attributes.category,
        name: item.attributes.name
      }))
    },

    getActivityGroup: async (activityGroupId) => {
      const json = await get(`/content/activity-groups/${activityGroupId}`)
      const item = json.data
      return {
        id: item.id,
        name: item.attributes.name,
        description: item.attributes.description,
        orderedActivities: item.relationships.orderedActivities.data.map(a => a.id)
      }
    },

    getActivitiesInGroup: async (activityGroupId) => {
      const json = await get(`/content/activities?activityGroupIds=${activityGroupId}&limit=-1`)
      return json.data.map(item => ({
        id: item.id,
        name: item.attributes.name,
        format: item.attributes.format
      }))
    }
  }
}
