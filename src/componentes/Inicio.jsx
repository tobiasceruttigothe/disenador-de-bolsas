import React from 'react'
import InicioAdmin from './InicioAdmin'
import InicioCliente from './InicioCliente'
import InicioDisenador from './InicioDisenador'

export default function Inicio({ tipoUsuario }) {
    return (
        <div>
            {tipoUsuario === 'admin' && <InicioAdmin></InicioAdmin>}
            {tipoUsuario === 'cliente' && <InicioCliente></InicioCliente>}
            {tipoUsuario === 'disenador' && <InicioDisenador></InicioDisenador>}
        </div>
    )
}
