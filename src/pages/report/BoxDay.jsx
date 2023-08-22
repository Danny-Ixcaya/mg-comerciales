import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../providers/GlobalProvider'
import DatePicker from '../../components/DatePicker';
import Searchbar from '../../components/Searchbar';
// import Select from '../../components/Select';
import SelectBox from '../../components/report/SelectBox';
// import Select from '../../components/report/SelectReportShopp';
import SelectOPT from '../../components/report/SelectReportShopp';
import TableData from '../../components/TableData';
// import Tablaprueba from '../components/tprueba';
import ButtonDrop from '../../components/ButtonDrop';
import { NavLink, Button, Label, Input, Table, Alert,  Spinner} from 'reactstrap'
import { ToastContainer, toast } from "react-toastify";
import Tablebox from '../../components/report/tablebox';
import { Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import Tablep from '../../components/report/tprueba';
// import { Row, Col,  Button } from "reactstrap";
import { FcPrint } from 'react-icons/fc';


function BoxDay (props)  {
  const URL = import.meta.env.VITE_BACKEND_URL;
    //   /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Caja: Reporte Diario");
  }, []);




  const defaultDateString = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  const [selectedDate1, setSelectedDate1] = useState(defaultDateString());
  const [salesData, setSalesData] = useState([]);
  const [hasSales, setHasSales] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null);



  //*********************************** */
  // const [cajaDiaria, setCajaDiaria] = useState(null);



