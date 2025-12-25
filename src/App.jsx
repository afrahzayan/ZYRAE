import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Authentication/Login'
import Registration from './Authentication/Registration'
import Home from './Pages/Home'
import ProductPage from './Pages/ProductPage'
import Cart from './Pages/Cart'
import Wishlist from './Pages/Wishlist'
import Profile from './Pages/Profile'
import ProductDetails from './Pages/ProductDetails'
import Checkout from './Pages/CheckOut'
import Collections from './Pages/Collections'
import Card from './Component/Card'
import Philosophy from './Pages/Philosophy'
import OrdersPage from './Pages/OrdersPage'
import ProductsManagement from './Admin/Pages/ProductsManagement'
import OrdersManagement from './Admin/Pages/OrdersManagement'
import UsersManagement from './Admin/Pages/UserManagement'
import AdminHome from './Admin/Pages/AdminHome'
import AdminRoute from './Admin/Component/AdminRoute'
import AddProduct from './Admin/Pages/AddProduct'

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