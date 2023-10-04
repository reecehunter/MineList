import React, { useEffect, useRef, useState } from "react";
import styles from "./Toast.module.css";
import Check from "../icons/Check";
import X from "../icons/X";
import useInterval from "../../hooks/useInterval";

const Toast = (props) => {
  const { type, title, message, onClick } = props;
  const timerStart = 7000;
  const [timer, setTimer] = useState(timerStart);
  const [mouseOver, setMouseOver] = useState(false);
  const toastRef = useRef();

  useInterval(() => setTimer((prev) => (mouseOver ? prev : prev - 10)), 10);

  useEffect(() => {
    if (toastRef) {
      toastRef.current.classList.add(styles.show);
    }
  }, []);

  useEffect(() => {
    if (timer <= 0) {
      toastRef.current.classList.remove(styles.show);
      setTimeout(() => onClick(), 500);
    }
  }, [timer]);

  return (
    <div ref={toastRef} className={styles.container} role="alert" onMouseEnter={() => setMouseOver(true)} onMouseLeave={() => setMouseOver(false)}>
      <div className={styles.iconContainer}>
        <Check color="var(--successColor)" width={20} height={20} className={styles.icon} />
      </div>
      <div className={styles.content}>
        <div className={styles.header}>
          <p className={styles.title}>{title}</p>
          <X color="var(--primaryColor)" width={16} className={styles.closeButton} onClick={onClick} />
        </div>
        <p className={styles.message}>{message}</p>
      </div>
      <span className={styles.progressBar} style={{ width: `${(100 * timer) / timerStart}%` }}></span>
    </div>
  );
};

export default Toast;
