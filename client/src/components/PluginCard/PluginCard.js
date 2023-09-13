import React from "react";
import styles from "./PluginCard.module.css";
import Download from "../icons/Download";
import { Link } from "react-router-dom";
import Star from "../icons/Star";
import Eye from "../icons/Eye";
import Statistic from "../Statistic/Statistic";
import config from "../../config/config";

const ServerCard = (props) => {
  const { className, id, imgSrc, name, description, downloads, stars, views, author } = props;
  const link = `/plugin/${id}`;

  return (
    <article className={`${className} ${styles.serverCard} text-primaryy`}>
      <div className={styles.container}>
        <div className={styles.imgTitleDesc}>
          <Link to={link} className={styles.imgContainer}>
            <img src={imgSrc ? imgSrc : config.default_plugin_image} className={styles.img} alt={`${name} server banner`} />
          </Link>
          <div className={styles.header}>
            <Link to={link} style={{ textDecoration: "none" }}>
              <h3 className={styles.name}>{name}</h3>
            </Link>
            <span>
              by <Link to={`/profile/${author}`}>{author}</Link>
            </span>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
        <div className={styles.stats}>
          <Statistic icon={<Download />} number={downloads} text="downloads" />
          <Statistic icon={<Eye />} number={views} text="views" />
          <Statistic icon={<Star />} number={stars} text="stars" />
        </div>
      </div>
    </article>
  );
};

export default ServerCard;
