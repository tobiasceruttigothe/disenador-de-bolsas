import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Log from './componentes/Log'
import Lienzo from "./componentes/Lienzo"

function App() {
  const [estado, setEstado] = useState("PP")
  const [log, setLog] = useState(false)
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<Log></Log>}></Route>
          <Route path="/" element ={<Lienzo></Lienzo>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
