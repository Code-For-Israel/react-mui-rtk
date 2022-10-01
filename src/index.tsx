import { ThemeProvider } from '@mui/material/styles'
import React from 'react'
import { createRoot } from 'react-dom/client'
import { Provider as ReduxProvider } from 'react-redux'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { i18n } from './i18n'
import { getUserAsync, store } from './store'
import { theme } from './theme'
import { reportWebVitals } from './utils'

console.log(`i18n ${i18n.isInitialized ? 'initialized' : 'not initialized'}`)

const container = document.getElementById('root')!
const root = createRoot(container)

// Get fresh user data if we have a token for it
// if (storageUtil.get(config.storage.TOKEN_KEY)) {
store.dispatch(getUserAsync())
// }

root.render(
  <React.StrictMode>
    <ReduxProvider store={store}>
      <ThemeProvider theme={theme}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </ThemeProvider>
    </ReduxProvider>
  </React.StrictMode>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
