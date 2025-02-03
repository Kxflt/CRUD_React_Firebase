import { useState } from "react";
import styles from "./Login.module.css";
import { signIn } from "../../firebase/auth";
import { useNavigate } from "react-router-dom";
import Button from "../../Components/Button/Button";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signIn(email, password);
      navigate("/user"); // Redirige al usuario a la página principal después de iniciar sesión
    } catch (error) {
      setError(error.message);
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
        {error && <p style={{ color: "red" }}>{error}</p>}

        <Button type="submit">Iniciar sesión</Button>
      </form>
    </div>
  );
};

export default Login;
