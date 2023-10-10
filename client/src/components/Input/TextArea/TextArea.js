import React, { forwardRef } from "react";
import styles from "./TextArea.module.css";

const TextArea = forwardRef((props, ref) => {
  const { name, defaultValue = "", placeholder = "", onChange, outline = true, className = "", style = {}, onFocus = () => {}, onBlur = () => {}, id = "" } = props;
  return (
    <textarea
      ref={ref}
      id={id}
      name={name}
      type="text"
      defaultValue={defaultValue}
      placeholder={placeholder}
      onChange={onChange}
      className={`${className} ${styles.input} ${outline ? styles.outline : ""}`}
      style={style}
      onFocus={onFocus}
      onBlur={onBlur}
    />
  );
});

export default TextArea;
