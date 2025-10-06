import express from 'express';
import cors from 'cors';
import mysql from 'mysql2/promise';

const app = express();
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'kanban'
};

// Tableros
app.post('/api/v1/tableros', async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const db = await mysql.createConnection(dbConfig);
    const [result] = await db.execute(
      'INSERT INTO tablero (titulo, descripcion) VALUES (?, ?)',
      [titulo, descripcion]
    );
    const [tablero] = await db.execute('SELECT * FROM tablero WHERE id = ?', [result.insertId]);
    res.json({ message: 'Tablero creado', data: tablero[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/tableros', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [tableros] = await db.execute('SELECT * FROM tablero');
    res.json({ data: tableros });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/tableros/:id', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [tablero] = await db.execute('SELECT * FROM tablero WHERE id = ?', [req.params.id]);
    const [columnas] = await db.execute('SELECT * FROM columnas WHERE tablero_id = ?', [req.params.id]);
    for (const columna of columnas) {
      const [tareas] = await db.execute('SELECT * FROM tareas WHERE columna_id = ?', [columna.id]);
      columna.tareas = tareas;
    }
    res.json({ data: { ...tablero[0], columnas } });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/v1/tableros/:id', async (req, res) => {
  try {
    const { titulo, descripcion } = req.body;
    const db = await mysql.createConnection(dbConfig);
    await db.execute('UPDATE tablero SET titulo = ?, descripcion = ? WHERE id = ?', [titulo, descripcion, req.params.id]);
    const [tablero] = await db.execute('SELECT * FROM tablero WHERE id = ?', [req.params.id]);
    res.json({ message: 'Tablero actualizado', data: tablero[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/v1/tableros/:id', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM tablero WHERE id = ?', [req.params.id]);
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Columnas
app.post('/api/v1/tableros/:tableroId/columnas', async (req, res) => {
  try {
    const { nombre, posicion } = req.body;
    const db = await mysql.createConnection(dbConfig);
    const [result] = await db.execute(
      'INSERT INTO columnas (nombre, posicion, tablero_id) VALUES (?, ?, ?)',
      [nombre, posicion, req.params.tableroId]
    );
    const [columna] = await db.execute('SELECT * FROM columnas WHERE id = ?', [result.insertId]);
    res.json({ message: 'Columna creada', data: columna[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/tableros/:tableroId/columnas', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [columnas] = await db.execute('SELECT * FROM columnas WHERE tablero_id = ?', [req.params.tableroId]);
    res.json({ data: columnas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/v1/columnas/:id', async (req, res) => {
  try {
    const { nombre, posicion } = req.body;
    const db = await mysql.createConnection(dbConfig);

    const fields = [];
    const values = [];
    if (nombre !== undefined) {
      fields.push('nombre = ?');
      values.push(nombre);
    }
    if (posicion !== undefined) {
      fields.push('posicion = ?');
      values.push(posicion);
    }
    values.push(req.params.id);

    await db.execute(`UPDATE columnas SET ${fields.join(', ')} WHERE id = ?`, values);
    const [columna] = await db.execute('SELECT * FROM columnas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Columna actualizada', data: columna[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/v1/columnas/:id', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM columnas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Tareas
app.post('/api/v1/columnas/:columnaId/tareas', async (req, res) => {
  try {
    const { titulo, descripcion, posicion } = req.body;
    const db = await mysql.createConnection(dbConfig);
    const [result] = await db.execute(
      'INSERT INTO tareas (titulo, descripcion, columna_id, posicion) VALUES (?, ?, ?, ?)',
      [titulo, descripcion, req.params.columnaId, posicion]
    );
    const [tarea] = await db.execute('SELECT * FROM tareas WHERE id = ?', [result.insertId]);
    res.json({ message: 'Tarea creada', data: tarea[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.get('/api/v1/columnas/:columnaId/tareas', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    const [tareas] = await db.execute('SELECT * FROM tareas WHERE columna_id = ?', [req.params.columnaId]);
    res.json({ data: tareas });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.put('/api/v1/tareas/:id', async (req, res) => {
  try {
    const { titulo, descripcion, posicion, columna_id } = req.body;
    const db = await mysql.createConnection(dbConfig);

    const fields = [];
    const values = [];
    if (titulo !== undefined) {
      fields.push('titulo = ?');
      values.push(titulo);
    }
    if (descripcion !== undefined) {
      fields.push('descripcion = ?');
      values.push(descripcion);
    }
    if (posicion !== undefined) {
      fields.push('posicion = ?');
      values.push(posicion);
    }
    values.push(req.params.id);

    await db.execute(`UPDATE tareas SET ${fields.join(', ')} WHERE id = ?`, values);
    const [tarea] = await db.execute('SELECT * FROM tareas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Tarea actualizada', data: tarea[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete('/api/v1/tareas/:id', async (req, res) => {
  try {
    const db = await mysql.createConnection(dbConfig);
    await db.execute('DELETE FROM tareas WHERE id = ?', [req.params.id]);
    res.json({ message: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`API corriendo en http://localhost:${PORT}/api/v1`);
});