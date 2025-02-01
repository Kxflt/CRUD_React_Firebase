import { useState, useEffect } from "react";
import styles from "./Header.module.css";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { FirebaseAuth } from "../../firebase/config";
import { NavBar } from "../NavBar/NavbBar";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(FirebaseAuth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(FirebaseAuth);
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <header className={styles.header}>
      <h1 className={styles.companyName}>NOMBRE DE TU EMPRESA</h1>

      <NavBar user={user} handleLogout={handleLogout} />
      {/* <nav className={styles.navbar}>
        <ul className={styles.navList}>
          <li className={styles.navItem}>
            <Link to="/">Inicio</Link>
          </li>
          {user ? (
            <>
              <li className={styles.navItem}>
                <Link to="/user">Mi Ficha</Link>
              </li>
              <li className={styles.navItem}>
                <button onClick={handleLogout}>Cerrar sesión</button>
              </li>
            </>
          ) : (
            <>
              <li className={styles.navItem}>
                <Link to="/login">Iniciar sesión</Link>
              </li>
              <li className={styles.navItem}>
                <Link to="/register">Registrarse</Link>
              </li>
            </>
          )}
        </ul>
      </nav> */}
      {user && (
        <div className={styles.userGreeting}>
          Hola, {user.displayName || user.email}
        </div>
      )}
    </header>
  );
};

export default Header;
