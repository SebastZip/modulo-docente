import { useDispatch } from 'react-redux';
import { login } from '../slices';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './LoginPage.css';

export const LoginPage = () => {
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [applyBlur, setApplyBlur] = useState(false);
  const registerRef = useRef(null);

  const handleOpenRegister = () => {
    setShowRegister(true);
    setApplyBlur(true);
  };

  const handleCloseRegister = () => {
    setApplyBlur(false); 
    setIsClosing(true);
    setTimeout(() => {
      setShowRegister(false);
      setIsClosing(false);
    }, 350); // Debe coincidir con la duración de slideOut
  };

  // Cierre al hacer clic fuera del panel
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showRegister &&
        registerRef.current &&
        !registerRef.current.contains(e.target)
      ) {
        handleCloseRegister();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRegister]);

  return (
    <div className="login-container">
      {/* Login principal */}
      <div className={`login-page ${applyBlur ? 'apply-blur' : ''}`}>
        <h2 className="title">¡Bienvenido!</h2>

        <div className="login-box">
          <div className="logo-container">
            <img src="/images/v98_36.png" alt="Logo UNMSM" className="logo" />
          </div>

          <form>
            <div className="input-group">
              <div className="icon-wrapper">
                <img src="/images/v98_31.png" alt="Icono usuario" className="input-icon" />
              </div>
              <input type="email" placeholder="Correo institucional" />
            </div>

            <div className="input-group">
              <div className="icon-wrapper">
                <img src="/images/v98_34.png" alt="Icono contraseña" className="input-icon" />
              </div>
              <input type="password" placeholder="Contraseña" />
            </div>

            <button type="submit" className="login-button">Ingresar</button>

            <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>

            <p className="register">
              ¿Nuevo Usuario?{' '}
              <button
                type="button"
                className="register-text-btn"
                onClick={handleOpenRegister}
              >
                Regístrate
              </button>
            </p>
          </form>
        </div>
      </div>

      {/* Overlay (opcional si quieres oscurecer fondo) */}
      {showRegister && <div className="overlay"></div>}

      {/* Panel de Registro */}
      {showRegister && (
        <div
          className={`register-panel ${isClosing ? 'slide-out' : ''}`}
          ref={registerRef}
        >
          <div className="register-image">
            <img src="/images/facultad.jpg" alt="Facultad UNMSM" />
          </div>

          <div className="register-content">
            <h2>Crea tu cuenta</h2>
            <form>
              <input type="text" placeholder="Nombres y Apellidos" />
              <input type="email" placeholder="Correo institucional" />
              <input type="password" placeholder="Contraseña" />
              <input type="password" placeholder="Confirmar contraseña" />
              <button type="submit" className="register-btn">Registrarse</button>
            </form>
            <button onClick={handleCloseRegister} className="close-btn">Cerrar</button>
          </div>
        </div>
      )}
    </div>
  );
};
