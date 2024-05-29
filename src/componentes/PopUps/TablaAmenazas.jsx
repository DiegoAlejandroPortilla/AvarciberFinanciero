import React, { useEffect, useState } from 'react';
import axios from 'axios';
import dayjs from 'dayjs';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Button,
  TextField,
  Box,
  Typography,
  Modal,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

const TablaGA = () => {
  const [datos, setDatos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposIds, setTiposIds] = useState([]);

  useEffect(() => {
    // Function to fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('https://savarciber-production.up.railway.app/api/amenazas');
        // Assuming the response data is an array, you can set it to the 'datos' state
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);
  useEffect(() => {
    // Function to fetch data from the API when the component mounts
    const fetchData = async () => {
      try {
        const response = await axios.get('https://savarciber-production.up.railway.app/api/tipoamenaza');
        // Assuming the response data is an array, you can set it to the 'datos' state
        setTipos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []);

  // Update tiposIds state after tipos has been updated
  useEffect(() => {
    const tiposIds1 = tipos.map((item) => item.TIA_CODIGO);
    setTiposIds(tiposIds1);
  }, [tipos]);


  const [formulario, setFormulario] = useState({
    Tipo: '',
    FechaInicio: '',
    Identificacion: '',
    Nombre: '',
    Descripción: '',
    Observacion: '',
    FechaInactividad: null,
  });
  const formattedDate = dayjs(formulario.FechaInicio).format('YYYY/MM/DD');
  const formattedDate2 = dayjs(formulario.FechaInactividad).format('YYYY/MM/DD');
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  const [modificarIndex, setModificarIndex] = useState(-1);

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleDateChange = (newValue) => {
    // Format the date using dayjs before updating the state
    const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
    console.log(formattedDate);
    setFormulario({
      ...formulario,
      FechaInicio: formattedDate,
    });
  };
  const handleFechaInactividadChange = (newValue) => {
    // Format the date using dayjs before updating the state
    const formattedDate = dayjs(newValue).format('YYYY-MM-DD');
    setFormulario({
      ...formulario,
      FechaInactividad: formattedDate,
    });
  };
  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      Tipo: '',
      FechaInicio: '',
      Identificacion: '',
      Nombre: '',
      Descripción: '',
      Observacion: '',
      FechaInactividad: null,
    });
    setModalOpen(true);
  };

  const handleFormChange = (event) => {
    setFormulario({
      ...formulario,
      [event.target.name]: event.target.value,
    });
  };

  const handleGuardar = async () => {
    if (modificarIndex !== -1) {
      // Modificar el dato existente en la posición 'modificarIndex'
      await axios.put(`https://savarciber-production.up.railway.app/api/amenazas/${modificarIndex}`, {
        ...formulario,
        Tipo: formulario.TipoId, // Use TipoId for the Tipo value
      });
      // Now update the 'datos' state with the updated data
      const response = await axios.get('https://savarciber-production.up.railway.app/api/amenazas');
      setDatos(response.data);
    } else {
      await axios.post('https://savarciber-production.up.railway.app/api/amenazas',{
        ...formulario,
        Tipo: formulario.TipoId, // Use TipoId for the Tipo value
      });
      // Now fetch the updated data and update the 'datos' state
      const response = await axios.get('https://savarciber-production.up.railway.app/api/amenazas');
      setDatos(response.data);
    }

    setModalOpen(false);
    setFormulario({
      Tipo: '',
      FechaInicio: '',
      Identificacion: '',
      Nombre: '',
      Descripción: '',
      Observacion: '',
      FechaInactividad: null,
    });
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      Tipo: '',
      FechaInicio: '',
      Identificacion: '',
      Nombre: '',
      Descripción: '',
      Observacion: '',
      FechaInactividad: null,
    });
  };

  const handleModificar = (index) => {
    const formattedFechaInicio = dayjs(datos[index].AME_FECHA_INICIO).format('YYYY-MM-DD');
    
    const selectedTipo = tipos.find((tipo) => tipo.TIA_DESCRIPCION === datos[index].TIA_CODIGO);
    
    setModificarIndex(datos[index].AME_CODIGO);
    setFormulario({
      TipoId: selectedTipo ? selectedTipo.TIA_CODIGO : '',
      Tipo: selectedTipo ? selectedTipo.TIA_DESCRIPCION : '',
      FechaInicio: datos[index].AME_FECHA_INICIO?datos[index].AME_FECHA_INICIO.split('T')[0]:datos[index].AME_FECHA_INICIO,
      Identificacion: datos[index].AME_IDENTIFICACION,
      Nombre: datos[index].AME_NOMBRE,
      Descripción: datos[index].AME_DESCRIPCION,
      Observacion: datos[index].AME_OBSERVACION,
      FechaInactividad: datos[index].AME_FECHA_INACTIVIDAD?datos[index].AME_FECHA_INACTIVIDAD.split('T')[0]:datos[index].AME_FECHA_INACTIVIDAD,
    });
    setModalOpen(true);
  };

  const handleEliminar = async (index) => {
    const codigoToDelete = datos[index].AME_CODIGO;

    // Make the DELETE request to delete the data
    await axios.delete(`https://savarciber-production.up.railway.app/api/amenazas/${codigoToDelete}`);

    // Fetch the updated data after the deletion
    const response = await axios.get('https://savarciber-production.up.railway.app/api/amenazas');
    setDatos(response.data);

    // Close the modal and reset the form
    setModalOpen(false);
    setFormulario({
      Tipo: '',
      FechaInicio: '',
      Identificacion: '',
      Nombre: '',
      Descripción: '',
      Observacion: '',
      FechaInactividad: null,
    });
  };
  return (
    <Box>
      <Box sx={{ border: 'none', p: 4 }}>
        <TableContainer component={Paper}>
          <Table sx={{ width: '97%', margin: '20px 10px 10px 10px', borderCollapse: 'collapse', border: '1px solid #ddd' }}>
            <TableBody>
              <TableRow>
                <TableCell colSpan={3} align="left">
                  <Button variant="contained" color="primary" onClick={handleInsert}>
                    Insertar Nuevo
                  </Button>
                </TableCell>

                <TableCell colSpan={3} align="right">
                  <TextField label="Buscar" variant="outlined" value={busqueda} onChange={handleBusquedaChange} />
                </TableCell>
              </TableRow>

              <TableRow>
                <TableCell colSpan={2} align="center">
                  Código
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Tipo
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Fecha de Inicio
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Identificacion
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Nombre
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Descripción
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Observacion
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Fecha de Inactividad
                </TableCell>
                <TableCell colSpan={4} align="center">
                  Opciones
                </TableCell>
              </TableRow>

              {/* Mapear los datos y renderizar las filas */}
              {datos.map((dato, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={2} align="center">
                    {dato.AME_CODIGO}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.TIA_CODIGO}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.AME_FECHA_INICIO.split('T')[0]}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.AME_IDENTIFICACION}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.AME_NOMBRE}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.AME_DESCRIPCION}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.AME_OBSERVACION}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.AME_FECHA_INACTIVIDAD?dato.AME_FECHA_INACTIVIDAD.split('T')[0]:dato.AME_FECHA_INACTIVIDAD}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    <Button variant="contained" color="primary" onClick={() => handleModificar(index)}>
                      <EditIcon />
                    </Button>
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    <Button variant="contained" color="secondary" onClick={() => handleEliminar(index)} sx={{ backgroundColor: 'red' }}>
                      <DeleteIcon />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}

              <TableRow>
                <TableCell colSpan={3} align="left">
                  Total de datos ingresados: {datos.length}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* Ventana emergente */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            bgcolor: 'background.paper',
            boxShadow: 24,
            p: 4,
            minWidth: 300,
            maxWidth: 500,
          }}
        >
          <Typography variant="h6" gutterBottom paddingBottom={1}>
            {modificarIndex !== -1 ? 'Modificar Elemento' : 'Nuevo Elemento'}
          </Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            name="Tipo"
            value={formulario.Tipo}
            options={tipos.map((tipo) => tipo.TIA_DESCRIPCION)} 
            sx={{ width: 300 }}
  onChange={(event, newValue) => {
    const selectedTipo = tipos.find((tipo) => tipo.TIA_DESCRIPCION === newValue);
    setFormulario({
      ...formulario,
      TipoId: selectedTipo ? selectedTipo.TIA_CODIGO : '',
      Tipo: newValue, // Update the selected value when an option is selected
    });
  }}
  renderInput={(params) => <TextField {...params} label="Tipos de Amenazas" />}
          />
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Fecha de Inicio"
              name="FechaInicio"
              value={dayjs(formulario.FechaInicio)}
              onChange={handleDateChange} // Use the updated event handler
              renderInput={(params) => <TextField {...params} />}
            />
          </LocalizationProvider>
          <Box paddingBottom={2}>
            <TextField label="Identificacion" name="Identificacion" fullWidth value={formulario.Identificacion} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Nombre" name="Nombre" fullWidth value={formulario.Nombre} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Descripción" name="Descripción" fullWidth value={formulario.Descripción} onChange={handleFormChange} />
          </Box>
          <Box paddingBottom={2}>
            <TextField label="Observación" name="Observacion" fullWidth value={formulario.Observacion} onChange={handleFormChange} />
          </Box>
          {modificarIndex !== -1 ?
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Fecha de Inactividad"
                name="FechaInactividad"
                value={dayjs(formulario.FechaInactividad)}
                 onChange={handleFechaInactividadChange} // Use the new event handler // Use the updated event handler
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
            : ' '}
          <Box>
            <Button variant="contained" color="primary" onClick={handleCancelar} sx={{ mr: 10 }}>
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleGuardar}>
              Guardar
            </Button>
          </Box>
        </Box>
      </Modal>
    </Box>
  );
};

export default TablaGA;
