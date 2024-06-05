import React, { useEffect, useState } from 'react';
import axios from 'axios';
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

const TablaUnidades = () => {
  const [datos, setDatos] = useState([]);
  const [formulario, setFormulario] = useState({
    
    UNI_NOMBRE: '',
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modificarIndex, setModificarIndex] = useState(-1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/api/unidades');
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      
      UNI_NOMBRE: '',
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
        await axios.put(`https://savarciberfinanciero-production.up.railway.app/api/api/unidades/${modificarIndex}`, formulario);
        // Now update the 'datos' state with the updated data
        const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/api/unidades');
        setDatos(response.data);
      } else {
        // Agregar un nuevo dato
        await axios.post('https://savarciberfinanciero-production.up.railway.app/api/api/unidades', formulario);
        // Now fetch the updated data and update the 'datos' state
        const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/api/unidades');
        setDatos(response.data);
      }

    setModalOpen(false);
    setFormulario({
      
      UNI_NOMBRE: '',
    });
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      
      UNI_NOMBRE: '',
    });
  };

  const handleModificar = (index) => {
    const unidad = datos[index];
    setModificarIndex(unidad.UNI_CODIGO);
    setFormulario({
      
      UNI_NOMBRE: unidad.UNI_NOMBRE,
    });
    setModalOpen(true);
  };

  const handleEliminar = async (index) => {
    const codigoToDelete = datos[index].UNI_CODIGO;

    await axios.delete(`https://savarciberfinanciero-production.up.railway.app/api/api/unidades/${codigoToDelete}`);

    const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/api/unidades');
    setDatos(response.data);

    setModalOpen(false);
    setFormulario({
      
      UNI_NOMBRE: '',
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
                  Empresa
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Nombre
                </TableCell>
                <TableCell colSpan={4} align="center">
                  Opciones
                </TableCell>
              </TableRow>

              {datos.map((dato, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={2} align="center">
                    {dato.UNI_CODIGO}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.EMP_CODIGO}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {dato.UNI_NOMBRE}
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
                  Total de unidades ingresadas: {datos.length}
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

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
            {modificarIndex !== -1 ? 'Modificar Unidad' : 'Nueva Unidad'}
          </Typography>
          
          <TextField label="Nombre" name="UNI_NOMBRE" fullWidth value={formulario.UNI_NOMBRE} onChange={handleFormChange} />
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

export default TablaUnidades;
