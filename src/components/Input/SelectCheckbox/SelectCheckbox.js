import React, { useEffect, useRef } from "react";
import styles from "./SelectCheckbox.module.css";
import Check from "../../icons/Check";

const SelectCheckbox = (props) => {
  const { name, selected, icon = "", alwaysShowIcon = false, onClick, type = "multiple" } = props;
  const checkboxRef = useRef();

  useEffect(() => {
    if (checkboxRef.current && type === "single") {
      checkboxRef.current.style.borderRadius = "50%";
    }
  }, []);

  return (
    <span className={styles.container} onClick={onClick}>
      <span ref={checkboxRef} className={styles.checkbox}>
        {selected ? (
          <span className={styles.selected}>
            <Check color="var(--primaryColor)" />
          </span>
        ) : (
          ""
        )}
      </span>
      {icon}
      {name}
    </span>
  );
};

export default SelectCheckbox;
