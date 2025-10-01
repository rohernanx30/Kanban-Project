import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function Columna({ columna, actualizarColumna }) {
  const [nombre, setNombre] = React.useState(columna.nombre);
  const [tareas, setTareas] = React.useState(columna.tareas || []);

  const cambiarNombre = (e) => {
    setNombre(e.target.value);
    actualizarColumna({ ...columna, nombre: e.target.value, tareas });
  };

  const agregarTarea = () => {
    const nuevaTarea = { id: Date.now(), texto: "Nueva tarea" };
    const nuevasTareas = [...tareas, nuevaTarea];
    setTareas(nuevasTareas);
    actualizarColumna({ ...columna, nombre, tareas: nuevasTareas });
  };

  const cambiarTarea = (id, texto) => {
    const nuevasTareas = tareas.map(t => t.id === id ? { ...t, texto } : t);
    setTareas(nuevasTareas);
    actualizarColumna({ ...columna, nombre, tareas: nuevasTareas });
  };

  const eliminarTarea = (id) => {
    const nuevasTareas = tareas.filter(t => t.id !== id);
    setTareas(nuevasTareas);
    actualizarColumna({ ...columna, nombre, tareas: nuevasTareas });
  };

  return (
    <div className="card mb-3" style={{ minWidth: "250px", maxWidth: "250px" }}>
      {/* Nombre de la columna */}
      <input
        type="text"
        value={nombre}
        onChange={cambiarNombre}
        className="form-control fw-bold mb-2"
        placeholder="Nombre de columna"
      />

      {/* Lista de tareas */}
      <div className="d-flex flex-column gap-2 p-2">
        {tareas.map(t => (
          <div key={t.id} className="d-flex align-items-center gap-2 bg-light rounded p-2">
            <input
              type="text"
              value={t.texto}
              onChange={(e) => cambiarTarea(t.id, e.target.value)}
              className="form-control"
            />
            <button 
              onClick={() => eliminarTarea(t.id)} 
              className="btn btn-danger btn-sm"
            >
              ✕
            </button>
          </div>
        ))}

        {/* Botón agregar tarea */}
        <button 
          onClick={agregarTarea} 
          className="btn btn-outline-primary mt-2"
        >
          + Agregar tarea
        </button>
      </div>
    </div>
  );
}
