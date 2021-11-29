import React, { Fragment } from 'react'
import { useQuery } from '@apollo/client'
import GetTransactions from '../../gql/transactions.gql'
import HomePage from './Home'

const Home = () => {
  const { loading, error, data = {} } = useQuery(GetTransactions)

  if (data) {
    console.log(data)
  }

  if (loading) {
    return (
      <Fragment>
        Loading...
      </Fragment>
    )
  }

  if (error) {
    return (
      <Fragment>
        ¯\_(ツ)_/¯
      </Fragment>
    )
  }

  return (
    // set up overview dashboard
    <Fragment>
      <HomePage txData={data?.transactions} />
    </Fragment>
  )
}

export default Home
