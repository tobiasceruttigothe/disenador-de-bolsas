import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Log from './componentes/Log'
import InicioCliente from './componentes/InicioCliente'
import InicioAdmin from './componentes/InicioAdmin'
import NuevoDiseno from './componentes/NuevoDiseno'
import SelectorDiseno from './componentes/SelectorDiseno'
import Lienzo from './componentes/Lienzo'
import FormularioCliente from './componentes/FormularioCliente'


function App() {
  const [inicioCliente, setInicioCliente] = useState("T")
  const [log, setLog] = useState(false)
  
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Log></Log>}></Route>
          <Route path='/lienzo' element={<Lienzo></Lienzo>}></Route>
          <Route path='/login' element={<Log></Log>}></Route>
          <Route path='/inicio' element={inicioCliente == "T" ? <InicioCliente/> : <InicioAdmin/>}></Route>
          <Route path='/nuevoDiseno' element={<NuevoDiseno></NuevoDiseno>}></Route>
          <Route path='/selectorDiseno' element={<SelectorDiseno></SelectorDiseno>}></Route>
          <Route path='/formularioCliente' element={<FormularioCliente></FormularioCliente>}></Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
