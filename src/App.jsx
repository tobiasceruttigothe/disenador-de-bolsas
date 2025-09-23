import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Log from './componentes/Log'
import Inicio from './componentes/Inicio'
import NuevoDiseno from './componentes/NuevoDiseno'
import SelectorDiseno from './componentes/SelectorDiseno'
import Lienzo from './componentes/Lienzo'

function App() {
  const [estado, setEstado] = useState("PP")
  const [log, setLog] = useState(false)
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Log></Log>}></Route>
          <Route path='/lienzo' element={<Lienzo></Lienzo>}></Route>
          <Route path='/login' element={<Log></Log>}></Route>
          <Route path='/lienzo' element={<Lienzo></Lienzo>}></Route>
          <Route path='/inicio' element={<Inicio></Inicio>}></Route>
          <Route path='/nuevoDiseno' element={<NuevoDiseno></NuevoDiseno>}></Route>
          <Route path='/selectorDiseno' element={<SelectorDiseno></SelectorDiseno>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
