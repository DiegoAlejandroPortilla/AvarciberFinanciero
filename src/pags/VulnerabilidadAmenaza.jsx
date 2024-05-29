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
import { Vulnerabilidades } from "./Medicion";
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

export const VulnerabilidadAmenaza = () => {
  const steps = [
    "Asociar Vulnerabilidades a Amenazas",
  ];

  function getStepContent(step) {
    switch (step) {
      case 0:
        return <SeleccionarAmenaza onRowsUpdate={handleActualizacion} />;
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
  const SeleccionarAmenaza = () => {
    const [tableData, setTableData] = useState([]);
    const [activos, setActivos] = useState([]);
    const [vulnerabilidades, setVulnerabilidades] = useState([]);
    const [guardarPressed, setGuardarPressed] = useState(false);
    const [amenazas, setAmenazas] = useState([]);
    const [showAddVulnerabilidadButtons, setShowAddVulnerabilidadButtons] = useState([]);
    const [showAddActivoButton, setShowAddActivoButton] = useState(true);
    const [vulnerabilidadSeleccionada, setVulnerabilidadSeleccionada] = useState([]);
    const [frecuenciaOptions] = useState([
      { label: 'Muy Baja', value: 'Muy Baja' },
      { label: 'Baja', value: 'Baja' },
      { label: 'Media', value: 'Media' },
      { label: 'Alta', value: 'Alta' },
      { label: 'Muy Alta', value: 'Muy Alta' },
    ]);
    useEffect(() => {
      async function fetchData() {
        try {
          handleAddRow();
          const activosResponse = await axios.get("https://savarciber-production.up.railway.app/api/activos");
          setActivos(
            activosResponse.data.map((item) => ({
              value: item.ACT_CODIGO,
              label: item.ACT_NOMBRE,
            }))
          );

          const vulnerabilidadesResponse = await axios.get("https://savarciber-production.up.railway.app/api/vulnerabilidades");
          setVulnerabilidades(
            vulnerabilidadesResponse.data.map((item) => ({
              value: item.VUL_CODIGO,
              label: item.VUL_NOMBRE,
            }))
          );

          const amenazasResponse = await axios.get("https://savarciber-production.up.railway.app/api/amenazas");
          setAmenazas(
            amenazasResponse.data.map((item) => ({
              value: item.AME_CODIGO,
              label: item.AME_NOMBRE,
            }))
          );
        } catch (error) {
          console.log(error);
        }
      }
      fetchData();
    }, []);

    const handleAddRow = () => {
      setTableData((prevData) => [
        ...prevData,
        { activo: null, vulnerabilidades: [] },
      ]);
      setShowAddVulnerabilidadButtons((prevButtons) => [...prevButtons, true]);
      setVulnerabilidadSeleccionada((prevSelected) => [...prevSelected, false]);
    };

    const handleVulnerabilidadSelect = (index, selected) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[index].vulnerabilidades.push({
          vulnerabilidad: selected,
          amenaza: null,
          frecuencia: null,
        });
        return newData;
      });

      setShowAddVulnerabilidadButtons((prevButtons) => {
        const newButtons = [...prevButtons];
        newButtons[index] = false;
        return newButtons;
      });

      setShowAddActivoButton(false);
      setVulnerabilidadSeleccionada((prevSelected) => {
        const newSelected = [...prevSelected];
        newSelected[index] = true;
        return newSelected;
      });
    };

    const handleAgregarAmenaza = (rowIndex) => {
      const selectedVulnerabilidad = tableData[rowIndex].vulnerabilidades[0]?.vulnerabilidad;

      if (!selectedVulnerabilidad) {
        alert("Debe seleccionar una vulnerabilidad antes de agregar amenazas.");
        return;
      }

      setTableData((prevData) => {
        const newData = [...prevData];
        const newVulnerabilidades = [...newData[rowIndex].vulnerabilidades]; // Create a new array

        newVulnerabilidades.push({
          vulnerabilidad: selectedVulnerabilidad,
          amenaza: null,
          frecuencia: null,
        });

        newData[rowIndex] = {
          ...newData[rowIndex],
          vulnerabilidades: newVulnerabilidades,
        };

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
          frecuencia: null,
        });
        return newData;
      });

      setShowAddVulnerabilidadButtons((prevButtons) => {
        const newButtons = [...prevButtons];
        newButtons[rowIndex] = true;
        return newButtons;
      });

      setShowAddActivoButton(false);
    };

    const handleAmenazaSelect = (rowIndex, vulIndex, selected) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex].vulnerabilidades[vulIndex].amenaza = selected;
        return newData;
      });
    };

    const handleEliminarVulnerabilidad = (rowIndex, vulIndex) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex].vulnerabilidades.splice(vulIndex, 1);
        return newData;
      });
    };

    const handleInputChange = (rowIndex, vulIndex, field, value) => {
      setTableData((prevData) => {
        const newData = [...prevData];
        newData[rowIndex].vulnerabilidades[vulIndex][field] = value;
        return newData;
      });
    };

    const handleCancelarProceso = () => {
      // Utiliza el objeto history para retroceder una página
      window.history.back();
    
      // Puedes devolver un valor aquí si es necesario
      return "Proceso cancelado";
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
        if (!rowData.vulnerabilidades) {
          alert("Debe seleccionar una vulnerabilidad.");
          return;
        }
    
        for (const vul of rowData.vulnerabilidades) {
          if (
            !vul.vulnerabilidad ||
            !vul.vulnerabilidad.value ||
            !vul.amenaza ||
            !vul.amenaza.value ||
            !vul.frecuencia ||
            vul.frecuencia === ""
          ) {
            alert("Por favor, complete todos los campos antes de guardar.");
            console.log("Invalid data found. Skipping.");
            console.log("rowData:", rowData);
            console.log("vul:", vul);
            return; // Detener la función si hay campos vacíos
          }
        }
      }
    
      console.log(tableData);
      await saveDataAmenaza();
      setGuardarPressed(true);
      alert("Se guardó la vulnerabilidad con éxito.");
      window.history.back();
    };
    

    const handleEliminarAmenaza = (rowIndex) => {
      const confirmDelete = window.confirm(
        "¿Está seguro de que desea eliminar esta amenaza?"
      );
    
      if (confirmDelete) {
        setTableData((prevData) => {
          const newData = [...prevData];
    
          // Verifica si hay más de una amenaza antes de permitir la eliminación
          if (newData[rowIndex].vulnerabilidades.length > 1) {
            newData[rowIndex].vulnerabilidades = newData[rowIndex].vulnerabilidades.filter((_, index) => index !== rowIndex);
          } else {
            alert("No puede eliminar la única amenaza. Debe haber al menos una amenaza.");
          }
    
          return newData;
        });
      }
    };
    
    

    const saveDataAmenaza = async () => {
      try {
        const dataToSend = [];

        for (const rowData of tableData) {
          if (!rowData.vulnerabilidades.every(vul =>
            vul.vulnerabilidad && vul.amenaza !== ""
          )) {
            continue; // Skip invalid data
          }

          for (const vul of rowData.vulnerabilidades) {
            if (!vul.vulnerabilidad || !vul.amenaza) {
              console.log("Invalid data found in inner loop. Skipping.");
              console.log("vul.vulnerabilidad:", vul.vulnerabilidad);
              console.log("vul.amenaza:", vul.amenaza);
              continue; // Skip invalid data in inner loop
            }

            const data = {
              VUL_CODIGO: vul.vulnerabilidad.value,
              AME_CODIGO: vul.amenaza.value,
              AMV_PROBABILIDAD: vul.frecuencia,
              AMV_FECHA_INICION: new Date().toISOString().slice(0, 19).replace('T', ' '),
              AMV_FECHA_INACTIVIDAD: null,
              AMV_VALOR_DANO_PROMEDIO: null,
            };

            console.log("Valid data found. Adding to dataToSend:", data);

            dataToSend.push(data);
          }
        }

        if (dataToSend.length === 0) {
          console.log("No valid data to send.");
          return;
        }

        console.log("Data being sent to API:", dataToSend);

        for (const data of dataToSend) {
          await axios.post("https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades", data);
        }
      } catch (error) {
        console.error("Error saving data:", error);
      }
    };



    const marcasDeslizador = [];
    for (let i = 1; i <= 10; i++) {
      marcasDeslizador.push({
        value: i,
        label: String(i),
      });
    }

    return (
      <Box>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Typography variant="subtitle1" fontWeight="bold">
                  Vulnerabilidad
                </Typography>
              </TableCell>
              <TableCell>

              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row, rowIndex) => (
              <TableRow key={rowIndex}>
                <TableCell>
                  <Select
                    value={row.vulnerabilidades[0]?.vulnerabilidad}
                    options={vulnerabilidades}
                    onChange={(selected) => handleVulnerabilidadSelect(rowIndex, selected)}
                    placeholder="Seleccione una Vulnerabilidad"
                    isDisabled={!showAddVulnerabilidadButtons[rowIndex]}
                  />
                </TableCell>
                <TableCell colSpan={2}>
                  {row.vulnerabilidades && row.vulnerabilidades.map((vul, vulIndex) => (
                    <Box
                      key={vulIndex}
                      display="flex"
                      flexDirection="column"
                      sx={{ marginBottom: "16px" }}
                    >
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Amenaza</Typography>
                      <Select
                        value={vul.amenaza}
                        options={amenazas}
                        onChange={(selected) => handleAmenazaSelect(rowIndex, vulIndex, selected)}
                        placeholder="Seleccione una Amenaza"
                      />
                      <Typography variant="subtitle1" fontWeight="bold" marginTop="10px" marginBottom="10px">Frecuencia</Typography>
                      <Select
                        options={frecuenciaOptions}
                        value={frecuenciaOptions.find((option) => option.value === vul.frecuencia)}
                        onChange={(selectedValue) => handleInputChange(rowIndex, vulIndex, "frecuencia", selectedValue.value)}
                        placeholder="Seleccione una Frecuencia"
                      />
                      <br />
                      <Box
                        display="flex"
                        flexDirection="row" // Alineación horizontal
                        alignItems="center" // Opcional, para centrar verticalmente
                        justifyContent="space-between" // Espacio entre los botones
                        width="100%" // Asegura que los botones ocupen todo el ancho
                      >
                        <Button
                          variant="contained"
                          onClick={() => handleAgregarAmenaza(rowIndex)}
                          sx={{ width: "100%" }}
                        >
                          Agregar Amenaza
                        </Button>

                        <Button
                          variant="contained"
                          color="error"
                          onClick={() => handleEliminarAmenaza(rowIndex)}
                          sx={{ width: "100%" }}
                        >
                          Eliminar Amenaza
                        </Button>
                      </Box>
                    </Box>
                  ))}
                  <Box display="flex" sx={{ marginBottom: "8px" }}>
                    {vulnerabilidadSeleccionada[rowIndex] && (
                      <>

                        <Button
                          startIcon={<SaveIcon />}
                          color="success"
                          variant="contained"
                          onClick={handleGuardarClick}
                          sx={{ width: "100%", marginRight: "1px" }}
                        >
                          Guardar
                        </Button>
                      </>
                    )}
                  </Box>
                  <Box display="flex" sx={{ marginBottom: "8px" }}>

                    <Button
                      variant="contained"
                      color="error"
                      onClick={handleCancelarProceso}
                      sx={{ width: "100%", marginRight: "1px" }}
                    >
                      Cancelar
                    </Button>
                    <br />

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
                {activeStep !== 0 && (
                  <Button onClick={handleBack} sx={{ mt: 3, ml: 1 }}>
                    Regresar
                  </Button>
                )}

              </Box>
            </React.Fragment>
          )}
        </Paper>
      </Container>
    </React.Fragment>
  );

}