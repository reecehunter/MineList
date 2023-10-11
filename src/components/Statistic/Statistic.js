import React from "react";
import styles from "./Statistic.module.css";

const Statistic = (props) => {
  const { icon, text, number } = props;

  return (
    <p className={styles.stat}>
      {icon}{" "}
      <span className={styles.numberAndText}>
        <span className={styles.number}>{number}</span> {text}
      </span>
    </p>
  );
};

export default Statistic;
