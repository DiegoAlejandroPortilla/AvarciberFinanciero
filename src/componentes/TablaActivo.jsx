import * as React from 'react';
import PropTypes from 'prop-types';
import { alpha } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TableSortLabel from '@mui/material/TableSortLabel';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import { visuallyHidden } from '@mui/utils';
import { useEffect, useState } from 'react';
import axios from 'axios';

function createData(vulnerabilidad, costo, confidencialidad, integridad, disponibilidad) {
  return {
    vulnerabilidad,
    costo,
    confidencialidad,
    integridad,
    disponibilidad,
    
  };
}

const rows = [
    createData(305, 3.7, 67, 4.3, '05-03-2023', 67, 56),
];

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

const headCells = [
  {
    id: 'activo',
    numeric: true,
    disablePadding: false,
    label: 'Activo',
  },
  {
    id: 'vulnerabilidad',
    numeric: true,
    disablePadding: false,
    label: 'Vulnerabilidad',
  },
  {
    id: 'dimension',
    numeric: true,
    disablePadding: false,
    label: 'Dimensión',
  },
  {
    id: 'valoracion',
    numeric: true,
    disablePadding: false,
    label: 'Valoración',
  },
  {
    id: 'fecha',
    numeric: true,
    disablePadding: false,
    label: 'Fecha',
  },
  
];

function EnhancedTableHead(props) {
  const { order, orderBy, onRequestSort } =
    props;
  const createSortHandler = (property) => (event) => {
    onRequestSort(event, property);
  };

  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align="center"
            padding={headCell.disablePadding ? 'none' : 'normal'}
            sortDirection={orderBy === headCell.id ? order : false}
          >
            {headCell.hasFilter ? ( // Mostrar filtro si hasFilter es true
              <TableSortLabel
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={createSortHandler(headCell.id)}
              >
                {headCell.label}
                {orderBy === headCell.id ? (
                  <Box component="span" sx={visuallyHidden}>
                    {order === 'desc' ? 'sorted descending' : 'sorted ascending'}
                  </Box>
                ) : null}
              </TableSortLabel>
            ) : ( // Mostrar solo el texto si hasFilter es false
              <Typography>{headCell.label}</Typography>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.oneOf(['asc', 'desc']).isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
};

function EnhancedTableToolbar(props) {
  const { numSelected, tableTitle  } = props;
  const [/*searchValue,*/setSearchValue] = React.useState(''); // Nuevo estado para el valor de búsqueda

  const handleSearchChange = (event) => {
    setSearchValue(event.target.value); // Actualizar el valor de búsqueda al escribir en el TextField
    props.onSearch(event.target.value); // Llamar a la función onSearch proporcionada por props
  };

  return (
    <Toolbar
      sx={{
        pl: { sm: 2 },
        pr: { xs: 1, sm: 1 },
        ...(numSelected > 0 && {
          bgcolor: (theme) =>
            alpha(theme.palette.primary.main, theme.palette.action.activatedOpacity),
        }),
      }}
    >
      {numSelected > 0 ? (
        <Typography
          sx={{ flex: '1 1 100%' }}
          color="inherit"
          variant="subtitle1"
          component="div"
        >
          {numSelected} selected
        </Typography>
      ) : (
        <Typography
          sx={{ flex: '1 1 100%' }}
          variant="h6"
          id="tableTitle"
          component="div"
        >
         {tableTitle}
        </Typography>
      )}

      <TextField
        label="Buscar"
        variant="outlined"
        size="small"
        onChange={handleSearchChange}
      />
    </Toolbar>
  );
}

EnhancedTableToolbar.propTypes = {
  numSelected: PropTypes.number.isRequired,
};

export default function EnhancedTable({ tableTitle }) {
  const [order, setOrder] = React.useState('asc');
  const [orderBy, setOrderBy] = React.useState('calories');
  const [selected, setSelected] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [dense, setDense] = React.useState(false);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  const [rows, setRows] = React.useState([]); // Estado para almacenar los datos de la tabla
  const [datos, setDatos] = useState([]);
  //const [searchTerm, setSearchTerm] = React.useState('');

  useEffect(() => {
    // Function to fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/valorimpacto');
        // Assuming the response data is an array, you can set it to the 'datos' state
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = rows.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleChangeDense = (event) => {
    setDense(event.target.checked);
  };

   // Función para filtrar los resultados en tiempo real según el término de búsqueda
  /*const handleSearch = (searchValue) => {
    setSearchTerm(searchValue.toLowerCase());
    setPage(0);
  };*/

  // Filtramos los resultados según el término de búsqueda
  /*const filteredRows = React.useMemo(() => {
    if (!searchTerm) return rows;

    return rows.filter((row) => {
      return (
        row.activo.toString().toLowerCase().includes(searchTerm) ||
        row.vulnerabilidad.toString().toLowerCase().includes(searchTerm) ||
        row.dimension.toString().toLowerCase().includes(searchTerm) ||
        row.valoracion.toString().toLowerCase().includes(searchTerm) ||
        row.fecha.toString().toLowerCase().includes(searchTerm)
      );
    });
  }, [searchTerm, rows]);*/

  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const visibleRows = React.useMemo(
    () =>
      stableSort(rows, getComparator(order, orderBy)).slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage,
      ),
    [order, orderBy, page, rowsPerPage],
  );

  return (
    <Box sx={{ width: '100%' }}>
      <Paper sx={{ width: '100%', mb: 2 }}>
        <EnhancedTableToolbar numSelected={selected.length} tableTitle={tableTitle} />
        <TableContainer>
          <Table
            sx={{ minWidth: 750 }}
            aria-labelledby="tableTitle"
            size={dense ? 'small' : 'medium'}
          >
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={handleSelectAllClick}
              onRequestSort={handleRequestSort}
              rowCount={rows.length}
            />
            <TableBody>
              {datos.map((dato, index) => {
                return (
                  <TableRow key={index}>
                    
                    <TableCell align="center">{dato.ACT_CODIGO}</TableCell>
                    <TableCell align="center">{dato.DIV_CODIGO}</TableCell>
                    <TableCell align="center">{dato.VUL_CODIGO}</TableCell>
                    <TableCell align="center">{dato.VAI_VALOR}</TableCell>
                    <TableCell align="center">{dato.VAI_FECHA}</TableCell>
                  </TableRow>
                );
              })}
              {emptyRows > 0 && (
                <TableRow
                  style={{
                    height: (dense ? 33 : 53) * emptyRows,
                  }}
                >
                  <TableCell colSpan={6} align="center"> {/* Ajustamos el atributo align */}
                    No hay datos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={rows.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="Filas por página"
        />
      </Paper>
      <FormControlLabel
        control={<Switch checked={dense} onChange={handleChangeDense} />}
        label="Ajuste"
      />
    </Box>
  );
}
