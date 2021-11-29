import React, { useContext } from 'react'
import { string, func } from 'prop-types'

import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import Grid from '@material-ui/core/Grid'
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline'

import { TableContext } from './TableContext'
import transactionStyles from '../../styles/transactions'

const propTypes = {
  addItemText: string,
  onAddClick: func,
  testPrefix: string,
  tableTitle: string
}

const TableCxHeader = ({ addItemText, onAddClick, testPrefix, tableTitle }) => {
  const { rows, setRows } = useContext(TableContext)
  const classes = transactionStyles()

  return (
    <Grid alignContent='center' className={classes.heading} container justifyContent='space-between' >
      <Typography component='h1' variant='h4'>{tableTitle}</Typography>
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
  )
}

TableCxHeader.propTypes = propTypes
export default TableCxHeader
