import React, { useState, useEffect, useRef } from 'react'
import { arrayOf, func, shape, string, bool, number } from 'prop-types'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import Grid from '@material-ui/core/Grid'
import Typography from '@material-ui/core/Typography'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'
import ClearIcon from '@material-ui/icons/Clear'
import DeleteIcon from '@material-ui/icons/Delete'
import DoneIcon from '@material-ui/icons/Done'
import EditIcon from '@material-ui/icons/Edit'

import transactionStyles from '../../styles/transactions'

const propTypes = {
  addItemText: string,
  data: arrayOf(shape({
    id: string,
    user_id: string,
    description: string,
    merchant_id: string,
    debit: bool,
    credit: bool,
    amount: number
  })),
  onAddClick: func,
  onSave: func,
  onDelete: func,
  tableHeaderKeys: arrayOf(shape({
    id: string,
    label: string,
    readOnly: bool,
    placeholder: string
  })),
  tableTitle: string.isRequired,
  testPrefix: string
}

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const TableCx = ({ addItemText, data, onAddClick, onDelete, onSave, tableHeaderKeys, tableTitle, testPrefix }) => {
  const makeDataTestId = (transactionId, fieldName) => `${testPrefix}-${transactionId}-${fieldName}`

  // const [addTransaction] = useMutation(AddTransaction)
  // const [updateTransaction] = useMutation(UpdateTransaction)
  const [rows, setRows] = useState(data)
  const [previous, setPrevious] = useState({})
  const classes = transactionStyles()
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

  const onChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }))
    }
    const { value, name } = e.target
    const { id } = row
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [name]: value }
      }
      return row
    })
    setRows(newRows)
  }

  const onRevert = id => {
    const newRows = rows.map(row => {
      if (row.id === id) {
        return previous[id] ? previous[id] : row
      }
      return row
    })
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
    <>
      <Grid alignContent='center' className={classes.heading} container justifyContent='space-between' >
        <Typography component='h1' variant='h3'>{tableTitle}</Typography>
        <Button
          color='primary'
          data-testid={`${testPrefix}-add-button`}
          onClick={() => onAddClick(rows, setRows)}
          startIcon={<AddCircleOutlineIcon />}
          variant='contained'
        >
          {addItemText}
        </Button>
      </Grid>
      <Paper>
        <TableContainer>
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell align='left' />
                {tableHeaderKeys.map(header => (
                  <TableCell align='left' key={header.id}>
                    {header.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map(row => (
                <TableRow data-testid={makeDataTestId(row.id, 'table-row')} key={row.id} >
                  <TableCell className={classes.selectTableCell}>
                    {row.isEditMode ? (
                      <>
                        <IconButton
                          aria-label='save'
                          data-testid={makeDataTestId(row.id, 'save-button')}
                          onClick={() => onSave(row.id, rows, setRows, previous)}
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
                  {Object.keys(row).map(key => {
                    return key !== 'isEditMode' && key !== 'debit' && key !== 'credit' && (
                      <TableCell align='left' className={classes.tableCell} data-testid={makeDataTestId(row.id, `${key}-cell`)} key={key} >
                        {row.isEditMode && key !== 'id' ? (
                          <Input
                            className={classes.input}
                            data-testid={makeDataTestId(row.id, `${key}-input`)}
                            disabled={tableHeaderKeys.find(header => header.id === key).readOnly || false}
                            inputProps={{ readOnly: tableHeaderKeys.find(header => header.id === key).readOnly || false }}
                            name={key}
                            onChange={e => onChange(e, row)}
                            placeholder={tableHeaderKeys.find(header => header.id === key).placeholder || ''}
                            value={row[key]}
                          />
                        ) : (
                          <>
                            {key === 'amount' ? (
                              <Typography style={{ color: row.debit ? 'red' : 'green' }}>
                                {`${row.debit ? '-' : '+'} ${formatter.format(row[key])}`}
                              </Typography>
                            ) : row[key]}
                          </>
                        )}
                      </TableCell>
                    )
                  })}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </>
  )
}

TableCx.propTypes = propTypes
export default TableCx
