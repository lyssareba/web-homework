import React, { useEffect, useRef, useContext } from 'react'
import { func, object } from 'prop-types'
import TableCell from '@material-ui/core/TableCell'
import IconButton from '@material-ui/core/IconButton'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'
import { TableContext } from './TableContext'
import transactionStyles from '../../styles/transactions'

const propTypes = {
  row: object,
  onSave: func,
  onDelete: func
}

const ActionTableCell = ({ row, onSave, onDelete }) => {
  const classes = transactionStyles()
  const { rows, setRows, previous, setPrevious, makeDataTestId } = useContext(TableContext)
  let resettingIdRef = useRef(null)

  const onToggleEditMode = id => {
    setRows(state => {
      return rows.map(row => {
        if (row.id === id) {
          return { ...row, isEditMode: !row.isEditMode }
        }
        return row
      })
    })
  }

  const onRevert = id => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row
      }
      return row
    })
    if (!id) {
      newRows.shift()
    }
    setRows(newRows)
    setPrevious(state => {
      delete state[id]
      return state
    })
    resettingIdRef.current = id
  }

  const onDeleteItem = id => {
    onDelete(id)
    const newRows = rows.filter(row => row.id !== id)
    setRows(newRows)
    setPrevious(state => {
      delete state[id]
      return state
    })
    resettingIdRef.current = id
  }

  useEffect(() => {
    if (resettingIdRef.current) {
      onToggleEditMode(resettingIdRef.current)
    }
    resettingIdRef.current = false
  }, [rows])

  return (
    <TableCell className={classes.selectTableCell} >
      {row.isEditMode ? (
        <>
          <IconButton
            aria-label='save'
            data-testid={makeDataTestId(row.id, 'save-button')}
            onClick={() => onSave(row.id, rows, setRows)}
          >
            <DoneIcon />
          </IconButton>
          <IconButton
            aria-label='revert'
            data-testid={makeDataTestId(row.id, 'revert-button')}
            onClick={() => onRevert(row.id)}
          >
            <ClearIcon />
          </IconButton>
        </>
      ) : (
        <>
          <IconButton
            aria-label='edit'
            data-testid={makeDataTestId(row.id, 'edit-button')}
            onClick={() => onToggleEditMode(row.id)}
          >
            <EditIcon />
          </IconButton>
          <IconButton
            aria-label='delete'
            data-testid={makeDataTestId(row.id, 'delete-button')}
            onClick={() => onDeleteItem(row.id)}
          >
            <DeleteIcon />
          </IconButton>
        </>
      )}
    </TableCell>
  )
}

ActionTableCell.propTypes = propTypes
export default ActionTableCell
