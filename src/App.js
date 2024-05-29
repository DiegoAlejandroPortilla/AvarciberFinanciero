import React from "react";
import Sidebar from "./componentes/Sidebar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Unidades, TipoDeActivos, TipoDeVulnerabilidades, TipoDeAmenazas, DimDeVal, DimensionValoracion, Probabilidades } from "./pags/Parametrizacion";
import { Activos, Vulnerabilidades, Amenazas } from "./pags/Medicion";
import { Activos as Act, ValDeImpac } from "./pags/Activos";
import { AmenazasPVul } from "./pags/Vulnerabilidades";
import { Gestionar } from "./pags/Gestionar";
import { Edit } from "./pags/Edit";
import { Riesgo } from "./pags/Riesgo";
import { Graficos } from "./pags/Graficos";
import RegisterPage from "./pages/Register2";
import LoginPage from "./pages/LoginPage";
import { AuthProvider } from "./context/AuthContext";
import ProfilePage from "./pages/ProfilePage";
import { ProtectedRoute } from "./ProtectedRoute";
import { VulnerabilidadAmenaza } from "./pags/VulnerabilidadAmenaza";
import Inicio from "./pages/Inicio";
import {AuthWrapper} from "./AuthWrapper.jsx"
function App() {
  const unusedVariable = 'some value';
  return (
    <AuthProvider>
      <Router>
        <Sidebar />
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />

            <Route path="/inicio/general" element={<Inicio />} />

            <Route path="/parametrizacion/unidades" element={<Unidades />} />
            <Route path="/parametrizacion/tipo-de-activos" element={<TipoDeActivos />} />
            <Route path="/parametrizacion/tipo-de-vulnerabilidades" element={<TipoDeVulnerabilidades />} />
            <Route path="/parametrizacion/tipo-de-amenazas" element={<TipoDeAmenazas />} />
            <Route path="/parametrizacion/dimensiones-de-valoracion" element={<DimensionValoracion />} />
            <Route path="/parametrizacion/probabilidades" element={<Probabilidades />} />
            <Route path="/parametrizacion/amenazas" element={<Amenazas />} />
            <Route path="/parametrizacion/vulnerabilidades" element={<Vulnerabilidades />} />

            <Route path="/medicion/activos" element={<Activos />} />
            <Route path="/medicion/valor-de-impacto" element={<ValDeImpac />} />
            <Route path="/medicion/amenazas-por-vulnerabilidad" element={<AmenazasPVul />} />

            <Route path="/gestionar/nuevo-proceso" element={<Gestionar />} />
            <Route path="/gestionar/vulnerabilidad-amenaza" element={<VulnerabilidadAmenaza />} />
            <Route path="/gestionar/editar-vulnerabilidades" element={<Edit />} />
            <Route path="/gestionar/Calculo-Riesgo" element={<Riesgo />} />
            <Route path="/graficos/heatmap" element={<Graficos />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
