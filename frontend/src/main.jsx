// OSSW_Ready/frontend/src/main.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter basename="/OSSW_Ready">
      <App />
    </BrowserRouter>
  </React.StrictMode>
)
