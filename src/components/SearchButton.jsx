import { Button } from 'reactstrap';
import SearchIcon from '@mui/icons-material/Search';

const SearchButton = ({ onClick }) => {
  return (
    <Button color="primary" onClick={onClick}>
      Buscar
    </Button>
  );
};

export default SearchButton;
