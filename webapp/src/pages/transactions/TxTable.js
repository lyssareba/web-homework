/* eslint-disable camelcase, react/jsx-sort-props */
import React, { useState } from 'react'
import { arrayOf, string, bool, number, shape } from 'prop-types'
import { useMutation, useQuery } from '@apollo/client'
import GetUsers from '../../gql/users.gql'

import TableCx from '../../components/table'
import { TableContext } from '../../components/table/TableContext'

import AddTransaction from '../../gql/addTransaction.gql'
import UpdateTransaction from '../../gql/updateTransaction.gql'
import DeleteTransaction from '../../gql/deleteTransaction.gql'

export const tableHeaderKeys = [
  { id: 'id', label: 'ID', readOnly: true, placeholder: 'Auto Generated', type: 'id' },
  { id: 'user', label: 'User', placeholder: 'employee1', type: 'name', typeFulfillmentKeys: ['firstName', 'lastName'], inputType: 'dropdown' },
  { id: 'description', label: 'Description', placeholder: 'groceries', type: 'text' },
  { id: 'merchant_id', label: 'Merchant ID', placeholder: 'walmart', type: 'text' },
  { id: 'amount', label: 'Amount', placeholder: '-100 or +100', type: 'currency' }
]

const createData = (data) => data.map(({ id, user_id, description, merchant_id, debit, amount, user }) => ({
  id,
  user,
  user_id,
  description,
  merchant_id,
  amount,
  debit,
  isEditMode: false
}))

const TxTable = ({ data }) => {
  const [addTransaction] = useMutation(AddTransaction)
  const [updateTransaction] = useMutation(UpdateTransaction)
  const [deleteTransaction] = useMutation(DeleteTransaction)
  const { data: usersData } = useQuery(GetUsers)
  const formattedData = createData(data)
  const [rows, setRows] = useState(formattedData)
  const [previous, setPrevious] = useState({})

  const testPrefix = 'transactions'
  const makeDataTestId = (transactionId, fieldName) => `${testPrefix}-${transactionId}-${fieldName}`
  const txObject = {
    id: null,
    user: null,
    user_id: null,
    description: null,
    merchant_id: null,
    amount: null,
    debit: null,
    isEditMode: null
  }

  const onSave = async (id, rows, setRows, previous) => {
    if (id === '') {
      const newTransaction = rows.find(row => row.id === '')
      newTransaction.credit = /^\+/.test(newTransaction.amount) || false
      newTransaction.debit = /^-/.test(newTransaction.amount) || false
      newTransaction.amount = parseFloat(newTransaction.amount.substring(1))
      delete newTransaction.isEditMode
      delete newTransaction.id
      delete newTransaction.user
      try {
        const { data } = await addTransaction({
          variables: {
            ...newTransaction
          }
        })
        newTransaction.user = usersData?.users.find(usr => usr.id === newTransaction.user_id)
        const newRows = rows.map(row => {
          if (row.id === undefined) {
            const formattedRow = Object.assign(txObject, row)
            formattedRow.id = data.addTransaction.id
            formattedRow.isEditMode = false
            return { ...formattedRow }
          }
          return row
        })
        setRows(newRows)
      } catch (err) {
        console.log(err)
      }
    } else {
      const updatedTransaction = rows.find(row => row.id === id)

      if (updatedTransaction.amount !== previous[id].amount) {
        updatedTransaction.credit = /^\+/.test(updatedTransaction.amount) || false
        updatedTransaction.debit = /^-/.test(updatedTransaction.amount) || false
        updatedTransaction.amount = parseFloat(updatedTransaction.amount.substring(1))
      }
      delete updatedTransaction.isEditMode
      delete updatedTransaction.user

      try {
        await updateTransaction({
          variables: {
            id: updatedTransaction.id,
            user_id: updatedTransaction.user_id,
            description: updatedTransaction.description,
            merchant_id: updatedTransaction.merchant_id,
            debit: updatedTransaction.debit,
            credit: updatedTransaction.credit,
            amount: updatedTransaction.amount
          }
        })

        updatedTransaction.user = usersData?.users.find(usr => usr.id === updatedTransaction.user_id)
        setRows(state => {
          return rows.map(row => {
            if (row.id === id) {
              delete row.credit
              const formattedRow = Object.assign(txObject, row)
              return formattedRow
            }
            return row
          })
        })
        setPrevious(state => {
          delete state[id]
          return state
        })
      } catch (err) {
        console.log(err)
      }
    }
  }

  const onTransactionDelete = async id => {
    try {
      await deleteTransaction({
        variables: { id }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const onAddTransactionClick = (rows, setRows) => {
    const newRows = [...rows]
    const emptyRow = {
      id: '',
      user: {},
      user_id: '',
      description: '',
      merchant_id: '',
      amount: '',
      isEditMode: true
    }
    newRows.unshift(emptyRow)
    setRows(newRows)
  }

  const formatDropdownData = () => {
    const { users } = usersData
    const formattedUsers = users.map(({ id, lastName, firstName }) => ({
      id,
      name: firstName.concat(' ', lastName)
    }))
    return formattedUsers
  }

  return (
    <TableContext.Provider
      value={{
        rows,
        setRows,
        previous,
        setPrevious,
        tableHeaderKeys,
        makeDataTestId
      }}
    >
      <TableCx.Header
        addItemText={'Add Transaction'}
        onAddClick={onAddTransactionClick}
        tableTitle={'Transactions'}
        testPrefix={testPrefix}
      />
      <TableCx
        onSave={onSave}
        onDelete={onTransactionDelete}
        inputDropdownData={{
          key: 'user',
          updateKey: 'user_id',
          data: usersData?.users?.length && formatDropdownData()
        }}
      />
    </TableContext.Provider>
  )
}

TxTable.propTypes = {
  data: arrayOf(shape({
    id: string,
    user_id: string,
    description: string,
    merchant_id: string,
    debit: bool,
    credit: bool,
    amount: number
  }))
}

export default TxTable
