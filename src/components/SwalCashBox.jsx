import React, { useState, useEffect } from 'react'
import Swal from 'sweetalert2'
import { BsFillCartPlusFill } from 'react-icons/bs'
import { Button } from 'reactstrap'
import { useNavigate } from "react-router-dom";

function SwalCashBox(props) {
  // Para navegar
  const navigate = useNavigate();
  const swalOpen = () => {
    Swal.fire({
      title: '<strong>La caja se encuentra <u>Cerrada</u></strong>',
      icon: 'info',
      html:
      'Ve al módulo de <b>Caja</b>, ' + // Reemplazar la etiqueta <> con Link
      'para realizar la apertura😀',
      showCloseButton: true,
      showCancelButton: true,
      focusConfirm: false,
      confirmButtonText:
      '<i class="fa fa-thumbs-up"></i>Ir al módulo de caja',
      confirmButtonAriaLabel: 'Thumbs up, great!',
      cancelButtonText:
        '<i class="fa fa-thumbs-down"></i>Cancelar Apertura',
      cancelButtonAriaLabel: 'Thumbs down'
    }).then((result) => {
      if (result.isConfirmed) {
        navigate("/cash-box")
      }
    })
  }

  const IconComponent = props.icon

  return (
    <>
      <Button 
        color={props.color}
        outline
        onClick={swalOpen}
      >
      {/* <FcPlus /> */}
      <IconComponent size={20}/>
      {" "}
        {props.text}
      </Button>
    </>
  )
}

export default SwalCashBox