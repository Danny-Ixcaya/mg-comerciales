import React, { useEffect, useState } from "react";
import { useStore } from "../providers/GlobalProvider";
import { FaCashRegister } from "react-icons/fa";
import "../styles/Cash.scss";
import Swal from "sweetalert2";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Spinner } from "reactstrap";
import { FormGroup, Label, Col, Input, Table } from "reactstrap";
import { Formik } from "formik";
import ModalBox from "../components/caja/ModalBox";
import "../styles/Formulario.scss";
import CashTest from "../components/caja/CashTest";
// Caja abierta
import { useBoxisOpen } from "../providers/GlobalProvider";

function CashBox(props) {
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Caja");
  }, []);
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
  // Saldo para iniciar la jornada -> saldoCajaAnt + valor del input
  const [resultadoFinal, setResultadoFinal] = useState(0);
  const [montoInicial, setMontoInicial] = useState(0);
  // Data de la api endpoint /api/Caja/caja
  const [saldoCajaAnterior, setSaldoCajaAnterior] = useState([]);
  // Modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);

   // Estado global de caja
   const boxOpen = useBoxisOpen((state) => state.boxOpen)
   const toggleBox = useBoxisOpen((state) => state.setBoxOpen)
  /* Data de la última caja registrada */
  const getDataCashBox = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/Caja/saldo-ultima-caja`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      );
      const data = await response.json();
      // console.log(data);
      setSaldoCajaAnterior(data);
    } catch (error) {
      console.log(error);
    }
  };


  const [loading, setLoading] = useState(true)  
  const [cajaActiva, setCajaActiva] = useState([])
  // Antes de los useEffect existentes
  const [datosCargados, setDatosCargados] = useState(false);
  const getDataCashLastBox = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/Caja/ultima-caja`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      )
      const data = await response.json()
      // console.info(data)
      if(response.ok) {
        setCajaActiva(data)
        setLoading(false)
        setDatosCargados(true);
      }
    } catch (error) {
      console.log(error)
    }
  }
  
  useEffect(() => {
    // Si no hay caja activa y el estado de fetch dice que si hay una caja activa en curso.
    if(datosCargados) {
      localStorage.getItem("cajaAbierta") === null &&  cajaActiva.estado === true ?
        (localStorage.setItem("cajaAbierta", "true"),
        toggleBox(true))
      : null
    }
  }, [cajaActiva, datosCargados])
  
  
  useEffect(() => {
    getDataCashBox();
    getDataCashLastBox();
  }, []);

  // let cajaAbiertaFilter = cashData.filter((item) => item.estado === true)


  /* Cambia el estado, le establece el valor del localStorage */
  /* const setCajaSesion = (valor) => {
    setCajaAbierta(valor);
  }; */

  let test = "";
  test = localStorage.getItem("cajaAbierta");
  if (test === "true") {
    return (
      <div className={isOpen ? "wrapper" : "side"}>
        {/* ---------CAJA ABIERTA ---------- */}
        <CashTest />
      </div>
    );
  } else {
    /* -------- CAJA CERRADA --------- */
    return (
      <div className={isOpen ? "wrapper" : "side"}>
         {loading ? (
          <div className="d-flex align-items-center justify-content-center" style={{ height: '90vh' }}>
            <Spinner
              color="danger"
              style={{
                height: '3em',
                width: '3em'
              }}
            >
              Loading...
            </Spinner>
          </div>
          ) : (
            <>
              <div className="card-front">
          <div className="card-up">
            <p>Caja Cerrada</p>
            <FaCashRegister size={28} />
          </div>
          <div className="card-bottom">
            <button onClick={toggle} id="abrir">
              <label htmlFor="Abrir">Click para Aperturar</label>
            </button>
            <span>
              <FaCashRegister />
            </span>
            <Modal isOpen={modal} fade={false} toggle={toggle} centered={true}>
              <ModalHeader toggle={toggle}>
                <FaCashRegister size={30} /> Apertura de Caja
              </ModalHeader>
              <ModalBody>
                <Formik
                  initialValues={{
                    montoInicial: "",
                  }}
                  validate={(valores) => {
                    // Validaciones...
                    let errores = {};
                    // Validacion montoInicial
                    if (!valores.montoInicial) {
                      errores.montoInicial =
                        "Por favor ingresa el monto para abrir caja";
                      /* !/^[0-9]{9}$/.test(valores.montoInicial) */
                    } else if (
                      !/^(\d{1,4}(\.\d{1,2})?)$/.test(valores.montoInicial)
                    ) {
                      errores.montoInicial =
                        "El monto inicial debe tener un máximo de 4 números y 2 decimales opcionales";
                    }
                    return errores;
                  }}
                  onSubmit={async (valores, { resetForm }) => {
                    // Captura de la data que se va a enviar...
                    const dataCajaPost = {
                      saldoInicial: montoInicial,
                    };
                    // Método POST y otras operaciones...
                    try {
                      const response = await fetch(
                        `${import.meta.env.VITE_BACKEND_URL}/api/Caja`,
                        {
                          method: "POST",
                          headers: {
                            Authorization: `Bearer ${localStorage.token}`,
                            "Content-Type": "application/json",
                          },
                          body: JSON.stringify(dataCajaPost),
                        }
                      );
                      if (response.ok) {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title: "Caja abierta",
                          showConfirmButton: false,
                          timer: 1000,
                        });
                        // Estado global
                        toggleBox(true)
                        // Validación de caja en localStorage si se creó la caja entonces
                        // Establecer el estado de apertura de la caja
                        localStorage.setItem("cajaAbierta", true);
                        // Obtener el estado de apertura de la caja
                        /* setCajaSesion(
                          localStorage.getItem("cajaAbierta")
                        ); */

                        // cajaAbierta = localStorage.getItem('cajaAbierta');

                        resetForm();
                      } else {
                        console.log(
                          "Ha ocurrido un error al enviar el formulario"
                        );
                      }
                    } catch (error) {
                      console.log(
                        "Ha ocurrido un error al enviar el formulario"
                      );
                      console.log(error);
                    }
                    // Resetear el formulario y mostrar mensaje de éxito
                    resetForm();
                  }}
                >
                  {({
                    values,
                    handleSubmit,
                    handleChange,
                    handleBlur,
                    errors,
                    touched,
                  }) => (
                    <form className="formulario" onSubmit={handleSubmit}>
                      <FormGroup row>
                        <Label for="input-montoInicial" sm={4}>
                          Monto por añadir
                        </Label>
                        <Col sm={7}>
                          <Input
                            type="text"
                            inputMode="numeric"
                            id="input-montoInicial"
                            name="montoInicial"
                            placeholder="250"
                            autoComplete="off"
                            min="0"
                            value={values.montoInicial}
                            onBlur={handleBlur}
                            onChange={handleChange}
                            /* Feedback para el usuario con el prop valid o invalid de reactstrap */
                            valid={
                              touched.montoInicial &&
                              !errors.montoInicial &&
                              values.montoInicial.length > 0
                            }
                            invalid={
                              touched.montoInicial && !!errors.montoInicial
                            }
                          />

                          {touched.montoInicial && errors.montoInicial && (
                            <div className="error">{errors.montoInicial}</div>
                          )}
                        </Col>

                        {/* Campos del formulario */}
                        <Table className="mt-3" bordered striped>
                          <thead>
                            <tr>
                              <th>Caja</th>
                              <th>Totales</th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr>
                              <td title="saldo entregado en la caja anterior">
                                Saldo en Caja
                              </td>
                              <td>
                                {saldoCajaAnterior.saldoFinal || 0}
                              </td>
                            </tr>
                            <tr>
                              <td>Monto añadido</td>
                              <td>{values.montoInicial || 0}</td>
                            </tr>
                            <tr>
                              <th>Monto inicial jornada</th>
                              {/* Cálculo del monto inicial de la jornada */}
                              <th className="d-none">
                                {setResultadoFinal(
                                  saldoCajaAnterior.saldoFinal +
                                    parseFloat(values.montoInicial)
                                ) ||
                                  saldoCajaAnterior.saldoFinal ||
                                  0}
                              </th>
                              {setMontoInicial(values.montoInicial)}
                              {/* <th className="d-nonoe">{setMontoInicial(values.montoInicial)}</th> */}
                              <th>
                                {resultadoFinal ||
                                  saldoCajaAnterior.saldoFinal ||
                                  0}
                              </th>
                            </tr>
                          </tbody>
                        </Table>
                      </FormGroup>
                      <Button type="submit" color="primary" outline>
                        Registrar
                      </Button>
                      <Button color="secondary" onClick={toggle}>
                        Cancelar
                      </Button>
                      {/*  {formularioEnviado && (
                    <p className="exito">Formulario enviado con éxito!</p>
                  )} */}
                    </form>
                  )}
                </Formik>
              </ModalBody>
              <ModalFooter></ModalFooter>
            </Modal>
          </div>
        </div>
            </>
          )}
        
      </div>
    );
  }
}

export default CashBox;
