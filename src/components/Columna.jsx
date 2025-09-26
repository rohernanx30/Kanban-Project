import React from "react";
import './components.css';
import '../App.css'; 

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

  return (
    <div className="board-card" style={{ minWidth: "250px", maxWidth: "250px" }}>
      <input
        type="text"
        value={nombre}
        onChange={cambiarNombre}
        style={{ fontWeight: "700", margin: "0.5rem" }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0 0.5rem" }}>
        {tareas.map(t => (
          <input
            key={t.id}
            type="text"
            value={t.texto}
            onChange={(e) => cambiarTarea(t.id, e.target.value)}
            style={{ padding: "0.25rem", borderRadius: "4px", border: "1px solid #ccc" }}
          />
        ))}
        <button onClick={agregarTarea} style={{ marginTop: "0.5rem", borderRadius: "9999px", backgroundColor: "#997047", color: "white", border: "none", padding: "0.25rem" }}>+ Agregar tarea</button>
      </div>
    </div>
  );
}
