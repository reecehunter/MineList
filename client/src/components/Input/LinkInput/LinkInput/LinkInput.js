import React from "react";
import styles from "./LinkInput.module.css";
import RightArrow from "../../../icons/RightArrow";
import Trashcan from "../../../icons/Trashcan";

const LinkInput = (props) => {
  const { onTitleChange, onURLChange, onDelete } = props;

  return (
    <div className={styles.link}>
      <input type="text" placeholder="Link Title" onChange={onTitleChange} />
      <RightArrow width={22} height={22} />
      <input type="text" placeholder="URL" onChange={onURLChange} />
      <Trashcan width={28} height={28} color="var(--primaryColor)" className={styles.deleteLinkButton} onClick={onDelete} />
    </div>
  );
};

export default LinkInput;
