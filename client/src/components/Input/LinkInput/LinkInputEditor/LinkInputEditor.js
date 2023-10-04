import React, { useState } from "react";
import styles from "./LinkInputEditor.module.css";
import LinkInput from "../LinkInput/LinkInput";
import Button from "../../../Button/Button";
import { Link } from "react-router-dom";

const LinkInputEditor = (props) => {
  const { links, setLinks } = props;
  const [linkCount, setLinkCount] = useState(1);

  function handleLinkChange(event, index, titleOrURL) {
    setLinks({
      ...links,
      [index]: { ...links[index], [titleOrURL]: event.target.value },
    });
  }

  function addLinkInput() {
    if (linkCount < 5) setLinkCount((prev) => prev + 1);
  }

  function removeLinkInput(index) {
    setLinks((prev) => {
      const newLinks = { ...prev };
      delete newLinks[index];
      return newLinks;
    });
    setLinkCount((prev) => prev - 1);
  }

  return (
    <div className={styles.container}>
      <label htmlFor="link">Links</label>
      {[...Array(linkCount)].map((input, index) => (
        <LinkInput onTitleChange={(e) => handleLinkChange(e, index, "title")} onURLChange={(e) => handleLinkChange(e, index, "url")} onDelete={() => removeLinkInput(index)} />
      ))}
      <Button onClick={addLinkInput} icon={<Link width={16} height={16} color="var(--primaryColor)" />} className={`${styles.addLinkButton} button-quaternary`}>
        Add Link
      </Button>
    </div>
  );
};

export default LinkInputEditor;
