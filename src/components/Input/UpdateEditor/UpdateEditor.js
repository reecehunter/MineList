import React, { useRef, useState } from "react";
import styles from "./UpdateEditor.module.css";
import Button from "../../Button/Button";
import PlusSquare from "../../icons/PlusSquare";
import TextInput from "../TextInput/TextInput";
import MarkdownEditor from "../MarkdownEditor/MarkdownEditor";

const UpdateEditor = (props) => {
  const { inputName, defaultHeight = 50, placeholder = "", setJar, setVersion, onChange, onSubmit } = props;
  const jarInputRef = useRef(null);
  const [jarName, setJarName] = useState("Upload Jar");

  function handleJarChange(event) {
    setJar(event.target.files[0]);
    setJarName(event.target.files[0].name);
  }

  function clickJarInput() {
    if (jarInputRef.current) {
      jarInputRef.current.click();
    }
  }

  return (
    <div className={styles.container}>
      <MarkdownEditor inputName={inputName} placeholder={placeholder} defaultHeight={defaultHeight} onChange={onChange} />
      <div className={styles.bottomRow}>
        <TextInput name="version" placeholder="1.20.2" className={styles.versionInput} onChange={(e) => setVersion(e.target.value)} />
        <div>
          <Button className="button-quaternary" onClick={clickJarInput}>
            {jarName}
          </Button>
          <input ref={jarInputRef} name="jar" type="file" accept=".jar" onChange={handleJarChange} hidden />
          <Button className={`${styles.submitButton} button button-septenary`} icon={<PlusSquare />} onClick={onSubmit}>
            Submit Update
          </Button>
        </div>
      </div>
    </div>
  );
};

export default UpdateEditor;
