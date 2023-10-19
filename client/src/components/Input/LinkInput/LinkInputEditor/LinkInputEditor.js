import React, { useEffect, useState } from "react";
import styles from "./LinkInputEditor.module.css";
import LinkInput from "../LinkInput/LinkInput";
import Button from "../../../Button/Button";
import { Link } from "react-router-dom";

const LinkInputEditor = (props) => {
  const { defaultLinks = [], links = {}, setLinks } = props;
  const [linkCount, setLinkCount] = useState(1);

  function handleLinkChange(event, index, titleOrURL) {
    setLinks({
      ...links,
      [index]: { ...links[index], [titleOrURL]: event.target.value },
    });
  }

  function addLinkInput() {
    if (linkCount < 5) {
      setLinks((prev) => {
        const newLinks = { ...prev };
        newLinks[links.length] = { title: null, url: null };
        return newLinks;
      });
    }
  }

  function removeLinkInput(index) {
    setLinks((prev) => {
      const newLinks = { ...prev };
      delete newLinks[index];
      return newLinks;
    });
  }

  useEffect(() => setLinks({ ...links, ...defaultLinks }), []);

  return (
    <div className={styles.container}>
      {Object.values(links).map((link, index) => (
        <LinkInput
          key={index}
          defaultTitle={link.title}
          defaultURL={link.url}
          onTitleChange={(e) => handleLinkChange(e, index, "title")}
          onURLChange={(e) => handleLinkChange(e, index, "url")}
          onDelete={() => removeLinkInput(index)}
        />
      ))}
      <Button onClick={addLinkInput} icon={<Link width={16} height={16} color="var(--primaryColor)" />} className={`${styles.addLinkButton} button-quaternary`}>
        Add Link
      </Button>
    </div>
  );
};

export default LinkInputEditor;
