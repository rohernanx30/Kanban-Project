import logo from "../assets/icon.png";

export default function Header({ vista, crearTablero, volverInicio }) {
    return (
        <nav className="navbar navbar-expand-lg px-3">
            <a className="navbar-brand d-flex align-items-center fw-bold" href="#">
                <img src={logo} alt="Logo" width="32" height="32" className="d-inline-block align-top me-2" />
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
                        <a className="nav-link" href="#">Inicio</a>
                    </li>
                    <li className="nav-item">
                        <a className="nav-link" href="#">Tablas</a>
                    </li>
                </ul>

                <div className="d-flex">
                    {vista === "inicio" && (
                        <button className="btn btn-primary me-2" onClick={crearTablero}>
                            Crear tablero
                        </button>
                    )}
                    {vista === "tablero" && (
                        <button className="btn btn-primary" onClick={volverInicio}>
                            Volver
                        </button>
                    )}
                </div>
            </div>

            {/* Offcanvas para móvil */}
            <div
                className="offcanvas offcanvas-end d-lg-none w-75"
                tabIndex="-1"
                id="offcanvasNavbar"
                aria-labelledby="offcanvasNavbarLabel"
            >
                <div className="offcanvas-header">
                    <h5 className="offcanvas-title" id="offcanvasNavbarLabel">TaskFlow</h5>
                    <button type="button" className="btn-close btn-primary" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                </div>
                <div className="offcanvas-body">
                    <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                        <li className="nav-item">
                            <a className="nav-link" href="#">Inicio</a>
                        </li>
                        <li className="nav-item">
                            <a className="nav-link" href="#">Tablas</a>
                        </li>
                    </ul>

                    <div className="d-flex mt-3">
                        {vista === "inicio" && (
                            <button className="btn btn-primary me-2" onClick={crearTablero}>
                                Crear tablero
                            </button>
                        )}
                        {vista === "tablero" && (
                            <button className="btn btn-primary" onClick={volverInicio}>
                                Volver
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </nav>

    );
}
