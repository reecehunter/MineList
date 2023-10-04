import React from "react";
import styles from "./TextInput.module.css";

const TextInput = (props) => {
  const { name, defaultValue = "", placeholder = "", className = "", onChange, style = {}, id = "", type = "text" } = props;
  return <input id={id} name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} onChange={onChange} className={`${className} ${styles.input}`} />;
};

export default TextInput;