//   *****************************************GENERAR PDF */

  const generarPdf = () => {
    setLoading1(true)
    const url = `${URL}/api/pdfBox/boxday?fecha=${selectedDate1}`;
    //=2023-5-20
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/pdf',
      },
      responseType: 'blob',
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const newWindow = window.open(url, '_blank');
        if (!newWindow) {
          throw new Error('No se pudo abrir el PDF en una pestaña nueva.');
        }
        setLoading1(false)
      })
      .catch((error) => {
        console.error('Error:', error);
        setLoading1(false)
      });
  };
  // *****************************************FIN GENERAR PDF */



  
  // useEffect(() => {
  //   checkSales(new Date(selectedDate1));
  // }, []); // Ejecutar una vez al cargar la página
  
  // const checkSales = (date) => {
  //   setLoading(true);
  //   if (date) {
  //     const formattedDate = date.toISOString().split('T')[0];
  
  //     // Realizar la solicitud a la API para obtener los datos de ventas en la fecha seleccionada
  //     fetch(`http://localhost:5173/api/ReportDay/day?fecha=${formattedDate}`,{
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.token}`,
  //       }
  //     })
  //       .then((response) => response.json())
  //       .then((data) => {
  //         // Verificar la respuesta de la API y actualizar los datos de ventas y el estado hasSales en consecuencia
  //         setSalesData(data);
  //         setHasSales(data.length > 0);
  //       })
  //       .catch((error) => {
  //         console.error('Error:', error);
  //       });
  //   }
  //   setLoading(false)
  // };
  
  // const handleDateChange1 = (event) => {
  //   const dateValue = event.target.value;
  //   const date = dateValue ? new Date(dateValue) : null;
  //   setSelectedDate1(dateValue);
  //   checkSales(date);
  // };

  const [data, setData] = useState([]);
  const [cajaDiaria, setCajaDiaria] = useState(null);
  const [movimientosCaja, setMovimientosCaja] = useState([]);
  const [ventas, setVentas] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [totalVentas, setTotalVentas] = useState(0);
  const [totalGastos, setTotalGastos] = useState(0);
  let sumaGastos = 0;
  
 



  useEffect(() => {
    checkSales(new Date(selectedDate1));
  }, []); // Ejecutar una vez al cargar la página
  
  const checkSales = (date) => {
    setLoading(true);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
  
      // Realizar la solicitud a la API para obtener los datos de ventas en la fecha seleccionada
      fetch(`${URL}/api/ReportBox/daily?fecha=${formattedDate}`,{
        headers: {
          'Authorization': `Bearer ${localStorage.token}`,
        }
      })
        .then( (response) => response.json()
        )
        .then((data) => {
          // Verificar la respuesta de la API y actualizar los datos de ventas y el estado hasSales en consecuencia
            // setData(responseData);
            setSalesData(data);
            setCajaDiaria(data.cajaDiaria);
            setMovimientosCaja(data.movimientosCaja);
            setTotalVentas(data.totalVentas);
            setTotalGastos(data.totalGastos);
            setHasSales(data.length > 0);
            setLoading(false);

   
          // setLoading(false);
    
          
        })
        .catch((error) => {
          console.error('Error:', error);
          // alert('No se encontraron  los datos ');
          setLoading(false);
          // setGastos(error);
          
        });
    }
    // setLoading(false)
  };
  
  const handleDateChange1 = (event) => {
    const dateValue = event.target.value;
    const date = dateValue ? new Date(dateValue) : null;
    setSelectedDate1(dateValue);
    checkSales(date);
  };

  if (!cajaDiaria || cajaDiaria.length ===0) {
    return (
      <div className='text-center'>
        <p>No se aperturó caja y no hay ventas o compras realizadas</p>
        <Button color='primary' ><Link to="/cash-box" style={{ textDecoration: 'none' }}className='text-white'>Aperturar Caja</Link></Button>
        <p>o, ir a</p>
        <Button color='primary' ><Link to="/boxweek" style={{ textDecoration: 'none' }}className='text-white'>reporte semanal</Link></Button>
      </div>
    )
    // <NavLink to="/ruta-de-destino">Texto del enlace</NavLink>
    // <p className='text-center'><a href="/purchasesall">Ir a reporte semanal</a></p>
        {/* <Alert color="warning">No hay ventas en la fecha seleccionada.</Alert>; */}
        
      
    
  }


const estadoStyle = {
  color: cajaDiaria.estado ? 'green' : 'red'
};




  
 
  return (

  <div className={ isOpen ? "wrapper" : "side" }>
      <div className="container-fluid mt-4">
        <div className="row">
          {/* <div className="col">
            <DatePicker />
          </div> */}
          <div className="col">
            {/* <Searchbar searcher={searcher}/> */}


          </div>
          <div className="col">
            <SelectOPT />


          </div>
        </div>
        <div className="row ">
          <div className='col '>
            <SelectBox />
            
            
          </div> 
          <div className='col '>
              <Button color="primary" disabled={loading1} onClick={generarPdf} >
                
                {loading1 ? (
                  <>
                    <Spinner size="sm" />
                    <span>Generando</span>
                  </>
                ) : (
                  <>
                    Imprimir
                    <FcPrint />
                  </>
                )}
              </Button>
            
          </div> 

          <div className="col ">
            {/* <Button onClick={fetchDailyReport}>Ver</Button> */}
          <Input
            type="date"
            id="dateInput"
            value={selectedDate1}
            onChange={handleDateChange1}
          />

      </div>
    
        </div>
        
        <div className="row">
          <div className="col">
    
 
    <div>

      <div>
      
        
        
        <i>*Nota: Imprime el reporte de la fecha actual antes de cerrar caja</i>
        
        <Table>
      <thead>
        <tr>
        <th className="text-center">Fecha Caja</th>
          <th className="text-center">Saldo Inicial</th>
          <th className="text-center">Entradas</th>
          <th className="text-center">Salidas</th>
          <th className="text-center">Saldo del día</th>
        </tr>
      </thead>
      <tbody>
        <tr>
        <td className="text-center">{cajaDiaria.fecha}</td>
          <td className="text-center">{cajaDiaria.saldoInicial}</td>
          <td className="text-center">{totalVentas}</td>
          <td className="text-center">{totalGastos}</td>
          <td className="text-center">{cajaDiaria.saldoFinal}</td>
          <td className="text-center"><p style={estadoStyle}>Estado: {cajaDiaria.estado ? 'activo' : 'cerrado'}</p></td>
        </tr>
      </tbody>
    </Table>
      </div>
      <div className='d-flex'>
      <Table >
      <thead>
                <tr>
                  {/* <th>Id Venta</th> */}
                  <th className='w-25' align='left'>#Comanda</th>
                  <th className='w-50' align='center'>Fecha</th>
                  <th >Total</th>
                  {/* <th>Id Mesero</th>
                  <th>Id Cliente</th> */}
                </tr>
              </thead>
      </Table>
      <Table >
      <thead>
                <tr>
                  <th>No. Doc.</th>
                  <th>Fecha</th>
                  <th>Descripcion</th>
                  <th>Total</th>
                  {/* <th>Total</th> */}
                  {/* <th>Id Cliente</th> */}
                </tr>
              </thead>
      </Table>
      </div>

      {/* <Tablebox
        movimientosCaja={movimientosCaja}
        data={salesData}
        
        
        /> */}


        

        {loading ? (
        <Spinner
        className="m-5"
        color="warning"
      >
        Loading...
      </Spinner>
      ):
       movimientosCaja.length >0 ? (
        // <Alert color="success">Hay ventas en la fecha seleccionada.</Alert>
        // <Tablep data={results} />
        // <Tablebox movimientosCaja={movimientosCaja} data={salesData} />
                // <Alert color="warning">No hay ventas en la fecha seleccionada.</Alert>

                // <Tablebox 
                // movimientosCaja={movimientosCaja} 
                // cajaDiaria={cajaDiaria} 
                // totalGastos={totalGastos}
                // totalVentas={totalVentas}
                // />
                <Tablebox 
                movimientosCaja={movimientosCaja} 
              
                />


      ) :(
        <Alert color="warning">No hay ventas en la fecha seleccionada.</Alert>
        // <Tablebox movimientosCaja={movimientosCaja} data={salesData} />
      ) }

{/* {errorMessage ===null ? (
        
        <Alert color="danger">{errorMessage}</Alert>
      ): (
    
        <Tablebox movimientosCaja={movimientosCaja} data={salesData} />

      )} */}


        
      

        
    </div>
    </div>
      </div>
    </div>


     </div>



    
  );


  
};

export default BoxDay;