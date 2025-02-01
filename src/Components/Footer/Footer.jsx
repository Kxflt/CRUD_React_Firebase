import React from "react";
import styles from "./Footer.module.css";
import { FaInstagram, FaTiktok, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.logoContainer}>
          {/* Logo de la empresa (reemplaza con el tuyo) */}
          <img
            src="logo-empresa.png"
            alt="Logo de la empresa"
            className={styles.companyLogo}
          />
        </div>
        <div className={styles.socialIcons}>
          <a
            href="https://www.instagram.com"
            target="_blank"
            rel="noopener noreferrer">
            <FaInstagram size={24} className={styles.socialIcon} />
          </a>
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noopener noreferrer">
            <FaTiktok size={24} className={styles.socialIcon} />
          </a>
          <a
            href="mailto:info@example.com"
            target="_blank"
            rel="noopener noreferrer">
            <FaEnvelope size={24} className={styles.socialIcon} />
          </a>
        </div>
        <div className={styles.address}>
          <p>Dirección: Calle Ejemplo 123, Ciudad, País</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
