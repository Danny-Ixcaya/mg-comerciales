import { useState } from 'react';
import { Input } from '@mui/material';

const SearchInput = ({ onSearch }) => {
  const [value, setValue] = useState('');

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      onSearch(value);
    }
  };

  return (
    <Input
      placeholder="Buscar registros"
      value={value}
      onChange={(event) => setValue(event.target.value)}
      onKeyDown={handleKeyDown}
      sx={{ height: '20px', width: '100%' }}
    />
  );
};

export default SearchInput;
