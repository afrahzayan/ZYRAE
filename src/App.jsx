import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from './Authentication/Login'
import Registration from './Authentication/Registration'
import Home from './Pages/Home'
import ProductPage from './Pages/ProductPage'

function App() {
  return (
    
        <Routes>
        
        <Route path="/" element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/registration' element={<Registration />} />
        <Route path="/products" element={<ProductPage />} />
        </Routes>
      
  )
}

export default App