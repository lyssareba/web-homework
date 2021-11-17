import React from 'react'
import { Link } from 'react-router-dom'
import { bool, func } from 'prop-types'
import clsx from 'clsx'

import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft'
import useNavigationStyles from '../../styles/navigation'

import navLinks from './navLinks'

const propTypes = {
  drawerOpen: bool.isRequired,
  handleDrawerClose: func.isRequired
}

const MenuDrawer = ({ drawerOpen, handleDrawerClose }) => {
  const classes = useNavigationStyles()

  return (
    <Drawer
      classes={{
        paper: clsx({
          [classes.drawerOpen]: drawerOpen,
          [classes.drawerClose]: !drawerOpen
        })
      }}
      // eslint-disable-next-line
      className={clsx(classes.drawer, {
        [classes.drawerOpen]: drawerOpen,
        [classes.drawerClose]: !drawerOpen
      })}
      variant='permanent'
    >
      <div className={classes.toolbar}>
        <IconButton onClick={handleDrawerClose}>
          <ChevronLeftIcon />
        </IconButton>
      </div>
      <Divider />
      <List>
        {navLinks.map(navLink => (
          <Link className={classes.navLink} key={navLink.id} to={navLink.link}>
            <ListItem button>
              <ListItemIcon>{navLink.icon}</ListItemIcon>
              <ListItemText primary={navLink.text} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Drawer>
  )
}

MenuDrawer.propTypes = propTypes
export default MenuDrawer
