// src/pages/Home.jsx

import Sidebar from "../../Components/Sidebar/Sidebar";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.homeContainer}>
      <Sidebar />
      <main className={styles.mainContent}>
        <h1>Bienvenido a Home</h1>
        {/* agregar más contenido para la página de inicio */}
      </main>
    </div>
  );
};

export default Home;
