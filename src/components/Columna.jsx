import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { crearTarea, actualizarTarea, eliminarTarea as eliminarTareaApi, actualizarColumna as actualizarColumnaApi } from '../api/kanbanApi';

export default function Columna({ columna, setTareas, setNombre }) {
  const { id, nombre, tareas } = columna;
  const [modalTarea, setModalTarea] = React.useState(false);
  const [nombreTarea, setNombreTarea] = React.useState("");

  const cambiarNombre = (e) => {
    setNombre(e.target.value);
  };

  const guardarCambioNombre = async () => {
    try {
      await actualizarColumnaApi(id, { nombre });
    } catch (err) {
      alert("Error al actualizar el nombre de la columna: " + err.message);
    }
  };

  const abrirModalTarea = () => {
    setNombreTarea("");
    setModalTarea(true);
  };

  const cerrarModalTarea = () => {
    setModalTarea(false);
  };

  const agregarTarea = async (e) => {
    e && e.preventDefault();
    if (!nombreTarea.trim()) {
      alert("El nombre de la tarea es obligatorio");
      return;
    }
    try {
      const nuevaTareaBD = await crearTarea(id, {
        titulo: nombreTarea,
        descripcion: "",
        posicion: tareas.length + 1
      });
      const nuevaTarea = {
        id: nuevaTareaBD.id,
        texto: nuevaTareaBD.titulo
      };
      setTareas([...tareas, nuevaTarea]);
      cerrarModalTarea();
    } catch (err) {
      alert("Error al agregar tarea: " + err.message);
    }
  };

  const cambiarTarea = (id, texto) => {
    const nuevasTareas = tareas.map(t => t.id === id ? { ...t, texto } : t);
    setTareas(nuevasTareas);
  };

  const guardarCambioTarea = async (id, texto) => {
    try {
      await actualizarTarea(id, { titulo: texto });
    } catch (err) {
      alert("Error al actualizar la tarea: " + err.message);
    }
  };

  const eliminarTarea = async (id) => {
    if (window.confirm("¿Seguro que quieres eliminar esta tarea?")) {
      try {
        await eliminarTareaApi(id);
        const nuevasTareas = tareas.filter(t => t.id !== id);
        setTareas(nuevasTareas);
      } catch (err) {
        alert("Error al eliminar la tarea: " + err.message);
      }
    }
  };

  return (
    <div className="card mb-3 bg-light" style={{ minWidth: "250px", maxWidth: "250px" }}>
      {/* Nombre de la columna */}
      <input
        type="text"
        value={nombre}
        onChange={cambiarNombre}
        onBlur={guardarCambioNombre}
        className="form-control fw-bold mb-2"
        placeholder="Nombre de columna"
      />

      {/* Lista de tareas */}
      <div className="d-flex flex-column gap-2 p-2">
        {tareas.map(t => (
          <div key={t.id} className="d-flex align-items-center gap-2 bg-white rounded p-2 shadow-sm">
            <input
              type="text"
              value={t.texto}
              onBlur={(e) => guardarCambioTarea(t.id, e.target.value)}
              onChange={(e) => cambiarTarea(t.id, e.target.value)}
              className="form-control border-0"
            />
            <button onClick={() => eliminarTarea(t.id)} className="btn btn-danger btn-sm">✕</button>
          </div>
        ))}
      </div>

        {/* Botón agregar tarea */}
        <button 
          onClick={abrirModalTarea} 
          className="btn btn-primary mt-2"
        >
          + Agregar tarea
        </button>
        {/* Modal para agregar tarea */}
        {modalTarea && (
          <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
            <div className="modal-dialog">
              <div className="modal-content">
                <form onSubmit={agregarTarea}>
                  <div className="modal-header">
                    <h5 className="modal-title">Nueva tarea</h5>
                    <button type="button" className="btn-close" onClick={cerrarModalTarea}></button>
                  </div>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Nombre de la tarea</label>
                      <input type="text" className="form-control" value={nombreTarea} onChange={e => setNombreTarea(e.target.value)} required />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={cerrarModalTarea}>Cancelar</button>
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
