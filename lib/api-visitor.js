const EventEmitter = require('events').EventEmitter

function fetchIncludes(node, included, relation) {
  const refs = node.relationships[relation].data
  if (Array.isArray(refs)) {
    return refs.map(ref => {
      return included.filter(i => i.id === ref.id && i.type === ref.type)[0]
    })
  } else {
    const ref = refs
    return included.filter(i => i.id === ref.id && i.type === ref.type)[0]
  }
}

module.exports = () => {
  const emitter = new EventEmitter()
  emitter.visit = async (api) => {
    const groupCollections = await api.getGroupCollections()

    for (let group of groupCollections.data) {
      emitter.emit('group-collection', group)

      const activityGroupIds = fetchIncludes(group, groupCollections.included, 'orderedGroups')
        .map(i => i.relationships.activityGroup.data.id)

      for (let activityGroupId of activityGroupIds) {
        const activityGroup = await api.getActivityGroup(activityGroupId)
        emitter.emit('activity-group', activityGroup.data)

        const activities = await api.getActivitiesInGroup(activityGroupId)
        for (let activity of activities.data) {
          const mediaItems = fetchIncludes(activity, activities.included, 'variations')
            .map(v => {
              const mediaItem = fetchIncludes(v, activities.included, 'mediaItem')
              return {
                id: mediaItem.id,
                filename: mediaItem.attributes.filename,
                duration: v.attributes.duration,
                group: {
                  id: group.id,
                  name: group.attributes.name
                },
                pack: {
                  id: activityGroup.data.id,
                  name: activityGroup.data.attributes.name,
                //  description: activityGroup.data.attributes.description
                },
                activity: {
                  id: activity.id,
                  name: activity.attributes.name
                }
              }
            })
          mediaItems.forEach(mi => emitter.emit('media-item', mi))
        }
      }
    }
  }
  return emitter;
}
