import React, { useEffect, useRef, useState } from "react";
import styles from "./MarkdownEditor.module.css";
import parseMarkdown from "../../helpers/markdownParser";
import Eye from "../icons/Eye";
import Pencil from "../icons/Pencil";
import SelectOption from "../SelectOption/SelectOption";
import TextArea from "../Input/Textarea/TextArea";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownEditor = (props) => {
  const { inputName, defaultValue = "", onChange } = props;
  const [value, setValue] = useState(defaultValue);
  const [previewMode, setPreviewMode] = useState(false);

  function handleChange(e) {
    setTextAreaHeight(e.target);
    onChange(e);
    setValue(e.target.value);
  }

  function setTextAreaHeight() {
    const element = document.getElementById("editPluginDescription");
    if (element) {
      element.style.height = "0px";
      element.style.height = element.scrollHeight + "px";
    }
  }

  useEffect(() => {
    if (!previewMode) {
      setTextAreaHeight();
    }
  }, [previewMode]);

  return (
    <div>
      <div className={styles.descriptionModes}>
        <SelectOption name="Edit" selected={previewMode === false} icon={<Pencil width={16} height={16} />} onClick={() => setPreviewMode(false)} />
        <SelectOption name="Preview" selected={previewMode === true} icon={<Eye width={16} height={16} />} onClick={() => setPreviewMode(true)} />
      </div>
      {previewMode ? (
        <Markdown remarkPlugins={[remarkGfm]} className={styles.previewContainer}>
          {value}
        </Markdown>
      ) : (
        <TextArea id="editPluginDescription" name={inputName} defaultValue={value} className={styles.textArea} onChange={handleChange} />
      )}
    </div>
  );
};

export default MarkdownEditor;
