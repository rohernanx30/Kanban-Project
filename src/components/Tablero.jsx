import React from "react";
import Columna from "./Columna";
import 'bootstrap/dist/css/bootstrap.min.css';
import { crearColumna, eliminarColumna as eliminarColumnaApi } from '../api/kanbanApi';

export default function Tablero({ tablero, actualizarTablero, columnas, setColumnas }) {
  const [nombre, setNombre] = React.useState(tablero.nombre);
  const [modalColumna, setModalColumna] = React.useState(false);
  const [nombreNuevaColumna, setNombreNuevaColumna] = React.useState("");

  // Validacion: no se permite nombre vacio para columna
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

  // Funcionamiento de la API: crear columna nueva
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

  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  const [columnaAEliminar, setColumnaAEliminar] = React.useState(null);

  const ejecutarEliminarColumna = async () => {
    if (!columnaAEliminar) return;
    try {
      await eliminarColumnaApi(columnaAEliminar);
      setColumnas(columnas.filter(c => c.id !== columnaAEliminar));
      setConfirmModalVisible(false);
      setColumnaAEliminar(null);
    } catch (err) {
      alert("Error al eliminar la columna: " + err.message);
      setConfirmModalVisible(false);
      setColumnaAEliminar(null);
    }
  };

  const confirmarEliminarColumna = (idColumna) => {
    setColumnaAEliminar(idColumna);
    setConfirmModalVisible(true);
  };

  const cancelarEliminarColumna = () => {
    setConfirmModalVisible(false);
    setColumnaAEliminar(null);
  };

  // Actualiza tareas en columna especifica (optimizado para manejar callbacks)
  const setTareasEnColumna = React.useCallback((idColumna, nuevasTareas) => {
    setColumnas(prevColumnas => {
      // Encontrar el índice de la columna a actualizar
      const colIndex = prevColumnas.findIndex(c => c.id === idColumna);
      if (colIndex === -1) {
        console.warn(`[Tablero] Columna ${idColumna} no encontrada`);
        return prevColumnas;
      }
      
      const colActual = prevColumnas[colIndex];
      
      // Si nuevasTareas es una función, ejecutarla con las tareas actuales
      const tareasFinales = typeof nuevasTareas === 'function' 
        ? nuevasTareas(colActual.tareas) 
        : nuevasTareas;
      
      // Verificar si realmente cambiaron las tareas
      if (JSON.stringify(colActual.tareas) === JSON.stringify(tareasFinales)) {
        console.log(`[Tablero] Sin cambios reales en columna ${idColumna}, evitando actualización`);
        return prevColumnas;
      }
      
      // Crear nuevo array solo modificando la columna afectada
      const nuevasColumnas = [...prevColumnas];
      nuevasColumnas[colIndex] = { ...colActual, tareas: tareasFinales };
      
      console.log(`[Tablero] Columna ${idColumna} actualizada con ${tareasFinales.length} tareas`);
      return nuevasColumnas;
    });
  }, []);

  // Actualiza nombre de columna especifica
  const setNombreColumna = (idColumna, nuevoNombre) => {
    setColumnas(columnas.map(c => c.id === idColumna ? { ...c, nombre: nuevoNombre } : c));
  };

  return (
    <div className="container-fluid px-4 py-3 fade-in-up">
      <div className="mb-4">
        <div className="d-flex align-items-center mb-3">
          <div className="icon-wrapper me-3" style={{
            background: 'linear-gradient(135deg, #87CEEB, #B8A7D9)',
            width: '48px',
            height: '48px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <i className="bi bi-clipboard-data text-white" style={{ fontSize: '1.2rem' }}></i>
          </div>
          <div className="flex-grow-1">
            <input
              type="text"
              value={nombre}
              onChange={cambiarNombre}
              onBlur={() => actualizarTablero({ ...tablero, nombre })}
              className="form-control form-control-lg fw-bold border-0 bg-transparent"
              placeholder="Nombre del tablero"
              style={{ 
                fontSize: '1.75rem',
                color: 'var(--text-primary)',
                boxShadow: 'none'
              }}
            />
          </div>
        </div>
      </div>

      {/* Columnas Kanban */}
      <div className="row g-4" style={{ minHeight: '70vh' }}>
        <div className="d-flex flex-row overflow-auto pb-3" style={{ gap: '1.5rem', minHeight: '500px' }}>
          {columnas.map((col, index) => (
            <div key={col.id} className="kanban-column position-relative" style={{ 
              minWidth: '320px',
              maxWidth: '320px',
              flexShrink: 0
            }}>
              <Columna
                columna={col}
                setTareas={(nuevasTareas) => setTareasEnColumna(col.id, nuevasTareas)}
                setNombre={(nuevoNombre) => setNombreColumna(col.id, nuevoNombre)}
                index={index}
              />
              <button
                onClick={() => confirmarEliminarColumna(col.id)}
                className="btn btn-sm position-absolute"
                style={{ 
                  top: '8px',
                  right: '8px',
                  zIndex: 10,
                  background: 'rgba(255, 107, 157, 0.1)',
                  border: '1px solid rgba(255, 107, 157, 0.3)',
                  color: 'var(--priority-high)',
                  borderRadius: '8px',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'var(--priority-high)';
                  e.target.style.color = 'white';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 107, 157, 0.1)';
                  e.target.style.color = 'var(--priority-high)';
                }}
              >
                <i className="bi bi-x" style={{ fontSize: '1rem' }}></i>
              </button>
            </div>
          ))}

          {/* Botón para agregar columna */}
          <div 
            className="d-flex align-items-center justify-content-center text-center"
            style={{ 
              minWidth: '320px',
              maxWidth: '320px',
              flexShrink: 0,
              minHeight: '400px',
              background: 'rgba(255, 255, 255, 0.5)',
              border: '2px dashed var(--border-light)',
              borderRadius: '16px',
              cursor: 'pointer',
              transition: 'all 0.3s ease'
            }}
            onClick={abrirModalColumna}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.8)';
              e.target.style.borderColor = 'var(--canva-blue)';
              e.target.style.transform = 'translateY(-2px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255, 255, 255, 0.5)';
              e.target.style.borderColor = 'var(--border-light)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <div>
              <div className="mb-3" style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #87CEEB, #B8A7D9)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <i className="bi bi-plus-lg text-white" style={{ fontSize: '1.5rem' }}></i>
              </div>
              <h5 className="fw-600" style={{ color: 'var(--text-primary)' }}>Agregar columna</h5>
              <p className="text-muted mb-0">Crea una nueva columna para organizar tus tareas</p>
            </div>
          </div>
        </div>
      </div>

      {confirmModalVisible && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Confirmar eliminación</h5><button type="button" className="btn-close" onClick={cancelarEliminarColumna}></button></div>
              <div className="modal-body"><p>¿Estás seguro de que quieres eliminar esta columna y todas sus tareas?</p></div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={cancelarEliminarColumna}>Cancelar</button><button type="button" className="btn btn-danger" onClick={ejecutarEliminarColumna}>Eliminar</button></div>
            </div>
          </div>
        </div>
      )}

      {/* Modal para agregar columna */}
      {modalColumna && (
        <div className="modal fade show" style={{ 
          display: 'block', 
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)'
        }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={agregarColumna}>
                <div className="modal-header border-0">
                  <div className="d-flex align-items-center">
                    <div className="icon-wrapper me-3" style={{
                      background: 'linear-gradient(135deg, #87CEEB, #B8A7D9)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-columns-gap text-white"></i>
                    </div>
                    <h5 className="modal-title fw-600 mb-0">Nueva columna</h5>
                  </div>
                  <button 
                    type="button" 
                    className="btn-close"
                    onClick={cerrarModalColumna}
                    style={{
                      background: 'none',
                      border: 'none',
                      fontSize: '1.2rem'
                    }}
                  ></button>
                </div>
                <div className="modal-body px-4 py-3">
                  <div className="mb-3">
                    <label className="form-label fw-500" style={{ color: 'var(--text-primary)' }}>
                      Nombre de la columna
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      value={nombreNuevaColumna} 
                      onChange={e => setNombreNuevaColumna(e.target.value)} 
                      placeholder="Ej: Por hacer, En progreso, Completado..."
                      required 
                      autoFocus
                      style={{
                        borderRadius: '12px',
                        border: '2px solid var(--border-light)',
                        padding: '0.75rem 1rem'
                      }}
                    />
                  </div>
                </div>
                <div className="modal-footer border-0 px-4 pb-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary me-2"
                    onClick={cerrarModalColumna}
                    style={{
                      borderRadius: '10px',
                      padding: '0.5rem 1.5rem',
                      fontWeight: '500'
                    }}
                  >
                    <i className="bi bi-x-circle me-2"></i>Cancelar
                  </button>
                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    style={{
                      borderRadius: '10px',
                      padding: '0.5rem 1.5rem',
                      fontWeight: '500'
                    }}
                  >
                    <i className="bi bi-plus-circle me-2"></i>Agregar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}