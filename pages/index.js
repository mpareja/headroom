import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'

import ChildIcon from '@material-ui/icons/ChildCare'
import PacksIcon from '@material-ui/icons/Folder'
import SinglesIcon from '@material-ui/icons/List'
import AnimationIcon from '@material-ui/icons/Movie'

import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import GridList from '@material-ui/core/GridList'
import { makeStyles } from '@material-ui/core/styles'
import { useState } from 'react'
import createApi from '../lib/file-api'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  collectionName: {
    textAlign: 'center'
  },
  groupList: {
    display: 'flex',
    flexWrap: 'nowrap'
  },
  activity: {
    padding: theme.spacing(2),
    margin: theme.spacing(1.5),
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '6px',
    width: '172px',
    height: '216px',
    [theme.breakpoints.up('sm')]: {
      width: '328px',
      height: '408px'
    }
  },
  bottomNavigation: {
    margin: 0,
    textAlign: 'center',
    width: '100%',
    position: 'fixed',
    top: 'auto',
    left: 0,
    right: 0,
    bottom: 0
  }
}))

const Header = () =>
  <Container>
    <h1 style={{ textAlign: 'center' }}>Headroom</h1>
  </Container>

const Collection = ({ collection }) => {
  const classes = useStyles()

  return (
    <>
      <h3 className={classes.collectionName}>{collection.name}</h3>
      <GridList cols={3.5} className={classes.groupList}>
        {collection.groups.map(group =>
          <ActivityCard key={group.id} name={group.name} />
        )}
      </GridList>
    </>
  )
}

const ActivityCard = ({ name }) => {
  const classes = useStyles()

  return (
    <Grid item>
      <h3 className={classes.activity}>{name}</h3>
    </Grid>
  )
}

const Navigation = ({ categoryId, onChange }) => {
  const classes = useStyles()

  return (
    <BottomNavigation value={categoryId} onChange={onChange} showLabels className={classes.bottomNavigation}>
      <BottomNavigationAction label='Packs' value="PACK_GROUP" icon={<PacksIcon />}/>
      <BottomNavigationAction label='Singles' value="DISCOVER_SINGLES" icon={<SinglesIcon />}/>
      <BottomNavigationAction label='Kids' value="KIDS" icon={<ChildIcon />}/>
      <BottomNavigationAction label='Animations' value="ANIMATION_GROUP" icon={<AnimationIcon />}/>
    </BottomNavigation>
  )
}

export default ({ classes, categories, collections }) => {
  const [categoryId, setCategoryId] = useState('PACK_GROUP')
  const handleChange = (_, categoryId) => setCategoryId(categoryId)

  const category = categories.find(c => c.id === categoryId)
  const categoryCollections = collections[categoryId]

  return (
    <Container>
      {categoryCollections.map(collection => (
        <Collection key={collection.id} collection={collection} />
      ))}
      <Navigation categoryId={categoryId} onChange={handleChange} />
    </Container>
  )
}

const toPascal = (s) => s.replace(/_/g, ' ').replace(/(\w)(\w*)/g,
  (g0,g1,g2) => g1.toUpperCase() + g2.toLowerCase())

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
