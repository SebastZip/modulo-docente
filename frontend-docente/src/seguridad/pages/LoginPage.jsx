import { useDispatch } from 'react-redux';
import { login, checkingCredentials } from '../slices';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import './LoginPage.css';

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showRegister, setShowRegister] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [applyBlur, setApplyBlur] = useState(false);
  const registerRef = useRef(null);

  // Estados para el formulario de login
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [toastMessages, setToastMessages] = useState([]);

  const handleCloseToast = (indexToRemove) => {
    setToastMessages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const showCustomToast = (message) => {
    setToastMessages(prev => [...prev, message]);
  };

  const removeToast = (index) => {
    setToastMessages(prev => prev.filter((_, i) => i !== index));
  };

  const toastContainerRef = useRef(null);

  // Formulario registro
  const [nombres, setNombres] = useState('');
  const [apellidos, setApellidos] = useState('');
  const [codigo, setCodigo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [institucionId, setInstitucionId] = useState('');
  const [departamentoId, setDepartamentoId] = useState('');
  const [claseId, setClaseId] = useState('');

  const [categorias, setCategorias] = useState([]);
  const [instituciones, setInstituciones] = useState([]);
  const [departamentos, setDepartamentos] = useState([]);
  const [clases, setClases] = useState([]);

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
    }, 350);
  };

  // Función para manejar el login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setToastMessages([]); // Limpiar mensajes previos

    // Validaciones básicas
    if (!loginEmail || !loginPassword) {
      showCustomToast("❌ Por favor, completa todos los campos");
      setLoginLoading(false);
      return;
    }

    try {
      const response = await fetch("http://localhost:8080/api/usuarios/login", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginEmail,
          password: loginPassword
        })
      });

      const result = await response.text();

      if (response.ok) {
        showCustomToast("✅ " + result);
        
        console.log("Iniciando proceso de login...");
        
        // Seguir el flujo correcto: primero checking, luego authenticated
        dispatch(checkingCredentials());
        console.log("Dispatched checkingCredentials");
        
        // Luego hacer el login con los datos del usuario
        setTimeout(() => {
          console.log("Dispatching login...");
          dispatch(login({ 
            uid: 'manual_login_' + Date.now(), // ID único para login manual
            email: loginEmail,
            displayName: loginEmail.split('@')[0], // Usar parte del email como nombre
            photoURL: null
          }));
          console.log("Login dispatched");
          
          // Navegar al dashboard en la ruta de cursos
          setTimeout(() => {
            console.log("Navegando al dashboard...");
            navigate('/cursos/dashboard'); // Ahora sí debería funcionar
          }, 200);
        }, 100);
        
      } else {
        showCustomToast("❌ " + result);
      }
    } catch (error) {
      console.error("Error en el login:", error);
      showCustomToast("❌ Hubo un error al iniciar sesión. Verifica tu conexión.");
    } finally {
      setLoginLoading(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showRegister &&
        registerRef.current &&
        !registerRef.current.contains(e.target) &&
        (!toastContainerRef.current || !toastContainerRef.current.contains(e.target))
      ) {
        handleCloseRegister();
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showRegister]);

  useEffect(() => {
    fetch("http://localhost:8080/api/categorias").then(res => res.json()).then(setCategorias);
    fetch("http://localhost:8080/api/instituciones").then(res => res.json()).then(setInstituciones);
    fetch("http://localhost:8080/api/departamentos").then(res => res.json()).then(setDepartamentos);
    fetch("http://localhost:8080/api/clases").then(res => res.json()).then(setClases);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setToastMessages([]); // Limpiar errores previos

    const errores = [];

    if (!email.endsWith("@unmsm.edu.pe")) {
      errores.push("❌ El correo debe terminar en @unmsm.edu.pe");
    }
    if (password !== confirmPassword) {
      errores.push("❌ Las contraseñas no coinciden");
    }

    if (errores.length > 0) {
      errores.forEach(showCustomToast);
      return;
    }

    const data = {
      nombres,
      apellidos,
      codigo,
      email,
      password,
      confirmPassword,
      claseId,
      categoriaId,
      institucionId: parseInt(institucionId),
      departamentoId: parseInt(departamentoId)
    };

    try {
      const response = await fetch("http://localhost:8080/api/docentes/registrar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      const result = await response.text();

      try {
        const parsed = JSON.parse(result); // Intenta interpretar como JSON
        if (Array.isArray(parsed)) {
          parsed.forEach(msg => showCustomToast("❌ " + msg));
        } else if (typeof parsed === 'string') {
          showCustomToast("❌ " + parsed);
        } else {
          showCustomToast("❌ Error desconocido");
        }
      } catch (err) {
        if (result === "Registro exitoso") {
          showCustomToast("✅ Registro exitoso");
          handleCloseRegister();
        } else {
          showCustomToast("❌ " + result);
        }
      }

    } catch (error) {
      console.error("Error en el registro:", error);
      showCustomToast("❌ Hubo un error al registrar.");
    }
  };

  return (
    <div className="login-container">
      <div className={`login-page ${applyBlur ? 'apply-blur' : ''}`}>
        <h2 className="title">¡Bienvenido!</h2>
        <div className="login-box">
          <div className="logo-container">
            <img src="/images/v98_36.png" alt="Logo UNMSM" className="logo" />
          </div>
          <form onSubmit={handleLogin}>
            <div className="input-group">
              <div className="icon-wrapper">
                <img src="/images/v98_31.png" alt="Icono usuario" className="input-icon" />
              </div>
              <input 
                type="email" 
                placeholder="Correo institucional"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                required
                disabled={loginLoading}
              />
            </div>
            <div className="input-group">
              <div className="icon-wrapper">
                <img src="/images/v98_34.png" alt="Icono contraseña" className="input-icon" />
              </div>
              <input 
                type="password" 
                placeholder="Contraseña"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                required
                disabled={loginLoading}
              />
            </div>
            <button 
              type="submit" 
              className="login-button"
              disabled={loginLoading}
            >
              {loginLoading ? 'Ingresando...' : 'Ingresar'}
            </button>
            <a href="#" className="forgot">¿Olvidaste tu contraseña?</a>
            <p className="register">
              ¿Nuevo Usuario?{' '}
              <button type="button" className="register-text-btn" onClick={handleOpenRegister}>
                Regístrate
              </button>
            </p>
          </form>
        </div>
      </div>

      {showRegister && <div className="overlay"></div>}

      {showRegister && (
        <div className={`register-panel ${isClosing ? 'slide-out' : ''}`} ref={registerRef}>
          <div className="register-image">
            <img src="/images/facultad.jpg" alt="Facultad UNMSM" />
          </div>
          <div className="register-content">
            <h2>Crea tu cuenta</h2>
            <form onSubmit={handleSubmit}>
              <input type="text" placeholder="Nombres" value={nombres} onChange={e => setNombres(e.target.value)} required />
              <input type="text" placeholder="Apellidos" value={apellidos} onChange={e => setApellidos(e.target.value)} required />
              <input type="text" placeholder="Código de docente" value={codigo} onChange={e => setCodigo(e.target.value)} required />
              <input type="email" placeholder="Correo institucional" value={email} onChange={e => setEmail(e.target.value)} required />
              <input type="password" placeholder="Contraseña" value={password} onChange={e => setPassword(e.target.value)} required />
              <input type="password" placeholder="Confirmar contraseña" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

              <select value={categoriaId} onChange={e => setCategoriaId(e.target.value)} required>
                <option value="">Selecciona una categoría</option>
                {categorias.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.nombre}</option>
                ))}
              </select>

              <select value={institucionId} onChange={e => setInstitucionId(e.target.value)} required>
                <option value="">Selecciona una institución</option>
                {instituciones.map(inst => (
                  <option key={inst.id} value={inst.id}>{inst.nombreCorto}</option>
                ))}
              </select>

              <select value={departamentoId} onChange={e => setDepartamentoId(e.target.value)} required>
                <option value="">Selecciona un departamento</option>
                {departamentos.map(dep => (
                  <option key={dep.id} value={dep.id}>{dep.nombre}</option>
                ))}
              </select>

              <select value={claseId} onChange={e => setClaseId(e.target.value)} required>
                <option value="">Selecciona una clase</option>
                {clases.map(cl => (
                  <option key={cl.id} value={cl.id}>{cl.nombre}</option>
                ))}
              </select>

              <button type="submit" className="register-btn">Registrarse</button>
            </form>
            <button onClick={handleCloseRegister} className="close-btn">Cerrar</button>
          </div>
        </div>
      )}

      {toastMessages.length > 0 && (
        <div ref={toastContainerRef} className="toast-container">
        {toastMessages.map((msg, index) => (
          <div key={index} className="custom-toast">
            <span>{msg}</span>
            <button type="button" className="close-toast" onClick={() => handleCloseToast(index)}>×</button>
          </div>
        ))}
      </div>
      )}
    </div>
  );
};