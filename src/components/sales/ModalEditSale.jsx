import React, { useState, useEffect, useMemo } from "react";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
} from "reactstrap";
import { AiOutlineEdit, AiOutlineMinus, AiOutlinePlus } from "react-icons/ai";
import Swal from "sweetalert2";
import SwalCashIcon from "../SwalCashIcon";
// Caja abierta
import { useBoxisOpen } from "../../providers/GlobalProvider";

function ModalEditSale(props) {
  const { idVenta, actualizarListaVentas } = props;
  const [modal, setModal] = useState(false);
  const [itemId, setItemId] = useState("");
  const [sale, setSale] = useState([]);
  const [formularioEnviado, setFormularioEnviado] = useState(false);
  const toggle = () => setModal(!modal);

  const getDataSale = async (id) => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/Venta/${id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const json = await response.json();
      setSale(json);
    } catch (error) {
      console.log(error);
    }
  };

  const [dataPostSale, setDataPostSale] = useState([]);

  useEffect(() => {
    if (itemId) {
      getDataSale(itemId);
    }
  }, [itemId]);

  useEffect(() => {
    if (sale.detalleVenta) {
      setDataPostSale(sale.detalleVenta);
    } else {
      setDataPostSale([]);
    }
  }, [sale]);

  const dataUpdateVenta = dataPostSale.map(item => ({
    idDetalleVenta: item?.id || "",
    cantidad: item?.cantidad || ""
  }));
  

  const postSaleUpdate = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/Venta/${itemId}`,
        {
          method: "PUT",
          body: JSON.stringify(dataUpdateVenta),
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
            "Content-Type": "application/json",
          },
        }
      );
      if (response.ok) {
        setModal(false);

        Swal.fire({
          position: "center",
          icon: "success",
          title: "Registro actualizado Correctamente",
          showConfirmButton: false,
          timer: 1500,
        });
        /* Prop para actualizar la data de la tabla */
        actualizarListaVentas();
      }
    } catch (error) {
      console.log(error);
    }
  };
  /*----------- Caja  ------------*/
  // Estado global de caja
  const boxOpen = useBoxisOpen((state) => state.boxOpen);

  /*----------------------- */

  const handleMinusClick = (index) => {
    // Copia del array que tiene los datos de la venta
    const updatedDataPostSale = [...dataPostSale];

    if (updatedDataPostSale[index].cantidad > 1) {
      updatedDataPostSale[index].cantidad = updatedDataPostSale[index].cantidad - 1;
      updatedDataPostSale[index].subtotal = updatedDataPostSale[index].cantidad * updatedDataPostSale[index].precio;
      setDataPostSale(() => updatedDataPostSale);
    }
  };
  
  const handlePlusClick = (index) => {
    const updatedDataPostSale = [...dataPostSale];
    updatedDataPostSale[index].cantidad = updatedDataPostSale[index].cantidad + 1;
    updatedDataPostSale[index].subtotal = updatedDataPostSale[index].cantidad * updatedDataPostSale[index].precio;
    setDataPostSale(() => updatedDataPostSale);
  };

  const sumaSubtotales = useMemo(() => {
    return dataPostSale.reduce((total, item) => total + item.subtotal, 0);
  }, [dataPostSale]);

  return (
    <>
      {boxOpen === false ? (
        <SwalCashIcon icon={AiOutlineEdit} />
      ) : (
        <AiOutlineEdit
          onClick={() => {
            /* AbrirModal */
            toggle();
            /* item clickado de la tabla */
            setItemId(idVenta);
          }}
          size="20"
        />
      )}

      <Modal isOpen={modal} toggle={toggle} size="lg" centered>
        <ModalHeader toggle={toggle}>
          <div style={{color: "black"}}><AiOutlineEdit size={28} /> Editar venta</div>
        </ModalHeader>
        <ModalBody>
          <h5 className="mb-2 title-edit-sale" id="title-edit-sale-1">No. de comanda: <u>{sale?.numeroComanda|| "..."} </u></h5>
          <h5 id="title-edit-sale-2">Cliente: {sale?.cliente || "...."}</h5>
          <form onSubmit={postSaleUpdate} id="form-edit-sale">
            <Table>
              <thead>
                <tr>
                  <th>Platillo</th>
                  <th>Cantidad</th>
                  <th>Precio Unitario</th>
                  <th>Sub total</th>
                </tr>
              </thead>
              {dataPostSale.length > 0 ? (
                <tbody>
                  {dataPostSale.map((detalle, index) => (
                    <tr key={detalle.id}>
                      <td>{detalle.platillo}</td>
                      <td>
                        <div className="table-buttons">
                          <button
                            type="button"
                            className="btn btn-danger btn-minus"
                            onClick={() => handleMinusClick(index)}
                          >
                            <AiOutlineMinus />
                          </button>
                          <input
                            type="text"
                            className="form-control input-cantidad-edit"
                            name={`dataPostSale[${index}].cantidad`}
                            value={detalle.cantidad || ""}
                            onChange={(e) => {
                              const updatedDataPostSale = [...dataPostSale];
                              updatedDataPostSale[index].cantidad =
                                e.target.value;
                              setDataPostSale(updatedDataPostSale);
                            }}
                            readOnly
                          />
                          <button
                            type="button"
                            className="btn btn-success btn-plus"
                            onClick={() => handlePlusClick(index)}
                          >
                            <AiOutlinePlus />
                          </button>
                        </div>
                      </td>
                      <td>{detalle.precio || "...."}</td>
                      <td>{detalle.subtotal || "...."}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={2}>Total</td>
                    <td className="font-weigth-bold">Q.{sumaSubtotales.toFixed(2) || "...."}</td>
                  </tr>
                </tbody>
              ) : (
                <tbody>
                  <tr>
                    <td colSpan="4">No hay detalles de venta disponibles.</td>
                  </tr>
                </tbody>
              )}
            </Table>
            <Button color="primary" outline type="submit">
              Actualizar
            </Button>
            <Button color="primary" outline type="button" onClick={toggle}>
              Cancelar
            </Button>
          </form>
        </ModalBody>
        <ModalFooter></ModalFooter>
      </Modal>
    </>
  );
}

export default ModalEditSale;
