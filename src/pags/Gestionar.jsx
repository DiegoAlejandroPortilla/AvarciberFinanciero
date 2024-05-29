import React, { useState, useEffect } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Paper from "@mui/material/Paper";
import Slider from '@mui/material/Slider';
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Column from "../componentes/Column";
import { DragDropContext } from "react-beautiful-dnd";
import { styled } from "@stitches/react"; // Corregido el import
import axios from "axios";
import moment from 'moment';
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import SaveIcon from "@mui/icons-material/Save";
import Select from "react-select";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';
import {
  Grid,
  FormControl,
  InputLabel,
  MenuItem,
  Checkbox,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import TextField from "@mui/material/TextField";
/*function Copyright() {
  return (
    <Typography variant="body2" color="text.secondary" align="center">
      {"Copyright © "}
      <Link color="inherit">
        AVARCIBER
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}*/

export const Gestionar = () => {
  const steps = [
    "Seleccionar Activo por Vulnerabilidad"
  ];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <SeleccionarActivo onRowsUpdate={handleActualizacion} />;
      default:
        throw new Error("Unknown step");
    }
  }

  const StyledColumns = styled("div", {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    margin: "5vh auto",
    width: "80%",
    height: "80vh",
    gap: "8px",
  });

  const SeleccionarActivo = () => {
    const [tableData, setTableData] = useState([]);
    const [allVulnerabilidadFechas, setAllVulnerabilidadFechas] = useState({});
    const [activos, setActivos] = useState([]);
    const [vulnerabilidades, setVulnerabilidades] = useState([]);
    const [guardarPressed, setGuardarPressed] = useState(false);
    const [amenazas, setAmenazas] = useState([]);
    const [amenazasVulnerabilidades, setAmenazasVulnerabilidades] = useState([]);
    const [deslizador1, setDeslizador1] = useState(1);
    const [deslizador2, setDeslizador2] = useState(1);
    const [deslizador3, setDeslizador3] = useState(1);
    const [showAddVulnerabilidadButton, setShowAddVulnerabilidadButton] = useState(true);
    const [selectedVulnerabilidadFecha, setSelectedVulnerabilidadFecha] = useState(null);
    const [showAddActivoButton, setShowAddActivoButton] = useState(true);
    const [showFechaBox, setShowFechaBox] = useState([]);

    useEffect(() => {
      async function fetchData() {
        try {
          handleAddRow();
          const activosResponse = await axios.get(
            "https://savarciber-production.up.railway.app/api/activos"
          );
          setActivos(
            activosResponse.data.map((item) => ({
              value: item.ACT_CODIGO,
              label: item.ACT_NOMBRE,
            }))
          );

          const vulnerabilidadesResponse = await axios.get(
            "https://savarciber-production.up.railway.app/api/vulnerabilidades"
          );
          setVulnerabilidades(
            vulnerabilidadesResponse.data.map((item) => ({
              value: item.VUL_CODIGO,
              label: item.VUL_NOMBRE,
            }))
          );

          const amenazasResponse = await axios.get(
            "https://savarciber-production.up.railway.app/api/amenazas"
          );
          setAmenazas(
            amenazasResponse.data.map((item) => ({
              value: item.AME_CODIGO,
              label: item.AME_NOMBRE,
            }))
          );

          const amenazaVulnerabilidadResponse = await axios.get("https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades");
          console.log("Respuesta de la API:", amenazaVulnerabilidadResponse.data);
          setAmenazasVulnerabilidades(amenazaVulnerabilidadResponse.data.map((item) => ({
            value: item.VUL_CODIGO,
            label: item.VUL_NOMBRE,
            AMV_FECHA_INICIO: item.AMV_FECHA_INICIO,
          })));



          /*const amenazasVulnerabilidadesResponse = await axios.get("https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades");

          // Obtener todas las IDs de vulnerabilidades (pueden estar repetidas)
          const allVulnerabilityCodes = amenazasVulnerabilidadesResponse.data.map(item => item.VUL_CODIGO);
          setAmenazasVulnerabilidades(allVulnerabilityCodes);

          // Obtener fechas para cada código de vulnerabilidad
          const fechasPorVulnerabilidad = {};

          for (const codigo of allVulnerabilityCodes) {
            const fechaVulnerabilidad = await obtenerFechaVulnerabilidad(codigo);
            fechasPorVulnerabilidad[codigo] = fechaVulnerabilidad;
          }

          // Puedes utilizar fechasPorVulnerabilidad para mostrar las fechas correspondientes en tu aplicación
          console.log(fechasPorVulnerabilidad);

          // Puedes seleccionar la fecha de la primera vulnerabilidad (puedes ajustar esto según tus necesidades)
          if (allVulnerabilityCodes.length > 0) {
            const fechaVulnerabilidad = fechasPorVulnerabilidad[allVulnerabilityCodes[0]];
            setSelectedVulnerabilidadFecha(fechaVulnerabilidad);
          }*/
        } catch (error) {
          console.log(error);
        }
      }

      fetchData();
    }, []);

    

    const formatearFecha = (fecha) => {
      const date = new Date(fecha);
      const opcionesDeFormato = { year: 'numeric', month: '2-digit', day: '2-digit' };
      return date.toLocaleDateString(undefined, opcionesDeFormato);
    };

    const obtenerFechaVulnerabilidad = async (vulnerabilidadCodigo) => {
      try {
        const fechaResponse = await axios.get(
          `https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades/fecha/${vulnerabilidadCodigo}`
        );

        if (fechaResponse.data && fechaResponse.data.length > 0 && fechaResponse.data[0].AMV_FECHA_INICION) {
          const fechaVulnerabilidad = formatearFecha(fechaResponse.data[0].AMV_FECHA_INICION);
          return fechaVulnerabilidad;
        } else {
          console.error("La respuesta de la API no contiene la propiedad esperada.");
          return null;
        }
      } catch (error) {
        console.error("Error obteniendo la fecha de la vulnerabilidad:", error);
        return null;
      }
    };


    const handleAddRow = () => {
      setTableData((prevData) => [
        ...prevData,
        { activo: null, vulnerabilidades: [] },
      ]);
    };

    const handleActivoSelect = (index, selected) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[index].activo = selected;
        return newData;
      });
    };

    const handleAddVulnerabilidad = (rowIndex) => {
      const selectedActivo = tableData[rowIndex].activo;

      if (!selectedActivo) {
        alert("Debe seleccionar un activo antes de agregar una vulnerabilidad.");
        return;
      }

      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex].vulnerabilidades.push({
          vulnerabilidad: null,
          amenaza: null,
          dimension1: 1,
          dimension2: 1,
          dimension3: 1,
          costo: "",
        });
        return newData;
      });

      setShowAddVulnerabilidadButton(false);
      setShowAddActivoButton(false);
    };


    const handleVulnerabilidadSelect = async (rowIndex, vulIndex, selected) => {
      try {
        const fechaVulnerabilidad = selected.AMV_FECHA_INICIO;

        console.log("Fecha de vulnerabilidad seleccionada:", fechaVulnerabilidad);

        setTableData((prevData) => {
          const newData = [...prevData];
          newData[rowIndex].vulnerabilidades[vulIndex] = {
            ...newData[rowIndex].vulnerabilidades[vulIndex],
            vulnerabilidad: selected,
            fechaVulnerabilidad: fechaVulnerabilidad,
          };

          return newData;
        });

        // Actualiza el estado showFechaBox solo para la fila y vulnerabilidad actual
        setShowFechaBox((prevShowFechaBox) => {
          const newShowFechaBox = [...prevShowFechaBox];
          newShowFechaBox[rowIndex] = newShowFechaBox[rowIndex] || {};
          newShowFechaBox[rowIndex][vulIndex] = true;
          console.log("Nuevo estado showFechaBox:", newShowFechaBox);
          return newShowFechaBox;
        });

        // Actualiza el estado selectedVulnerabilidadFecha solo si la fila está seleccionada
        setSelectedVulnerabilidadFecha(fechaVulnerabilidad);
      } catch (error) {
        console.error("Error obteniendo la fecha de la vulnerabilidad:", error);
      }
    };

  const handleInputChange = (rowIndex, vulIndex, field, value) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex].vulnerabilidades[vulIndex][field] = value;
        return newData;
      });
    };

    const handleEliminarActivo = (rowIndex) => {
      const confirmDelete = window.confirm(
        "¿Está seguro de que desea eliminar este activo?"
      );
      if (confirmDelete) {
        setTableData((prevData) => {
          const newData = [...prevData];
          newData.splice(rowIndex, 1);
          return newData;
        });
        handleAddRow();

      }
    };

    const handleGuardarClick = async () => {
      for (const rowData of tableData) {
        if (!rowData.activo) {
          alert("Debe seleccionar un activo para cada fila antes de guardar.");
          return;
        }

        for (const vul of rowData.vulnerabilidades) {
          if (
            !vul.vulnerabilidad ||
            !vul.dimension1 ||
            !vul.dimension2 ||
            !vul.dimension3 ||
            !vul.costo
          ) {
            alert("Debe completar todos los campos antes de guardar de guardar.");
            return;
          }
        }
      }

      console.log(tableData);
      await saveDataToApi();
      await saveData2();
      setGuardarPressed(true);
      alert("Se guardo con Exito.");
     // Utiliza el objeto history para retroceder una página
     window.history.back();
    };


    const saveDataToApi = async () => {
      try {
        const dataToSend = [];

        for (const rowData of tableData) {
          if (!rowData.vulnerabilidades.every(vul =>
            vul.vulnerabilidad && rowData.activo && vul.costo !== ""
          )) {
            continue; // Skip invalid data
          }

          for (const vul of rowData.vulnerabilidades) {
            const data = {
              VUL_CODIGO: vul.vulnerabilidad.value,
              ACT_CODIGO: rowData.activo.value,
              VAC_COSTO: vul.costo,
              VAC_FECHA_INICIO: new Date().toISOString().slice(0, 19).replace('T', ' '), // Format as 'YYYY-MM-DD HH:MM:SS'
              VAC_FECHA_INACTIVIDAD: null,
              VAC_OBSERVACION: null,
            };

            dataToSend.push(data);
          }
        }

        if (dataToSend.length === 0) {
          console.log("No valid data to send.");
          return;
        }

        console.log("Data being sent to API:", dataToSend);

        for (const data of dataToSend) {
          await axios.post("https://savarciber-production.up.railway.app/api/vulnerabilidadActivo", data);
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };



    const saveData2 = async () => {
      try {
        const dataToSend = [];

        for (const rowData of tableData) {
          if (!rowData.vulnerabilidades.every(vul =>
            vul.vulnerabilidad && rowData.activo && vul.dimension1 && vul.dimension2 && vul.dimension3 !== ""
          )) {
            continue; // Skip invalid data
          }

          for (const vul of rowData.vulnerabilidades) {
            let divCodigoValue = 0; // Reset divCodigoValue for each asset

            if (vul.dimension1 !== "") {
              divCodigoValue = 1;
            } else if (vul.dimension2 !== "") {
              divCodigoValue = 2;
            } else if (vul.dimension3 !== "") {
              divCodigoValue = 3;
            }

            const dimensions = [vul.dimension1, vul.dimension2, vul.dimension3];

            for (const dimension of dimensions) {
              if (dimension !== "") {
                const data = {
                  DIV_CODIGO: divCodigoValue,
                  VUL_CODIGO: vul.vulnerabilidad.value,
                  ACT_CODIGO: rowData.activo.value,
                  VAI_FECHA: new Date().toISOString().slice(0, 19).replace('T', ' '),
                  VAI_VALOR: dimension,
                };
                dataToSend.push(data);

                // Increment divCodigoValue for the next iteration
                divCodigoValue++;
              }
            }
          }
        }

        if (dataToSend.length === 0) {
          console.log("No valid data to send.");
          return;
        }

        console.log("Data being sent to API:", dataToSend);

        for (const data of dataToSend) {
          await axios.post("https://savarciber-production.up.railway.app/api/valorimpacto", data);
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };



    const handleEliminarVulnerabilidad = (rowIndex, vulIndex) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex].vulnerabilidades.splice(vulIndex, 1);
        return newData;
      });
    };

    const marcasDeslizador = [];
    for (let i = 1; i <= 10; i++) {
      marcasDeslizador.push({
        value: i,
        label: String(i),
      });
    }


    const handleCancelarProceso = () => {
      window.history.back();
      // Puedes devolver un valor aquí si es necesario
     return "Proceso cancelado";

    };



    return (
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Activo
                </Typography>
              </TableCell>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Vulnerabilidades
                </Typography>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <Select
                    value={row.activo}
                    options={activos}
                    onChange={(selected) => handleActivoSelect(rowIndex, selected)}
                    isDisabled={row.vulnerabilidades.length > 0}
                    placeholder="Seleccione un Activo"
                  />
                </TableCell>
                <TableCell colSpan={2}>
                  {row.vulnerabilidades.map((vul, vulIndex) => (
                    <Box
                      key={vulIndex}
                      display="flex"
                      flexDirection="column"
                      sx={{ marginBottom: "16px" }}
                    >
                      <Select
                        value={vul.vulnerabilidad}
                        options={amenazasVulnerabilidades}
                        onChange={(selected) => handleVulnerabilidadSelect(rowIndex, vulIndex, selected)}
                        placeholder="Seleccione una Vulnerabilidad"
                        isSearchable
                        getOptionLabel={(option) => option.label}
                        getOptionValue={(option) => option.value}
                        isDisabled={row.activo === null} // Deshabilita el ComboBox si no se ha seleccionado un activo
                        sx={{
                          marginBottom: "8px",
                          zIndex: 1
                        }}
                      />

                      <br />
                      {/* Mostrar la caja de fecha condicionalmente */}
                      {showFechaBox[rowIndex] && showFechaBox[rowIndex][vulIndex] && (
                        <TextField
                          type="text"
                          value={formatearFecha(vul.fechaVulnerabilidad || selectedVulnerabilidadFecha || "")}
                          label="Fecha de Vulnerabilidad Seleccionada"
                          disabled
                          sx={{
                            marginBottom: "8px",
                            zIndex: 0
                          }}
                        />
                      )}
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px">Dimensiones de Seguridad</Typography>
                      <Typography variant="subtitle1" marginTop="10px" style={{ fontStyle: 'italic', color: 'gray' }}>Estime con un valor de 1-10 para cada caso, donde 1 es el menor impacto.</Typography>
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Disponibilidad</Typography>
                      <Slider
                        defaultValue={1}
                        step={null}
                        min={1}
                        max={10}
                        marks={marcasDeslizador}
                        value={vul.dimension1}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            vulIndex,
                            "dimension1",
                            e.target.value
                          )
                        }
                        color="secondary"
                        sx={{
                          width: "97%",
                          marginLeft: "auto"
                        }}
                      />
                      { }
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Integridad</Typography>
                      <Slider
                        defaultValue={1}
                        step={null}
                        min={1}
                        max={10}
                        marks={marcasDeslizador}
                        value={vul.dimension2}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            vulIndex,
                            "dimension2",
                            e.target.value
                          )
                        }
                        sx={{
                          width: "97%",
                          marginLeft: "auto"
                        }}
                      />
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Confidencialidad</Typography>
                      <Slider
                        defaultValue={1}
                        step={null}
                        min={1}
                        max={10}
                        marks={marcasDeslizador}
                        value={vul.dimension3}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            vulIndex,
                            "dimension3",
                            e.target.value
                          )
                        }
                        color="secondary"
                        sx={{
                          width: "97%",
                          marginLeft: "auto"
                        }}
                      />
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Costo</Typography>
                      <TextField
                        type="text"
                        value={vul.costo}
                        onChange={(e) =>
                          handleInputChange(
                            rowIndex,
                            vulIndex,
                            "costo",
                            e.target.value
                          )
                        }
                        label="Ingrese el costo (en USD) del activo."
                        sx={{
                          marginBottom: "8px",
                          zIndex: 0
                        }}
                      />
                      <br />
                      <Button
                        startIcon={<SaveIcon />}
                        color="success"
                        variant="contained"
                        onClick={handleGuardarClick}>
                        Guardar
                      </Button>
                      <br />
                      <Button
                        variant="contained"
                        color="error"
                        onClick={() =>
                          handleCancelarProceso()
                        }
                      >
                        Cancelar
                      </Button>

                    </Box>
                  ))}
                  <Box display="flex" sx={{ marginBottom: "8px" }}>
                    <Button
                      variant="contained"
                      onClick={() => handleAddVulnerabilidad(rowIndex)}
                      disabled={
                        !row.vulnerabilidades.every((vul) => vul.vulnerabilidad !== null)
                      }
                      sx={{ marginRight: "8px", display: showAddVulnerabilidadButton ? 'block' : 'none' }}
                    >
                      Añadir Vulnerabilidad
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => handleEliminarActivo(rowIndex)}
                      sx={{ marginRight: "8px", display: showAddVulnerabilidadButton ? 'block' : 'none' }}
                    >
                      Eliminar Activo
                    </Button>

                  </Box>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    );

  };

  function createData(item1, item2, item3) {
    return {
      item1,
      item2,
      item3,
    };
  }

  const [rows, setRows] = useState([]);

  const handleActualizacion = (filasActualizadas) => {
    setRows(filasActualizadas);
  };

  const headCells = [
    {
      id: "item1",
      numeric: false,
      label: "Activo",
    },
    {
      id: "item2",
      numeric: false,
      label: "Vulnerabilidad",
    },
    {
      id: "item3",
      numeric: false,
      label: "Amenaza",
    },
  ];


  const TablaAmenaza = () => {
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
      async function fetchData() {
        try {
          const activoVulnerabilidadResponse = await axios.get(
            'https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades/total'
          );

          const currentDate = new Date().toLocaleDateString('es-ES', { timeZone: 'America/Bogota' });

          const filteredData = activoVulnerabilidadResponse.data.filter((item) => {
            const fechaLocal = new Date(item.VAC_FECHA_INICIO).toLocaleDateString('es-ES', { timeZone: 'America/Bogota' });
            return fechaLocal === currentDate;
          });

          const mappedData = filteredData.map((item) => ({
            amenaza: item.AME_NOMBRE,
            vulnerabilidad: item.ACT_NOMBRE,
            activo: item.ACT_NOMBRE,
            promedio: item.VAL_IMPACTO,
            costo: item.VA_COSTO,
            fecha: new Date(item.VAC_FECHA_INICIO).toLocaleDateString('es-ES', { timeZone: 'America/Bogota' }),
          }));

          setTableData(mappedData);
        } catch (error) {
          console.error(error);
        }
      }

      fetchData();
    }, []);

    return (
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center">Amenaza</TableCell>
                  <TableCell align="center">Vulnerabilidad</TableCell>
                  <TableCell align="center">Valor Impacto Promedio</TableCell>
                  <TableCell align="center">Costo</TableCell>
                  <TableCell align="center">Fecha</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {tableData.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{row.amenaza}</TableCell>
                    <TableCell>{row.vulnerabilidad}</TableCell>
                    <TableCell align="center">{row.promedio}</TableCell>
                    <TableCell>{row.costo}</TableCell>
                    <TableCell>{row.fecha}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    );
  };




  const TablaResultado = () => {
    const [tablaFinal, setTablaFinal] = useState([]);
    const [frecuenciaOptions] = useState([
      { label: 'Muy Baja', value: 'Muy Baja' },
      { label: 'Baja', value: 'Baja' },
      { label: 'Media', value: 'Media' },
      { label: 'Alta', value: 'Alta' },
      { label: 'Muy Alta', value: 'Muy Alta' },
    ]);
    const [riesgoData, setRiesgoData] = useState([]);
    const data = [
      { x: 100, y: 200, z: 200 },
      { x: 120, y: 100, z: 260 },
      { x: 170, y: 300, z: 400 },
      { x: 140, y: 250, z: 280 },
      { x: 150, y: 400, z: 500 },
      { x: 110, y: 280, z: 200 },
    ];
    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];


    useEffect(() => {
      async function fetchData() {
        try {
          const activoVulnerabilidadResponse = await axios.get(
            'https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades/total'
          );

          const mappedData = activoVulnerabilidadResponse.data.map((item) => ({
            amenaza: item.AmenazaNombre,
            promedio: item.ValorPromedioImpacto,
            costo: item.CostoVulnerabilidad,
            frecuencia: '', // Initialize frecuencia as empty string
            riesgo: '', // Initialize riesgo as empty string
            riesgoNumerico: 0
          }));

          // Group data by amenaza
          const groupedData = mappedData.reduce((acc, item) => {
            const { amenaza, promedio, costo } = item;
            if (!acc[amenaza]) {
              acc[amenaza] = { amenaza, promedios: [promedio], costos: [costo] };
            } else {
              acc[amenaza].promedios.push(promedio);
              acc[amenaza].costos.push(costo);
            }
            return acc;
          }, {});

          // Calculate promedioMedia and costoTotal for each amenaza
          const calculatedData = Object.values(groupedData).map((group) => {
            const promedioMedia = Math.round(
              group.promedios.reduce((acc, val) => acc + val, 0) / group.promedios.length
            );
            const costoTotal = group.costos.reduce((acc, val) => acc + val, 0);
            return { amenaza: group.amenaza, promedio: promedioMedia, costo: costoTotal };
          });

          setTablaFinal(calculatedData);

          const riesgoResponse = await axios.get(
            'https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades/rangos'
          );

          const riesgoMapeado = riesgoResponse.data.map((item) => ({
            VAL_IMPACTO: item.VAL_IMPACTO,
            VA_FRECUENCIA: item.VA_FRECUENCIA,
            VA_IMPACTO: item.VA_IMPACTO,
            VAL_RIESGO: item.VAL_RIESGO
          }));

          setRiesgoData(riesgoMapeado);

        } catch (error) {
          console.error(error);
        }
      }

      fetchData();
    }, []);

    // Update Frecuencia and Riesgo values for a specific row
    const handleFrecuenciaChange = (selectedFrecuencia, rowIndex) => {
      const promedio = tablaFinal[rowIndex].promedio;

      // Find matching data in riesgoData
      const matchingData = riesgoData.find(
        (data) =>
          data.VA_FRECUENCIA === selectedFrecuencia &&
          data.VAL_IMPACTO === promedio
      );

      if (matchingData) {
        const updatedTablaFinal = [...tablaFinal];
        updatedTablaFinal[rowIndex].frecuencia = selectedFrecuencia;
        updatedTablaFinal[rowIndex].riesgo = matchingData.VA_IMPACTO;
        updatedTablaFinal[rowIndex].riesgoNumerico = matchingData.VAL_RIESGO;
        setTablaFinal(updatedTablaFinal);
      }
    };

    const getTextColor = (riesgo) => {
      switch (riesgo) {
        case 'Despreciable':
          return 'gray';
        case 'Bajo':
          return 'green';
        case 'Medio':
          return '#FFC133';
        case 'Alto':
          return 'orange';
        case 'Muy Alto':
          return 'red';
        case 'Daño Extremo':
          return 'red';
        default:
          return 'inherit';
      }
    };


    return (
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center"><b>Amenaza</b></TableCell>
                  <TableCell align="center"><b>Impacto</b></TableCell>
                  <TableCell align="center"><b>Costo</b></TableCell>
                  <TableCell align="center"><b>Frecuencia</b></TableCell>
                  <TableCell align="center"><b>Riesgo</b></TableCell>
                  <TableCell align="center"><b>Valor del Riesgo</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {tablaFinal.map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    <TableCell>{row.amenaza}</TableCell>
                    <TableCell>{row.promedio}</TableCell>
                    <TableCell>{row.costo}</TableCell>
                    <TableCell>
                      <Select
                        options={frecuenciaOptions}
                        value={handleFrecuenciaChange.frecuencia}
                        onChange={(selectedValue) => handleFrecuenciaChange(selectedValue.value, rowIndex)}
                      >
                      </Select>
                    </TableCell>
                    <TableCell><b style={{ color: getTextColor(row.riesgo) }}>{row.riesgo}</b></TableCell>
                    <TableCell><b style={{ color: getTextColor(row.riesgo) }}>{row.riesgoNumerico}</b></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

          </TableContainer>
        </Grid>
      </Grid>

    );
  };



  const [activeStep, setActiveStep] = useState(0);

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  return (
    <React.Fragment>
      <AppBar
        position="absolute"
        color="default"
        elevation={0}
        sx={{
          position: "relative",
          borderBottom: (t) => `1px solid ${t.palette.divider}`,
        }}
      />
      <Container component="main" maxWidth="xl" sx={{ mb: 4 }}>
        <Paper
          variant="outlined"
          sx={{ my: { xs: 3, md: 6 }, p: { xs: 2, md: 3 } }}
        >
          <Stepper activeStep={activeStep} sx={{ pt: 3, pb: 5 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <React.Fragment>
              <Typography variant="h5" gutterBottom>
                Gracias.
              </Typography>
              <Typography variant="subtitle1">
                Gracias por usar AvarCiber.
              </Typography>
            </React.Fragment>
          ) : (
            <React.Fragment>
              {getStepContent(activeStep)}
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>

              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </React.Fragment>
  );
};