const authorization = process.env.HEADROOM_BEARER
const fetch = require('isomorphic-unfetch')

module.exports = (magic) => {
  async function get (path) {
    const url = `https://api.prod.${magic}.com${path}`
    const res = await fetch(url, { headers: { authorization } })

    if (res.status !== 200) {
      const error = new Error(`unexpected ${res.status} http status: ${path}`)
      error.status = 200
      throw error
    }

    return res.json()
  }

  return {
    getGroupCollections: async () => {
      return get('/content/group-collections?limit=-1')
    },

    getActivityGroup: async (activityGroupId) => {
      return get(`/content/activity-groups/${activityGroupId}`)
    },

    getActivitiesInGroup: async (activityGroupId) => {
      return get(`/content/activities?activityGroupIds=${activityGroupId}&limit=-1`)
    }
  }
}
