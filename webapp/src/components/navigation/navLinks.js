import React from 'react'
import HomeIcon from '@material-ui/icons/Home'
import PeopleIcon from '@material-ui/icons/People'
import ReceiptIcon from '@material-ui/icons/Receipt'
import StoreIcon from '@material-ui/icons/Store'

const navLinks = [
  {
    id: 'home',
    text: 'Home',
    icon: <HomeIcon />,
    link: '/'
  }, {
    id: 'transactions',
    text: 'Transactions',
    icon: <ReceiptIcon />,
    link: '/transactions'
  }, {
    id: 'vendors',
    text: 'Vendors',
    icon: <StoreIcon />,
    link: '/vendors'
  }, {
    id: 'users',
    text: 'Users',
    icon: <PeopleIcon />,
    link: '/users'
  }
]

export default navLinks
