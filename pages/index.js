import Container from '@material-ui/core/Container'
import Grid from '@material-ui/core/Grid'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  group: {
    padding: theme.spacing(2),
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    borderRadius: '6px',
    width: '172px',
    height: '216px',
    [theme.breakpoints.up('sm')]: {
      width: '328px',
      height: '408px'
    }
  }
}))

const Header = () =>
  <Container>
    <h1 style={{ textAlign: 'center' }}>Headroom</h1>
  </Container>

const ActivityGroup = ({ name }) => {
  const classes = useStyles()

  return (
    <Grid item>
      <h3 className={classes.group}>{name}</h3>
    </Grid>
  )
}

export default () =>
  <Container>
    <Header />
    <Grid container spacing={3}>
      <ActivityGroup name='Acceptance' />
      <ActivityGroup name='Everyday' />
    </Grid>
  </Container>
