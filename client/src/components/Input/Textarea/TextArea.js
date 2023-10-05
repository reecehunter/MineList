import React, { forwardRef } from "react";
import styles from "./TextArea.module.css";

const TextArea = forwardRef((props, ref) => {
  const { name, defaultValue = "", placeholder = "", onChange, className = "", style = {}, id = "" } = props;
  return <textarea ref={ref} id={id} name={name} type="text" defaultValue={defaultValue} placeholder={placeholder} onChange={onChange} className={`${className} ${styles.input}`} style={style} />;
});

export default TextArea;
