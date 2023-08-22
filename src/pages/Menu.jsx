import React, { useState ,useEffect } from 'react'
import { useStore } from '../providers/GlobalProvider'
import Searchbar from '../components/Searchbar'
import { FcPlus, FcPrint } from 'react-icons/fc'
import { Button } from 'reactstrap'
import TableMenu from '../components/menu/TableMenu'
import ModalAddMenu from '../components/menu/ModalAddMenu'
import SearchComponent from '../components/buscador'
// import MatxSearchBox from '../components/buscador'
import {Box} from '@mui/system'
// import { Button } from "reactstrap";
import { Input } from "@mui/material";

import SearchButton from '../components/SearchButton'
import SearchInput from '../components/SearchInput'


function Menu(props) {
  /* isOpen (globalstate) -> para que el contenido se ajuste según el ancho de la sidebar (navegación) */
  const isOpen = useStore((state) => state.sidebar);
  useEffect(() => {
    // Para establecer en el módulo en el que nos encontramos
    props.setTitle("Menú de platillos");
  }, []);

  /* ------ Fetch */
   const [dataApi, setDataApi] = useState([])
   const getData = async () => {
     try {
       const response = await fetch(
         `${import.meta.env.VITE_BACKEND_URL}/api/Menu`,
         {
           headers: {
             Authorization: `Bearer ${localStorage.token}`,
           },
         }
       );
       const json = await response.json() 
       setDataApi(json)
     }
     catch(err) {
       console.error(err)
     }
   }
   useEffect(() => {
     getData()
   }, [])
 
  /* ----- Buscador */
  // state para buscador
  const [search, setSearch] = useState("");
  // buscador, captura de datos
  const searcher = (e) => {
    setSearch(e.target.value);
  };
  //metodo de filtrado del buscador
  // Si state search es null (no sea ha ingresado nada en el input) results = dataApi
  const results = !search
    ? dataApi
    : // Si se ha ingresado información al input, que la compare a los criterios y los filtre
      dataApi.filter((item) =>
        item.platillo.toLowerCase().includes(search.toLocaleLowerCase())
      );





      const [showInput, setShowInput] = useState(false);

      const handleButtonClick = () => {
        setShowInput(true);
      };
    
      const handleSearch = (value) => {
        console.log(`Buscando "${value}"...`);
      };

      

  return (
    <div className={isOpen ? "wrapper" : "side"}>
      <div className="container-fluid mt-4">
        <div className="row">
          <div className="col-6">
            <Searchbar searcher={searcher} />
          </div>
        <div className="col-6 ">
 
          <ModalAddMenu
            actualizarListaMenu={getData}
          />
          {/* <Button 
            color="primary"
            outline
            >
            Imprimir lista 
            <FcPrint />
          </Button> */}

        </div>
        </div>
        <div className="row">
          <div className="col">
            {/* <TableData data={results} /> */}
            <TableMenu 
              data={results}
              actualizarListaMenu={getData} />

              <Box display="flex" alignItems="center">
              {/* <SearchComponent/> */}

              {!showInput && <SearchButton onClick={handleButtonClick} />}
      {showInput && <SearchInput onSearch={handleSearch} />}
              </Box>

              
              
          </div>

          
        </div>
      </div>
    </div>
  );
}

export default Menu;
