// TAREAS
export async function getTareas(columnaId) {
  const res = await fetch(`${API_URL}/columnas/${columnaId}/tareas`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener tareas');
  return data.data;
}

export async function crearTarea(columnaId, { titulo, descripcion, posicion }) {
  const res = await fetch(`${API_URL}/columnas/${columnaId}/tareas`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ titulo, descripcion, posicion })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al crear tarea');
  return data.data;
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
export async function getTableros() {
  const res = await fetch(`${API_URL}/tableros`);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Error al obtener tableros');
  return data.data;
}


const API_URL = 'http://127.0.0.1:3000/api/v1';

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

