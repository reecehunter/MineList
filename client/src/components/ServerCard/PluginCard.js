import React, { useEffect, useState } from "react";
import styles from "./PluginCard.module.css";
import Download from "../icons/Download";
import DownloadSlideUp from "../DownloadSlideUp/DownloadSlideUp";
import { Link } from "react-router-dom";

const ServerCard = (props) => {
  const { className, id, vanityURL, imgSrc, name, description, downloads, stars, views } = props;
  const [hovering, setHovering] = useState(false);
  const link = `/plugin/${vanityURL}`;

  return (
    <article className={`${className} ${styles.serverCard} text-primaryy`} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <div className={styles.imgContainer}>
        <Link to={link}>
          <img src={imgSrc ? imgSrc : "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png"} className={styles.img} alt={`${name} server banner`} />
        </Link>
      </div>
      <div className={styles.text}>
        <div className={styles.nameAndVotes}>
          <Link to={link} style={{ textDecoration: "none" }}>
            <h5 className={styles.name}>{name}</h5>
          </Link>
          <div className={styles.stats}>
            <p className={styles.downloadIcon}>
              <Download width={22} height={22} /> {downloads}
            </p>
          </div>
        </div>
        <p className={styles.description}>{description}</p>
        <DownloadSlideUp id={id} hovering={hovering} stars={stars} views={views} />
      </div>
    </article>
  );
};

export default ServerCard;
