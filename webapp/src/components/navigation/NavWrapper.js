import React, { useState } from 'react'
import { node } from 'prop-types'
import clsx from 'clsx'
import AppBar from '@material-ui/core/AppBar'

import IconButton from '@material-ui/core/IconButton'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'

import MenuIcon from '@material-ui/icons/Menu'

import MenuDrawer from './MenuDrawer'
import useNavigationStyles from '../../styles/navigation'

const propTypes = {
  children: node.isRequired
}

const NavWrapper = ({ children }) => {
  const classes = useNavigationStyles()
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleDrawerOpen = () => setDrawerOpen(true)
  const handleDrawerClose = () => setDrawerOpen(false)

  return (
    <>
      <AppBar
        className={clsx(classes.appBar, {
          [classes.appBarShift]: drawerOpen
        })}
        position='fixed'
      >
        <Toolbar>
          <IconButton
            aria-label='open menu'
            className={clsx(classes.menuButton, {
              [classes.hide]: drawerOpen
            })}
            color='inherit'
            edge='start'
            onClick={handleDrawerOpen}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant='h6'>
            Budget Master
          </Typography>
        </Toolbar>
      </AppBar>
      <MenuDrawer drawerOpen={drawerOpen} handleDrawerClose={handleDrawerClose} />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        {children}
      </main>
    </>
  )
}

NavWrapper.propTypes = propTypes
export default NavWrapper
