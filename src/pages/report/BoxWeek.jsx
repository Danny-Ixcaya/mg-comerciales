import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { useStore } from '../../providers/GlobalProvider'
// import Select from '../../components/Select';
import SelectBox from '../../components/report/SelectBox';
// import Select from '../../components/report/SelectReportShopp';
import SelectOPT from '../../components/report/SelectReportShopp';
import TableData from '../../components/TableData';
// import Tablaprueba from '../components/tprueba';
import ButtonDrop from '../../components/ButtonDrop';
import { Col, Button, Label, Input, Table, Alert,  Spinner, ButtonGroup} from 'reactstrap'
import Tablep from '../../components/report/tprueba';
import { FcPrint } from 'react-icons/fc';


import Tableboxweek from '../../components/report/tableboxweek';



function BoxWeek (props)  {
  const URL = import.meta.env.VITE_BACKEND_URL;
    //   /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar)
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Caja: Reporte Semanal");
  }, []);



  //*********************************** */
const [loading1, setLoading1] = useState(false)
const [loading, setLoading] = useState(false)
const [error, setError] = useState(null);



//   *****************************************GENERAR PDF */

  const generarPdf = () => {
    setLoading1(true)
    const url = `${URL}/api/pdfBox/weeklypdf`;
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


  const [data, setDataApi] = useState(null);

  useEffect(() => {

    setLoading(true)
    fetch(`${URL}/api/ReportBox/weekly`,{
      headers: {
        'Authorization': `Bearer ${localStorage.token}`,
      }
    })
      .then(response => response.json())
      .then(data => {
        setDataApi(data);
        setLoading(false)
      })
      .catch(error => {
        console.error('Error:', error);
        setLoading(false)
      });
  }, []);

  // if (dataApi.cajasSemanales.length === 0) {
  //   return 
  //     <Spinner
  //       className="m-5"
  //       color="warning"
  //     >
  //       Loading...
  //     </Spinner>
    
  // }
  if (!data) {
    return (
      <div className='text-center'>
        <p>No se encontro reporte semanal</p>
        <Button color='primary' ><Link to="/cash-box" style={{ textDecoration: 'none' }} className='text-white'>Aperturar Caja</Link></Button>
        <p>o, ir a </p>
        <Button color='primary' ><Link to="/boxmonth" style={{ textDecoration: 'none' }}className='text-white'>reporte mensual</Link></Button>
      </div>
    )
  }
  


  // Ordenar las cajas por fecha de forma descendente
  data.cajasSemanales.sort((a, b) => new Date(b.cajaDiaria.fecha) - new Date(a.cajaDiaria.fecha));
 
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
          {/* <Input
            type="date"
            id="dateInput"
            value={selectedDate1}
            onChange={handleDateChange1}
          /> */}

      </div>
    
        </div>
        
        <div className="row">
          <div className="col">

            <div>



                {/* *************************************************** */}

          


                {/* {data.cajasSemanales.map((caja, index) => (
                  <div key={caja.cajaDiaria.idCajaDiaria}>
                  <h4>Caja Diaria ID: {caja.cajaDiaria.idCajaDiaria}</h4>
                  <p>Fecha: {caja.cajaDiaria.fecha}</p>
                  <p>Saldo Inicial: {caja.cajaDiaria.saldoInicial}</p>
                  <p>Saldo Final: {caja.cajaDiaria.saldoFinal}</p>
                  <p>Estado: {caja.cajaDiaria.estado}</p>


                             
                          
                          <p>Total Ventas: {caja.totalVentas}  </p>
                          <p>Total Compras: {caja.totalGastos}</p>

                    </div>

                ))} */}


<div>
     

      <div className="p-3 mt-3 bg-secondary bg-gradient bg-opacity-25 rounded-5 mb-3">
        <h3>Resumen Semanal:</h3>
        {/* <p>Total Ingresos Semana: Q. {data.totalIngresosSemana}</p> */}
        <p>Total Ventas Semana: Q. {data.totalVentasSemana}</p>
        <p>Total Compras Semana: Q. {data.totalComprasSemana}</p>
        <p>Total Saldo Final Semana: Q. {data.totalSaldoFinalSemana}</p>
      </div>

      <div>
        {/* <h3>Cajas Semanales:</h3> */}
       
        {/* {loading ? (
        <Spinner
        className="m-5"
        color="warning"
      >
        Loading...
      </Spinner>
      ):
       (
        // <Alert color="success">Hay ventas en la fecha seleccionada.</Alert>
        <Tableboxweek data={data}></Tableboxweek>
        // <Alert color="warning">No hay ventas en la fecha seleccionada.</Alert>
      ) } */}

{loading && <Spinner
        className="m-5"
        color="warning"
      >
        Loading...
      </Spinner>}
      {error && <p>{error}</p>}
      {data !== null  ? (
        // <p>no hay</p>
        <div >
        {/* ******************** */}
        <Tableboxweek data={data}></Tableboxweek>
          
        </div>
        
      ) : (
        <p>no hay datos</p>
        
      )
    }
        
      </div>
    </div>







  

{/*         ++++++++******************************************+ */}


            </div>
    
 

    </div>
      

      <div>

          </div>
      </div>
    </div>


     </div>



    
  );


  
};

export default BoxWeek;