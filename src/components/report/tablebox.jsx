import React, { useEffect, useState } from 'react';
import { Table, Alert } from 'reactstrap'


export default function Tablebox ( props ) {

    // const { movimientosCaja, cajaDiaria, totalVentas,  totalGastos} = props
    const { movimientosCaja} = props


    // const [cajaDiaria, setCajaDiaria] = useState(null);
    // const [movimientosCaja, setMovimientosCaja] = useState([]);
    // const [ventas, setVentas] = useState([]);
    // const [gastos, setGastos] = useState([]);
    // const [totalVentas, setTotalVentas] = useState(0);
    // const [totalGastos, setTotalGastos] = useState(0);

    // const estadoStyle = {
    //   color: cajaDiaria.estado ? 'green' : 'red'
    // };
    
  return (
    <div>

{/* <h6>Resumen de ventas: {sumaTotal}</h6> */}
{/* {data.length > 0 ?  */}
    {/* {movimientosCaja ?  ( */}
    {/* <Table>
      <thead>
        <tr>
          <th className="text-center">Saldo Inicial</th>
          <th className="text-center">Entradas</th>
          <th className="text-center">Salidas</th>
          <th className="text-center">Saldo del día</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td className="text-center">{cajaDiaria.saldoInicial}</td>
          <td className="text-center">{totalVentas}</td>
          <td className="text-center">{totalGastos}</td>
          <td className="text-center">{cajaDiaria.saldoFinal}</td>
          <td className="text-center"><p style={estadoStyle}>Estado: {cajaDiaria.estado ? 'activo' : 'cerrado'}</p></td>
        </tr>
      </tbody>
    </Table> */}
{
movimientosCaja.map((movimiento, index) => (
  <div key={index} className='d-flex'>
    {/* <p>Id Movimiento: {movimiento.idMovimiento}</p>
    <p>Concepto: {movimiento.concepto}</p>
    <p>Total: {movimiento.total}</p> */}

    {/* <h4>Ventas</h4> */}
    <Table >

      
      <tbody>
        {movimiento.ventas.map((venta, ventaIndex) => (
          <tr key={ventaIndex}>
            {/* <td  align="left">{ventaIndex+1}</td> */}
            <td className='w-25' align="left">{venta.numeroComanda}</td>
            <td className='w-25' align="right">{venta.fecha}</td>
            <td className='w-25' align="center">Q. {venta.total}</td>
            {/* <td>{venta.idMesero}</td>
            <td>{venta.idCliente}</td> */}
          </tr>
        ))}
      </tbody>
    </Table>

    {/* <h4>Gastos</h4> */}
    <Table>
      
      <tbody>
        {movimiento.gastos.map((gasto, gastoIndex) => (
          <tr key={gastoIndex}>
            {/* <td>{gasto.idGasto}</td> */}
            <td className='w-25' align='center' >{gasto.numeroDocumento}</td>
            <td className='w-25' align='left'>{gasto.fecha}</td>
            <td className='w-50'>{gasto.concepto}</td>
            <td className='w-25'>{gasto.total}</td>
            {/* <td>{gasto.idProveedor}</td> */}
          </tr>
        ))}
      </tbody>
    </Table>

  
  </div>
))

      
      
        }
  </div>
  );
  };
  
