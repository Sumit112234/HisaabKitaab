import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.css'
import HomePage from './components/Home'
import ManageExpenses from './components/ExpenseList'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AuthPage from './pages/LoginSignup'
import { use, useState } from 'react'

function App() {

  const [userLogin, setUserLogin] = useState(localStorage.getItem('hisaabUser') || null);
//  console.log(JSON.parse(localStorage.getItem('hisaabUser')))

  return (
    <BrowserRouter>
    <Navbar userLogin={userLogin} setUserLogin={setUserLogin}/>
      <Routes>
        <Route element={<HomePage userLogin={userLogin}/>} path='/' />
        <Route element={<AuthPage userLogin={userLogin} setUserLogin={setUserLogin} />}  path='/login' />
        <Route element={<ManageExpenses/>} path='/expense-list' />
      </Routes>
      
    </BrowserRouter>
  )
}

export default App
