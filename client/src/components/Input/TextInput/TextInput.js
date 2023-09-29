import React from "react";
import styles from "./TextInput.module.css";

const TextInput = (props) => {
  const { name, defaultValue = "", placeholder = "", className = "", onChange, style = {}, id = "" } = props;
  return <input id={id} name={name} type="text" defaultValue={defaultValue} placeholder={placeholder} onChange={onChange} className={`${className} ${styles.input}`} style={style} />;
};

export default TextInput;
