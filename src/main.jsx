import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { ConfigProvider } from 'antd'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ConfigProvider
      drawer={{ 
        styles: {
          wrapper:{
            margin: 15,
          },
          content: {
            borderRadius: 8
          }
        }
      }}
    >
      <App />
    </ConfigProvider>
  </StrictMode>,
)