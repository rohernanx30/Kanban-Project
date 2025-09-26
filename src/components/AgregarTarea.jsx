import React, { useState } from "react";
import '../App.css'; 

export default function AgregarTarea({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState("");

  function submit() {
    if (!texto.trim()) return;
    onAdd(texto.trim());
    setTexto("");
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="agregar-tarea-btn" onClick={() => setOpen(true)}>
        + Agregar tarea
      </button>
    );
  }

  return (
    <div className="agregar-tarea-form">
      <textarea
        className="agregar-tarea-input"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Describe la tarea..."
        rows={3}
      />
      <div style={{ marginTop: 8, display: "flex", gap: 8 }}>
        <button className="btn" onClick={submit}>
          Agregar
        </button>
        <button className="btn btn-ghost" onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
