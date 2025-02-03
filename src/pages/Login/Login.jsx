import { useState } from "react";
import { signIn } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button/Button";
import styles from "./Login.module.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      await signIn(email, password);
      navigate("/user"); // Redirige al usuario a la página principal después de iniciar sesión
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.login}>
      <h2>Iniciar sesión</h2>
      <form onSubmit={handleLogin}>
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
        {/* {error && <p className={styles.errorMessage}>{error}</p>} */}
        {error && <p className="error-message">{error}</p>}
        <Button type="submit" disabled={isLoading}>
          {isLoading ? "Cargando..." : "Iniciar sesión"}
        </Button>
      </form>
    </div>
  );
};

export default Login;
