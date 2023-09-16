import React, { useEffect, useState } from "react";
import styles from "./CreateForm.module.css";
import axios from "axios";
import config from "../../config/config";
import Button from "../../components/Button/Button";
import SelectOption from "../SelectOption/SelectOption";
import RightArrow from "../icons/RightArrow";
import LeftArrow from "../icons/LeftArrow";
import X from "../icons/X";
import Pencil from "../icons/Pencil";
import Eye from "../icons/Eye";
import Trashcan from "../icons/Trashcan";
import PlusSquare from "../icons/PlusSquare";
import Link from "../icons/Link";
import Hash from "../icons/Hash";
import parseMarkdown from "../../helpers/markdownParser";

const LoginForm = () => {
  const [formData, setFormData] = useState({});
  const [linkCount, setLinkCount] = useState(1);
  const [errors, setErrors] = useState([]);
  const [type, setType] = useState("Server");
  const [step, setStep] = useState(1);
  const [descriptionMode, setDescriptionMode] = useState("Edit");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => console.log(formData), [formData]);

  const onSubmit = (event) => {
    event.preventDefault();
    axios
      .post(`${config.api_url}/api/plugins/create`, formData)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  const toggleUrlBorder = (event) => {
    const element = event.currentTarget.parentElement;
    const border = "2px solid var(--secondaryColor)";
    if (element.style.border === border) element.style.border = "";
    else element.style.border = border;
  };

  const setFocus = (event) => {
    const element = event.currentTarget;
    element.children[0].focus();
  };

  const toggleTag = (tagName) => {
    const index = tags.indexOf(tagName);
    if (index > -1) {
      const newTags = [...tags];
      newTags.splice(index, 1);
      setTags(newTags);
    } else {
      setTags([...tags, tagName]);
    }
  };

  const addLink = () => {
    if (linkCount < 5) setLinkCount((prev) => prev + 1);
  };

  useEffect(() => {
    handleChange({ target: { name: "type", value: type } });
  }, [type]);

  useEffect(() => {
    const typeElement = document.getElementById("createFormType");
    const titleElement = document.getElementById("createFormTitle");
    const urlElement = document.getElementById("createFormUrl");
    const summaryElement = document.getElementById("createFormSummary");
    const imageElement = document.getElementById("createFormImage");
    const descriptionElement = document.getElementById("createFormDescription");
    const versionsElement = document.getElementById("createFormVersions");
    const tagsElement = document.getElementById("createFormTags");
    const linksElement = document.getElementById("createFormLinks");
    const jarElement = document.getElementById("createFormJar");
    const backButton = document.getElementById("createFormBackButton");
    const continueButton = document.getElementById("createFormContinueButton");
    const submitButton = document.getElementById("createFormSubmitButton");

    if (step === 1) {
      typeElement.style.display = "block";
      titleElement.style.display = "block";
      urlElement.style.display = "block";
      summaryElement.style.display = "block";
      imageElement.style.display = "none";
      descriptionElement.style.display = "none";
      versionsElement.style.display = "none";
      tagsElement.style.display = "none";
      linksElement.style.display = "none";
      jarElement.style.display = "none";
      continueButton.style.width = "100%";
      continueButton.style.display = "flex";
      submitButton.style.display = "none";
    } else if (step === 2) {
      typeElement.style.display = "none";
      titleElement.style.display = "none";
      urlElement.style.display = "none";
      summaryElement.style.display = "none";
      imageElement.style.display = "none";
      descriptionElement.style.display = "none";
      versionsElement.style.display = "block";
      tagsElement.style.display = "block";
      linksElement.style.display = "none";
      jarElement.style.display = "none";
      backButton.style.width = "100%";
      continueButton.style.display = "flex";
      submitButton.style.display = "none";
    } else if (step === 3) {
      typeElement.style.display = "none";
      titleElement.style.display = "none";
      urlElement.style.display = "none";
      summaryElement.style.display = "none";
      imageElement.style.display = "block";
      descriptionElement.style.display = "block";
      versionsElement.style.display = "none";
      tagsElement.style.display = "none";
      linksElement.style.display = "none";
      jarElement.style.display = "none";
      backButton.style.width = "100%";
      continueButton.style.display = "flex";
      submitButton.style.display = "none";
    } else if (step === 4) {
      typeElement.style.display = "none";
      titleElement.style.display = "none";
      urlElement.style.display = "none";
      summaryElement.style.display = "none";
      imageElement.style.display = "none";
      descriptionElement.style.display = "none";
      versionsElement.style.display = "none";
      tagsElement.style.display = "none";
      linksElement.style.display = "block";
      jarElement.style.display = "block";
      backButton.style.width = "33%";
      continueButton.style.display = "none";
      submitButton.style.display = "flex";
    }
  }, [step]);

  return (
    <form className={styles.form} onSubmit={onSubmit}>
      {errors.map((error, index) => (
        <p key={index} className="text-danger mb-3">
          {error}
        </p>
      ))}

      <div className={styles.header}>
        <h2>Create a Project</h2>
        <X className={styles.xButton} />
      </div>

      <div className={styles.formContent}>
        <div id="createFormType">
          <label htmlFor="type">
            Type<span className={styles.required}>*</span>
          </label>
          <div className={styles.typeOptions}>
            <input type="type" defaultValue={type} onChange={handleChange} hidden />
            <SelectOption name="Server" selected={type === "Server"} onClick={() => setType("Server")} />
            <SelectOption name="Plugin" selected={type === "Plugin"} onClick={() => setType("Plugin")} />
          </div>
        </div>

        <div id="createFormTitle">
          <label htmlFor="title">
            Name<span className={styles.required}>*</span>
          </label>
          <input name="title" type="text" placeholder="Title" onChange={handleChange} className={styles.nameInput} />
        </div>

        <div id="createFormUrl">
          <label htmlFor="url">
            URL<span className={styles.required}>*</span>
          </label>
          <div>
            <p className={styles.url} onClick={setFocus}>
              {`https://minelist.gg/${type.toLocaleLowerCase()}/`}
              <input name="url" type="text" onChange={handleChange} className={styles.urlInput} onFocus={toggleUrlBorder} onBlur={toggleUrlBorder} />
            </p>
          </div>
        </div>

        <div id="createFormSummary">
          <label htmlFor="summary">
            Summary<span className={styles.required}>*</span>
          </label>
          <p>A short description that appears in searches.</p>
          <textarea name="summary" type="summary" placeholder="Summary" onChange={handleChange} />
        </div>

        <div id="createFormImage">
          <label htmlFor="image">
            {type} Image<span className={styles.required}>*</span>
          </label>
          <p>The logo image for your {type.toLowerCase()}.</p>
          <input name="image" type="file" accept="image/*" onChange={handleChange} />
        </div>

        <div id="createFormDescription">
          <label htmlFor="description">
            Description<span className={styles.required}>*</span>
          </label>
          <p>The long description to go on the main {type.toLowerCase()} page.</p>
          <div className={styles.descriptionModes}>
            <SelectOption
              name="Edit"
              selected={descriptionMode === "Edit"}
              icon={<Pencil width={16} height={16} />}
              onClick={() => {
                setDescriptionMode("Edit");
              }}
            />
            <SelectOption
              name="Preview"
              selected={descriptionMode === "Preview"}
              icon={<Eye width={16} height={16} />}
              onClick={() => {
                setDescriptionMode("Preview");
              }}
            />
          </div>
          {descriptionMode === "Edit" ? (
            <textarea
              name="description"
              placeholder="Long description"
              onChange={(e) => {
                setDescription(e.currentTarget.value);
                handleChange(e);
              }}
            />
          ) : (
            parseMarkdown(description)
          )}
        </div>

        <div id="createFormVersions">
          <label htmlFor="versions">
            Working Versions<span className={styles.required}>*</span>
          </label>
          <div className={styles.versions}>
            <div>
              <input type="checkbox" name="versions" value="1.7" onChange={handleChange} />
              <span>1.7</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.8" onChange={handleChange} />
              <span>1.8</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.9" onChange={handleChange} />
              <span>1.9</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.10" onChange={handleChange} />
              <span>1.10</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.11" onChange={handleChange} />
              <span>1.11</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.12" onChange={handleChange} />
              <span>1.12</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.13" onChange={handleChange} />
              <span>1.13</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.14" onChange={handleChange} />
              <span>1.14</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.15" onChange={handleChange} />
              <span>1.15</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.16" onChange={handleChange} />
              <span>1.16</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.17" onChange={handleChange} />
              <span>1.17</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.18" onChange={handleChange} />
              <span>1.18</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.19" onChange={handleChange} />
              <span>1.19</span>
            </div>
            <div>
              <input type="checkbox" name="versions" value="1.20" onChange={handleChange} />
              <span>1.20</span>
            </div>
          </div>
        </div>

        <div id="createFormTags">
          <label htmlFor="tags">
            Tags<span className={styles.required}>*</span>
          </label>
          <div className={styles.tags}>
            <SelectOption name="Chat" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Chat")} onClick={() => toggleTag("Chat")} />
            <SelectOption name="Utility" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Utility")} onClick={() => toggleTag("Utility")} />
            <SelectOption name="Economy" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Economy")} onClick={() => toggleTag("Economy")} />
            <SelectOption name="Fun" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Fun")} onClick={() => toggleTag("Fun")} />
            <SelectOption name="Management" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Management")} onClick={() => toggleTag("Management")} />
            <SelectOption name="Adventure" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Adventure")} onClick={() => toggleTag("Adventure")} />
            <SelectOption name="Cursed" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Cursed")} onClick={() => toggleTag("Cursed")} />
            <SelectOption name="Equipment" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Equipment")} onClick={() => toggleTag("Equipment")} />
            <SelectOption name="Magic" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Magic")} onClick={() => toggleTag("Magic")} />
            <SelectOption name="Minigame" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Minigame")} onClick={() => toggleTag("Minigame")} />
            <SelectOption name="Mobs" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Mobs")} onClick={() => toggleTag("Mobs")} />
            <SelectOption name="Optimization" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("Optimization")} onClick={() => toggleTag("Optimization")} />
            <SelectOption name="World Generation" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("World Generation")} onClick={() => toggleTag("World Generation")} />
          </div>
        </div>

        <div id="createFormJar">
          <label htmlFor="file">Upload Jar</label>
          <input name="file" type="file" accept=".jar" onChange={handleChange} />
        </div>

        <div id="createFormLinks">
          <label htmlFor="link">Links</label>
          {[...Array(linkCount)].map((input, index) => (
            <div key={index} className={styles.link}>
              <div>
                <input name={`linkTitle${index}`} type="text" placeholder="Link Title" onChange={handleChange} />
                <RightArrow width={22} height={22} />
                <input name={`link${index}`} type="text" placeholder="URL" onChange={handleChange} />
                <Trashcan width={28} height={28} color="var(--primaryColor)" className={styles.deleteLinkButton} onClick={() => setLinkCount((prev) => prev - 1)} />
              </div>
            </div>
          ))}
          <Button onClick={addLink} icon={<Link width={16} height={16} color="var(--primaryColor)" />} className={`${styles.addLinkButton} button-quaternary`}>
            Add Link
          </Button>
        </div>

        <div className={styles.buttons}>
          <Button id="createFormBackButton" className="button-quaternary" icon={<LeftArrow color="var(--primaryColor)" />} onClick={() => setStep((prev) => prev - 1)}>
            Back
          </Button>
          <Button id="createFormContinueButton" className="button-secondary" icon={<RightArrow color="var(--primaryColor)" />} onClick={() => setStep((prev) => prev + 1)}>
            Continue
          </Button>
          <Button id="createFormSubmitButton" type="submit" icon={<PlusSquare color="var(--primaryColor)" />} className={`button button-secondary ${styles.submitButton}`}>
            Create {type}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginForm;
