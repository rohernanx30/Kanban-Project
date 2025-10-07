import logo from "../assets/icon.png";

export default function Header({ vista, crearTablero, volverInicio, verTabla }) {
    return (
        <nav className="navbar navbar-expand-lg px-4 py-3" style={{
            background: 'linear-gradient(135deg, #87CEEB 0%, #B8A7D9 100%)',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0 0 20px 20px'
        }}>
            <a 
                className="navbar-brand d-flex align-items-center fw-bold text-white" 
                href="#"
                onClick={(e) => { e.preventDefault(); volverInicio(); }}
                style={{ 
                    cursor: 'pointer',
                    fontSize: '1.5rem',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
            >
                <div className="icon-wrapper me-3" style={{
                    background: 'rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)',
                    width: '48px',
                    height: '48px',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <i className="bi bi-kanban" style={{ fontSize: '1.5rem', color: 'white' }}></i>
                </div>
                TaskFlow
            </a>

            {/* Botón hamburguesa solo en móvil */}
            <button
                className="navbar-toggler d-lg-none"
                type="button"
                data-bs-toggle="offcanvas"
                data-bs-target="#offcanvasNavbar"
                aria-controls="offcanvasNavbar"
            >
                <span className="navbar-toggler-icon"></span>
            </button>

            {/* Menú de escritorio */}
            <div className="collapse navbar-collapse d-none d-lg-flex justify-content-between">
                <ul className="navbar-nav me-auto">
                    <li className="nav-item">
                        <a 
                            className="nav-link text-white fw-500 px-3 py-2 rounded-pill me-2" 
                            href="#"
                            onClick={(e) => { e.preventDefault(); volverInicio(); }}
                            style={{ 
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backgroundColor: vista === "inicio" ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (vista !== "inicio") {
                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (vista !== "inicio") {
                                    e.target.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <i className="bi bi-house-door me-2"></i>Inicio
                        </a>
                    </li>
                    <li className="nav-item">
                        <a 
                            className="nav-link text-white fw-500 px-3 py-2 rounded-pill" 
                            href="#" 
                            onClick={(e) => { e.preventDefault(); verTabla(); }}
                            style={{ 
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                backgroundColor: vista === "tabla" ? 'rgba(255, 255, 255, 0.2)' : 'transparent'
                            }}
                            onMouseEnter={(e) => {
                                if (vista !== "tabla") {
                                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (vista !== "tabla") {
                                    e.target.style.backgroundColor = 'transparent';
                                }
                            }}
                        >
                            <i className="bi bi-table me-2"></i>Tablas
                        </a>
                    </li>
                </ul>

                <div className="d-flex">
                    {vista === "inicio" && (
                        <button 
                            className="btn text-white fw-500 px-4 py-2"
                            onClick={crearTablero}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '25px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <i className="bi bi-plus-circle me-2"></i>Crear tablero
                        </button>
                    )}
                    {vista === "tablero" && (
                        <button 
                            className="btn text-white fw-500 px-4 py-2"
                            onClick={volverInicio}
                            style={{
                                background: 'rgba(255, 255, 255, 0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                                borderRadius: '25px',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                                e.target.style.transform = 'translateY(-2px)';
                            }}
                            onMouseLeave={(e) => {
                                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                                e.target.style.transform = 'translateY(0)';
                            }}
                        >
                            <i className="bi bi-arrow-left me-2"></i>Volver
                        </button>
                    )}
                </div>
            </div>

            {/* Offcanvas para móvil */}
            <div
                className="offcanvas offcanvas-end d-lg-none"
                tabIndex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
                style={{ width: '80%', maxWidth: '350px' }}
            >
                <div 
                    className="offcanvas-header"
                    style={{
                        background: 'linear-gradient(135deg, #87CEEB 0%, #B8A7D9 100%)',
                        color: 'white'
                    }}
                >
                    <h5 className="offcanvas-title fw-bold" id="offcanvasNavbarLabel">
                        <i className="bi bi-kanban me-2"></i>TaskFlow
                    </h5>
                    <button 
                        type="button" 
                        className="btn-close btn-close-white" 
                        data-bs-dismiss="offcanvas" 
                        aria-label="Close"
                    ></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li className="nav-item mb-2">
                            <a 
                                className="nav-link fw-500 px-3 py-2 rounded-pill d-flex align-items-center" 
                                href="#"
                                onClick={(e) => { e.preventDefault(); volverInicio(); }}
                                style={{ 
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)',
                                    backgroundColor: vista === "inicio" ? 'var(--bg-light)' : 'transparent',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="bi bi-house-door me-3"></i>Inicio
                            </a>
                        </li>
                        <li className="nav-item mb-2">
                            <a 
                                className="nav-link fw-500 px-3 py-2 rounded-pill d-flex align-items-center" 
                                href="#" 
                                onClick={(e) => { e.preventDefault(); verTabla(); }}
                                style={{ 
                                    cursor: 'pointer',
                                    color: 'var(--text-primary)',
                                    backgroundColor: vista === "tabla" ? 'var(--bg-light)' : 'transparent',
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                <i className="bi bi-table me-3"></i>Tablas
                            </a>
                        </li>
                    </ul>

                    <div className="mt-4">
                        {vista === "inicio" && (
                            <button className="btn btn-primary w-100 mb-3" onClick={crearTablero}>
                                <i className="bi bi-plus-circle me-2"></i>Crear tablero
                            </button>
                        )}
                        {vista === "tablero" && (
                            <button className="btn btn-primary w-100 mb-3" onClick={volverInicio}>
                                <i className="bi bi-arrow-left me-2"></i>Volver
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>

    );
}