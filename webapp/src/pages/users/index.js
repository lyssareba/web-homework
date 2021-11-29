import React from 'react'
import { useQuery } from '@apollo/client'
import GetUsers from '../../gql/users.gql'
import GetVendors from '../../gql/vendors.gql'

import UsersTx from './Users'

const Users = () => {
  const { loading, error, data = {} } = useQuery(GetUsers)
  const { data: vendorData = {} } = useQuery(GetVendors)
  if (loading) {
    return (
      <>
        Loading...
      </>
    )
  }

  if (error) {
    return (
      <>
        ¯\_(ツ)_/¯
      </>
    )
  }

  return (
    <UsersTx data={data.users} vendors={vendorData.vendors} />
  )
}
export default Users
