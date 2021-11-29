import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@material-ui/core/CssBaseline'
import AppRouter from './routes'
import { ApolloProvider } from '@apollo/client'
import { client } from './network/apollo-client'
import { ThemeProvider } from '@material-ui/core/styles'

import theme from './styles/theme'

ReactDOM.render(
  (
    <div data-app-init=''>
      <ApolloProvider client={client}>
        <CssBaseline />
        <ThemeProvider theme={theme}>
          <AppRouter />
        </ThemeProvider>
      </ApolloProvider>
    </div>
  ),
  document.getElementById('react-app')
)
