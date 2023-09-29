import React from "react";
import styles from "./TextArea.module.css";

const TextArea = (props) => {
  const { name, defaultValue = "", placeholder = "", onChange, className = "", style = {}, id = "" } = props;
  return <textarea id={id} name={name} type="text" defaultValue={defaultValue} placeholder={placeholder} onChange={onChange} className={`${className} ${styles.input}`} style={style} />;
};

export default TextArea;
