import React from 'react'
import ReactDOM from 'react-dom'
import App from './App2'
import NavBar from './Navbar'
import { ThemeProvider } from '@mui/material/styles';

ReactDOM.render(
  <React.StrictMode>
      <NavBar/>
      <App />
  </React.StrictMode>,
  document.getElementById('root')
)
