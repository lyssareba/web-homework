/* eslint-disable camelcase, react/jsx-sort-props */
import React, { useState } from 'react'
import { arrayOf, string, bool, number, shape } from 'prop-types'
import { useMutation, useQuery } from '@apollo/client'
import GetUsers from '../../gql/users.gql'
import GetVendors from '../../gql/vendors.gql'

import TableCx from '../../components/table'
import { TableContext } from '../../components/table/TableContext'

import AddTransaction from '../../gql/addTransaction.gql'
import UpdateTransaction from '../../gql/updateTransaction.gql'
import DeleteTransaction from '../../gql/deleteTransaction.gql'

export const tableHeaderKeys = [
  { id: 'user', label: 'User', placeholder: 'employee1', type: 'name', typeFulfillmentKeys: ['firstName', 'lastName'], inputType: 'dropdown' },
  { id: 'description', label: 'Description', placeholder: 'groceries', type: 'text' },
  { id: 'vendor', label: 'Vendor', placeholder: 'Walmart', type: 'name', inputType: 'dropdown' },
  // { id: 'category', label: 'Category', placeholder: 'Food', type: 'name', typeFullfillmentKeys: ['name'], inputType: 'dropdown' },
  { id: 'amount', label: 'Amount', placeholder: '-100 or +100', type: 'currency' }
]

const createData = (data) => data.map(({ id, user_id, description, vendor_id, debit, amount, user, vendor }) => ({
  id,
  user,
  user_id,
  description,
  vendor_id,
  vendor,
  amount,
  debit,
  isEditMode: false
}))

const TxTable = ({ data }) => {
  const [addTransaction] = useMutation(AddTransaction)
  const [updateTransaction] = useMutation(UpdateTransaction)
  const [deleteTransaction] = useMutation(DeleteTransaction)
  const { data: { users } = {} } = useQuery(GetUsers)
  const { data: { vendors } = {} } = useQuery(GetVendors)
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
    vendor_id: null,
    vendor: null,
    // category: null,
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
      delete newTransaction.vendor

      try {
        const { data } = await addTransaction({
          variables: {
            ...newTransaction
          }
        })

        newTransaction.user = users?.find(usr => usr.id === newTransaction.user_id)
        newTransaction.vendor = vendors?.find(vndr => vndr.id === newTransaction.vendor_id)

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
      delete updatedTransaction.vendor

      try {
        await updateTransaction({
          variables: {
            id: updatedTransaction.id,
            user_id: updatedTransaction.user_id,
            description: updatedTransaction.description,
            vendor_id: updatedTransaction.vendor_id,
            debit: updatedTransaction.debit,
            credit: updatedTransaction.credit,
            amount: updatedTransaction.amount
          }
        })

        updatedTransaction.user = users?.find(usr => usr.id === updatedTransaction.user_id)
        updatedTransaction.vendor = vendors?.find(vndr => vndr.id === updatedTransaction.vendor_id)

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
      vendor_id: '',
      // category: '',
      amount: '',
      isEditMode: true
    }
    newRows.unshift(emptyRow)
    setRows(newRows)
  }

  const formatDropdownData = () => users?.map(
    ({ id, lastName, firstName }) => ({
      id,
      name: firstName.concat(' ', lastName)
    })
  )

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
        inputDropdownData={[
          {
            key: 'user',
            updateKey: 'user_id',
            data: users?.length && formatDropdownData()
          },
          {
            key: 'vendor',
            updateKey: 'vendor_id',
            data: vendors?.length && vendors
          }
        ]}
      />
    </TableContext.Provider>
  )
}

TxTable.propTypes = {
  data: arrayOf(shape({
    id: string,
    user_id: string,
    description: string,
    vendor_id: string,
    debit: bool,
    credit: bool,
    amount: number
  }))
}

export default TxTable
