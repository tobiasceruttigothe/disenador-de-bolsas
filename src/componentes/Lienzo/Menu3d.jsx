import React from 'react'
import { crearPDF } from '../../services/crearPDF'
import Cookies from "js-cookie"
import axios from "axios"
import "../../styles/main.css"

export default function MenuDescargar({ setModal3d, disenoClick, setDisenoClick }) {

    const handle3d = async () => {
        try {
            const token = Cookies.get("access_token")
            const id = disenoClick.id
            const status = await axios.get("http://localhost:9090/api/ia/health", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            if (status.status == 200){
                await axios.post("http://localhost:9090/api/ia/generate-3d", {disenoId: id}, {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            })
            alert("Imagen generada correctamente. Se actualizará el diseño automáticamente pronto.")
            setModal3d(false)
            setDisenoClick()
            } else{
                throw new Error("El servidor externo no esta en funcionamiento actualmente. ")
            }
        } catch (err) {
            alert("Ha ocurrido un error con la generación de la imagen. Intente de nuevo luego")
            console.log(err)
        }
    }

    return (
        <div style={{ width: "500px" }}>
            <h2 >Generar vista 3D</h2>
            <hr />


            <div
                className="p-3"
            >
                <div>
                    <h5>Si lo desea, puede generar una vista 3D del diseño creado.</h5>
                    <button onClick={handle3d} className="boton-1 ">Generar imagen 3D</button>
                    <p className="mt-3"><i className="fa fa-info-circle fa-xs"></i> La imagen es generada por un servidor externo. Puede cometer errores. Paper SRL se desentiende del resultado conseguido.</p>

                </div>

            </div>

            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                    className="boton-2 w-25 mt-3 me-3"
                    onClick={() => { setModal3d(false); setDisenoClick() }}
                    type="submit"
                >
                    Volver
                </button>
            </div>
        </div>
    )
}
