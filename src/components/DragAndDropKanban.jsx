import React, { useEffect, useState } from 'react';
import {
  getTableros,
  getColumnas,
  getTareas,
  actualizarTarea
} from '../api/kanbanApi';
import Columna from './Columna';

// Drag and drop: helpers para mover tareas entre columnas
const moveTask = (tareasPorColumna, sourceColId, destColId, tareaId) => {
  const sourceTasks = Array.from(tareasPorColumna[sourceColId]);
  const destTasks = Array.from(tareasPorColumna[destColId]);
  const tareaIdx = sourceTasks.findIndex(t => t.id === tareaId);
  if (tareaIdx === -1) return tareasPorColumna;
  const [removed] = sourceTasks.splice(tareaIdx, 1);
  destTasks.push(removed);
  return {
    ...tareasPorColumna,
    [sourceColId]: sourceTasks,
    [destColId]: destTasks
  };
};

const grid = 8;
const getItemStyle = (isDragging, draggableStyle) => ({
  userSelect: 'none',
  padding: grid * 2,
  margin: `0 0 ${grid}px 0`,
  background: isDragging ? '#bbdefb' : '#fff',
  borderRadius: '6px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  ...draggableStyle
});
const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? '#e3f2fd' : '#f4f4f4',
  padding: grid,
  minWidth: 250,
  borderRadius: 8,
  transition: 'background 0.2s'
});

const DragAndDropKanban = () => {
  const [tableroId, setTableroId] = useState(null);
  const [columnas, setColumnas] = useState([]);
  const [tareasPorColumna, setTareasPorColumna] = useState({});
  const [loading, setLoading] = useState(true);

  // Funcionamiento de la API: carga tableros, columnas y tareas al iniciar
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const tableros = await getTableros(); // API: obtener tableros
      const id = tableros[0]?.id;
      setTableroId(id);
      if (!id) return;
      const cols = await getColumnas(id); // API: obtener columnas
      setColumnas(cols);
      const tareasObj = {};
      for (const col of cols) {
        const tareas = await getTareas(col.id); // API: obtener tareas por columna
        tareasObj[col.id] = tareas.sort((a, b) => a.posicion - b.posicion);
      }
      setTareasPorColumna(tareasObj);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Drag and drop: mueve tarea entre columnas y actualiza visualmente y en la base de datos
  const moverTareaGlobal = async (tarea, sourceColId, destColId) => {
    if (sourceColId === destColId) {
      return; // No se mueve si la columna es la misma
    }
    // Actualizacion visual inmediata
    const sourceTasks = Array.isArray(tareasPorColumna[sourceColId]) ? [...tareasPorColumna[sourceColId]] : [];
    const destTasks = Array.isArray(tareasPorColumna[destColId]) ? [...tareasPorColumna[destColId]] : [];
    
    // Encuentra la tarea en la columna de origen
    const tareaIdx = sourceTasks.findIndex(t => t.id === tarea.id);
    if (tareaIdx === -1) {
      console.warn(`[moverTareaGlobal] Tarea ${tarea.id} no encontrada en columna ${sourceColId}`);
      return; // La tarea no existe en la columna de origen
    }
    
    // Eliminar de origen y añadir a destino
    const [tareaAMover] = sourceTasks.splice(tareaIdx, 1);
    const nuevaTarea = { ...tareaAMover, columna_id: destColId };
    destTasks.push(nuevaTarea);
    
    // Actualizar UI INMEDIATAMENTE - actualización optimista
    setTareasPorColumna(prev => ({
      ...prev,
      [sourceColId]: sourceTasks,
      [destColId]: destTasks
    }));
    
    console.log(`[moverTareaGlobal] UI actualizada inmediatamente`);
    
    // 2. Actualizar la base de datos en segundo plano (async)
    try {
      console.log(`[moverTareaGlobal] Actualizando BD...`);
      await actualizarTarea(tarea.id, { columna_id: destColId });
      console.log(`[moverTareaGlobal] BD actualizada exitosamente`);
      
      // 3. Sincronizar con el servidor (recargar solo las columnas afectadas)
      const [nuevasSource, nuevasDest] = await Promise.all([
        getTareas(sourceColId),
        getTareas(destColId)
      ]);
      
      // Actualizar solo las columnas afectadas con datos frescos del servidor
      setTareasPorColumna(prev => ({
        ...prev,
        [sourceColId]: Array.isArray(nuevasSource) ? nuevasSource : [],
        [destColId]: Array.isArray(nuevasDest) ? nuevasDest : []
      }));
      
      console.log(`[moverTareaGlobal] Columnas sincronizadas con el servidor`);
      
    } catch (error) {
      console.error("[moverTareaGlobal] Error al mover la tarea:", error);
      
      // Revertir cambios en la UI en caso de error
      try {
        const [nuevasSource, nuevasDest] = await Promise.all([
          getTareas(sourceColId),
          getTareas(destColId)
        ]);
        
        setTareasPorColumna(prev => ({
          ...prev,
          [sourceColId]: Array.isArray(nuevasSource) ? nuevasSource : [],
          [destColId]: Array.isArray(nuevasDest) ? nuevasDest : []
        }));
        
        console.log(`[moverTareaGlobal] Cambios revertidos`);
      } catch (revertError) {
        console.error("[moverTareaGlobal] Error al revertir cambios:", revertError);
      }
      
      alert("Error al mover la tarea. Por favor, inténtalo de nuevo.");
    }
  };

  if (loading) return <div>Cargando...</div>;

  // Funciones de edición/eliminación (puedes adaptar según tu lógica)
  const handleEdit = (tarea) => {
    // Aquí puedes abrir modal o navegar para editar
    alert('Editar tarea: ' + tarea.titulo);
  };
  const handleDelete = async (id) => {
    // Aquí puedes llamar a la API y refrescar
    alert('Eliminar tarea: ' + id);
  };

  // Asegurarse de que moverTareaGlobal sea una función válida antes de pasarla
  console.log('moverTareaGlobal en DragAndDropKanban es de tipo:', typeof moverTareaGlobal);
  
  return (
    <div style={{ display: 'flex', gap: '1rem' }}>
      {columnas.map((col, idx) => (
        <Columna
          key={col.id}
          columna={{ ...col, tareas: Array.isArray(tareasPorColumna[col.id]) ? tareasPorColumna[col.id] : [] }}
          setTareas={(tareasActualizadas) => {
            setTareasPorColumna(prev => ({ ...prev, [col.id]: Array.isArray(tareasActualizadas) ? tareasActualizadas : [] }));
          }}
          setNombre={() => {}}
          todasLasColumnas={columnas}
          recargarTablero={() => {}}
          index={idx}
          moverTareaGlobal={moverTareaGlobal}
        />
      ))}
    </div>
  );
};

export default DragAndDropKanban;
