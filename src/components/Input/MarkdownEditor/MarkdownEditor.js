import React, { useEffect, useRef, useState } from "react";
import styles from "./MarkdownEditor.module.css";
import Eye from "../../icons/Eye";
import Pencil from "../../icons/Pencil";
import SelectOption from "../SelectOption/SelectOption";
import TextArea from "../TextArea/TextArea";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

const MarkdownEditor = (props) => {
  const { inputName, defaultTextValue = "", defaultHeight = 50, placeholder = "", onChange } = props;
  const textAreaRef = useRef(null);
  const [textValue, setTextValue] = useState(defaultTextValue);
  const [previewMode, setPreviewMode] = useState(false);

  function handleChange(e) {
    setTextAreaHeight(e.target);
    onChange(e);
    setTextValue(e.target.value);
  }

  function setTextAreaHeight() {
    if (textAreaRef.current) {
      resetTextAreaHeight();
      textAreaRef.current.style.height = textAreaRef.current.scrollHeight + "px";
    }
  }

  function resetTextAreaHeight() {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = defaultHeight + "px";
    }
  }

  useEffect(() => {
    if (!previewMode) {
      setTextAreaHeight();
    }
  }, [previewMode]);

  useEffect(() => resetTextAreaHeight(), []);

  return (
    <div>
      <div className={styles.textAreaContainer}>
        <div className={styles.descriptionModes}>
          <SelectOption name="Edit" selected={previewMode === false} icon={<Pencil width={16} height={16} />} onClick={() => setPreviewMode(false)} />
          <SelectOption name="Preview" selected={previewMode === true} icon={<Eye width={16} height={16} />} onClick={() => setPreviewMode(true)} />
        </div>
        {previewMode ? (
          <Markdown remarkPlugins={[remarkGfm]} className={styles.previewContainer}>
            {textValue}
          </Markdown>
        ) : (
          <TextArea ref={textAreaRef} placeholder={placeholder} name={inputName} defaultTextValue={textValue} onChange={handleChange} />
        )}
      </div>
    </div>
  );
};

export default MarkdownEditor;
