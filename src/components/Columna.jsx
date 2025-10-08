import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import { crearTarea, actualizarTarea, eliminarTarea as eliminarTareaApi, actualizarColumna as actualizarColumnaApi, getTareas } from '../api/kanbanApi';
import Tarea from './Tarea';

// Estilos para mostrar el area de drop
const styles = {
  dragOver: {
    backgroundColor: 'rgba(25, 118, 210, 0.1)',
    border: '2px dashed #1976d2',
    transition: 'all 0.3s ease',
  }
};

// Helper para comparar IDs sin problemas de tipo (string vs number)
const idsIguales = (a, b) => String(a) === String(b);

const initialTareaState = {
  titulo: "",
  descripcion: "",
  fecha_limite: "",
  asignado_por: "",
  asignado_a: "",
  porcentaje_avance: 0,
  prioridad: "Bajo",
};

export default function Columna({ columna, setTareas, setNombre, todasLasColumnas, recargarTablero, index, moverTareaGlobal }) {
  const { id, nombre } = columna;
  const tareas = Array.isArray(columna.tareas) ? columna.tareas : [];

  // Debug: Detectar cuando la columna se re-renderiza
  React.useEffect(() => {
    console.log(`[Columna ${id}] Re-renderizada con ${tareas.length} tareas:`, tareas.map(t => t.id));
  }, [tareas, id]);

  // Lista defensiva sin duplicados para evitar render doble por estados transitorios
  const tareasUnicas = React.useMemo(() => {
    const seen = new Set();
    return tareas.filter(t => {
      const k = String(t?.id);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    });
  }, [tareas]);

  // Drag and drop: escucha eventos globales SOLO para las columnas involucradas
  React.useEffect(() => {
    // ÚNICA actualización visual inmediata (sin recargas de BD)
    const handleActualizacionVisualInmediata = (event) => {
      const { sourceColId, destColId, tareaId, tarea } = event.detail;
      
      // FILTRO: Solo procesar si esta columna está involucrada
      if (!idsIguales(id, sourceColId) && !idsIguales(id, destColId)) {
        console.log(`[Columna ${id}] Ignorando actualización - no involucrada (source: ${sourceColId}, dest: ${destColId})`);
        return;
      }
      
      console.log(`[Columna ${id}] Procesando actualización visual para tarea ${tareaId}`);
      
      // Si es la columna de origen: ELIMINAR solo esa tarea específica
      if (idsIguales(id, sourceColId)) {
        setTareas(prevTareas => {
          console.log(`[Columna ${id}] Tareas antes de remover:`, prevTareas.map(t => t.id));
          const filtered = prevTareas.filter(t => !idsIguales(t.id, tareaId));
          console.log(`[Columna ${id}] Tareas después de remover:`, filtered.map(t => t.id));
          console.log(`[Columna ${id}] Tarea ${tareaId} removida visualmente`);
          return filtered;
        });
      }
      
      // Si es la columna de destino: AGREGAR la tarea
      if (idsIguales(id, destColId)) {
        setTareas(prevTareas => {
          console.log(`[Columna ${id}] Tareas antes de agregar:`, prevTareas.map(t => t.id));
          
          // Evitar duplicados
          const existe = prevTareas.some(t => idsIguales(t.id, tareaId));
          if (existe) {
            console.log(`[Columna ${id}] Tarea ${tareaId} ya existe, ignorando`);
            return prevTareas;
          }
          
          const sinDuplicados = prevTareas.filter(t => !idsIguales(t.id, tareaId));
          const nuevasTareas = [...sinDuplicados, { ...tarea, columna_id: destColId }];
          console.log(`[Columna ${id}] Tareas después de agregar:`, nuevasTareas.map(t => t.id));
          console.log(`[Columna ${id}] Tarea ${tareaId} agregada visualmente`);
          return nuevasTareas;
        });
      }
    };

    // ÚNICA recarga desde BD (después de confirmar el movimiento)
    const handleMovimientoCompletado = async (event) => {
      const { sourceColId, destColId, exitoso } = event.detail;
      
      // FILTRO: Solo procesar si esta columna está involucrada
      if (!idsIguales(id, sourceColId) && !idsIguales(id, destColId)) return;
      
      // Si el movimiento falló, recargar para restaurar estado correcto
      if (!exitoso) {
        console.log(`[Columna ${id}] Movimiento falló, recargando desde BD`);
        try {
          const nuevasTareas = await getTareas(id);
          if (Array.isArray(nuevasTareas)) {
            setTareas(nuevasTareas);
          }
        } catch (error) {
          console.error(`[Columna ${id}] Error al recargar:`, error);
        }
        return;
      }
      
      // Movimiento exitoso: recargar solo para sincronizar posiciones
      console.log(`[Columna ${id}] Sincronizando con BD después de movimiento exitoso`);
      try {
        // Desfase para evitar condiciones de carrera
        const delay = idsIguales(id, sourceColId) ? 150 : 300;
        
        setTimeout(async () => {
          const nuevasTareas = await getTareas(id);
          if (Array.isArray(nuevasTareas)) {
            setTareas(nuevasTareas);
            console.log(`[Columna ${id}] Sincronizada con BD`);
          }
        }, delay);
      } catch (error) {
        console.error(`[Columna ${id}] Error al sincronizar:`, error);
      }
    };

    // Recarga completa del tablero (con throttling para evitar spam)
    const handleRecargaCompleta = async () => {
      const ahora = Date.now();
      if (!window.ultimaRecargaColumna) {
        window.ultimaRecargaColumna = {};
      }
      
      // Throttling: máximo 1 recarga cada 2 segundos
      if (!window.ultimaRecargaColumna[id] || ahora - window.ultimaRecargaColumna[id] > 2000) {
        window.ultimaRecargaColumna[id] = ahora;
        
        try {
          const nuevasTareas = await getTareas(id);
          if (Array.isArray(nuevasTareas)) {
            setTareas(nuevasTareas);
            console.log(`[Columna ${id}] Recarga completa ejecutada`);
          }
        } catch (error) {
          console.error(`[Columna ${id}] Error en recarga completa:`, error);
        }
      }
    };
    
    // Registrar SOLO los event listeners necesarios
    window.addEventListener('actualizacionVisualInmediata', handleActualizacionVisualInmediata);
    window.addEventListener('movimientoCompletado', handleMovimientoCompletado);
    window.addEventListener('recargaCompletaTablero', handleRecargaCompleta);
    
    return () => {
      window.removeEventListener('actualizacionVisualInmediata', handleActualizacionVisualInmediata);
      window.removeEventListener('movimientoCompletado', handleMovimientoCompletado);
      window.removeEventListener('recargaCompletaTablero', handleRecargaCompleta);
    };
  }, [id, setTareas]); 
  const getColumnIcon = (columnName) => {
    const name = columnName.toLowerCase();
    if (name.includes('hacer') || name.includes('pendiente') || name.includes('todo')) {
      return 'lightbulb';
    } else if (name.includes('progreso') || name.includes('desarrollo') || name.includes('proceso')) {
      return 'clock';
    } else if (name.includes('completado') || name.includes('terminado') || name.includes('hecho') || name.includes('done')) {
      return 'check-circle';
    } else if (name.includes('revisión') || name.includes('revision') || name.includes('review')) {
      return 'eye';
    }
    return 'kanban';
  };

  const getColumnGradient = (index) => {
    const gradients = [
      'linear-gradient(135deg, #FFB6B3, #FFF5E6)',
      'linear-gradient(135deg, #87CEEB, #B8A7D9)',
      'linear-gradient(135deg, #A8E6CF, #87CEEB)',
      'linear-gradient(135deg, #B8A7D9, #FFB6B3)'
    ];
    return gradients[index % gradients.length];
  };
  
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

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    Object.assign(e.currentTarget.style, styles.dragOver);
    
    // Actualización visual durante el arrastre
    if (window.draggedTarea && window.draggedTarea.columnaId !== id) {
      // Mostrar feedback visual de que se puede soltar aquí
      e.currentTarget.style.transform = 'scale(1.01)';
    }
  };
  
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.currentTarget.style.backgroundColor = '';
    e.currentTarget.style.border = '1px solid var(--border-light)';
    e.currentTarget.style.transform = 'scale(1)';
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Restaurar estilos visuales
    e.currentTarget.style.backgroundColor = '';
    e.currentTarget.style.border = '1px solid var(--border-light)';
    e.currentTarget.style.transform = 'scale(1)';
    
    // Obtener información de la tarea arrastrada
    let sourceColId, tarea;
    
    if (window.draggedTarea) {
      ({ tarea, columnaId: sourceColId } = window.draggedTarea);
    }
    
    // Validar datos
    if (!tarea || !sourceColId) {
      console.warn('[Drop] No hay información de la tarea arrastrada');
      return;
    }
    
    // No hacer nada si se suelta en la misma columna
    if (idsIguales(sourceColId, id)) {
      console.log(`[Drop] Tarea ${tarea.id} soltada en la misma columna`);
      window.draggedTarea = null;
      return;
    }
    
    console.log(`[Drop] Moviendo tarea ${tarea.id} de columna ${sourceColId} a ${id}`);
    
    // 1️⃣ ACTUALIZACIÓN VISUAL INMEDIATA (UX optimista)
    window.dispatchEvent(new CustomEvent('actualizacionVisualInmediata', {
      detail: {
        sourceColId,
        destColId: id,
        tareaId: tarea.id,
        tarea: tarea
      }
    }));
    
    // 2️⃣ ACTUALIZACIÓN EN BASE DE DATOS (en background)
    try {
      if (typeof moverTareaGlobal === 'function') {
        // Usar función global si está disponible
        await moverTareaGlobal(tarea, sourceColId, id);
      } else {
        // Actualizar directamente
        await actualizarTarea(tarea.id, { columna_id: id });
      }
      
      // 3️⃣ NOTIFICAR ÉXITO (para sincronización final)
      window.dispatchEvent(new CustomEvent('movimientoCompletado', {
        detail: {
          sourceColId,
          destColId: id,
          tareaId: tarea.id,
          exitoso: true
        }
      }));
      
      console.log(`[Drop] Tarea ${tarea.id} movida exitosamente`);
      
    } catch (error) {
      console.error(`[Drop] Error al mover tarea ${tarea.id}:`, error);
      
      // 3️⃣ NOTIFICAR ERROR (para revertir cambios visuales)
      window.dispatchEvent(new CustomEvent('movimientoCompletado', {
        detail: {
          sourceColId,
          destColId: id,
          tareaId: tarea.id,
          exitoso: false,
          error: error.message
        }
      }));
      
      alert("Error al mover la tarea. Por favor, inténtalo de nuevo.");
    }
    
    // Limpiar referencia global
    window.draggedTarea = null;
  };

  return (
    <div
      className="h-100 d-flex flex-column"
      style={{ 
        background: 'rgba(255, 255, 255, 0.9)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        border: '1px solid var(--border-light)',
        boxShadow: 'var(--shadow-soft)',
        minHeight: '400px',
        transition: 'all 0.3s ease'
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Header de la columna */}
      <div 
        className="column-header p-3 d-flex align-items-center"
        style={{
          background: getColumnGradient(index),
          borderRadius: '16px 16px 0 0',
          minHeight: '70px'
        }}
      >
        <div className="icon-wrapper me-3" style={{
          background: 'rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(10px)',
          width: '40px',
          height: '40px',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <i className={`bi bi-${getColumnIcon(nombre)} text-white`} style={{ fontSize: '1.1rem' }}></i>
        </div>
        <input
          type="text"
          value={nombre}
          onChange={cambiarNombre}
          onBlur={guardarCambioNombre}
          className="form-control fw-600 border-0 text-white"
          placeholder="Nombre de columna"
          style={{
            background: 'transparent',
            fontSize: '1.1rem',
            fontWeight: '600',
            color: 'white !important',
            boxShadow: 'none'
          }}
        />
      </div>

      <div className="flex-grow-1 p-3 overflow-auto" style={{ maxHeight: '500px' }}>
        <div className="d-flex flex-column gap-2">
          {tareasUnicas.map(t => (
            <Tarea 
              key={t.id} 
              tarea={t} 
              onEdit={abrirModalEdicion} 
              onDelete={confirmarEliminarTarea} 
              todasLasColumnas={todasLasColumnas}
              recargarTablero={recargarTablero}
              onDragStart={(e, tareaObj) => {
                // Guardar información de la tarea en memoria global
                window.draggedTarea = { 
                  tarea: tareaObj, 
                  columnaId: id 
                };
                
                // Configurar dataTransfer para compatibilidad
                try {
                  e.dataTransfer.setData('text/plain', JSON.stringify({
                    tareaId: tareaObj.id,
                    sourceColId: id
                  }));
                  e.dataTransfer.effectAllowed = 'move';
                } catch (error) {
                  console.error('[DragStart] Error al configurar dataTransfer:', error);
                }
                
                console.log(`[DragStart] Tarea ${tareaObj.id} lista para arrastrar desde columna ${id}`);
              }}
            />
          ))}
          {tareasUnicas.length === 0 && (
            <div className="text-center py-4">
              <div className="mb-3" style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: 'var(--bg-light)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <i className="bi bi-inbox" style={{ 
                  fontSize: '1.5rem', 
                  color: 'var(--text-muted)' 
                }}></i>
              </div>
              <p className="text-muted small mb-0">No hay tareas aquí</p>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 mt-auto">
        <button 
          onClick={abrirModalCrear} 
          className="btn w-100 d-flex align-items-center justify-content-center"
          style={{
            background: 'rgba(135, 206, 235, 0.1)',
            border: '2px dashed var(--canva-blue)',
            color: 'var(--canva-blue)',
            borderRadius: '12px',
            padding: '0.75rem',
            fontWeight: '500',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'var(--canva-blue)';
            e.target.style.color = 'white';
            e.target.style.borderColor = 'var(--canva-blue)';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(135, 206, 235, 0.1)';
            e.target.style.color = 'var(--canva-blue)';
            e.target.style.borderColor = 'var(--canva-blue)';
          }}
        >
          <i className="bi bi-plus-circle me-2"></i>
          Agregar tarea
        </button>
      </div>

      {/* Modal para CREAR tarea */}
      {modalCrear && (
        <div className="modal fade show" style={{ 
          display: 'block', 
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)'
        }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={agregarTarea}>
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
                      <i className="bi bi-plus-circle text-white"></i>
                    </div>
                    <h5 className="modal-title fw-600 mb-0">Nueva Tarea</h5>
                  </div>
                  <button type="button" className="btn-close" onClick={cerrarModalCrear}></button>
                </div>
                <div className="modal-body px-4 py-3">
                  <div className="mb-4">
                    <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                      <i className="bi bi-card-text me-2"></i>Nombre de la tarea
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="titulo" 
                      value={nuevaTareaData.titulo} 
                      onChange={handleCrearChange} 
                      placeholder="Ej: Diseñar interfaz de usuario"
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                      <i className="bi bi-text-paragraph me-2"></i>Descripción
                    </label>
                    <textarea 
                      className="form-control" 
                      name="descripcion" 
                      value={nuevaTareaData.descripcion} 
                      onChange={handleCrearChange}
                      rows="3"
                      placeholder="Describe los detalles de la tarea..."
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                        <i className="bi bi-calendar-event me-2"></i>Fecha Límite
                      </label>
                      <input 
                        type="date" 
                        className="form-control" 
                        name="fecha_limite" 
                        value={nuevaTareaData.fecha_limite} 
                        onChange={handleCrearChange} 
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                        <i className="bi bi-flag me-2"></i>Prioridad
                      </label>
                      <select 
                        className="form-select" 
                        name="prioridad" 
                        value={nuevaTareaData.prioridad} 
                        onChange={handleCrearChange}
                      >
                        <option value="Bajo">🟢 Bajo</option>
                        <option value="Medio">🟡 Medio</option>
                        <option value="Alto">🔴 Alto</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                        <i className="bi bi-person-check me-2"></i>Asignado por
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="asignado_por" 
                        value={nuevaTareaData.asignado_por} 
                        onChange={handleCrearChange}
                        placeholder="Nombre del asignador"
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                        <i className="bi bi-person-circle me-2"></i>Asignado a
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="asignado_a" 
                        value={nuevaTareaData.asignado_a} 
                        onChange={handleCrearChange}
                        placeholder="Nombre del responsable"
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-500 mb-3" style={{ color: 'var(--text-primary)' }}>
                      <i className="bi bi-bar-chart me-2"></i>Progreso: {nuevaTareaData.porcentaje_avance}%
                    </label>
                    <input 
                      type="range" 
                      className="form-range" 
                      name="porcentaje_avance" 
                      min="0" 
                      max="100" 
                      step="10" 
                      value={nuevaTareaData.porcentaje_avance} 
                      onChange={handleCrearChange}
                      style={{
                        background: `linear-gradient(to right, var(--canva-blue) 0%, var(--canva-blue) ${nuevaTareaData.porcentaje_avance}%, var(--bg-light) ${nuevaTareaData.porcentaje_avance}%, var(--bg-light) 100%)`
                      }}
                    />
                    <div className="d-flex justify-content-between text-muted small mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 px-4 pb-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary me-2"
                    onClick={cerrarModalCrear}
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
                    <i className="bi bi-plus-circle me-2"></i>Crear Tarea
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {modalEdicion && tareaEnEdicion && (
        <div className="modal fade show" style={{ 
          display: 'block', 
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)'
        }} tabIndex="-1">
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <form onSubmit={guardarTareaEditada}>
                <div className="modal-header border-0">
                  <div className="d-flex align-items-center">
                    <div className="icon-wrapper me-3" style={{
                      background: 'linear-gradient(135deg, #FFB6B3, #FFF5E6)',
                      width: '40px',
                      height: '40px',
                      borderRadius: '10px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      <i className="bi bi-pencil text-white"></i>
                    </div>
                    <h5 className="modal-title fw-600 mb-0">Editar Tarea</h5>
                  </div>
                  <button type="button" className="btn-close" onClick={cerrarModalEdicion}></button>
                </div>
                <div className="modal-body px-4 py-3">
                  <div className="mb-4">
                    <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                      <i className="bi bi-card-text me-2"></i>Nombre de la tarea
                    </label>
                    <input 
                      type="text" 
                      className="form-control" 
                      name="titulo" 
                      value={tareaEnEdicion.titulo} 
                      onChange={handleEdicionChange} 
                      required 
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                      <i className="bi bi-text-paragraph me-2"></i>Descripción
                    </label>
                    <textarea 
                      className="form-control" 
                      name="descripcion" 
                      value={tareaEnEdicion.descripcion} 
                      onChange={handleEdicionChange}
                      rows="3"
                    />
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                        <i className="bi bi-calendar-event me-2"></i>Fecha Límite
                      </label>
                      <input 
                        type="date" 
                        className="form-control" 
                        name="fecha_limite" 
                        value={tareaEnEdicion.fecha_limite ? new Date(tareaEnEdicion.fecha_limite).toISOString().split('T')[0] : ''} 
                        onChange={handleEdicionChange} 
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                        <i className="bi bi-flag me-2"></i>Prioridad
                      </label>
                      <select 
                        className="form-select" 
                        name="prioridad" 
                        value={tareaEnEdicion.prioridad} 
                        onChange={handleEdicionChange}
                      >
                        <option value="Bajo">🟢 Bajo</option>
                        <option value="Medio">🟡 Medio</option>
                        <option value="Alto">🔴 Alto</option>
                      </select>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                        <i className="bi bi-person-check me-2"></i>Asignado por
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="asignado_por" 
                        value={tareaEnEdicion.asignado_por} 
                        onChange={handleEdicionChange}
                      />
                    </div>
                    <div className="col-md-6 mb-4">
                      <label className="form-label fw-500 mb-2" style={{ color: 'var(--text-primary)' }}>
                        <i className="bi bi-person-circle me-2"></i>Asignado a
                      </label>
                      <input 
                        type="text" 
                        className="form-control" 
                        name="asignado_a" 
                        value={tareaEnEdicion.asignado_a} 
                        onChange={handleEdicionChange}
                      />
                    </div>
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-500 mb-3" style={{ color: 'var(--text-primary)' }}>
                      <i className="bi bi-bar-chart me-2"></i>Progreso: {tareaEnEdicion.porcentaje_avance}%
                    </label>
                    <input 
                      type="range" 
                      className="form-range" 
                      name="porcentaje_avance" 
                      min="0" 
                      max="100" 
                      step="10" 
                      value={tareaEnEdicion.porcentaje_avance} 
                      onChange={handleEdicionChange}
                    />
                    <div className="d-flex justify-content-between text-muted small mt-1">
                      <span>0%</span>
                      <span>50%</span>
                      <span>100%</span>
                    </div>
                  </div>
                </div>
                <div className="modal-footer border-0 px-4 pb-4">
                  <button 
                    type="button" 
                    className="btn btn-outline-secondary me-2"
                    onClick={cerrarModalEdicion}
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
                    <i className="bi bi-check-circle me-2"></i>Guardar Cambios
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmModalVisible && (
        <div className="modal fade show" style={{ 
          display: 'block', 
          background: 'rgba(0,0,0,0.4)',
          backdropFilter: 'blur(4px)'
        }} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <div className="d-flex align-items-center">
                  <div className="icon-wrapper me-3" style={{
                    background: 'linear-gradient(135deg, var(--priority-high), #FF8A9B)',
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <i className="bi bi-exclamation-triangle text-white"></i>
                  </div>
                  <h5 className="modal-title fw-600 mb-0">Confirmar Eliminación</h5>
                </div>
                <button type="button" className="btn-close" onClick={cancelarEliminarTarea}></button>
              </div>
              <div className="modal-body px-4 py-3">
                <p className="mb-0" style={{ color: 'var(--text-secondary)' }}>
                  ¿Estás seguro de que quieres eliminar esta tarea? Esta acción no se puede deshacer.
                </p>
              </div>
              <div className="modal-footer border-0 px-4 pb-4">
                <button 
                  type="button" 
                  className="btn btn-outline-secondary me-2"
                  onClick={cancelarEliminarTarea}
                  style={{
                    borderRadius: '10px',
                    padding: '0.5rem 1.5rem',
                    fontWeight: '500'
                  }}
                >
                  <i className="bi bi-x-circle me-2"></i>Cancelar
                </button>
                <button 
                  type="button" 
                  className="btn"
                  onClick={ejecutarEliminarTarea}
                  style={{
                    background: 'linear-gradient(135deg, var(--priority-high), #FF8A9B)',
                    border: 'none',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '0.5rem 1.5rem',
                    fontWeight: '500'
                  }}
                >
                  <i className="bi bi-trash me-2"></i>Eliminar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}