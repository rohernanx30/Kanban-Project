import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

import { crearTarea, actualizarTarea, eliminarTarea as eliminarTareaApi, actualizarColumna as actualizarColumnaApi } from '../api/kanbanApi';
import Tarea from './Tarea';

const initialTareaState = {
  titulo: "",
  descripcion: "",
  fecha_limite: "",
  asignado_por: "",
  asignado_a: "",
  porcentaje_avance: 0,
  prioridad: "Bajo",
};

export default function Columna({ columna, setTareas, setNombre, todasLasColumnas, recargarTablero }) {
  const { id, nombre, tareas } = columna;
  
  const [modalCrear, setModalCrear] = React.useState(false);
  const [nuevaTareaData, setNuevaTareaData] = React.useState(initialTareaState);

  const [modalEdicion, setModalEdicion] = React.useState(false);
  const [tareaEnEdicion, setTareaEnEdicion] = React.useState(null);

  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  const [tareaAEliminar, setTareaAEliminar] = React.useState(null);

  const cambiarNombre = (e) => {
    setNombre(e.target.value);
  };

  const guardarCambioNombre = async () => {
    try {
      await actualizarColumnaApi(id, { nombre });
    } catch (err) {
      console.error("Error al actualizar el nombre de la columna: " + err.message);
    }
  };

  const abrirModalCrear = () => {
    setNuevaTareaData(initialTareaState);
    setModalCrear(true);
  };
  const cerrarModalCrear = () => setModalCrear(false);
  const handleCrearChange = (e) => {
    const { name, value } = e.target;
    setNuevaTareaData({ ...nuevaTareaData, [name]: value });
  };

  const agregarTarea = async (e) => {
    e.preventDefault();
    if (!nuevaTareaData.titulo.trim()) {
      console.warn("El nombre de la tarea es obligatorio");
      return;
    }
    try {
      const nuevaTareaBD = await crearTarea(id, { ...nuevaTareaData, posicion: tareas.length + 1 });
      setTareas([...tareas, nuevaTareaBD]);
      cerrarModalCrear();
    } catch (err) {
      console.error("Error al agregar tarea: " + err.message);
    }
  };

  const abrirModalEdicion = (tarea) => {
    setTareaEnEdicion(tarea);
    setModalEdicion(true);
  };
  const cerrarModalEdicion = () => setModalEdicion(false);
  const handleEdicionChange = (e) => {
    const { name, value } = e.target;
    setTareaEnEdicion({ ...tareaEnEdicion, [name]: value });
  };

  const guardarTareaEditada = async (e) => {
    e.preventDefault();
    try {
      const tareaActualizada = await actualizarTarea(tareaEnEdicion.id, tareaEnEdicion);
      const nuevasTareas = tareas.map(t => t.id === tareaEnEdicion.id ? tareaActualizada : t);
      setTareas(nuevasTareas);
      cerrarModalEdicion();
    } catch (err) {
      console.error("Error al actualizar la tarea: " + err.message);
    }
  };

  const ejecutarEliminarTarea = async () => {
    if (!tareaAEliminar) return;
    try {
      await eliminarTareaApi(tareaAEliminar);
      setTareas(tareas.filter(t => t.id !== tareaAEliminar));
      setConfirmModalVisible(false);
      setTareaAEliminar(null);
    } catch (err) {
      console.error("Error al eliminar la tarea: " + err.message);
      setConfirmModalVisible(false);
      setTareaAEliminar(null);
    }
  };

  const confirmarEliminarTarea = (idTarea) => {
    setTareaAEliminar(idTarea);
    setConfirmModalVisible(true);
  };

  const cancelarEliminarTarea = () => {
    setConfirmModalVisible(false);
    setTareaAEliminar(null);
  };

  return (
    <div className="card mb-3 bg-light" style={{ minWidth: "320px", maxWidth: "320px" }}>
      <div className="card-header">
        <input
          type="text"
          value={nombre}
          onChange={cambiarNombre}
          onBlur={guardarCambioNombre}
          className="form-control fw-bold border-0 bg-light"
          placeholder="Nombre de columna"
        />
      </div>

      <div className="card-body overflow-auto" style={{maxHeight: '60vh'}}>
        {tareas.map(t => (
          <Tarea 
            key={t.id} 
            tarea={t} 
            onEdit={abrirModalEdicion} 
            onDelete={confirmarEliminarTarea} 
            todasLasColumnas={todasLasColumnas}
            recargarTablero={recargarTablero}
          />
        ))}
      </div>

      <div className="card-footer">
        <button onClick={abrirModalCrear} className="btn btn-primary w-100">
          + Agregar tarea
        </button>
      </div>

      {/* Modal para CREAR tarea */}
      {modalCrear && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={agregarTarea}>
                <div className="modal-header">
                  <h5 className="modal-title">Nueva Tarea</h5>
                  <button type="button" className="btn-close" onClick={cerrarModalCrear}></button>
                </div>
                <div className="modal-body">
                  {/* Formulario idéntico al de edición */}
                  <div className="mb-3"><label className="form-label">Nombre</label><input type="text" className="form-control" name="titulo" value={nuevaTareaData.titulo} onChange={handleCrearChange} required /></div>
                  <div className="mb-3"><label className="form-label">Descripción</label><textarea className="form-control" name="descripcion" value={nuevaTareaData.descripcion} onChange={handleCrearChange} /></div>
                  <div className="row"><div className="col-md-6 mb-3"><label className="form-label">Fecha Límite</label><input type="date" className="form-control" name="fecha_limite" value={nuevaTareaData.fecha_limite} onChange={handleCrearChange} /></div><div className="col-md-6 mb-3"><label className="form-label">Prioridad</label><select className="form-select" name="prioridad" value={nuevaTareaData.prioridad} onChange={handleCrearChange}><option value="Bajo">Bajo</option><option value="Medio">Medio</option><option value="Alto">Alto</option></select></div></div>
                  <div className="row"><div className="col-md-6 mb-3"><label className="form-label">Asignado por</label><input type="text" className="form-control" name="asignado_por" value={nuevaTareaData.asignado_por} onChange={handleCrearChange} /></div><div className="col-md-6 mb-3"><label className="form-label">Asignado a</label><input type="text" className="form-control" name="asignado_a" value={nuevaTareaData.asignado_a} onChange={handleCrearChange} /></div></div>
                  <div className="mb-3"><label className="form-label">% Avance: {nuevaTareaData.porcentaje_avance}%</label><input type="range" className="form-range" name="porcentaje_avance" min="0" max="100" step="10" value={nuevaTareaData.porcentaje_avance} onChange={handleCrearChange} /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={cerrarModalCrear}>Cancelar</button><button type="submit" className="btn btn-primary">Agregar Tarea</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalEdicion && tareaEnEdicion && (
         <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={guardarTareaEditada}>
                <div className="modal-header">
                  <h5 className="modal-title">Editar Tarea</h5>
                  <button type="button" className="btn-close" onClick={cerrarModalEdicion}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3"><label className="form-label">Nombre</label><input type="text" className="form-control" name="titulo" value={tareaEnEdicion.titulo} onChange={handleEdicionChange} required /></div>
                  <div className="mb-3"><label className="form-label">Descripción</label><textarea className="form-control" name="descripcion" value={tareaEnEdicion.descripcion} onChange={handleEdicionChange} /></div>
                  <div className="row"><div className="col-md-6 mb-3"><label className="form-label">Fecha Límite</label><input type="date" className="form-control" name="fecha_limite" value={tareaEnEdicion.fecha_limite ? new Date(tareaEnEdicion.fecha_limite).toISOString().split('T')[0] : ''} onChange={handleEdicionChange} /></div><div className="col-md-6 mb-3"><label className="form-label">Prioridad</label><select className="form-select" name="prioridad" value={tareaEnEdicion.prioridad} onChange={handleEdicionChange}><option value="Bajo">Bajo</option><option value="Medio">Medio</option><option value="Alto">Alto</option></select></div></div>
                  <div className="row"><div className="col-md-6 mb-3"><label className="form-label">Asignado por</label><input type="text" className="form-control" name="asignado_por" value={tareaEnEdicion.asignado_por} onChange={handleEdicionChange} /></div><div className="col-md-6 mb-3"><label className="form-label">Asignado a</label><input type="text" className="form-control" name="asignado_a" value={tareaEnEdicion.asignado_a} onChange={handleEdicionChange} /></div></div>
                  <div className="mb-3"><label className="form-label">% Avance: {tareaEnEdicion.porcentaje_avance}%</label><input type="range" className="form-range" name="porcentaje_avance" min="0" max="100" step="10" value={tareaEnEdicion.porcentaje_avance} onChange={handleEdicionChange} /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={cerrarModalEdicion}>Cancelar</button><button type="submit" className="btn btn-primary">Guardar Cambios</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmModalVisible && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.5)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Eliminación</h5>
                <button type="button" className="btn-close" onClick={cancelarEliminarTarea}></button>
              </div>
              <div className="modal-body">
                <p>¿Estás seguro de que quieres eliminar esta tarea?</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelarEliminarTarea}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={ejecutarEliminarTarea}>Eliminar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}