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
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import SearchIcon from '@mui/icons-material/Search';
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import SaveIcon from "@mui/icons-material/Save";
import es from "date-fns/locale/es";
import moment from 'moment-timezone';
import FunctionsIcon from '@mui/icons-material/Functions';
import Select from "react-select";
import { ScatterChart, CartesianGrid, XAxis, YAxis, Tooltip, Scatter, Cell, LabelList, Dot, Bar } from 'recharts';
import { useWindowSize } from 'react-use';
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
    Tab,
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

export const Riesgo = () => {
    const steps = [
        "Seleccionar Activos",
        "Visualizacion",
        "Calculo de Probabilidad"
    ];

    function getStepContent(step) {
        switch (step) {
            case 0:
                return <SeleccionarActivo onRowsUpdate={handleActualizacion} />;
            case 1:
                return <TablaAmenaza selectedIds={selectedIds} selectedDates={selectedDates} />;
            case 2:
                return <TablaResultado selectedIds={selectedIds} selectedDates={selectedDates} />;
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

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedDates, setSelectedDates] = useState([]);
    const [guardado, setGuardado] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);


    const SeleccionarActivo = () => {
        const [tableData, setTableData] = useState([]);
        const [activos, setActivos] = useState([]);
        const [vulnerabilidades, setVulnerabilidades] = useState([]);
        const [guardarPressed, setGuardarPressed] = useState(false);
        const [amenazas, setAmenazas] = useState([]);
        const [deslizador1, setDeslizador1] = useState(1);
        const [deslizador2, setDeslizador2] = useState(1);
        const [deslizador3, setDeslizador3] = useState(1);
        const [lista, setLista] = useState([]);
        const [lista2, setLista2] = useState([]);
        const [selectedDate, setSelectedDate] = useState(new Date());
        const [columns, setColumns] = useState({
            Activos: {
                id: "Activos",
                list: [],
            },
            Escoger: {
                id: "Escoger",
                list: [],
            },
        });

        const [activosFiltrados, setActivosFiltrados] = useState([]);



        const onRowsUpdate = (filasActualizadas) => {
            setTableData(filasActualizadas);
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

        const marcasDeslizador = [];
        for (let i = 1; i <= 10; i++) {
            marcasDeslizador.push({
                value: i,
                label: String(i),
            });
        }

        const areDatesEqual = (date1, date2) => {
            const withoutTime1 = new Date(date1);
            const withoutTime2 = new Date(date2);
            withoutTime1.setHours(0, 0, 0, 0);
            withoutTime2.setHours(0, 0, 0, 0);
            return withoutTime1.getTime() === withoutTime2.getTime();
        };

        const handleDateChange = async (date) => {
            setSelectedDate(date);

            try {
                const response = await axios.get("https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades/agrupacion/1");

                // Filtrar activos por el rango de fechas del día seleccionado
                const activosPorFecha = response.data.filter((item) => {
                    return areDatesEqual(item.VAC_FECHA_INICIO, date);
                });

                console.log(`Activos for date ${date.toDateString()}:`, activosPorFecha);

                setActivosFiltrados(activosPorFecha);

                // Actualizar la lista de activos en la columna correspondiente
                setColumns((prevColumns) => ({
                    ...prevColumns,
                    Activos: {
                        ...prevColumns.Activos,
                        list: activosPorFecha.map((activo) => activo.ACT_NOMBRE),
                    },
                }));
            } catch (error) {
                console.log("Error fetching data:", error);
            }
        };

        useEffect(() => {
            async function getLista() {
                try {
                    const response = await axios.get("https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades/agrupacion/1");
                    setLista(response.data);
                    const newData = response.data.map((item) => item.ACT_NOMBRE);
                    setColumns({
                        Activos: {
                            id: "Activos",
                            list: [],
                        },
                        Escoger: {
                            id: "Escoger",
                            list: [],
                        },
                    });
                } catch (error) {
                    console.log("Error fetching data:", error);
                }
            }
            getLista();
        }, []);



        const onDragEnd = ({ source, destination }) => {
            // Make sure we have a valid destination
            if (!destination) return;

            // Make sure we're actually moving the item
            if (
                source.droppableId === destination.droppableId &&
                destination.index === source.index
            )
                return;

            // Set start and end variables
            const start = columns[source.droppableId];
            const end = columns[destination.droppableId];

            if (end.id === "Escoger") {
                const transferredText = start.list[source.index];
                const matchingItem = activosFiltrados.find(item => item.ACT_NOMBRE === transferredText);

                if (matchingItem) {
                    console.log(`Transferring text "${transferredText}" with Act_Codigo and Fecha: ${matchingItem.Act_Codigo}, ${matchingItem.FechaInicio}`);
                    setLista2(prevLista2 => {
                        console.log('Previous lista2:', prevLista2);
                        const updatedLista2 = [...prevLista2, matchingItem.ACT_CODIGO, matchingItem.VAC_FECHA_INICIO];
                        console.log('Updated lista2:', updatedLista2);
                        return updatedLista2;
                    });
                } else {
                    console.log(`No matching item found for text "${transferredText}"`);
                }
            } else if (end.id === "Activos") {
                const transferredText = start.list[source.index];
                const matchingItem = lista.find(item => item.ACT_NOMBRE === transferredText);
                if (matchingItem) {
                    console.log(`Transferring back text "${transferredText}" with Act_Codigo and Fecha: ${matchingItem.ACT_NOMBRE},${matchingItem.VAC_FECHA_INICIO}`);
                    setLista2(prevLista2 => prevLista2.filter(item => item !== matchingItem.ACT_CODIGO && item !== matchingItem.VAC_FECHA_INICIO));
                } else {
                    console.log(`No matching item found for text "${transferredText}"`);
                }
            }
            // If start is the same as end, we're in the same column
            if (start === end) {
                // Move the item within the list
                // Start by making a new list without the dragged item
                const newList = start.list.filter((_, idx) => idx !== source.index);

                // Then insert the item at the right location
                newList.splice(destination.index, 0, start.list[source.index]);

                // Then create a new copy of the column object
                const newCol = {
                    id: start.id,
                    list: newList,
                };

                // Update the state
                setColumns((state) => ({ ...state, [newCol.id]: newCol }));
            } else {
                // If start is different from end, we need to update multiple columns
                // Filter the start list like before
                const newStartList = start.list.filter((_, idx) => idx !== source.index);

                // Create a new start column
                const newStartCol = {
                    id: start.id,
                    list: newStartList,
                };

                // Make a new end list array
                const newEndList = end.list.slice();

                // Insert the item into the end list
                newEndList.splice(destination.index, 0, start.list[source.index]);

                // Create a new end column
                const newEndCol = {
                    id: end.id,
                    list: newEndList,
                };

                // Update the state
                setColumns((state) => ({
                    ...state,
                    [newStartCol.id]: newStartCol,
                    [newEndCol.id]: newEndCol,
                }));
            }
        };


        const handleEnviarClick = async () => {
            if (activosFiltrados.length === 0) {
                console.log('No existen activos con esa fecha.');
                // Mostrar el popup de que no existen activos con esa fecha
                return { error: 'No existen activos con esa fecha.' };
            }

            if (lista2.length === 0) {
                console.log('Lista2 está vacía.');
                // Puedes mostrar un mensaje o realizar otra acción si la lista2 está vacía
                return { error: 'Lista2 está vacía.' };
            }

            // Obtener los IDs de la lista2
            const tempSelectedIds = lista2.slice();

            const tempSelectedDates = activosFiltrados.map(item => item.VAC_FECHA_INICIO);

            // Actualizar selectedIds y selectedDates
            setSelectedIds(tempSelectedIds);
            setSelectedDates(tempSelectedDates); // Add this state variable

            // Puedes utilizar los arrays `tempSelectedIds` y `tempSelectedDates` según tus necesidades
            console.log('Lista2:', lista2);
            console.log('IDs seleccionadas en seleccionarActivos:', tempSelectedIds);
            console.log('Fechas seleccionadas en seleccionarActivos:', tempSelectedDates);

            // Devuelve información adicional si es necesario
            return { selectedIds: tempSelectedIds, selectedDates: tempSelectedDates, filasActualizadas: [] };
        };



        return (
            <Box>
                <Typography variant="subtitle1">Seleccione la fecha:</Typography>
                <Box display="flex" alignItems="center" marginRight={10}>
                    <DatePicker
                        selected={selectedDate}
                        onChange={handleDateChange}
                        dateFormat="dd/MM/yyyy"
                        isClearable
                        showYearDropdown
                        showMonthDropdown
                        locale={es}
                    />
                </Box>
                <DragDropContext onDragEnd={onDragEnd}>
                    <StyledColumns>
                        <Column col={columns.Activos} />
                        <Column col={columns.Escoger} />
                    </StyledColumns>
                    <Button
                        startIcon={<SaveIcon />}
                        onClick={() => handleEnviarClick()}
                        color="success"
                        variant="outlined"
                    >
                        Guardar
                    </Button>
                </DragDropContext>
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

    const TablaAmenaza = (selectedIds, selectedDates) => {
        const [tableData, setTableData] = useState([]);


        const formatDate = (dateString, timeZone) => {
            const date = moment.utc(dateString).tz(timeZone);
            const formattedDate = date.format('YYYY-MM-DD');
            return formattedDate;
        };


        useEffect(() => {
            const fetchData = async () => {
                try {
                    console.log("Estos son los IDS de Tabla Resultados:", selectedIds);

                    const idsArray = selectedIds.selectedIds;

                    console.log("Estos son los IDS transformados:", idsArray);

                    // Array para almacenar las respuestas de cada solicitud
                    const allData = [];

                    // Modifica el bucle para incrementar en 2 en cada iteración
                    for (let i = 0; i < idsArray.length; i += 2) {
                        const currentId = idsArray[i];
                        let currentDate = idsArray[i + 1];

                        currentDate = currentDate.split('T')[0];
                        // Agrega el console.log aquí
                        console.log(`Solicitando datos para id: ${currentId}, fecha: ${currentDate}`);

                        try {
                            const activoVulnerabilidadResponse = await axios.get(
                                `https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades/tabla/${currentId}/${currentDate}`
                            );

                            console.log("Respuesta de la API:", activoVulnerabilidadResponse.data);

                            const mappedData = activoVulnerabilidadResponse.data.map((item) => ({
                                amenaza: item.AME_NOMBRE,
                                vulnerabilidad: item.VUL_NOMBRE,
                                activo: item.ACT_NOMBRE,
                                promedio: parseFloat(item.PromedioGrupo).toFixed(3),
                                costo: item.VAC_COSTO,
                                fecha: formatDate(item.VAC_FECHA_INICIO, 'America/Bogota'), // Corregir la forma de acceder a la fecha
                            }));
                            console.log("Datos mapeados:", mappedData);

                            // Acumula los datos en el array allData
                            allData.push(...mappedData);

                        } catch (error) {
                            console.error("Error en la solicitud a la API:", error);
                            // Si hay un error, podrías manejarlo de alguna manera, por ejemplo, marcando el ítem como no disponible en la tabla
                        }
                    }

                    // Después de completar todas las solicitudes, actualiza el estado con todos los datos acumulados
                    setTableData(allData);

                } catch (error) {
                    console.error("Error general:", error);
                }
            };

            fetchData();
        }, [selectedIds]);

        return (
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <TableContainer component={Paper}>
                        <Table>
                            <TableHead>
                                <TableRow>
                                    <TableCell align="center">Amenaza</TableCell>
                                    <TableCell align="center">Vulnerabilidad</TableCell>
                                    <TableCell align="center">Activo</TableCell>
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
                                        <TableCell>{row.activo}</TableCell>
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


    const TablaResultado = (selectedIds, selectedDates) => {
        const [tablaFinal, setTablaFinal] = useState([]);
        const [frecuenciaOptions] = useState([
            { label: 'Muy Baja', value: 'Muy Baja' },
            { label: 'Baja', value: 'Baja' },
            { label: 'Media', value: 'Media' },
            { label: 'Alta', value: 'Alta' },
            { label: 'Muy Alta', value: 'Muy Alta' },
        ]);
        const { width } = useWindowSize();
        const [riesgoData, setRiesgoData] = useState([]);
        const [data, setData] = useState([]);
        const riesgoOrder = ['Despreciable', 'Bajo', 'Medio', 'Alto', 'Muy Alto', 'Daño Extremo'];

        const sortedTablaFinal = [...tablaFinal].sort((a, b) => riesgoOrder.indexOf(a.riesgo) - riesgoOrder.indexOf(b.riesgo));
        const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

        useEffect(() => {
            async function fetchData() {
                try {
                    console.log("Estos son los IDS de Tabla Resultados:", selectedIds);

                    const idsArray = selectedIds.selectedIds;

                    console.log("Estos son los IDS transformados:", idsArray);

                    // Array para almacenar las respuestas de cada solicitud
                    const responses = [];

                    // Modifica el bucle para incrementar en 2 en cada iteración
                    for (let i = 0; i < idsArray.length; i += 2) {
                        const currentId = idsArray[i];
                        let currentDate = idsArray[i + 1];

                        currentDate = currentDate.split('T')[0];
                        // Agrega el console.log aquí
                        console.log(`Solicitando datos para id: ${currentId}, fecha: ${currentDate}`);

                        try {
                            const activoVulnerabilidadResponse = await axios.get(
                                `https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades/tabla/${currentId}/${currentDate}`
                            );

                            console.log("Datos de TablaResult:", activoVulnerabilidadResponse.data);
                            // Mapeo de datos para el ID actual
                            const mappedData = activoVulnerabilidadResponse.data.map((item) => ({
                                amenaza: item.AME_NOMBRE,
                                promedio: item.PromedioGrupoPorAmenaza,
                                costo: Number(item.VAC_COSTO),
                                frecuencia1: item.AMV_PROBABILIDAD,
                                frecuencia: '', // Initialize frecuencia as an empty string
                                riesgo: '', // Initialize riesgo as an empty string
                                riesgoNumerico: 0
                            }));

                            responses.push(mappedData);
                        } catch (error) {
                            console.error(error);
                        }
                    }

                    // Combine data for all IDs
                    const combinedData = responses.flat();

                    // Group data by amenaza
                    const groupedData = combinedData.reduce((acc, item) => {
                        const { amenaza, promedio, costo, frecuencia1 } = item; // Agregar frecuencia1 aquí
                        if (!acc[amenaza]) {
                            acc[amenaza] = { amenaza, promedios: [promedio], costos: [costo], frecuencia1 }; // Incluir frecuencia1
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
                        return { amenaza: group.amenaza, frecuencia1: group.frecuencia1, promedio: promedioMedia, costo: costoTotal };
                    });


                    setTablaFinal(calculatedData);

                    const riesgoResponse = await axios.get('https://savarciber-production.up.railway.app/api/amenazasvulnerabilidades/rangos');

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
        }, [selectedIds]);


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


        const handleCalculoAutomatico = () => {
            setTablaFinal((prevTablaFinal) => {
                const updatedTablaFinal = prevTablaFinal.map((row) => {
                    const promedio = row.promedio;

                    console.log(`Procesando amenaza ${row.amenaza}`);
                    console.log(`row.frecuencia1: ${row.frecuencia1}, promedio: ${promedio}`);

                    const closestMatchingDataList = riesgoData.reduce((closestList, data) => {
                        const diffFrecuencia = Math.abs(frecuenciaOptions.findIndex(opt => opt.value === data.VA_FRECUENCIA) - frecuenciaOptions.findIndex(opt => opt.value === row.frecuencia1));
                        const diffPromedio = Math.abs(data.VAL_IMPACTO - promedio);
                        const distance = Math.sqrt(diffFrecuencia ** 2 + diffPromedio ** 2);

                        if (distance < 1) {
                            closestList.push({ data, distance });
                        }

                        return closestList;
                    }, []);

                    if (closestMatchingDataList.length > 0) {
                        // Ordenar la lista de coincidencias por distancia y tomar la primera
                        closestMatchingDataList.sort((a, b) => a.distance - b.distance);
                        const closestMatchingData = closestMatchingDataList[0];

                        console.log(`Actualizando fila para amenaza ${row.amenaza}`);
                        return {
                            ...row,
                            frecuencia: closestMatchingData.data.VA_FRECUENCIA,
                            riesgo: closestMatchingData.data.VA_IMPACTO,
                            riesgoNumerico: closestMatchingData.data.VAL_RIESGO,
                        };
                    } else {
                        console.log(`No se encontraron datos coincidentes para amenaza ${row.amenaza}`);
                        return row;
                    }
                });
                const updatedChartData = mapRiskToChartData(updatedTablaFinal);
                setData(updatedChartData);
                const sortedChartData = updatedChartData.sort((a, b) => riesgoOrder.indexOf(a.x) - riesgoOrder.indexOf(b.x));

                setData(sortedChartData);



                console.log("Datos grafica:", updatedChartData);

                console.log("Tabla Final Actualizada:", updatedTablaFinal);

                return updatedTablaFinal;
            });
        };
        const CustomDot = (props) => {
            const { cx, cy, payload, fill } = props;

            // Get the risk category
            const riesgo = payload.x;

            // Set the background color based on the riesgo
            const backgroundColor = getTextColor(riesgo);

            return (
                <Dot
                    cx={cx}
                    cy={cy}
                    fill={backgroundColor}
                    r={4}  // Adjust the radius as needed
                    strokeWidth={2}  // Adjust the stroke width as needed
                    stroke="#fff"  // Adjust the stroke color as needed
                />
            );
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
        const mapRiskToChartData = (tablaFinal) => {
            return tablaFinal.map((row) => {
                const xValue = row.riesgo; // Use the risk category as the X-axis value
                const yValue = row.riesgoNumerico;

                return {
                    x: xValue,
                    y: yValue,
                    amenaza: row.amenaza, // Include the amenaza property
                    costo: row.costo, // Include the costo property
                };
            });
        };


        // Define a function to convert riesgo to a numeric value
        const convertRiesgoToNumeric = (riesgo) => {
            switch (riesgo) {
                case 'Despreciable':
                    return 0;
                case 'Bajo':
                    return 1;
                case 'Medio':
                    return 2;
                case 'Alto':
                    return 3;
                case 'Muy Alto':
                    return 4;
                case 'Daño Extremo':
                    return 5;
                default:
                    return 0;
            }
        };

        const renderTooltipContent = (props) => {
            const { payload } = props;

            if (payload && payload.length > 0) {
                // Obtén el costo del payload
                const costo = payload[0].payload.costo;
                const xValue = payload[1].value;

                return (
                    <div>
                        {/* Puedes personalizar la apariencia del contenido aquí */}
                        <p>Costo: {costo}</p>
                        <p>Valor del Riesgo: {xValue}</p>

                    </div>
                );
            }

            return null;
        };

        return (
            <Grid container spacing={2}>
                <Grid item xs={12} container justifyContent="flex-end">
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<FunctionsIcon />}
                        onClick={handleCalculoAutomatico}
                        style={{ marginTop: '10px' }}
                    >
                        Realizar Cálculo
                    </Button>
                </Grid>
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
                                {sortedTablaFinal.map((row, rowIndex) => (
                                    <TableRow key={rowIndex}>
                                        <TableCell>{row.amenaza}</TableCell>
                                        <TableCell>{row.promedio}</TableCell>
                                        <TableCell>{row.costo}</TableCell>
                                        <TableCell align="center">{row.frecuencia1}</TableCell>
                                        {/*<TableCell>
                                            <Select
                                                options={frecuenciaOptions}
                                                value={handleFrecuenciaChange.frecuencia}
                                                onChange={(selectedValue) => handleFrecuenciaChange(selectedValue.value, rowIndex)}
                                                isSearchable={false}
                                                styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                                                menuPortalTarget={document.body}
                                            >
                                </Select>
                                </TableCell>*/}
                                        <TableCell align="center"><b style={{ color: getTextColor(row.riesgo) }}>{row.riesgo}</b></TableCell>
                                        <TableCell align="center"><b style={{ color: getTextColor(row.riesgo) }}>{row.riesgoNumerico}</b></TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <TableCell>
                        <Typography variant="subtitle1" fontWeight="bold">
                            Grafica del Riesgo
                        </Typography>
                    </TableCell>
                    <ScatterChart
                        width={width && width < 600 ? '100%' : 950}  // Ajusta según el ancho de la ventana
                        height={400}
                        margin={{ top: 50, right: 20, bottom: 20, left: 50 }}
                        style={{ margin: '0 auto' }}
                    >
                        <CartesianGrid />
                        <YAxis type="number" dataKey="y" name="Valor del Riesgo" domain={[0, 10]} />
                        <XAxis type="category" dataKey="x" name="Riesgo" ticks={['Despreciable', 'Muy Bajo', 'Bajo', 'Medio', 'Alto', 'Muy Alto', 'Daño Extremo']} />
                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={(props) => renderTooltipContent(props)} />
                        <Scatter name="A school" data={data} scatterRadius={1000}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={getTextColor(entry.x)} />
                            ))}
                            {/* Custom label for amenaza */}
                            <LabelList
                                dataKey="amenaza"  // Use the amenaza property
                                position="top"  // Adjust position as needed (top, left, right, bottom)
                                fill="#000"
                                fontSize="10" // Adjust text color as needed
                            />
                        </Scatter>
                    </ScatterChart>
                </Grid>
            </Grid >

        );
    };

    const refrescarPagina = () => {
        // Guardar información de la sesión antes de recargar la página
        const isLoggedIn = true; // Puedes ajustar esto según tu lógica de autenticación
        sessionStorage.setItem('isLoggedIn', isLoggedIn);

        // Recargar la página actual
        window.location.reload();

        // Puedes devolver un valor aquí si es necesario
        return "Página refrescada";
    };

    // Verificar el estado de la sesión al cargar la página
    window.onload = () => {
        const isLoggedIn = sessionStorage.getItem('isLoggedIn') === 'true';

        // Puedes usar la variable isLoggedIn para realizar acciones según el estado de la sesión
        if (isLoggedIn) {
            // El usuario está autenticado, realiza las acciones necesarias
            console.log("Usuario autenticado");
        } else {
            // El usuario no está autenticado, realiza las acciones necesarias
            console.log("Usuario no autenticado");
        }
    };

    useEffect(() => {
        const isLoggedInStored = sessionStorage.getItem('isLoggedIn') === 'true';
        setIsLoggedIn(isLoggedInStored);
    }, []);

   const [activeStep, setActiveStep] = useState(0);

    const handleNext = () => {
        setActiveStep(activeStep + 1);
        if (activeStep === steps.length - 1) {
            // Last step, pass selectedIds to TablaResultado
            setRows(selectedIds);
            setRows(selectedDates); // Set rows state if needed
        }
        if (activeStep === steps.length - 2) {
            // Second to last step, pass selectedDates to TablaResultado
            setRows(selectedIds);
            setRows(selectedDates);
        }
    };

    const handleBack = () => {
        setActiveStep(activeStep - 1);
        if (activeStep === steps.length - 1) {
            console.log("TablaAmenaza");
        }
        if (activeStep === steps.length - 2) {
            const isLoggedIn = true; // Puedes ajustar esto según tu lógica de autenticación
            setIsLoggedIn(isLoggedIn);
        }
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
                                <Button
                                    variant="contained"
                                    onClick={handleNext}
                                    sx={{ mt: 3, ml: 1 }}
                                    disabled={activeStep === steps.length - 1}
                                >
                                    {activeStep === steps.length - 1 ? "Confirmar" : "Siguiente"}
                                </Button>
                            </Box>
                        </React.Fragment>
                    )}
                </Paper>
            </Container>
        </React.Fragment>
    );
};