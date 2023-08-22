import React, { useEffect, useState } from 'react';
import { Table, Alert } from 'reactstrap'


export default function Tablep ( props ) {

    const { data } = props


    let totalSum = 0;

data.forEach((item) => {
  totalSum += item.total;
});

  return (
    <div>
      <h6>Resumen de Gastos: {totalSum}</h6>
    {data.length > 0 ? (
      <Table>
        <thead>
          <tr>
            <th>No</th>
            <th>Fecha</th>
            <th>Descripción</th>
            <th>Proveedor</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
        {data
            .sort((a, b) => new Date(b.gastos[0].fecha) - new Date(a.gastos[0].fecha))
            .map((item, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{item.gastos[0].fecha}</td>
                <td>{item.gastos[0].concepto}</td>
                <td>{item.proveedor.nombre}</td>
                <td>{item.total}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    ) : (
      <Alert color="danger">No se econtraron compras.</Alert>
    )}
  </div>
  );
  };
  
