import React from "react";
import Columna from "./Columna";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container-fluid mt-3">
      {/* Título del tablero */}
      <div className="mb-3">
        <input
          type="text"
          value={nombre}
          onChange={cambiarNombre}
          className="form-control form-control-lg fw-bold"
          placeholder="Nombre del tablero"
        />
      </div>

      {/* Columnas Kanban */}
      <div className="row flex-row flex-nowrap overflow-auto g-3">
        {tablero.columnas.map((col) => (
          <div key={col.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <Columna
              columna={col}
              actualizarColumna={actualizarColumna}
            />
          </div>
        ))}

        {/* Botón para agregar columna */}
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div 
            className="card text-center p-3 d-flex align-items-center justify-content-center"
            style={{ minHeight: "200px", cursor: "pointer", border: "2px dashed #6c757d" }}
            onClick={agregarColumna}
          >
            <span className="fs-1 text-muted">+</span>
            <p className="text-muted mt-2 mb-0">Agregar columna</p>
          </div>
        </div>
      </div>
    </div>
  );
}
