import React from "react";
import styles from "./InfoCard.module.css";

const InfoCard = (props) => {
  const { title, content } = props;

  return (
    <div className={styles.infoCard}>
      <div className={styles.infoCardHeader}>
        <h5>{title}</h5>
      </div>
      <div>{content}</div>
    </div>
  );
};

export default InfoCard;
