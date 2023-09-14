import React, { useEffect, useRef } from "react";
import styles from "./SelectOption.module.css";
import Check from "../icons/Check";

const SelectOption = (props) => {
  const { name, selected, onClick } = props;
  const ref = useRef();

  useEffect(() => {
    if (selected) ref.current.classList.add(styles.selected);
    else ref.current.classList.remove(styles.selected);
  }, [selected]);

  return (
    <span ref={ref} className={`${styles.contents}`} onClick={onClick}>
      {selected ? <Check color="var(--secondaryColor)" /> : ""} {name}
    </span>
  );
};

export default SelectOption;
