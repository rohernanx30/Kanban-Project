
import React, { useState } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';

export default function AgregarTarea({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [texto, setTexto] = useState("");

  // Validacion: no se permite agregar tareas vacias
  const submit = () => {
    if (!texto.trim()) return;
    onAdd(texto.trim());
    setTexto("");
    setOpen(false);
  };

  if (!open) {
    return (
      <button 
        className="btn btn-outline-primary w-100" 
        onClick={() => setOpen(true)}
      >
        + Agregar tarea
      </button>
    );
  }

  return (
    <div className="mt-2">
      <textarea
        className="form-control mb-2"
        value={texto}
        onChange={(e) => setTexto(e.target.value)}
        placeholder="Describe la tarea..."
        rows={3}
      />
      <div className="d-flex gap-2">
        <button className="btn btn-primary" onClick={submit}>
          Agregar
        </button>
        <button className="btn btn-secondary" onClick={() => setOpen(false)}>
          Cancelar
        </button>
      </div>
    </div>
  );
}
