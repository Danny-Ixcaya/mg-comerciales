import React from 'react'
import Swal from 'sweetalert2'
import { BsFillTrashFill } from 'react-icons/bs';
// Estado global de la caja
import { useBoxisOpen } from "../../providers/GlobalProvider";
import SwalCashIcon from "../SwalCashIcon"
function SwalDeleteSale({idVenta, actualizarListaVentas}) {
  /*----------- Caja  ------------*/
  // Estado global de caja
  const boxOpen = useBoxisOpen((state) => state.boxOpen)
  /*----------------------- */
  const deleteSweet = (id) => {
    Swal.fire({
      title: "Eliminar registro",
      text: "¿Estás seguro que quieres eliminar el registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#007bff",
      cancelButtonColor: "#d33",
      confirmButtonText: "Si, eliminalo!",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire("Eliminado!", "El registro se ha elimando", "success");
        saleDelete(id)
      }
    });
  };

  const saleDelete = async (id) => {
    // console.log("click -> Id: ", id);
    const response = await fetch(
      `${import.meta.env.VITE_BACKEND_URL}/api/Venta/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.token}`,
        },
      }
    );
    // setData(data.filter((data) => data.id_cliente !== id));
    if(response.ok) {
      /* Prop para actualizar la tabla en tiempo real, después de eliminar el registro. */
      actualizarListaVentas()
    }
  };
  return (
    <>
    {boxOpen === false ? (
      <SwalCashIcon icon={BsFillTrashFill} color={"red"}/>
    ): (
      <BsFillTrashFill
        onClick={() => deleteSweet(idVenta)}
        className="icon-action icon-action--delete"
        title="Eliminar venta individual"
        size={20}
      />
    )}
    </>
  )
}

export default SwalDeleteSale