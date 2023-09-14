import React from "react";
import styles from "./InfoCard.module.css";

const InfoCard = (props) => {
  const { title, children } = props;

  return (
    <div className={styles.infoCard}>
      <div className={styles.infoCardHeader}>
        <h5>{title}</h5>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default InfoCard;
