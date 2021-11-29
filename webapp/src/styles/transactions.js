import { makeStyles } from '@material-ui/core/styles'

const transactionStyles = makeStyles((theme) => ({
  heading: {
    fontSize: theme.typography.pxToRem(15),
    marginBottom: '24px'
  },
  selectTableCell: {
    width: 60
  },
  tableCell: {
    width: 130,
    height: 40
  },
  input: {
    width: 130,
    height: 40
  },
  collapsibleCell: {
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 0,
    marginTop: 0
  },
  collapsedCell: {
    paddingBottom: 0,
    paddingTop: 0,
    marginBottom: 0,
    marginTop: 0,
    borderBottom: 0
  },
  collapseContainer: {
    padding: '24px'
  }
}))

export default transactionStyles
