import React, { useEffect, useState } from "react";
import styles from "./ContentNav.module.css";

const ContentNav = (props) => {
  const { className, options, handleClick } = props;
  const [selectedInfo, setSelectedInfo] = useState("Description");

  const handleChange = (event) => {
    const element = event.currentTarget;
    const text = element.innerText;
    setSelectedInfo(text);

    const allSelected = element.parentElement.getElementsByClassName(styles.selected);
    for (const child of allSelected) {
      child.classList.remove(styles.selected);
    }
    element.classList.add(styles.selected);

    handleClick(text);
  };

  useEffect(() => {
    const infoSelector = document.getElementById("infoSelector");
    if (!infoSelector) return;
    const firstChild = infoSelector.children[0];
    if (!firstChild) return;
    firstChild.classList.add(styles.selected);
  }, []);

  return (
    <div id="infoSelector" className={`${styles.infoSelector} ${className}`}>
      {options.map((option, index) => (
        <p key={index} onClick={handleChange}>
          {option}
        </p>
      ))}
    </div>
  );
};

export default ContentNav;
