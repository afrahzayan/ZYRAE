import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './Context/AuthContext.jsx'
import { BrowserRouter } from 'react-router-dom'
import Wishlist from './Pages/Wishlist.jsx'
import { WishlistProvider } from './Context/WishlistContext.jsx'
import { CartProvider } from './Context/CartContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <CartProvider>
    <WishlistProvider>
    <AuthProvider>
      <BrowserRouter>
    <App />
      </BrowserRouter>
    </AuthProvider>
    </WishlistProvider>
    </CartProvider>
  </StrictMode>,
)
