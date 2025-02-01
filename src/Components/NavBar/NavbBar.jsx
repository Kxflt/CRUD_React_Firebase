import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import styles from "./NavBar.module.css";

export const NavBar = ({ user = null, handleLogout = () => {} }) => {
  return (
    <nav className={styles.navbar}>
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
    </nav>
  );
};
NavBar.propTypes = {
  user: PropTypes.object,
  handleLogout: PropTypes.func.isRequired,
};
