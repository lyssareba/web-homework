import React, { useContext } from 'react'
import { arrayOf, func, object, string } from 'prop-types'
import IconButton from '@material-ui/core/IconButton'
import Input from '@material-ui/core/Input'
import TableCell from '@material-ui/core/TableCell'
import Typography from '@material-ui/core/Typography'

import ExpandLess from '@material-ui/icons/ExpandLess'
import ExpandMore from '@material-ui/icons/ExpandMore'

import { TableContext } from './TableContext'
import transactionStyles from '../../styles/transactions'

const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD'
})

const propTypes = {
  row: object,
  expanded: string,
  setExpanded: func,
  headerKeys: arrayOf(object)
}

export const InfoTableCell = ({ row, expanded, setExpanded, headerKeys }) => {
  const { previous, setPrevious, rows, setRows, makeDataTestId } = useContext(TableContext)
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

  const cellHeaderData = (key) => headerKeys.find(header => header.id === key)

  return (
    <>
      {Object.keys(row).map(key => {
        if (!cellHeaderData(key)) return null

        if (row.isEditMode && !cellHeaderData(key).readOnly) {
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
        if (cellHeaderData(key).type === 'currency') {
          return (
            <TableCell align='left' className={classes.tableCell} data-testid={makeDataTestId(row.id, `${key}-cell`)} key={key} >
              <Typography style={{ color: row.debit ? 'red' : 'green' }}>
                {`${row.debit ? '-' : '+'} ${formatter.format(row[key])}`}
              </Typography>
            </TableCell>
          )
        }
        if (cellHeaderData(key).type === 'expandable') {
          const dataKey = headerKeys.find(header => header.type === 'expandable').id
          return (
            <TableCell align='left' className={classes.tableCell} data-testid={makeDataTestId(row.id, `${key}-cell`)} key={key} >
              <IconButton
                aria-label='expand row'
                disabled={row[dataKey].length === 0}
                onClick={expanded ? () => setExpanded(undefined) : () => setExpanded(row.id)}
                size='small'
              >
                {'View'}
                {expanded === row.id ? <ExpandLess /> : <ExpandMore />}
              </IconButton>
            </TableCell>
          )
        }
        return (
          <TableCell align='left' className={classes.tableCell} data-testid={makeDataTestId(row.id, `${key}-cell`)} key={key} >
            <Typography>
              {row[key]}
            </Typography>
          </TableCell>
        )
      })}
    </>
  )
}

InfoTableCell.propTypes = propTypes
export default InfoTableCell
