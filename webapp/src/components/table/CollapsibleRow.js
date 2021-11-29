import React from 'react'
import { arrayOf, object, string } from 'prop-types'
import Box from '@material-ui/core/Box'
import Collapse from '@material-ui/core/Collapse'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Typography from '@material-ui/core/Typography'

import transactionStyles from '../../styles/transactions'
import InfoTableCell from './InfoTableCell'

const propTypes = {
  row: object,
  expanded: string || undefined,
  headerKeys: arrayOf(object),
  tableTitle: string,
  dataKey: string
}

const CollapsibleRow = ({ row, dataKey, expanded, headerKeys, tableTitle }) => {
  const classes = transactionStyles()
  return (
    <TableRow>
      <TableCell className={expanded ? classes.collapsibleCell : classes.collapsedCell} colSpan={6}>
        <Collapse className={classes.collapseContainer} in={expanded === row.id} timeout='auto' unmountOnExit >
          <Box sx={{ margin: 1 }}>
            <Typography component='div' gutterBottom variant='h6'>
              {tableTitle}
            </Typography>
            <Table aria-label={dataKey} size='small' >
              <TableHead>
                <TableRow>
                  {headerKeys.map(header => (
                    <TableCell align='left' key={header.id}>
                      {header.label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {row[dataKey].map((txRow) => (
                  <TableRow key={txRow.id}>
                    <InfoTableCell headerKeys={headerKeys} row={txRow} />
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>
        </Collapse>
      </TableCell>
    </TableRow>
  )
}

CollapsibleRow.propTypes = propTypes
export default CollapsibleRow
