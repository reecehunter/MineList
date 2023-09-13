import React, { useState } from "react";
import styles from "./PluginCard.module.css";
import Download from "../icons/Download";
import DownloadSlideUp from "../DownloadSlideUp/DownloadSlideUp";
import { Link } from "react-router-dom";
import Star from "../icons/Star";
import Eye from "../icons/Eye";

const ServerCard = (props) => {
  const { className, id, imgSrc, name, description, downloads, stars, views } = props;
  const link = `/plugin/${id}`;

  return (
    <article className={`${className} ${styles.serverCard} text-primaryy`}>
      <div className={styles.container}>
        <div className={styles.imgTitleDesc}>
          <Link to={link} className={styles.imgContainer}>
            <img src={imgSrc ? imgSrc : "https://cdn.modrinth.com/data/Lu3KuzdV/b2c4b7b0033ab09cc166f2848003ef3a02c70a83.png"} className={styles.img} alt={`${name} server banner`} />
          </Link>
          <div>
            <Link to={link} style={{ textDecoration: "none" }}>
              <h3 className={styles.name}>{name}</h3>
            </Link>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
        <div className={styles.stats}>
          <p>
            <Download width={22} height={22} /> <span className={styles.statNumber}>{downloads}</span> downloads
          </p>
          <p>
            <Star /> <span className={styles.statNumber}>{stars}</span> stars
          </p>
          <p>
            <Eye /> <span className={styles.statNumber}>{views}</span> views
          </p>
        </div>
      </div>
    </article>
  );
};

export default ServerCard;
