import React, { useState, useEffect } from 'react'
import { useStore } from '../providers/GlobalProvider'
import { Link } from "react-router-dom"
import TableInventario from '../components/TableInventario';
import { FaCartPlus } from "react-icons/fa"
import { TbBrandShopee } from "react-icons/tb"

function Inventory(props) {
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Inventario");
  }, []);

   /* ------ Fetch */
   const [dataApi, setDataApi] = useState([])
   const getData = async () => {
     try {
       const response = await fetch(
         `${import.meta.env.VITE_BACKEND_URL}/api/Inventario`,
         {
           headers: {
             Authorization: `Bearer ${localStorage.token}`,
           },
         }
       );
       const json = await response.json() 
       setDataApi(json)
      //  console.log(json)
     }
     catch(err) {
       console.error(err)
     }
   }
   useEffect(() => {
     getData()
   }, [])
  
  return (
    <div className={ isOpen ? "wrapper" : "side" }>
      <div className="container-fluid mt-4">
        <h1 className="inventory-title">Movimientos del mes</h1>
        <div className="row">
          <div className="col inventory-buttons">
            <Link className="btn btn-danger" to="/sales">
              <FaCartPlus size={25}/>{" "}Todas las ventas
            </Link>
            <Link className="btn btn-success" to="/purchases">
              <TbBrandShopee size={25}/>{" "}Todos los gastos
            </Link>
          </div>
        </div>
        <div className="row">
          <div className="col mt-2">
          <TableInventario 
            data={dataApi} />
          </div>
        </div>
        </div>
    </div>
  );
}

export default Inventory;
