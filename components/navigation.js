import ChildIcon from '@mui/icons-material/ChildCare'
import PacksIcon from '@mui/icons-material/Folder'
import SinglesIcon from '@mui/icons-material/List'
import AnimationIcon from '@mui/icons-material/Movie'

import BottomNavigation from '@mui/material/BottomNavigation'
import BottomNavigationAction from '@mui/material/BottomNavigationAction'

export const Navigation = ({ categoryId, onChange }) => {
  return (
    <BottomNavigation
      value={categoryId}
      onChange={onChange}
      showLabels
      sx={{
        margin: 0,
        textAlign: 'center',
        width: '100%',
        position: 'fixed',
        top: 'auto',
        left: 0,
        right: 0,
        bottom: 0
      }}
    >
      <BottomNavigationAction label='Packs' value='PACK_GROUP' icon={<PacksIcon />} />
      <BottomNavigationAction label='Singles' value='DISCOVER_SINGLES' icon={<SinglesIcon />} />
      <BottomNavigationAction label='Kids' value='KIDS' icon={<ChildIcon />} />
      <BottomNavigationAction label='Animations' value='ANIMATION_GROUP' icon={<AnimationIcon />} />
    </BottomNavigation>
  )
}
