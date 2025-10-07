import './App.css';
import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


import Header from "./components/Header";  
import Tablero from "./components/Tablero";
import VistaTabla from "./components/VistaTabla";
import Footer from "./components/Footer";
import { 
  crearTablero as crearTableroApi, 
  getTableros,
  actualizarTablero as actualizarTableroApi,
  eliminarTablero as eliminarTableroApi,
  getColumnas,
  getTareas,
  actualizarTarea
} from "./api/kanbanApi";

export default function App() {
  const [tableros, setTableros] = React.useState([]);

  // Aplicar clases al body para el diseño global
  React.useEffect(() => {
    document.body.className = 'fade-in-up';
    return () => {
      document.body.className = '';
    };
  }, []);
  React.useEffect(() => {
    async function cargarTableros() {
      try {
        const tablerosBD = await getTableros();
        const adaptados = tablerosBD.map(t => ({ id: t.id, nombre: t.titulo, descripcion: t.descripcion, columnas: [] }));
        setTableros(adaptados);
      } catch (err) {
        console.error("Error al cargar tableros:", err.message);
      }
    }
    cargarTableros();
  }, []);

  const [modalVisible, setModalVisible] = React.useState(false);
  const [nuevoNombre, setNuevoNombre] = React.useState("");
  const [nuevaDescripcion, setNuevaDescripcion] = React.useState("");
  const [vista, setVista] = React.useState("inicio");
  const [tableroActivo, setTableroActivo] = React.useState(null);
  const [columnas, setColumnas] = React.useState([]);

  const [confirmModalVisible, setConfirmModalVisible] = React.useState(false);
  const [tableroAEliminar, setTableroAEliminar] = React.useState(null);

  React.useEffect(() => {
    async function cargarColumnas() {
      if (tableroActivo) {
        try {
          const cols = await getColumnas(tableroActivo.id);
          const columnasConTareas = await Promise.all(cols.map(async (col) => {
            const tareas = await getTareas(col.id);
            return { ...col, tareas: tareas.map(t => ({ ...t, texto: t.titulo })) };
          }));
          setColumnas(columnasConTareas);
        } catch (err) { 
          console.error("Error al cargar columnas:", err.message);
          setColumnas([]); 
        }
      } else {
        setColumnas([]);
      }
    }
    cargarColumnas();
  }, [tableroActivo]);

  const abrirModal = () => {
    setNuevoNombre("");
    setNuevaDescripcion("");
    setModalVisible(true);
  };

  const cerrarModal = () => {
    setModalVisible(false);
  };

  const crearTablero = async (e) => {
    e && e.preventDefault();
    if (!nuevoNombre.trim()) {
      console.warn("El nombre del tablero es obligatorio");
      return;
    }
    try {
      const data = await crearTableroApi({ titulo: nuevoNombre, descripcion: nuevaDescripcion });
      const nuevoTablero = { id: data.id, nombre: data.titulo, descripcion: data.descripcion, columnas: [] };
      setTableros([...tableros, nuevoTablero]);
      setTableroActivo(nuevoTablero);
      setVista("tablero");
      cerrarModal();
    } catch (err) {
      toast.error("Error al crear el tablero: " + err.message);
    }
  };

  const volverInicio = () => {
    setVista("inicio");
    setTableroActivo(null);
  };

  const verTabla = () => {
    setVista("tabla");
    setTableroActivo(null);
  }

  const actualizarTablero = async (tableroActualizado) => {
    try {
      await actualizarTableroApi(tableroActualizado.id, { titulo: tableroActualizado.nombre, descripcion: tableroActualizado.descripcion });
      setTableros(tableros.map(t => t.id === tableroActualizado.id ? tableroActualizado : t));
      setTableroActivo(tableroActualizado);
    } catch (err) {
      toast.error("Error al actualizar el tablero: " + err.message);
    }
  };

  const ejecutarEliminarTablero = async () => {
    if (!tableroAEliminar) return;
    try {
      await eliminarTableroApi(tableroAEliminar);
      setTableros(tableros.filter(t => t.id !== tableroAEliminar));
      setConfirmModalVisible(false);
      setTableroAEliminar(null);
    } catch (err) {
      console.error("Error al eliminar el tablero: " + err.message);
      setConfirmModalVisible(false);
      setTableroAEliminar(null);
    }
  };

  const confirmarEliminarTablero = (idTablero, e) => {
    e.stopPropagation();
    setTableroAEliminar(idTablero);
    setConfirmModalVisible(true);
  };

  const cancelarEliminarTablero = () => {
    setConfirmModalVisible(false);
    setTableroAEliminar(null);
  };

  return (
    <div className="app container-fluid p-0">
      {modalVisible && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={crearTablero}>
                <div className="modal-header"><h5 className="modal-title">Nuevo tablero</h5><button type="button" className="btn-close" onClick={cerrarModal}></button></div>
                <div className="modal-body">
                  <div className="mb-3"><label className="form-label">Nombre</label><input type="text" className="form-control" value={nuevoNombre} onChange={e => setNuevoNombre(e.target.value)} required /></div>
                  <div className="mb-3"><label className="form-label">Descripción</label><textarea className="form-control" value={nuevaDescripcion} onChange={e => setNuevaDescripcion(e.target.value)} /></div>
                </div>
                <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={cerrarModal}>Cancelar</button><button type="submit" className="btn btn-primary">Crear</button></div>
              </form>
            </div>
          </div>
        </div>
      )}

      {confirmModalVisible && (
        <div className="modal fade show" style={{ display: 'block', background: 'rgba(0,0,0,0.3)' }} tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header"><h5 className="modal-title">Confirmar eliminación</h5><button type="button" className="btn-close" onClick={cancelarEliminarTablero}></button></div>
              <div className="modal-body"><p>¿Estás seguro de que quieres eliminar este tablero?</p></div>
              <div className="modal-footer"><button type="button" className="btn btn-secondary" onClick={cancelarEliminarTablero}>Cancelar</button><button type="button" className="btn btn-danger" onClick={ejecutarEliminarTablero}>Eliminar</button></div>
            </div>
          </div>
        </div>
      )}

      <Header 
        vista={vista} 
        crearTablero={abrirModal} 
        volverInicio={volverInicio} 
        verTabla={verTabla}
      />

      <main className="container-fluid py-4">
        {vista === "inicio" && (
          <> 
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2>Tus tableros</h2>
              <button className="btn btn-primary d-md-none" onClick={abrirModal}>+</button>
            </div>
            <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-3">
              {tableros.map((t) => (
                <div className="col" key={t.id} onClick={() => { 
                  setTableroActivo(t); 
                  setVista("tablero"); 
                }}>
                  <div className="card h-100 shadow-sm cursor-pointer">
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{t.nombre}</h5>
                      <p className="card-text text-muted mt-auto">Click para abrir</p>
                      <button className="btn btn-sm btn-outline-danger mt-2" onClick={(e) => confirmarEliminarTablero(t.id, e)}>Eliminar</button>
                    </div>
                  </div>
                </div>
              ))}
              <div className="col">
                <div className="card h-100 border-dashed text-center d-flex justify-content-center align-items-center cursor-pointer" style={{ minHeight: "120px" }} onClick={abrirModal}>
                  <div><h1>+</h1><p>Nuevo tablero</p></div>
                </div>
              </div>
            </div>
          </>
        )}

        {vista === "tablero" && tableroActivo && (
          <div className="overflow-auto">
            <Tablero 
              tablero={tableroActivo} 
              actualizarTablero={actualizarTablero}
              columnas={columnas}
              setColumnas={setColumnas}
            />
          </div>
        )}

        {vista === "tabla" && (
          <VistaTabla 
            tableros={tableros}
            columnas={columnas}
            setColumnas={setColumnas}
            getTareas={getTareas}
            getColumnas={getColumnas}
          />
        )}
      </main>

      <Footer />
      
    </div>
  );
}

  