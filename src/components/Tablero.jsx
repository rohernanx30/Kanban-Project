import React from "react";
import Columna from "./Columna";
import 'bootstrap/dist/css/bootstrap.min.css';
import { crearColumna, eliminarColumna as eliminarColumnaApi } from '../api/kanbanApi';

export default function Tablero({ tablero, actualizarTablero, columnas, setColumnas }) {
  const [nombre, setNombre] = React.useState(tablero.nombre);
  const [modalColumna, setModalColumna] = React.useState(false);
  const [nombreNuevaColumna, setNombreNuevaColumna] = React.useState("");

  const cambiarNombre = (e) => {
    setNombre(e.target.value);
    actualizarTablero({ ...tablero, nombre: e.target.value });
  };

  const abrirModalColumna = () => {
    setNombreNuevaColumna("");
    setModalColumna(true);
  };

  const cerrarModalColumna = () => {
    setModalColumna(false);
  };

  const agregarColumna = async (e) => {
    e && e.preventDefault();
    if (!nombreNuevaColumna.trim()) {
      alert("El nombre de la columna es obligatorio");
      return;
    }
    try {
      const nuevaColumna = await crearColumna(tablero.id, {
        nombre: nombreNuevaColumna,
        posicion: columnas.length + 1
      });
      const colAdaptada = {
        id: nuevaColumna.id,
        nombre: nuevaColumna.nombre,
        tareas: []
      };
      setColumnas([...columnas, colAdaptada]);
      cerrarModalColumna();
    } catch (err) {
      alert("Error al agregar columna: " + err.message);
    }
  };

  const eliminarColumna = async (idColumna) => {
    if (window.confirm("¿Seguro que quieres eliminar esta columna y todas sus tareas?")) {
      try {
        await eliminarColumnaApi(idColumna);
        setColumnas(columnas.filter(c => c.id !== idColumna));
      } catch (err) {
        alert("Error al eliminar la columna: " + err.message);
      }
    }
  };

  const setTareasEnColumna = (idColumna, nuevasTareas) => {
    setColumnas(columnas.map(c => c.id === idColumna ? { ...c, tareas: nuevasTareas } : c));
  };

  const setNombreColumna = (idColumna, nuevoNombre) => {
    setColumnas(columnas.map(c => c.id === idColumna ? { ...c, nombre: nuevoNombre } : c));
  };

  return (
    <div className="container-fluid mt-3">
      {/* Título del tablero */}
      <div className="mb-3">
        <input
          type="text"
          value={nombre}
          onChange={cambiarNombre}
          onBlur={() => actualizarTablero({ ...tablero, nombre })}
          className="form-control form-control-lg fw-bold"
          placeholder="Nombre del tablero"
        />
      </div>

      {/* Columnas Kanban */}
      <div className="row flex-row flex-nowrap overflow-auto g-3">
        {columnas.map((col) => (
          <div key={col.id} className="col-12 col-sm-6 col-md-4 col-lg-3">
            <div className="position-relative">
              <Columna
                columna={col}
                setTareas={(nuevasTareas) => setTareasEnColumna(col.id, nuevasTareas)}
                setNombre={(nuevoNombre) => setNombreColumna(col.id, nuevoNombre)}
              />
              <button
                onClick={() => eliminarColumna(col.id)}
                className="btn btn-sm btn-danger position-absolute top-0 end-0 m-2"
                style={{ zIndex: 10 }}
              >✕</button>
            </div>
          </div>
        ))}

        {/* Botón para agregar columna */}
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <div 
            className="card text-center p-3 d-flex align-items-center justify-content-center"
            style={{ minHeight: "200px", cursor: "pointer", border: "2px dashed #6c757d" }}
            onClick={abrirModalColumna}
          >
            <span className="fs-1 text-muted">+</span>
            <p className="text-muted mt-2 mb-0">Agregar columna</p>
          </div>
        </div>
      </div>

      {/* Modal para agregar columna */}
      {modalColumna && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={agregarColumna}>
                <div className="modal-header">
                  <h5 className="modal-title">Nueva columna</h5>
                  <button type="button" className="btn-close" onClick={cerrarModalColumna}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Nombre de la columna</label>
                    <input type="text" className="form-control" value={nombreNuevaColumna} onChange={e => setNombreNuevaColumna(e.target.value)} required />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={cerrarModalColumna}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Agregar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}