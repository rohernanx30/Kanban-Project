import React from 'react';

// Calcula los dias totales entre dos fechas
const calcularDiasTotales = (fechaInicio, fechaFin) => {
  if (!fechaInicio || !fechaFin) return 'N/A';
  const inicio = new Date(fechaInicio);
  const fin = new Date(fechaFin);
  const diffTiempo = fin.getTime() - inicio.getTime();
  const diffDias = Math.ceil(diffTiempo / (1000 * 3600 * 24));
  return diffDias >= 0 ? diffDias : 0;
};

// Calcula los dias faltantes hasta la fecha fin
const calcularDiasFaltantes = (fechaFin) => {
  if (!fechaFin) return 'N/A';
  const hoy = new Date();
  const fin = new Date(fechaFin);
  hoy.setHours(0, 0, 0, 0);
  fin.setHours(0, 0, 0, 0);
  const diffTiempo = fin.getTime() - hoy.getTime();
  const diffDias = Math.ceil(diffTiempo / (1000 * 3600 * 24));
  return diffDias >= 0 ? diffDias : 0;
};

export default function VistaTabla({ tableros, getColumnas, getTareas }) {
  const [tableroSeleccionado, setTableroSeleccionado] = React.useState(null);
  const [tareas, setTareas] = React.useState([]);

  // Funcionamiento de la API: carga tareas del tablero seleccionado
  React.useEffect(() => {
    if (tableroSeleccionado) {
      const cargarTareas = async () => {
        try {
          const cols = await getColumnas(tableroSeleccionado.id); // API: obtener columnas
          const tareasPorColumna = await Promise.all(
            cols.map(async (col) => {
              const tareasDeCol = await getTareas(col.id); // API: obtener tareas
              return tareasDeCol.map(t => ({ ...t, estado: col.nombre }));
            })
          );
          setTareas(tareasPorColumna.flat());
        } catch (error) {
          alert("No se pudieron cargar las tareas del tablero.");
        }
      };
      cargarTareas();
    } else {
      setTareas([]);
    }
  }, [tableroSeleccionado, getColumnas, getTareas]);

  // Validacion: seleccion de tablero
  const handleSelectTablero = (e) => {
    const tableroId = e.target.value;
    if (tableroId) {
        const tablero = tableros.find(t => t.id === parseInt(tableroId));
        setTableroSeleccionado(tablero);
    } else {
        setTableroSeleccionado(null);
    }
  };

  return (
    <div className="container-fluid">
      <h2>Vista de Tablas</h2>
      <p>Seleccione un tablero para ver sus tareas en formato de tabla.</p>

      <div className="mb-3">
        <select className="form-select" onChange={handleSelectTablero} defaultValue="">
          <option value="">Seleccione un tablero</option>
          {tableros.map(tablero => (
            <option key={tablero.id} value={tablero.id}>
              {tablero.nombre}
            </option>
          ))}
        </select>
      </div>

      {tableroSeleccionado && (
        <div>
          <h3>{tableroSeleccionado.nombre}</h3>
          <div className="table-responsive">
            <table className="table table-striped table-bordered">
              <thead className="table-dark">
                <tr>
                  <th scope="col">Nº</th>
                  <th scope="col">Nombre</th>
                  <th scope="col">Descripción</th>
                  <th scope="col">Asignado por</th>
                  <th scope="col">Asignado a</th>
                  <th scope="col">Fecha Asignación</th>
                  <th scope="col">Fecha Límite</th>
                  <th scope="col">Prioridad</th>
                  <th scope="col">% Avance</th>
                  <th scope="col">Días Totales</th>
                  <th scope="col">Días Faltantes</th>
                </tr>
              </thead>
              <tbody>
                {tareas.map((tarea, index) => (
                  <tr key={tarea.id}>
                    <th scope="row">{index + 1}</th>
                    <td>{tarea.titulo || 'N/A'}</td>
                    <td>{tarea.descripcion || 'N/A'}</td>
                    <td>{tarea.asignado_por || 'N/A'}</td>
                    <td>{tarea.asignado_a || 'N/A'}</td>
                    <td>{new Date(tarea.fecha_creacion).toLocaleDateString()}</td>
                    <td>{tarea.fecha_limite ? new Date(tarea.fecha_limite).toLocaleDateString() : 'N/A'}</td>
                    <td>{tarea.prioridad === 'Bajo' ? 'Baja' : tarea.prioridad || 'N/A'}</td>
                    <td>
                      <div className="progress">
                        <div 
                          className="progress-bar" 
                          role="progressbar" 
                          style={{width: `${tarea.porcentaje_avance || 0}%`}} 
                          aria-valuenow={tarea.porcentaje_avance || 0}
                          aria-valuemin="0" 
                          aria-valuemax="100"
                        >
                          {`${tarea.porcentaje_avance || 0}%`}
                        </div>
                      </div>
                    </td>
                    <td>{calcularDiasTotales(tarea.fecha_creacion, tarea.fecha_limite)}</td>
                    <td>{calcularDiasFaltantes(tarea.fecha_limite)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}