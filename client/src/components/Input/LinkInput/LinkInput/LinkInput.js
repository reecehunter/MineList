import React, { useEffect } from "react";
import styles from "./LinkInput.module.css";
import RightArrow from "../../../icons/RightArrow";
import Trashcan from "../../../icons/Trashcan";
import TextInput from "../../TextInput/TextInput";

const LinkInput = (props) => {
  const { defaultTitle = "", defaultURL = "", onTitleChange, onURLChange, onDelete } = props;

  return (
    <div className={styles.link}>
      <TextInput type="text" defaultValue={defaultTitle} placeholder="Link Title" onChange={onTitleChange} />
      <RightArrow width={22} height={22} />
      <TextInput type="text" defaultValue={defaultURL} placeholder="URL" onChange={onURLChange} />
      <Trashcan width={28} height={28} color="var(--primaryColor)" className={styles.deleteLinkButton} onClick={onDelete} />
    </div>
  );
};

export default LinkInput;
