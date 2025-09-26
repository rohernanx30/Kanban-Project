import './App.css';
import React from "react";
import logo from './assets/icon.png'; 
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
    <div className="app">
      <header className="header">
        <div className="header-top">
          <div className="logo">
            <img src={logo} alt="Logo" style={{ width: '32px', height: '32px' }} />
            <h1>TaskFlow</h1>
          </div>
          <nav className="nav">
            <a href="#">Inicio</a>
            <a href="#">Tablas</a>
          </nav>
          <div className="actions">
            {vista === "inicio" && <button onClick={crearTablero}>Crear tablero</button>}
            {vista === "tablero" && <button onClick={volverInicio}>Volver</button>}
          </div>
        </div>
      </header>

      <main className="main">
        {vista === "inicio" && (
          <>
            <div className="main-header">
              <h2>Tus tableros</h2>
              <div className="add-board-mobile" onClick={crearTablero}>+</div>
            </div>
            <div className="boards">
              {tableros.map((t) => (
                <div
                  className="board-card"
                  key={t.id}
                  onClick={() => { setTableroActivo(t); setVista("tablero"); }}
                >
                  <h3>{t.nombre}</h3>
                  <p>Click para abrir</p>
                </div>
              ))}

              <div className="add-new-board" onClick={crearTablero}>
                <span>+</span>
                <p>Nuevo tablero</p>
              </div>
            </div>
          </>
        )}

        {vista === "tablero" && tableroActivo && (
          <Tablero tablero={tableroActivo} actualizarTablero={actualizarTablero} />
        )}
      </main>

      <footer className="footer">
        <p>© 2025 TaskFlow. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
}
