import React from "react";
import styles from "./Footer.module.css";

const Footer = () => {
  return (
    <>
      <div className={styles.container}>
        <div>
          <p className={styles.header}>MineList</p>
        </div>
        <div>
          <p className={styles.header}>Company</p>
        </div>
        <div>
          <p className={styles.header}>Resources</p>
        </div>
        <div>
          <p className={styles.header}>Community</p>
        </div>
      </div>
      <p>We are not associated with Mojang, AB or Microsoft.</p>
    </>
  );
};

export default Footer;
