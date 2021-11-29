import { createContext } from 'react'

export const TableContext = createContext({
  rows: {},
  setRows: () => {},
  previous: {},
  setPrevious: () => {},
  tableHeaderKeys: {},
  makeDataTestId: () => {}
})
