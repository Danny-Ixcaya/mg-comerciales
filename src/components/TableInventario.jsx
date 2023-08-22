import React, { useState, useEffect } from 'react'
import { Table } from 'reactstrap'
import '../styles/Table.scss'
import Skeleton from 'react-loading-skeleton'
import dayjs from 'dayjs'

export default function TableInventario(props) {
  const { data } = props

  return (
    <Table
      bordered
      hover
      // striped
      responsive
      className="fixed-header"
    >
  <thead>
    <tr className="red">
      <th>
        #
      </th>
      {/* <th>
        Fecha
      </th> */}
      <th>
        Tipo Movimiento
      </th>
      <th>
        Fecha
      </th>
      <th>
        Total
      </th>
    </tr>
  </thead>
  <tbody>
  { data.length === 0 ? (
    <tr>
      {/* Si el filtrado de la búsqueda es = [] */}
      <td colSpan={6}>Resultados no encontrados, el registro no existe ..</td>
    </tr>
  )
  :
  /* Si filtró con éxito */
  (
    data.map((item, index) => {
      return (
        <tr key={index}>
          <th scope="row">
            {index + 1}
          </th>
          <td>
            {item.tipoMovimiento}
          </td>
          <td>
            {dayjs(item.fechaCaja).format('DD/MM/YYYY')}
          </td>
          <td>
            Q.{item.total.toFixed(2)}
          </td>
        </tr>
      )
    })
  )
}
  
  </tbody>
</Table>
  )
}
