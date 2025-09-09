import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Log from './componentes/Log'

function App() {
  const [estado, setEstado] = useState("PP")
  const [log, setLog] = useState(false)
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Log></Log>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
