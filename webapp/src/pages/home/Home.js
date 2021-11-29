import React from 'react'
import { arrayOf, object } from 'prop-types'
import { useQuery } from '@apollo/client'
import Typography from '@material-ui/core/Typography'
import randomColor from 'randomcolor'
import { PieChart } from 'react-minimal-pie-chart'

import homeStyles from '../../styles/home'
import GetVendors from '../../gql/vendors.gql'

const propTypes = {
  txData: arrayOf(object)
}
const HomePage = ({ txData }) => {
  const classes = homeStyles()
  const { data: { vendors } = {} } = useQuery(GetVendors)

  const formatChartData = () => {
    const grouped = groupBy(txData, 'vendor_id')
    const formattedData = Object.entries(grouped).map(([key, value]) => ({
      title: vendors?.find(vndr => vndr.id === key).name,
      color: randomColor({ hue: 'blue', luminosity: 'light' }),
      value: value.length,
      key: key
    }))
    return formattedData
  }

  const groupBy = (array, key) => {
    return array.reduce((result, currentValue) => {
      (result[currentValue[key]] = result[currentValue[key]] || []).push(
        currentValue
      )
      return result
    }, {})
  }

  return (
    <>
      <Typography
        className={classes.heading}
        component='h1'
        variant='h3'
      >
        Welcome to Budget Master
      </Typography>
      <Typography>Transactions by Vendor</Typography>
      <div className={classes.pieChartContainer}>
        <PieChart
          data={formatChartData()}
          label={({ dataEntry }) => `${dataEntry.title} - ${dataEntry.value}`}
          labelStyle={{
            fontSize: '4px',
            fontFamily: 'sans-serif'
          }}
          radius={PieChart.defaultProps.radius - 5}
          segmentsShift={0.5}
        />
      </div>
    </>
  )
}

HomePage.propTypes = propTypes
export default HomePage
