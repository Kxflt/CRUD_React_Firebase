import { useState } from "react";
import styles from "./Register.module.css";
import { signUp } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }
    try {
      await signUp(email, password);
      setSuccess("Usuario creado con éxito");
      setError(null);
      // Redirige al usuario a la página de inicio de sesión después de 5 segundos
      setTimeout(() => {
        navigate("/login");
      }, 5000);
    } catch (error) {
      setError(error.message);
      setSuccess(null);
    }
  };

  return (
    <div className={styles.register}>
      <h2>Registro</h2>
      <form onSubmit={handleRegister}>
        <div className={styles.formGroup}>
          <label>Correo electrónico:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Contraseña:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className={styles.formGroup}>
          <label>Confirmar contraseña:</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        {error && <p style={{ color: "red" }}>{error}</p>}
        {success && <p style={{ color: "green" }}>{success}</p>}
        <button type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
