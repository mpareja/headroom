module.exports = async (api) => {
  const gc = await api.getGroupCollections()

  await Promise.all([
    Promise.all(gc.data.map(item => api.getActivityGroup(item.id))),
    Promise.all(gc.data.map(item => api.getActivitiesInGroup(item.id)))
  ])
}
