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
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';

const TablaPB = () => {
  const [datos, setDatos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tiposIds, setTiposIds] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [modificarIndex, setModificarIndex] = useState(-1);
  const [amenazasConNombres, setAmenazasConNombres] = useState([]);
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/api/probabilidad');
        setDatos(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/api/amenazas');
        setTipos(response.data);
  
        // Mapea AME_CODIGO a AME_NOMBRE para facilitar la búsqueda
        const amenazasConNombres = response.data.reduce((map, amenaza) => {
          map[amenaza.AME_CODIGO] = amenaza.AME_NOMBRE;
          return map;
        }, {});
        setAmenazasConNombres(amenazasConNombres);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);

  const [formulario, setFormulario] = useState({
    AME_CODIGO: '',
    PRO_DESCRIPCION: '',
    PRO_PROBALIDAD: '',
    PRO_RANGOS: '',
    PRO_VALOR: '',
    PRO_FRECUENCIA: '',
  });

  const handleBusquedaChange = (event) => {
    setBusqueda(event.target.value);
  };

  const handleInsert = () => {
    setModificarIndex(-1);
    setFormulario({
      AME_CODIGO: '',
      PRO_DESCRIPCION: '',
      PRO_PROBALIDAD: '',
      PRO_RANGOS: '',
      PRO_VALOR: '',
      PRO_FRECUENCIA: '',
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
      await axios.put(`https://savarciberfinanciero-production.up.railway.app/api/api/probabilidad/${modificarIndex}`, formulario);
      const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/api/probabilidad');
      setDatos(response.data);
    } else {
      await axios.post('https://savarciberfinanciero-production.up.railway.app/api/api/probabilidad', formulario);
      const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/api/probabilidad');
      setDatos(response.data);
    }

    setModalOpen(false);
    setFormulario({
      AME_CODIGO: '',
      PRO_DESCRIPCION: '',
      PRO_PROBALIDAD: '',
      PRO_RANGOS: '',
      PRO_VALOR: '',
      PRO_FRECUENCIA: '',
    });
  };

  const handleCancelar = () => {
    setModalOpen(false);
    setFormulario({
      AME_CODIGO: '',
      PRO_DESCRIPCION: '',
      PRO_PROBALIDAD: '',
      PRO_RANGOS: '',
      PRO_VALOR: '',
      PRO_FRECUENCIA: '',
    });
  };

  const handleModificar = (index) => {
    const probabilidad = datos[index];
  
    const selectedTipo = tipos.find((tipo) => tipo.AME_CODIGO === probabilidad.AME_CODIGO); // Corregir aquí
    setModificarIndex(probabilidad.PRO_CODIGO);
    setFormulario({
      AMEID: selectedTipo ? selectedTipo.AME_CODIGO : '',
      AME_CODIGO: selectedTipo ? selectedTipo.AME_NOMBRE : '',
      PRO_CODIGO: probabilidad.PRO_CODIGO,
      PRO_DESCRIPCION: probabilidad.PRO_DESCRIPCION,
      PRO_PROBALIDAD: probabilidad.PRO_PROBALIDAD,
      PRO_RANGOS: probabilidad.PRO_RANGOS,
      PRO_VALOR: probabilidad.PRO_VALOR,
      PRO_FRECUENCIA: probabilidad.PRO_FRECUENCIA,
    });
    setModalOpen(true);
  };

  const handleEliminar = async (index) => {
    const idToDelete = datos[index].PRO_CODIGO;

    await axios.delete(`https://savarciberfinanciero-production.up.railway.app/api/api/probabilidad/${idToDelete}`);

    const response = await axios.get('https://savarciberfinanciero-production.up.railway.app/api/api/probabilidad');
    setDatos(response.data);

    setModalOpen(false);
    setFormulario({
      AME_CODIGO: '',
      PRO_DESCRIPCION: '',
      PRO_PROBALIDAD: '',
      PRO_RANGOS: '',
      PRO_VALOR: '',
      PRO_FRECUENCIA: '',
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
                <TableCell colSpan={1} align="center">
                  Código
                </TableCell>
                <TableCell colSpan={2} align="center">
                  Amenaza
                </TableCell>
                <TableCell colSpan={3} align="center">
                  Probabilidad
                </TableCell>
                <TableCell colSpan={4} align="center">
                  Fecuencia
                </TableCell>
                <TableCell colSpan={5} align="center">
                  Opciones
                </TableCell>
              </TableRow>

              {datos.map((dato, index) => (
                <TableRow key={index}>
                  <TableCell colSpan={1} align="center">
                    {dato.PRO_CODIGO}
                  </TableCell>
                  <TableCell colSpan={2} align="center">
                    {}
                  {amenazasConNombres[dato.AME_CODIGO] || dato.AME_CODIGO}
                  </TableCell>
                  <TableCell colSpan={3} align="center">
                    {dato.PRO_RANGOS}
                  </TableCell>
                  <TableCell colSpan={4} align="center">
                    {dato.PRO_FRECUENCIA}
                  </TableCell>
                  <TableCell colSpan={5} align="center">
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
                  Total de probabilidades ingresadas: {datos.length}
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
            {modificarIndex !== -1 ? 'Modificar Probabilidad' : 'Nueva Probabilidad'}
          </Typography>
          <Autocomplete
            disablePortal
            id="combo-box-demo"
            name="AME_CODIGO"
            value={formulario.AME_CODIGO}
            options={tipos.map((tipo) => tipo.AME_NOMBRE)}
            sx={{ width: 300 }}
            onChange={(event, newValue) => {
              const selectedTipo = tipos.find((tipo) => tipo.AME_NOMBRE === newValue);
              setFormulario({
                ...formulario,
                AMEID: selectedTipo ? selectedTipo.AME_CODIGO : '',
                AME_NOMBRE: newValue, // Actualiza la propiedad correcta
              });
            }}
            renderInput={(params) => <TextField {...params} label="Tipos de Amenazas" />}
          />


          <TextField label="Descripción" name="PRO_DESCRIPCION" fullWidth value={formulario.PRO_DESCRIPCION} onChange={handleFormChange} />
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

export default TablaPB;
