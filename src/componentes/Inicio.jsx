import React from 'react'
import InicioAdmin from './InicioAdmin'
import SelectorDiseno from './SelectorDiseno'

export default function Inicio({ tipoUsuario }) {
    return (
        <div>
            {tipoUsuario === 'admin' && <InicioAdmin></InicioAdmin>}
            {tipoUsuario === 'cliente' && <SelectorDiseno></SelectorDiseno>}
            
        </div>
    )
}
