import ChildIcon from '@material-ui/icons/ChildCare'
import PacksIcon from '@material-ui/icons/Folder'
import SinglesIcon from '@material-ui/icons/List'
import AnimationIcon from '@material-ui/icons/Movie'

import BottomNavigation from '@material-ui/core/BottomNavigation'
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
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

export const Navigation = ({ categoryId, onChange }) => {
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
