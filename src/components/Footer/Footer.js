import React from "react";
import styles from "./Footer.module.css";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <>
      <div className={styles.container}>
        <div>
          <div className={styles.logoContainer}>
            <img src="https://freepngimg.com/thumb/minecraft/11-2-minecraft-diamond-png.png" width="35" height="30" className="d-inline-block align-center" alt="Logo" />
            <h4>MineList</h4>
          </div>
          <p>© Goose Gaming, Inc.</p>
          <p className={styles.mojangLegal}>Not associated with Mojang, AB or Microsoft.</p>
        </div>
        <div>
          <h4>Company</h4>
          <Link to="/legal/terms">Terms</Link>
          <Link to="/legal/privacy">Privacy</Link>
          <Link to="/rules">Rules</Link>
          <Link to="/careers">Careers</Link>
        </div>
        <div>
          <h4>Resources</h4>
          <Link to="/blog">Blog</Link>
          <Link to="/docs">Docs</Link>
          <Link to="/github">GitHub</Link>
        </div>
        <div>
          <h4>Community</h4>
          <Link to="/discord">Discord</Link>
          <Link to="/twitter">Twitter</Link>
        </div>
      </div>
    </>
  );
};

export default Footer;
