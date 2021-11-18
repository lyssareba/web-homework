import React from 'react'
import { useQuery } from '@apollo/client'
import GetUsers from '../../gql/users.gql'
import Users from './Users'

const Users = () => {
  const { loading, error, data = {} } = useQuery(GetUsers)

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
    <>
      <Users data={data.users} />
    </>
  )
}
export default Users
