import React from "react";
import './components.css';

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
    <div className="board-card" style={{ minWidth: "250px", maxWidth: "250px" }}>
      <input
        type="text"
        value={nombre}
        onChange={cambiarNombre}
        placeholder="Nombre de columna"
        style={{
          fontWeight: "700",
          margin: "0.5rem",
          width: "calc(100% - 1rem)",
          padding: "0.25rem",
          borderRadius: "4px",
          border: "1px solid #ccc"
        }}
      />
      <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", padding: "0 0.5rem" }}>
        {tareas.map(t => (
          <div key={t.id} className="board-card" style={{ padding: "0.5rem", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <input
              type="text"
              value={t.texto}
              onChange={(e) => cambiarTarea(t.id, e.target.value)}
              style={{ flexGrow: 1, border: "none", background: "transparent", outline: "none" }}
            />
            <button
              onClick={() => eliminarTarea(t.id)}
              style={{
                marginLeft: "0.5rem",
                backgroundColor: "#ff4d4f",
                color: "white",
                border: "none",
                borderRadius: "9999px",
                padding: "0.25rem 0.5rem",
                cursor: "pointer"
              }}
            >
              ✕
            </button>
          </div>
        ))}
        <button
          onClick={agregarTarea}
          className="actions"
          style={{ marginTop: "0.5rem", width: "100%" }}
        >
          + Agregar tarea
        </button>
      </div>
    </div>
  );
}
