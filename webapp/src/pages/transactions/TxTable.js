/* eslint-disable camelcase, react/jsx-sort-props */
import React from 'react'
import { arrayOf, string, bool, number, shape } from 'prop-types'
import { useMutation } from '@apollo/client'

import TableCx from '../../components/table'
import AddTransaction from '../../gql/addTransaction.gql'
import UpdateTransaction from '../../gql/updateTransaction.gql'
import DeleteTransaction from '../../gql/deleteTransaction.gql'

const tableHeaderKeys = [
  { id: 'id', label: 'ID', readOnly: true, placeholder: 'Auto Generated' },
  { id: 'user_id', label: 'User ID', placeholder: 'employee1' },
  { id: 'description', label: 'Description', placeholder: 'groceries' },
  { id: 'merchant_id', label: 'Merchant ID', placeholder: 'walmart' },
  { id: 'amount', label: 'Amount', placeholder: '-100 or +100' }
]

const createData = (data) => data.map(({ id, user_id, description, merchant_id, debit, amount }) => ({
  id,
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
  const formattedData = createData(data)

  const onSave = async (id, rows, setRows, previous) => {
    if (id === '') {
      const newTransaction = rows.find(row => row.id === '')
      newTransaction.credit = /^\+/.test(newTransaction.amount) || false
      newTransaction.debit = /^-/.test(newTransaction.amount) || false
      newTransaction.amount = parseFloat(newTransaction.amount.substring(1))
      delete newTransaction.isEditMode
      delete newTransaction.id
      try {
        const { data } = await addTransaction({
          variables: {
            ...newTransaction
          }
        })

        const newRows = rows.map(row => {
          if (row.id === undefined) {
            return { id: data.addTransaction.id, ...row, isEditMode: false }
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
      try {
        await updateTransaction({
          variables: {
            ...updatedTransaction
          }
        })
        setRows(state => {
          return rows.map(row => {
            if (row.id === id) {
              delete row.credit
              return { ...row }
            }
            return row
          })
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
      user_id: '',
      description: '',
      merchant_id: '',
      amount: '',
      isEditMode: true
    }
    newRows.unshift(emptyRow)
    setRows(newRows)
  }

  return (
    <>
      <TableCx
        data={formattedData}
        tableTitle={'Transactions'}
        addItemText={'Add Transaction'}
        onAddClick={onAddTransactionClick}
        tableHeaderKeys={tableHeaderKeys}
        onSave={onSave}
        onDelete={onTransactionDelete}
      />
    </>
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
