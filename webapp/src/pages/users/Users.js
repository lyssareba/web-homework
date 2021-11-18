import React from 'react'
import { arrayOf, string, shape, number, bool } from 'prop-types'
import { useMutation } from '@apollo/client'

import TableCx from '../../components/table'
import AddUser from '../../gql/addUser.gql'
import UpdateUser from '../../gql/updateUser.gql'
import DeleteUser from '../../gql/deleteUser.gql'

const tableHeaderKeys = [
  { id: 'id', label: 'ID', readOnly: true, placeholder: 'Auto Generated' },
  { id: 'dob', label: 'Birthday', placeholder: '01/21/2000' },
  { id: 'firstName', label: 'First Name', placeholder: 'John' },
  { id: 'lastName', label: 'Last Name', placeholder: 'Doe' },
  { id: 'transactions', label: 'Transactions', readOnly: true, placeholder: 'Auto Managed' }
]

const createData = (data) => data.map(({ id, dob, firstName, lastName, transactions }) => ({
  id,
  dob,
  firstName,
  lastName,
  transactions,
  isEditMode: false
}))

const Users = ({ data }) => {
  const [addUser] = useMutation(AddUser)
  const [updateUser] = useMutation(UpdateUser)
  const [deleteUser] = useMutation(DeleteUser)
  const formattedData = createData(data)

  const onSave = async (id, rows, setRows, previous) => {
    if (id === '') {
      const newUser = rows.find(row => row.id === '')
      delete newUser.isEditMode
      delete newUser.id
      try {
        const { data } = await addUser({
          variables: {
            ...newUser
          }
        })

        const newRows = rows.map(row => {
          if (row.id === undefined) {
            return { id: data.addUser.id, ...row, isEditMode: false }
          }
          return row
        })
        setRows(newRows)
      } catch (err) {
        console.log(err)
      }
    } else {
      const updatedUser = rows.find(row => row.id === id)
      delete updatedUser.isEditMode
      try {
        await updateUser({
          variables: {
            ...updatedUser
          }
        })
        setRows(state => rows.map(row => row))
      } catch (err) {
        console.log(err)
      }
    }
  }

  const onUserDelete = async id => {
    try {
      await deleteUser({
        variables: { id }
      })
    } catch (err) {
      console.log(err)
    }
  }

  const onAddUserClick = (rows, setRows) => {
    const newRows = [...rows]
    const emptyRow = {
      id: '',
      dob: '',
      firstName: '',
      lastName: '',
      transactions: '',
      isEditMode: true
    }
    newRows.unshift(emptyRow)
    setRows(newRows)
  }

  return (
    <TableCx
      addItemText={'Add User'}
      data={formattedData}
      onAddClick={onAddUserClick}
      onDelete={onUserDelete}
      onSave={onSave}
      tableHeaderKeys={tableHeaderKeys}
      tableTitle={'Users'}
    />
  )
}

Users.propTypes = {
  data: arrayOf(shape({
    dob: string,
    firstName: string,
    id: string,
    lastName: string,
    transactions: arrayOf(shape({
      amount: number,
      credit: bool,
      debit: bool,
      description: string,
      id: string,
      merchant_id: string,
      user_id: string
    }))
  }))
}

export default Users
