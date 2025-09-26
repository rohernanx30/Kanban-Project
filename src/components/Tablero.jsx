import React from "react";
import Columna from "./Columna";
import './components.css';
import '../App.css'; 

export default function Tablero({ tablero, actualizarTablero }) {
  const [nombre, setNombre] = React.useState(tablero.nombre);

  const cambiarNombre = (e) => {
    setNombre(e.target.value);
    actualizarTablero({ ...tablero, nombre: e.target.value });
  };

  const agregarColumna = () => {
    const nuevaColumna = { id: Date.now(), nombre: "Columna sin nombre", tareas: [] };
    const nuevoTablero = { ...tablero, columnas: [...tablero.columnas, nuevaColumna] };
    actualizarTablero(nuevoTablero);
  };

  const actualizarColumna = (columnaActualizada) => {
    const columnas = tablero.columnas.map(c => c.id === columnaActualizada.id ? columnaActualizada : c);
    actualizarTablero({ ...tablero, columnas });
  };

  return (
    <div className="tablero" style={{ display: "flex", gap: "1rem", overflowX: "auto" }}>
      <div>
        <input
          type="text"
          value={nombre}
          onChange={cambiarNombre}
          style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem" }}
        />
      </div>
      {tablero.columnas.map((col) => (
        <Columna
          key={col.id}
          columna={col}
          actualizarColumna={actualizarColumna}
        />
      ))}
      <div className="add-new-board" style={{ minWidth: "200px" }} onClick={agregarColumna}>
        <span>+</span>
        <p>Agregar columna</p>
      </div>
    </div>
  );
}
