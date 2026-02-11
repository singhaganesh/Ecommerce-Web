import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { Provider } from 'react-redux'
import store from './store/redusers/store.js'
import { AuthProvider } from './context/AuthContext.jsx'
import { CartProvider } from './context/CartContext.jsx'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <AuthProvider>
      <CartProvider>
        <StrictMode>
          <App />
          <ToastContainer position="top-right" autoClose={3000} />
        </StrictMode>
      </CartProvider>
    </AuthProvider>
  </Provider>,
)
