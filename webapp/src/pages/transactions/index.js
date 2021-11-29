import React from 'react'
import { useQuery } from '@apollo/client'
import GetTransactions from '../../gql/transactions.gql'
import TxTable from './TxTable'

const Transactions = () => {
  const { loading, error, data = {} } = useQuery(GetTransactions)

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
      <TxTable data={data.transactions} />
    </>
  )
}
export default Transactions
