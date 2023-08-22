import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Spinner
} from "reactstrap";
import { FormGroup, Label, Col, Input } from "reactstrap";
import { Formik, FieldArray } from "formik";
import "../../styles/Cash.scss";
import Select from "../Select";
import DatePicker from "../purchases/DatePicker";
import { AiOutlineClose } from "react-icons/ai";
import { FaCashRegister } from "react-icons/fa";
import ModalBoxClose from "./ModalBoxClose";
import dayjs from "dayjs";
import addDays from "date-fns/addDays";
import weekOfYear from "dayjs/plugin/weekOfYear";
import isToday from "dayjs/plugin/isToday";
import weekday from "dayjs/plugin/weekday";
import Swal from "sweetalert2";
// Caja abierta
import { useBoxisOpen } from "../../providers/GlobalProvider";
import { ToastContainer, toast } from "react-toastify";

dayjs.extend(weekOfYear);
dayjs.extend(isToday);
dayjs.extend(weekday);

function CashTest() {
  // setState del estado global de la caja
  const boxOpen = useBoxisOpen((state) => state.boxOpen)
  const toggleBox = useBoxisOpen((state) => state.setBoxOpen);
  // Modal
  const [modal, setModal] = useState(false);
  const toggle = () => setModal(!modal);
  /* Estado para el resultante de caja */
  const [resultadoFinal, setResultadoFinal] = useState(0);
  // Data de la api endpoint: /api/Caja
  const [cashData, setCashData] = useState([]);
  /* Identificar el activo para cerra la caja */
  const getDataCashBoxId = cashData.filter((item) => item.estado === true);
  /* Id del que tiene el estado activo */
  const IdActivo = getDataCashBoxId[0]?.idCajaDiaria;
  // Cantidad del input
  const [cantidadSacar, setCantidadSacar] = useState(0);

  const [loading, setLoading] = useState(true)

  const navigate = useNavigate();
  /* Data de todas las cajas registradas */
  const getDataCashBox = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/Caja`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      );
      const data = await response.json();
      setCashData(data);
      setDatosTabla(filterDataByMonth(data));
      setSelectedOption(1);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getDataCashBox();
  }, []);

  const notification = (mensaje) =>
    toast.error(mensaje, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
    });

  //Comienza el filtrado de datos
  const [selectedDateRange, setSelectedDateRange] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);
  useEffect(() => {
    //console.log('rango de fechas')
    //console.log(dayjs(selectedDateRange[0].startDate).format('DD/MM/YYYY'))
    //console.log(dayjs(selectedDateRange[0].endDate).format('DD/MM/YYYY'))
  }, [selectedDateRange]);
  const handleDateChange = (ranges) => {
    setSelectedDateRange([ranges.selection]);
  };

  //Estados necesarios
  const [datosTabla, setDatosTabla] = useState([]);
  const [selectedOption, setSelectedOption] = useState("");

  //Funciones necesarias para el sistema
  const filterDataByCurrentDate = (data) => {
    const fechaActual = dayjs();
    const fechaFormateada = fechaActual.format("YYYY-MM-DD");
    //const currentDate = new Date();
    //currentDate.setDate(currentDate.getDate() - 1);
    //const yesterday = currentDate.toISOString().split("T")[0];
    //console.log(yesterday);
    const filteredData = data.filter((item) => item.fecha === fechaFormateada);
    return filteredData;
  };
  const filterDataByDateRange = (data) => {
    const fechaActual = dayjs();
    const fechaInicioSemana = fechaActual.startOf("week");
    const fechaFinSemana = fechaInicioSemana.add(6, "day");
    const fechaInicioFormateada = fechaInicioSemana.format("YYYY-MM-DD");
    const fechaFinFormateada = fechaFinSemana.format("YYYY-MM-DD");

    const filteredData = data.filter((item) => {
      const itemDate = item.fecha;
      return (
        itemDate >= fechaInicioFormateada && itemDate <= fechaFinFormateada
      );
    });

    return filteredData;
  };
  const filterDataByMonth = (jsonData) => {
    const fechaActual = dayjs();
    const fechaInicioMes = fechaActual.startOf("month");
    const fechaFinMes = fechaActual.endOf("month");
    const fechaInicioFormateada = fechaInicioMes.format("YYYY-MM-DD");
    const fechaFinFormateada = fechaFinMes.format("YYYY-MM-DD");

    const filteredData = jsonData.filter((item) => {
      const itemDate = item.fecha;
      return (
        itemDate >= fechaInicioFormateada && itemDate <= fechaFinFormateada
      );
    });

    return filteredData;
  };
  const filterDataBy3Months = (jsonData) => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const endOfCurrentMonth = new Date(currentYear, currentMonth + 1, 0);

    const startOfTwoMonthsAgo = new Date(currentYear, currentMonth - 2, 1);

    return jsonData.filter((item) => {
      const itemDate = new Date(item.fecha);
      return itemDate >= startOfTwoMonthsAgo && itemDate <= endOfCurrentMonth;
    });
  };
  const filterDataByYear = (jsonData) => {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();

    const startOfYear = new Date(currentYear, 0, 1);
    const endOfYear = new Date(currentYear, 11, 31);

    return jsonData.filter(({ fecha }) => {
      const itemDate = new Date(fecha);
      return itemDate >= startOfYear && itemDate <= endOfYear;
    });
  };
  const filterDataByCustomDateRange = (data, startDate, endDate) => {
    // const startDate = new Date(); // Fecha de inicio de la semana actual
    // startDate.setDate(startDate.getDate() - startDate.getDay());

    // const endDate = new Date(); // Fecha de cierre de la semana actual
    // endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

    const filteredData = data.filter((item) => {
      const itemDate = item.fecha;
      return itemDate >= startDate && itemDate <= endDate;
    });

    return filteredData;
  };

  //Funciones para detectar la selección
  const handleChange = (event) => {
    setSelectedOption(event.target.value);

    // Verificar el valor seleccionado y ejecutar la función correspondiente
    if (event.target.value === "1") {
      handleOption1();
    }
    if (event.target.value === "2") {
      handleOption2();
    }
    if (event.target.value === "3") {
      handleOption3();
    }
    if (event.target.value === "4") {
      handleOption4();
    }
    if (event.target.value === "5") {
      handleOption5();
    }
    if (event.target.value === "6") {
      handleOption6();
    }
  };
  const handleOption1 = () => {
    // Función para la opción número 1
    setDatosTabla(filterDataByMonth(cashData));
  };
  const handleOption2 = () => {
    // Función para la opción número 2
    setDatosTabla(filterDataByCurrentDate(cashData));
  };
  const handleOption3 = () => {
    // Función para la opción número 2
    setDatosTabla(filterDataByDateRange(cashData));
  };
  const handleOption4 = () => {
    // Función para la opción número 2
    setDatosTabla(filterDataBy3Months(cashData));
  };
  const handleOption5 = () => {
    // Función para la opción número 2
    setDatosTabla(filterDataByYear(cashData));
  };
  const handleOption6 = () => {
    // Función para la opción número 2
    setDatosTabla(cashData);
  };
  const handleOption7 = () => {
    // Función para la opción número 2
    setDatosTabla(
      filterDataByCustomDateRange(
        cashData,
        dayjs(selectedDateRange[0].startDate).format("YYYY-MM-DD"),
        dayjs(selectedDateRange[0].endDate).format("YYYY-MM-DD")
      )
    );
  };

  /* Caja activa ----- */

  useEffect(() => {
    getDataCashLastBox();
  }, []);
  const [datosCargados,setDatosCargados] = useState(false)
  const [cajaActiva, setCajaActiva] = useState([])
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
        setDatosCargados(true)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    // Si hay una caja activa y si el estado de la response de fetch es false
    if(datosCargados) {
      localStorage.getItem("cajaAbierta") === "true" &&  cajaActiva.estado === false ?
        (localStorage.removeItem("cajaAbierta"),
        toggleBox(false))
      : null
    }
  }, [cajaActiva, datosCargados])

  return (
    <>
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
        <div className="container-fluid mt-3 mb-3">
          <div className="row mb-3 align-items-center">
            <div className="col-sm-8 px-sm-0 col-lg-6">
              <DatePicker
                selectedDateRange={selectedDateRange}
                handleDateChange={handleDateChange}
              />
            </div>
            <div className="col-sm-4 px-sm-0 col-lg-4">
              <Button outline color="info" onClick={handleOption7}>
                Buscar
              </Button>
            </div>
          </div>
          <div className="row d-flex justify-content-center align-items-initial mt-3 mb-2">
            <div className="col-6">
              <FormGroup style={{ maxWidth: "500px" }}>
                <Input
                  id="date-filter--cashBox"
                  name="select"
                  type="select"
                  value={selectedOption}
                  onChange={handleChange}
                >
                  <option value="1">Resumen de caja mensual</option>
                  <option value="2">Caja del día</option>
                  <option value="3">cajas de la semana</option>
                  <option value="4">Cajas de los ultimos 3 meses</option>
                  <option value="5">Cajas del año</option>
                  <option value="6">Todas las cajas</option>
                </Input>
              </FormGroup>
            </div>
            <div className="col-6">
              <Button color="danger" outline onClick={toggle}>
                <AiOutlineClose />
                Cerrar caja
              </Button>

              <Modal isOpen={modal} fade={false} toggle={toggle} centered={true}>
                <ModalHeader toggle={toggle}>
                  <FaCashRegister size={30} /> Cerrar Caja
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
                          "Por favor ingresa el monto para cerrar caja";
                        /* !/^[0-9]{9}$/.test(valores.montoInicial) */
                      } else if (
                        !/^(\d{1,4}(\.\d{1,2})?)$/.test(valores.montoInicial)
                      ) {
                        errores.montoInicial =
                          "El monto a retirar debe tener un máximo de 4 números y 2 decimales opcionales";
                      }
                      return errores;
                    }}
                    onSubmit={async (valores, { resetForm }) => {
                      // Captura de la data que se va a enviar...
                      let dataCerrar = {
                        cantidadSacar: cantidadSacar,
                      };
                      if (resultadoFinal < 0) {
                        setModal(false);
                        return notification(
                          "El monto a retirar no puede ser mayor al saldo actual"
                        );
                      }
                      // Método PUT para cerra caja
                      try {
                        const response = await fetch(
                          `${
                            import.meta.env.VITE_BACKEND_URL
                          }/api/Caja/${IdActivo}`,
                          {
                            method: "PUT",
                            body: JSON.stringify(dataCerrar),
                            headers: {
                              Authorization: `Bearer ${localStorage.token}`,
                              "Content-Type": "application/json",
                            },
                          }
                        );
                        if (response.ok) {
                          // Estado global de la caja
                          toggleBox(false);
                          // console.info(boxOpen)
                          /* Ocultar el modal */
                          setModal(false);
                          Swal.fire({
                            position: "center",
                            icon: "success",
                            title: "Caja Cerrada",
                            showConfirmButton: false,
                            timer: 1000,
                          });
                          /* Eliminar el valor de localStorage */
                          localStorage.removeItem("cajaAbierta");
                          navigate("/");
                        }
                      } catch (error) {
                        console.log(error);
                      }
                      // Resetear el formulario y mostrar mensaje de éxito
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
                            Monto a retirar
                          </Label>
                          <Col sm={7}>
                            <Input
                              type="text"
                              inputMode="numeric"
                              id="input-montoInicial"
                              name="montoInicial"
                              placeholder="250"
                              autoComplete="off"
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
                        </FormGroup>
                        {/* Table */}
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
                                  Saldo actual en caja
                                </td>
                                <td>{getDataCashBoxId[0]?.caja || 0}</td>
                              </tr>
                              <tr>
                                <td>Monto a retirar</td>
                                <td>{values.montoInicial || 0}</td>
                              </tr>
                              <tr>
                                <th>Resultante en caja</th>
                                {/* Cálculo del monto inicial de la jornada */}
                                <th className="d-none">
                                  {/* getDataCashBoxId[0]?.caja es lo que hay actualmente en caja */}
                                  {setResultadoFinal(
                                    getDataCashBoxId[0]?.caja -
                                      parseFloat(values.montoInicial)
                                  ) ||
                                    
                                    0}
                                  {setCantidadSacar(values.montoInicial)}
                                </th>

                                <th>
                                  {resultadoFinal ||
                                    0}
                                </th>
                              </tr>
                            </tbody>
                          </Table>
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
        </div>

        <Table bordered id="table-cash--open">
          <thead >
            <tr className="table-cash-row">
              <th className="table-cash-head table-cash-item--bruto">#</th>
              <th className="table-cash-head">Fecha</th>
              <th className="table-cash-head">Inicio</th>
              <th className="table-cash-head">Ingreso</th>
              <th className="table-cash-head">Egreso</th>
              <th className="table-cash-head">Saldo en caja</th>
              <th className="table-cash-head table-cash-item--bruto">Saldo Bruto</th>
              <th className="table-cash-head">Ganancia</th>
            </tr>
          </thead>
          <tbody>
            {datosTabla.length === 0 ? (
              <tr>
                <td colSpan={8}>No hay ninguna caja registrada</td>
              </tr>
            ) : (
              datosTabla.map((item, index) => (
                /* Identifica cuál es la caja activa, y en caso de haber una le pone la clase que pone el fondo verde */
                <tr
                  className={
                    item.estado === true ? "cash-active table-cash-row" : "inactive-cash-s table-cash-row"
                  }
                  key={item.idCajaDiaria}
                >
                  <td className="table-cash-item table-cash-item--bruto">{index + 1}</td>
                  <td className="table-cash-item">
                    {dayjs(item.fecha).format("DD/MM/YYYY")}
                    <br />
                    <span className="table-content-bold">
                      Estado:
                      {/* Si el item está activo el texto dirá activo */}
                      {item.estado === true ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="table-cash-item">Q.{item.saldoInicial?.toFixed(2) || 0}</td>
                  <td className="table-cash-item">
                    <span className="table-content-bold">Efectivo</span>
                    <br />
                    Q.{item.ingreso?.toFixed(2) || 0}
                  </td>
                  <td className="table-cash-item">
                    <span className="table-content-bold">Efectivo</span>
                    <br />
                    Q.{item.egreso?.toFixed(2) || 0}
                  </td>
                  <td className="table-cash-item">
                    <span className="table-content-bold">Caja</span>
                    Q.{item.caja?.toFixed(2) || 0}
                    <br />
                    <span
                      className={
                        item.estado === true ? "d-none" : "table-content-bold"
                      }
                    >
                      Entregó:Q.{item.entrega}
                    </span>
                  </td>
                  <td className="table-cash-item table-cash-item--bruto">Q.{item.saldoBruto?.toFixed(2) || 0}</td>
                  <td className="table-content-bold table-cash-item">
                    Q.{item.ganancia?.toFixed(2) || 0}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
        <ToastContainer />
      </>
    )}
      
    </>
  );
}

export default CashTest;
