import React, { useState } from 'react';
import { Button, InputBase } from '@mui/material';
// import {Input} from '@mui/material';
import { IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import '../styles/buscar.css'
// import './SearchComponent.css'; // Asegúrate de tener un archivo CSS para los estilos

function SearchComponent() {
  const [open, setOpen] = useState(false);
  const [searchText, setSearchText] = useState('');

  const toggleSearch = () => {
    setOpen(!open);
  };

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  return (
    <div className="search-container">
      <IconButton onClick={toggleSearch} className="search-icon-button">
        {open ? <CloseIcon /> : <SearchIcon />}
      </IconButton>
      {open && (
        <InputBase
          placeholder="Buscar..."
          className="search-input"
          value={searchText}
          onChange={handleSearchChange}
        />
      )}
    </div>
  );
}

export default SearchComponent;

