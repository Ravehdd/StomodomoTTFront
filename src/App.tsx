import { useEffect } from 'react'
import './App.css'
import { Route, Routes, useNavigate } from 'react-router-dom'
import PatientPage from './pages/PatientPage'
import AuthPage from './pages/AuthPage'

function App() {
  const storedIsAuthenticated = localStorage.getItem('isAuthenticated')

   useEffect(() => {
    if(storedIsAuthenticated === "false" || storedIsAuthenticated === null) {
      navigate('/auth')
    } else {
      navigate('/')
    }
  }, [storedIsAuthenticated])
  
  const navigate = useNavigate()

  return (
    <>
        <Routes>
          <Route path="/" element={<PatientPage />} />
          <Route path="/auth" element={<AuthPage />} />


        </Routes>
    </>
  )
}

export default App
