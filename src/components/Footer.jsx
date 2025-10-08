import React from 'react';
import kodigoIcon from '../assets/icon1.jpg';

export default function Footer() {
  // Footer visual, no requiere validaciones ni llamadas a la API
  return (
    <footer 
      className="mt-auto py-4 px-4"
      style={{
        background: 'linear-gradient(135deg, #87CEEB 0%, #B8A7D9 100%)',
        borderRadius: '20px 20px 0 0',
        boxShadow: '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)',
        marginTop: '2rem'
      }}
    >
      <div className="container-fluid">
        <div className="row align-items-center">
          <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
            <div className="d-flex align-items-center text-white">
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
            </div>
          </div>
          <div className="col-lg-4 col-md-6 mb-3 mb-lg-0">
            <div className="d-flex justify-content-center gap-3">
              <a 
                href="https://kodigo.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link d-flex align-items-center justify-content-center"
                title="Kodigo - Academia de programacion"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
            <img src={kodigoIcon} alt="Kodigo" style={{ width: '28px', height: '28px', borderRadius: '8px', objectFit: 'cover', boxShadow: '0 2px 8px rgba(0,0,0,0.10)' }} />
          </a>
              <a 
                href="https://github.com/rohernanx30/Kanban-Project" 
                target="_blank" 
                rel="noopener noreferrer"
                className="social-link d-flex align-items-center justify-content-center"
                title="Ver proyecto en GitHub"
                style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'rgba(255, 255, 255, 0.2)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(255, 255, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.3)';
                  e.target.style.transform = 'translateY(-2px) scale(1.05)';
                  e.target.style.boxShadow = '0 8px 16px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.transform = 'translateY(0) scale(1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <i className="bi bi-github" style={{ fontSize: '1.3rem' }}></i>
              </a>

             
            </div>
          </div>

          <div className="col-lg-4 col-md-12">
            <div className="text-center text-lg-end">
              
              <div className="d-flex justify-content-center justify-content-lg-end gap-3 small">
                <a 
                  href="#" 
                  className="text-white opacity-75"
                  style={{ 
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.75';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Privacidad
                </a>
                <span className="text-white opacity-50">|</span>
                <a 
                  href="#" 
                  className="text-white opacity-75"
                  style={{ 
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.75';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Términos
                </a>
                <span className="text-white opacity-50">|</span>
                <a 
                  href="#" 
                  className="text-white opacity-75"
                  style={{ 
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.opacity = '0.75';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  Soporte
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Divisor decorativo */}
        <div className="row mt-3 pt-3" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
          <div className="col-12">
            <div className="d-flex justify-content-center align-items-center">
              <div className="d-flex gap-2">
                <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.4)'
                  }}
                ></div>
                <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.6)'
                  }}
                ></div>
                <div 
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.4)'
                  }}
                ></div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </footer>
  );
}