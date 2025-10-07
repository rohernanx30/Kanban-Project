import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

const getPriorityClass = (priority) => {
  switch (priority) {
    case 'Alto': return 'danger';
    case 'Medio': return 'warning';
    case 'Bajo': return 'success';
    default: return 'secondary';
  }
};

export default function Tarea({ tarea, onEdit, onDelete }) {
  return (
    <div className="card shadow-sm mb-2">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start">
          <h5 className="card-title mb-1">{tarea.titulo}</h5>
          <span className={`badge bg-${getPriorityClass(tarea.prioridad)}`}>
            {tarea.prioridad}
          </span>
        </div>
        
        <p className="card-text text-muted small">{tarea.descripcion}</p>

        <div className="mb-2">
            <span className="fw-bold small">Asignado a:</span> {tarea.asignado_a || 'N/A'}
        </div>

        {tarea.fecha_limite && (
          <div className="text-danger small mb-2">
            <strong>Límite:</strong> {new Date(tarea.fecha_limite).toLocaleDateString()}
          </div>
        )}

        <div className="progress mb-2" style={{height: '10px'}}>
            <div 
                className="progress-bar" 
                role="progressbar" 
                style={{width: `${tarea.porcentaje_avance}%`}} 
                aria-valuenow={tarea.porcentaje_avance}
                aria-valuemin="0" 
                aria-valuemax="100"
            ></div>
        </div>

        <div className="d-flex justify-content-end gap-2">
            <button className="btn btn-outline-primary btn-sm" onClick={() => onEdit(tarea)}>
                Editar
            </button>
            <button className="btn btn-outline-danger btn-sm" onClick={() => onDelete(tarea.id)}>
                Eliminar
            </button>
        </div>
      </div>
    </div>
  );
}