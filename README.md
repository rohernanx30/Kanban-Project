# 🧩 Proyecto Kanban - Gestor de Tareas 

Este proyecto es una aplicación web de gestión de tareas, desarrollada con **Vite + React (JSX)**, **Node.js**, **API REST** y una **base de datos** conectada para la persistencia de los datos.  

Permite crear tableros, columnas y tareas de manera dinámica, con actualizaciones automáticas en la base de datos, alertas de confirmación y visualización en formato de mosaico o tabla.

---

## 🚀 Características principales

- **Creación de tableros:** desde el menú principal puedes generar nuevos tableros para organizar tus proyectos.  
- **Visualización en mosaico:** todos los tableros creados se muestran como tarjetas interactivas.  
- **Gestión de columnas:** dentro de cada tablero puedes crear las columnas que necesites (por ejemplo: “Pendiente”, “En proceso”, “Completado”).  
- **Tareas personalizables:** cada tarea incluye: Título, descripción, fecha de creación, fecha límite, persona que asigna, persona asignada, porcentaje de avance y grado de prioridad.
- **Edición de tareas:** puedes hacer clic en una tarea para editar sus datos.  
- **Arrastrar y soltar:** las tareas pueden moverse entre columnas fácilmente (drag & drop).  
- **Actualización automática:** todo cambio (creación, edición, eliminación o movimiento) se refleja de inmediato en la base de datos.  
- **Alertas de confirmación:** al eliminar tableros, columnas o tareas aparece una alerta de confirmación.  
- **Vista en tabla:** desde la pestaña “Tabla” se puede seleccionar un tablero y visualizar sus tareas en formato tabular.  
- **Diseño responsivo:** la interfaz está construida con **Bootstrap**, garantizando un diseño moderno y adaptable.

---

## 🛠️ Tecnologías utilizadas

- **Frontend:** React + Vite  
- **Estilos:** Bootstrap  
- **Backend:** Node.js (API REST)  
- **Base de datos:** MySQL
- **Lenguaje:** JavaScript (JSX en el frontend)

---

## ⚙️ Instalación y ejecución

Sigue los siguientes pasos para ejecutar el proyecto en tu entorno local:

### 1️⃣ Clona el repositorio
```bash
git clone https://github.com/rohernanx30/Kanban-Project.git
cd Kanban-Project
```
### 2️⃣ Instala las dependencias
```bash
npm install
```
### 3️⃣ Instala Bootstrap
```bash
npm install bootstrap
```
### 4️⃣ Ejecuta la base de dato
Configura y levanta tu base de datos MySQL, la estructura de la base se encuentra en el archivo de texto bd.txt

### 5️⃣ Levanta la API
```bash
node api.js
```
### 6️⃣ Inicia el frontend con Vite
```bash
npm run dev
```
## 👨‍💻 Autores

Desarrollado por **grupo 5**
- Daniel Alexander Alas
- Manuel Alexander Hernández
- Erick Francisco Magaña
- Rocío Guadalupe Martínez
- Edwar Francisco Ramos
 
💻 Proyecto final del bootcamp FSJ-28 Kodigo-Incaf 

## 📄 Licencia
Este proyecto está protegido bajo la licencia **Creative Commons Atribución-NoComercial 4.0 Internacional (CC BY-NC 4.0)**.  
Esto significa que puede ser usado, modificado y compartido únicamente con fines **educativos o personales**, siempre dando crédito a los autores originales y **sin fines comerciales**.

Más información: [https://creativecommons.org/licenses/by-nc/4.0/](https://creativecommons.org/licenses/by-nc/4.0/)
