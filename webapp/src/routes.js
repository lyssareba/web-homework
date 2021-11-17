import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import NavWrapper from './components/navigation/NavWrapper'
import Home from './pages/home'
import Transactions from './pages/transactions'
import Users from './pages/users'
import Vendors from './pages/vendors'

const AppRouter = () => (
  <Router>
    <NavWrapper>
      <Route component={Home} exact path='/' />
      <Route component={Transactions} exact path='/transactions' />
      <Route component={Users} exact path='/users' />
      <Route component={Vendors} exact path='/vendors' />
    </NavWrapper>
  </Router>
)

export default AppRouter
