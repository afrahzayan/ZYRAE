import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './authentication/login'
import Registration from './authentication/registration'
import Home from './pages/home'
import ProductPage from './pages/productPage'
import Cart from './pages/cart'
import Wishlist from './pages/wishlist'
import Profile from './pages/profile'
import ProductDetails from './pages/productDetails'
import Checkout from './pages/checkOut'
import Collections from './pages/collections'
import Card from './component/card'
import Philosophy from './pages/philosophy'
import OrdersPage from './pages/ordersPage'
import ProductsManagement from './admin/pages/ProductsManagement'
import OrdersManagement from './admin/pages/OrdersManagement'
import UsersManagement from './admin/pages/UserManagement'
import AdminHome from './admin/pages/AdminHome'
import AdminRoute from './admin/Component/AdminRoute'
import AddProduct from './admin/pages/AddProduct'
import OTPVerification from './authentication/otpVarification'
import PaymentSuccess from './pages/paymentSuccess'
import PaymentCancel from './pages/paymentCancel'


function App() {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path='/login' element={<Login />} />
      <Route path='/registration' element={<Registration />} />
      <Route path="/products" element={<ProductPage />} />
      <Route path='/cart' element={<Cart />} />
      <Route path='/wishlist' element={<Wishlist />} />
      <Route path='/profile' element={<Profile />} />
      <Route path='/product/:id' element={<ProductDetails />} />
      <Route path='/checkout' element={<Checkout />} />
      <Route path='/collections/:collectionName' element={<Collections />} />
      <Route path='/footer' element={<footer />} />
      <Route path='/card' element={<Card />} />
      <Route path='/philosophy' element={<Philosophy />} />
      <Route path='/orders' element={<OrdersPage />} />
      <Route path="/OTP-verification" element={<OTPVerification />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
      <Route path="/payment-cancel" element={<PaymentCancel />} />

    
      <Route path='/admin/home' element={
        <AdminRoute>
          <AdminHome />
        </AdminRoute>
      } />
      <Route path='/admin/products' element={
        <AdminRoute>
          <ProductsManagement />
        </AdminRoute>
      } />
      <Route path='/admin/orders' element={
        <AdminRoute>
          <OrdersManagement />
        </AdminRoute>
      } />
      <Route path='/admin/user' element={
        <AdminRoute>
          <UsersManagement />
        </AdminRoute>
      } />


      <Route path='/admin/products/add' element={<AddProduct />} />

    </Routes>
  )
}

export default App