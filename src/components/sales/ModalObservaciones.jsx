import React, { useState, useEffect } from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, FormGroup, Label, Col, Input } from 'reactstrap';
import { AiOutlineEye } from "react-icons/ai"
function ModalObservaciones(props) {
  const [modal, setModal] = useState(false);
  // Estado para almacenar el cliente seleccionado
  // const [selectedCliente, setSelectedCliente] = useState(null); 
  // const [selectedClientId, setSelectedClientId] = useState("");
  const toggle = () => setModal(!modal);
  

  const getDataCliente = async () => {
    try {
      // https://jsonplaceholder.typicode.com/comments
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/Cliente`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.token}`,
          },
        }
      );
      const json = await response.json() 
      props.setDataClienteProp(json)
      // console.log(json)
    } catch (error) {
      console.log(error)
    }
  };
  useEffect(() => {
    getDataCliente();
    // console.info(props.cliente)
  }, []);

  const handleClienteChange = (event) => {
    const selectedClientId = event.target.value;
    // Data de la API = state filtrado
    const selectedClient = props.cliente.find((client) => client.idCliente === selectedClientId);
    // SetState props
    props.setSelectedClienteIdProp(event.target.value);
    props.setSelectedClienteProp(selectedClient);
    //Data post prop
    props.setDataPostProp(event.target.value)
  };

  const handleAccept = () => {
    if (props.selectedClientId) {
      //  idCliente seleccionado (selectedClientId) para realizar alguna acción
      // console.log("idCliente seleccionado:", props.selectedClientId);
    }
    toggle(); // Cerrar el modal después de aceptar
  };

  return (
    <div>
      
      <Button color="danger" onClick={toggle} id="btn-observaciones">
      <AiOutlineEye/> Observaciones
      </Button>
      <Modal isOpen={modal} toggle={toggle} centered>
        <ModalHeader toggle={toggle}><AiOutlineEye size={28}/> Observaciones</ModalHeader>
        <ModalBody>
        <form>

          <FormGroup>
            <Label for="exampleSelect">
              Cliente
            </Label>
            <Input
              id="exampleSelect"
              name="select"
              type="select"
              value={props.selectedCliente}
              onChange={handleClienteChange}
            >
              <option value="">Selecciona el cliente</option>
              {props.cliente.map((item, index) => 
                <option 
                  key={item.idCliente}
                  value={item.idCliente}
                >
                  {index + 1}{" "}{item.nombreApellido}
                </option>
              )}
            
            </Input>
          </FormGroup>
          <FormGroup>
              <Label
              for="exampleText"
              sm={2}
              >
              Observaciones
              </Label>
              <Col sm={12}>
              <Input
                  id="exampleText"
                  name="text"
                  type="textarea"
                  onChange={props.changeObservaciones}
                  pattern="(?!.*\s{4,})(?!.*\s$).{0,255}$"
              />
              </Col>
          </FormGroup>
          </form>
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handleAccept}>
              Aceptar
            </Button>
            <Button color="secondary" onClick={toggle}>
              Cancel
            </Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ModalObservaciones;