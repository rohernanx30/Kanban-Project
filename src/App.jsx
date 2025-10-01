import './App.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import Header from "./components/Header";  
import Tablero from "./components/Tablero";

export default function App() {
  const [vista, setVista] = React.useState("inicio");
  const [tableros, setTableros] = React.useState([]);
  const [tableroActivo, setTableroActivo] = React.useState(null);

  const crearTablero = () => {
    const nuevoTablero = {
      id: Date.now(),
      nombre: "Tablero sin nombre",
      columnas: [],
    };
    setTableros([...tableros, nuevoTablero]);
    setTableroActivo(nuevoTablero);
    setVista("tablero");
  };

  const volverInicio = () => {
    setVista("inicio");
    setTableroActivo(null);
  };

  const actualizarTablero = (tableroActualizado) => {
    setTableros(tableros.map(t => t.id === tableroActualizado.id ? tableroActualizado : t));
    setTableroActivo(tableroActualizado);
  };

  return (
    <div className="app container-fluid p-0">
      {/* Header */}
      <Header 
        vista={vista} 
        crearTablero={crearTablero} 
        volverInicio={volverInicio} 
      />

      <main className="container-fluid py-4">
        {vista === "inicio" && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Tus tableros</h2>
              <button className="btn btn-primary d-md-none" onClick={crearTablero}>+</button>
            </div>

            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
              {tableros.map((t) => (
                <div
                  className="col"
                  key={t.id}
                  onClick={() => { setTableroActivo(t); setVista("tablero"); }}
                >
                  <div className="card h-100 shadow-sm cursor-pointer">
                    <div className="card-body">
                      <h5 className="card-title">{t.nombre}</h5>
                      <p className="card-text">Click para abrir</p>
                    </div>
                  </div>
                </div>
              ))}

              {/* Nuevo tablero */}
              <div className="col">
                <div 
                  className="card h-100 border-dashed text-center d-flex justify-content-center align-items-center cursor-pointer"
                  style={{ minHeight: "120px" }}
                  onClick={crearTablero}
                >
                  <div>
                    <h1>+</h1>
                    <p>Nuevo tablero</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {vista === "tablero" && tableroActivo && (
          <div className="overflow-auto">
            <Tablero tablero={tableroActivo} actualizarTablero={actualizarTablero} />
          </div>
        )}
      </main>

      <footer className="footer text-center py-3 bg-light mt-auto">
        <p className="mb-0">© 2025 TaskFlow. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
