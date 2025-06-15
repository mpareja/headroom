import Container from '@mui/material/Container'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { Navigation } from '../components/navigation'
import { useState } from 'react'

import createApi from '../lib/file-api'

const Collection = ({ collection }) => {
  return (
    <Box sx={{ mb: 4 }}>
      <Typography variant='h3' sx={{ textAlign: 'center', mb: 2 }}>
        {collection.name}
      </Typography>
      <Box sx={{
        display: 'flex',
        flexWrap: 'nowrap',
        overflowX: 'auto',
        gap: 2,
        pb: 2
      }}
      >
        {collection.groups.map(group =>
          <ActivityCard key={group.id} name={group.name} />
        )}
      </Box>
    </Box>
  )
}

const ActivityCard = ({ name }) => {
  return (
    <Box
      sx={{
        padding: 2,
        textAlign: 'center',
        backgroundColor: 'primary.main',
        borderRadius: '6px',
        width: '172px',
        height: '216px',
        color: 'white',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'primary.dark'
        },
        '@media (min-width: 600px)': {
          width: '328px',
          height: '408px'
        }
      }}
    >
      <Typography variant='h6' sx={{ fontSize: { xs: '0.9rem', sm: '1.25rem' } }}>
        {name}
      </Typography>
    </Box>
  )
}

export default ({ classes, categories, collections }) => {
  const [categoryId, setCategoryId] = useState('PACK_GROUP')
  const handleChange = (_, categoryId) => setCategoryId(categoryId)

  const categoryCollections = collections[categoryId]

  return (
    <>
      <Container sx={{ pb: 10 }}>
        {categoryCollections.map(collection => (
          <Collection key={collection.id} collection={collection} />
        ))}
      </Container>
      <Navigation categoryId={categoryId} onChange={handleChange} />
    </>
  )
}

const toPascal = (s) => s.replace(/_/g, ' ').replace(/(\w)(\w*)/g,
  (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase())

// The data model:
// [category: [collection: [group: [activity]]]]
export const getStaticProps = async () => {
  const api = createApi('./datastore/2018-04-02')
  const data = await api.getGroupCollections()

  const categories = [...new Set(data.data.map(g => g.attributes.category))]
    .map(category => ({ id: category, name: toPascal(category) }))

  // ex: { PACK_GROUP: [{ id: 8, name: 'Foundation', groups: [{ id: 21, name: 'Basics'}] }] }
  const collections = {}
  for await (const current of data.data) {
    const category = current.attributes.category
    const collection = collections[category] = collections[category] || []

    const orderedGroups = current.relationships.orderedGroups.data.map(og =>
      data.included.find(include => include.id === og.id && include.type === 'orderedGroups')
    ).sort((a, b) => a.attributes.ordinalNumber - b.attributes.ordinalNumber)

    const groups = await Promise.all(orderedGroups.map(og => {
      const include = data.included.find(include =>
        include.id === og.id && include.type === 'orderedGroups')

      return api.getActivityGroup(include.relationships.activityGroup.data.id)
        .then(group => ({
          id: group.data.id,
          name: group.data.attributes.name
        }))
    }))

    collection.push({ id: current.id, name: current.attributes.name, groups })
  }

  // console.log('CATEGORIES', categories)
  // console.log('COLLECTIONS', collections)
  return {
    props: { categories, collections }
  }
}
