import './RegisterPage.css';

export const RegisterPage = () => {
  return (
    <div className="register-page">
      {/* Lado Izquierdo: Imagen */}
      <div className="left-side">
        <img src="/images/facultad.jpg" alt="Facultad UNMSM" className="facultad-img" />
      </div>

      {/* Lado Derecho: Formulario */}
      <div className="right-side">
        <h2 className="register-title">Crea tu cuenta</h2>
        <form className="register-form">
          <input type="text" placeholder="Nombres y Apellidos" />
          <input type="email" placeholder="Correo institucional" />
          <input type="password" placeholder="Contraseña" />
          <input type="password" placeholder="Confirmar contraseña" />
          <button type="submit" className="register-btn">Registrarse</button>
        </form>
      </div>
    </div>
  );
};
