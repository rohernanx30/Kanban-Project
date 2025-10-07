const API_URL = 'http://127.0.0.1:3000/api/v1';

// TAREAS
export async function getTareas(columnaId) {
  const res = await fetch(`${API_URL}/columnas/${columnaId}/tareas`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener tareas');
  return data.data;
}

export async function crearTarea(columnaId, tareaData) {
  const res = await fetch(`${API_URL}/columnas/${columnaId}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(tareaData)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al crear tarea');
  return data.data;
}

export async function actualizarTarea(id, dataToUpdate) {
  const res = await fetch(`${API_URL}/tareas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dataToUpdate)
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar tarea');
  return data.data;
}

export async function eliminarTarea(id) {
  const res = await fetch(`${API_URL}/tareas/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al eliminar tarea');
  return data;
}

// COLUMNAS
export async function getColumnas(tableroId) {
  const res = await fetch(`${API_URL}/tableros/${tableroId}/columnas`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener columnas');
  return data.data;
}

export async function crearColumna(tableroId, { nombre, posicion }) {
  const res = await fetch(`${API_URL}/tableros/${tableroId}/columnas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, posicion })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al crear columna');
  return data.data;
}

export async function actualizarColumna(id, { nombre, posicion }) {
  const res = await fetch(`${API_URL}/columnas/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ nombre, posicion })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar columna');
  return data.data;
}

export async function eliminarColumna(id) {
  const res = await fetch(`${API_URL}/columnas/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al eliminar columna');
  return data;
}

export async function getTableros() {
  const res = await fetch(`${API_URL}/tableros`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener tableros');
  return data.data;
}
export async function crearTablero({ titulo, descripcion }) {
  const res = await fetch(`${API_URL}/tableros`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descripcion })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al crear tablero');
  return data.data;
}

export async function actualizarTablero(id, { titulo, descripcion }) {
  const res = await fetch(`${API_URL}/tableros/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descripcion })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al actualizar tablero');
  return data.data;
}

export async function eliminarTablero(id) {
  const res = await fetch(`${API_URL}/tableros/${id}`, {
    method: 'DELETE'
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al eliminar tablero');
  return data;
}