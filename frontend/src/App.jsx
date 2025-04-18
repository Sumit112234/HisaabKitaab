import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './components/Home'
import ManageExpenses from './components/ExpenseList'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthPage from './pages/LoginSignup'

function App() {
 

  return (
    <BrowserRouter>
    <Navbar/>
      <Routes>
        <Route element={<HomePage/>} path='/' />
        <Route element={<AuthPage/>} path='/login' />
        <Route element={<ManageExpenses/>} path='/expense-list' />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
