import React from "react";
import styles from "./Button.module.css";

const Button = (props) => {
  const { id, children, onClick, icon = "" } = props;

  return (
    <button id={id} className={`button ${props.className} ${styles.button}`} onClick={onClick}>
      {icon} {children}
    </button>
  );
};

export default Button;
