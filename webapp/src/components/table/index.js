import React, { useContext, useState } from 'react'
import { func, node } from 'prop-types'
import Paper from '@material-ui/core/Paper'

import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableContainer from '@material-ui/core/TableContainer'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'

import { TableContext } from './TableContext'
import InfoTableCell from './InfoTableCell'

import ActionTableCell from './ActionTableCell'
import TableCxHeader from './TableHeaders'
import CollapsibleRow from './CollapsibleRow'

const propTypes = {
  onSave: func,
  onDelete: func,
  collapsibleRow: node
}

const TableCx = ({ onDelete, onSave, collapsibleRow: CollapsibleRow }) => {
  const { rows, tableHeaderKeys, makeDataTestId } = useContext(TableContext)
  const [expanded, setExpanded] = useState(undefined)

  const getIsCollapsible = (row) => {
    const dataKey = tableHeaderKeys.find(header => header.type === 'expandable')?.id
    if (tableHeaderKeys.some(header => header.type === 'expandable') && row[dataKey].length > 0) {
      return React.cloneElement(CollapsibleRow, { expanded, row, dataKey })
    }
  }
  return (
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
              <>
                <TableRow data-testid={makeDataTestId(row.id, 'table-row')} key={row.id} >
                  <ActionTableCell
                    onDelete={onDelete}
                    onSave={onSave}
                    row={row}
                  />
                  <InfoTableCell expanded={expanded} headerKeys={tableHeaderKeys} row={row} setExpanded={setExpanded} />
                </TableRow>
                {getIsCollapsible(row)}
              </>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Paper>
  )
}

TableCx.Header = TableCxHeader
TableCx.Collapsible = CollapsibleRow
TableCx.propTypes = propTypes
export default TableCx
