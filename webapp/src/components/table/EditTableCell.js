import React, { useContext, useState } from 'react'
import { arrayOf, object, string, shape } from 'prop-types'

import Input from '@material-ui/core/Input'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'
import FormControl from '@material-ui/core/FormControl'
import MenuItem from '@material-ui/core/MenuItem'
import Select from '@material-ui/core/Select'

import { TableContext } from './TableContext'
import transactionStyles from '../../styles/transactions'

const propTypes = {
  row: object,
  headerKeys: arrayOf(object),
  inputDropdownData: shape({
    initValue: string, // id
    updateKey: string, // ie: user_id
    key: string, // ie: user
    data: arrayOf(shape({
      id: string,
      name: string
    }))
  })
}

const EditTableCell = ({ row, headerKeys, inputDropdownData }) => {
  const { previous, setPrevious, rows, setRows, makeDataTestId } = useContext(TableContext)
  const [dropdownValue, setDropdownValue] = useState(inputDropdownData.initValue)
  const classes = transactionStyles()

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

  const onDropdownChange = (e, row) => {
    if (!previous[row.id]) {
      setPrevious(state => ({ ...state, [row.id]: row }))
    }
    const { value } = e.target
    setDropdownValue(value)
    const { id } = row
    const newRows = rows.map(row => {
      if (row.id === id) {
        return { ...row, [inputDropdownData.updateKey]: value }
      }
      return row
    })
    setRows(newRows)
  }

  const cellHeaderData = (key) => headerKeys.find(header => header.id === key)
  return (
    <>
      {Object.keys(row).map(key => {
        if (!cellHeaderData(key)) return null

        if (cellHeaderData(key).type === 'id') {
          const idString = row[key].slice(-8)
          return (
            <TableCell align='left' className={classes.tableCell} data-testid={makeDataTestId(row.id, `${key}-cell`)} key={key} >
              <Typography>
                {idString}
              </Typography>
            </TableCell>
          )
        }

        if (cellHeaderData(key)?.inputType === 'dropdown') {
          const { data } = inputDropdownData
          const value = data.find(inp => inp.id === dropdownValue)
          return (
            <TableCell align='left' className={classes.tableCell} data-testid={makeDataTestId(row.id, `${key}-cell`)} key={key} >
              <FormControl key={key} style={{ width: '100%' }}>
                <Select
                  id={makeDataTestId(row.id, `${key}-input-dropdown`)}
                  name={key}
                  onChange={e => onDropdownChange(e, row)}
                  value={value?.id || null}
                >
                  {data.map(inp => (
                    <MenuItem key={inp.id} value={inp.id} >
                      {inp.name}
                    </MenuItem>
                  ))}

                </Select>
              </FormControl>
            </TableCell>
          )
        }

        if (!cellHeaderData(key).readOnly) {
          return (
            <TableCell align='left' className={classes.tableCell} data-testid={makeDataTestId(row.id, `${key}-cell`)} key={key} >
              <Input
                className={classes.input}
                data-testid={makeDataTestId(row.id, `${key}-input`)}
                disabled={cellHeaderData(key).readOnly || false}
                inputProps={{ readOnly: cellHeaderData(key).readOnly || false }}
                name={key}
                onChange={e => onChange(e, row)}
                placeholder={cellHeaderData(key).placeholder || ''}
                value={row[key]}
              />
            </TableCell>
          )
        }
      })}
    </>
  )
}

EditTableCell.propTypes = propTypes
export default EditTableCell
