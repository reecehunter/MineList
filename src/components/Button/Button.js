import React from "react";
import styles from "./Button.module.css";

const Button = (props) => {
  const { id, children, onClick, type = "button", icon = "", onMouseUp = () => {} } = props;

  return (
    <button id={id} className={`button ${props.className} ${styles.button}`} onClick={onClick} type={type} onMouseUp={onMouseUp}>
      <span>{icon}</span> <span>{children}</span>
    </button>
  );
};

export default Button;
