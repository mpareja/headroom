const EventEmitter = require('events').EventEmitter
const Promise = require('bluebird')

function fetchIncludes (node, included, relation) {
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
  emitter.visitActivityGroup = async (api, activityGroupId) => {
    const groupCollections = await api.getGroupCollections()

    const includedActivityMatches =
      i => i.relationships.activityGroup.data.id === activityGroupId
    const groups = groupCollections.data.filter(group =>
      fetchIncludes(group, groupCollections.included, 'orderedGroups')
        .some(includedActivityMatches))

    if (groups.length !== 1) {
      const err = new Error(`activity id "${activityGroupId}" found in ${groups.length} groups, expected 1`)
      err.groups = groups
      throw err
    }

    await visitActivityGroup(api, groups[0], activityGroupId)
  }

  emitter.visitAnimationGroups = async (api) => {
    const animationGroups = await api.getAnimationGroups()
    for (let group of animationGroups.data) {
      const animations = fetchIncludes(group, animationGroups.included, 'animations')
        .map(animation => ({
          id: animation.id,
          name: animation.attributes.title,
          thumbnail: animation.relationships.thumbnailMedia.data.id,
          video: animation.relationships.videoMedia.data.id,
          group: {
            id: group.id,
            name: group.attributes.title
          }
        }))
      animations.forEach(a => emitter.emit('animation', a))
    }
  }

  emitter.visit = async (api) => {
    const groupCollections = await api.getGroupCollections()

    for (let group of groupCollections.data) {
      emitter.emit('group-collection', group)

      const activityGroupIds = fetchIncludes(group, groupCollections.included, 'orderedGroups')
        .map(i => i.relationships.activityGroup.data.id)

      await Promise.map(activityGroupIds, (id) => visitActivityGroup(api, group, id))
      await emitter.visitAnimationGroups(api)
    }
  }

  return emitter

  async function visitActivityGroup (api, group, activityGroupId) {
    let activityGroup
    try {
      activityGroup = await api.getActivityGroup(activityGroupId)
      emitter.emit('activity-group', activityGroup.data)
    } catch (e) {
      const err = new Error('getActivityGroup failed')
      err.activityGroupId = activityGroupId
      err.inner = e
      return emitter.emit('error', err)
    }

    let activities
    try {
      activities = await api.getActivitiesInGroup(activityGroupId)
    } catch (e) {
      const err = new Error('getActivitiesInGroup error')
      err.activityGroupId = activityGroupId
      err.inner = e
      return emitter.emit('error', err)
    }
    if (emitter.listenerCount('media-item') > 0) {
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
                name: activityGroup.data.attributes.name
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
