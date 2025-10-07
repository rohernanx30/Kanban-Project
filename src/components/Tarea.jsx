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
  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'Alto': return 'exclamation-triangle-fill';
      case 'Medio': return 'clock-fill';
      case 'Bajo': return 'check-circle-fill';
      default: return 'circle';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'Alto': return 'var(--priority-high)';
      case 'Medio': return 'var(--priority-medium)';
      case 'Bajo': return 'var(--priority-low)';
      default: return 'var(--text-muted)';
    }
  };

  return (
    <div 
      className="card task-card mb-3"
      style={{
        background: '#FFFFFF',
        border: '1px solid var(--border-light)',
        borderRadius: '16px',
        boxShadow: 'var(--shadow-soft)',
        transition: 'all 0.3s ease',
        overflow: 'hidden'
      }}
    >
      <div className="card-body p-3">
        {/* Header con título y prioridad */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h6 className="card-title mb-0 fw-600" style={{ 
            color: 'var(--text-primary)',
            fontSize: '1rem',
            lineHeight: '1.4'
          }}>
            {tarea.titulo}
          </h6>
          <div className="d-flex align-items-center">
            <i 
              className={`bi bi-${getPriorityIcon(tarea.prioridad)} me-1`}
              style={{ 
                color: getPriorityColor(tarea.prioridad),
                fontSize: '0.9rem'
              }}
            ></i>
            <span 
              className={`badge bg-${getPriorityClass(tarea.prioridad)}`}
              style={{
                fontSize: '0.7rem',
                fontWeight: '500',
                padding: '0.3em 0.6em',
                borderRadius: '12px'
              }}
            >
              {tarea.prioridad}
            </span>
          </div>
        </div>
        
        {/* Descripción */}
        <p 
          className="card-text mb-3" 
          style={{ 
            color: 'var(--text-secondary)',
            fontSize: '0.875rem',
            lineHeight: '1.5',
            marginBottom: '0.75rem'
          }}
        >
          {tarea.descripcion}
        </p>

        {/* Información adicional */}
        <div className="mb-3">
          <div className="d-flex align-items-center mb-2">
            <i className="bi bi-person-circle me-2" style={{ color: 'var(--canva-blue)' }}></i>
            <span className="small fw-500" style={{ color: 'var(--text-secondary)' }}>
              {tarea.asignado_a || 'Sin asignar'}
            </span>
          </div>

          {tarea.fecha_limite && (
            <div className="d-flex align-items-center mb-2">
              <i className="bi bi-calendar-event me-2" style={{ color: 'var(--canva-coral)' }}></i>
              <span className="small fw-500" style={{ color: 'var(--priority-high)' }}>
                {new Date(tarea.fecha_limite).toLocaleDateString('es-ES', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })}
              </span>
            </div>
          )}
        </div>

        {/* Barra de progreso */}
        <div className="mb-3">
          <div className="d-flex justify-content-between align-items-center mb-1">
            <span className="small fw-500" style={{ color: 'var(--text-secondary)' }}>
              Progreso
            </span>
            <span className="small fw-600" style={{ color: 'var(--canva-blue)' }}>
              {tarea.porcentaje_avance}%
            </span>
          </div>
          <div className="progress" style={{ height: '8px', borderRadius: '10px' }}>
            <div 
              className="progress-bar" 
              role="progressbar" 
              style={{ 
                width: `${tarea.porcentaje_avance}%`,
                background: 'linear-gradient(135deg, var(--canva-mint), var(--canva-blue))',
                borderRadius: '10px',
                transition: 'width 0.6s ease'
              }} 
              aria-valuenow={tarea.porcentaje_avance}
              aria-valuemin="0" 
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="d-flex justify-content-end gap-2">
          <button 
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(tarea)}
            style={{
              borderRadius: '8px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              border: '1.5px solid var(--canva-blue)',
              color: 'var(--canva-blue)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--canva-blue)';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--canva-blue)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <i className="bi bi-pencil me-1"></i>Editar
          </button>
          <button 
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(tarea.id)}
            style={{
              borderRadius: '8px',
              padding: '0.4rem 0.8rem',
              fontSize: '0.75rem',
              fontWeight: '500',
              border: '1.5px solid var(--priority-high)',
              color: 'var(--priority-high)',
              transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'var(--priority-high)';
              e.target.style.color = 'white';
              e.target.style.transform = 'translateY(-1px)';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'transparent';
              e.target.style.color = 'var(--priority-high)';
              e.target.style.transform = 'translateY(0)';
            }}
          >
            <i className="bi bi-trash me-1"></i>Eliminar
          </button>
        </div>
      </div>
    </div>
  );
}