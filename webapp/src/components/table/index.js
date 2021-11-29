import React, { useContext, useState } from 'react'
import { arrayOf, func, node, shape, string } from 'prop-types'
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
import EditTableCell from './EditTableCell'

const propTypes = {
  onSave: func,
  onDelete: func,
  collapsibleRow: node,
  inputDropdownData: arrayOf(
    shape({
      key: string, // ie: user
      data: arrayOf(shape({
        id: string,
        name: string
      }))
    })
  )
}

const TableCx = ({ onDelete, onSave, collapsibleRow: CollapsibleRow, inputDropdownData }) => {
  const { rows, tableHeaderKeys, makeDataTestId } = useContext(TableContext)
  const [expanded, setExpanded] = useState(undefined)

  const getIsCollapsible = (row) => {
    const dataKey = tableHeaderKeys.find(header => header.type === 'expandable')?.id
    if (tableHeaderKeys.some(header => header.type === 'expandable') && row[dataKey].length > 0) {
      return React.cloneElement(CollapsibleRow, { expanded, row, dataKey })
    }
  }

  const formatInputDropdownData = (row) => inputDropdownData?.map(dropData => {
    const filledData = {
      ...dropData,
      initValue: row[dropData.key]?.id || ''
    }
    return filledData
  })

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
                  {row.isEditMode ? (
                    <EditTableCell
                      headerKeys={tableHeaderKeys}
                      inputDropdownData={formatInputDropdownData(row)}
                      row={row}
                    />
                  ) : (
                    <InfoTableCell
                      expanded={expanded}
                      headerKeys={tableHeaderKeys}
                      row={row}
                      setExpanded={setExpanded}
                    />
                  )}
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
