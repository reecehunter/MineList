import React, { useEffect, useRef, useState } from "react";
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
import SquareImage from "../SquareImage/SquareImage";

const CreateForm = (props) => {
  const { show, setShow } = props;

  const formContainerRef = useRef();
  const formRef = useRef();
  const imageUploadButtonRef = useRef();

  const [formData, setFormData] = useState({ price: 0 });
  const [linkCount, setLinkCount] = useState(1);
  const [errors, setErrors] = useState([]);
  const [type, setType] = useState("Server");
  const [step, setStep] = useState(1);
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [descriptionMode, setDescriptionMode] = useState("Edit");
  const [description, setDescription] = useState("");
  const [versions, setVersions] = useState([]);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const changeStep = (amount) => {
    if (step + amount > 5) return;
    else if (step + amount < 1) return;
    setStep((prev) => prev + amount);
  };

  const handleImageChange = (event) => {
    setImage(event.target.files[0]);
  };

  const handleJarChange = (event) => {
    setFormData({ ...formData, jar: event.target.files[0] });
  };

  useEffect(() => {
    setFormData({ ...formData, image: image });
    if (image) {
      setImagePreview(URL.createObjectURL(image));
    }
  }, [image]);

  const handleLinkChange = (event, index, titleOrURL) => {
    setLinks({
      ...links,
      [index]: { ...links[index], [titleOrURL]: event.target.value },
    });
  };

  useEffect(() => {
    setFormData({ ...formData, links: links });
  }, [links]);

  useEffect(() => console.log(formData), [formData]);

  const onSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    axios
      .post(`${config.api_url}/api/plugins/create`, formData, {
        headers: {
          "content-type": "multipart/form-data",
        },
      })
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

  const toggleVersion = (version) => {
    const index = versions.indexOf(version);
    if (index > -1) {
      const newVersions = [...versions];
      newVersions.splice(index, 1);
      setVersions(newVersions);
    } else {
      setVersions([...versions, version]);
    }
  };

  const addLinkInput = () => {
    if (linkCount < 5) setLinkCount((prev) => prev + 1);
  };

  useEffect(() => {
    handleChange({ target: { name: "type", value: type } });
  }, [type]);

  useEffect(() => {
    handleChange({ target: { name: "tags", value: tags } });
  }, [tags]);

  useEffect(() => {
    handleChange({ target: { name: "versions", value: versions } });
  }, [versions]);

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
    const priceElement = document.getElementById("createFormPrice");
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
      priceElement.style.display = "none";
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
      priceElement.style.display = "none";
      jarElement.style.display = "none";
      backButton.style.width = "100%";
      continueButton.style.display = "flex";
      submitButton.style.display = "none";
    } else if (step === 3) {
      typeElement.style.display = "none";
      titleElement.style.display = "none";
      urlElement.style.display = "none";
      summaryElement.style.display = "none";
      imageElement.style.display = "flex";
      descriptionElement.style.display = "block";
      versionsElement.style.display = "none";
      tagsElement.style.display = "none";
      linksElement.style.display = "none";
      priceElement.style.display = "none";
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
      priceElement.style.display = "block";
      jarElement.style.display = "block";
      backButton.style.width = "33%";
      continueButton.style.display = "none";
      submitButton.style.display = "flex";
    }
  }, [step]);

  useEffect(() => {
    if (show) {
      formContainerRef.current.classList.add(styles.show);
      setTimeout(() => {
        formRef.current.style.top = "50px";
      }, 100);
      document.body.classList.add(styles.bodyNoScroll);
    } else {
      setTimeout(() => {
        formContainerRef.current.classList.remove(styles.show);
      }, 200);
      formRef.current.style.top = "100vh";
      document.body.classList.remove(styles.bodyNoScroll);
    }
  }, [show]);

  return (
    <div ref={formContainerRef} className={styles.container}>
      <form ref={formRef} encType="multipart/form-data" className={styles.form} onSubmit={onSubmit}>
        {errors.map((error, index) => (
          <p key={index} className="text-danger mb-3">
            {error}
          </p>
        ))}

        <div className={styles.header}>
          <h2>Create a Project</h2>
          <X className={styles.xButton} onClick={() => setShow(false)} />
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

          <div id="createFormImage" className={styles.imageContainer}>
            <div>
              <label htmlFor="image">
                {type} Image<span className={styles.required}>*</span>
              </label>
              <p>The logo image for your {type.toLowerCase()}.</p>
              <Button onClick={() => imageUploadButtonRef.current.click()}>Choose Image</Button>
              <input ref={imageUploadButtonRef} name="image" type="file" accept="image/*" onChange={handleImageChange} hidden />
            </div>
            {imagePreview ? <SquareImage src={imagePreview} alt={`${type} display`} /> : ""}
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
            <div className={styles.tags}>
              <SelectOption name="1.7" icon="" selected={versions.includes(1)} onClick={() => toggleVersion(1)} />
              <SelectOption name="1.8" icon="" selected={versions.includes(2)} onClick={() => toggleVersion(2)} />
              <SelectOption name="1.9" icon="" selected={versions.includes(3)} onClick={() => toggleVersion(3)} />
              <SelectOption name="1.10" icon="" selected={versions.includes(4)} onClick={() => toggleVersion(4)} />
              <SelectOption name="1.11" icon="" selected={versions.includes(5)} onClick={() => toggleVersion(5)} />
              <SelectOption name="1.12" icon="" selected={versions.includes(6)} onClick={() => toggleVersion(6)} />
              <SelectOption name="1.13" icon="" selected={versions.includes(7)} onClick={() => toggleVersion(7)} />
              <SelectOption name="1.14" icon="" selected={versions.includes(8)} onClick={() => toggleVersion(8)} />
              <SelectOption name="1.15" icon="" selected={versions.includes(9)} onClick={() => toggleVersion(9)} />
              <SelectOption name="1.16" icon="" selected={versions.includes(10)} onClick={() => toggleVersion(10)} />
              <SelectOption name="1.17" icon="" selected={versions.includes(11)} onClick={() => toggleVersion(11)} />
              <SelectOption name="1.18" icon="" selected={versions.includes(12)} onClick={() => toggleVersion(12)} />
              <SelectOption name="1.19" icon="" selected={versions.includes(13)} onClick={() => toggleVersion(13)} />
              <SelectOption name="1.20" icon="" selected={versions.includes(14)} onClick={() => toggleVersion(14)} />
            </div>
          </div>

          <div id="createFormTags">
            <label htmlFor="tags">
              Tags<span className={styles.required}>*</span>
            </label>
            <div className={styles.tags}>
              <SelectOption name="Chat" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("1")} onClick={() => toggleTag("1")} />
              <SelectOption name="Utility" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("2")} onClick={() => toggleTag("2")} />
              <SelectOption name="Economy" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("3")} onClick={() => toggleTag("3")} />
              <SelectOption name="Fun" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("4")} onClick={() => toggleTag("4")} />
              <SelectOption name="Management" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("5")} onClick={() => toggleTag("5")} />
              <SelectOption name="Adventure" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("6")} onClick={() => toggleTag("6")} />
              <SelectOption name="Cursed" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("7")} onClick={() => toggleTag("7")} />
              <SelectOption name="Equipment" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("8")} onClick={() => toggleTag("8")} />
              <SelectOption name="Magic" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("9")} onClick={() => toggleTag("9")} />
              <SelectOption name="Minigame" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("10")} onClick={() => toggleTag("10")} />
              <SelectOption name="Mobs" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("11")} onClick={() => toggleTag("11")} />
              <SelectOption name="Optimization" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("12")} onClick={() => toggleTag("12")} />
              <SelectOption name="World Generation" icon={<Hash />} alwaysShowIcon={true} selected={tags.includes("13")} onClick={() => toggleTag("13")} />
            </div>
          </div>

          <div id="createFormPrice" className={styles.priceContainer}>
            <label htmlFor="price">Price</label>
            <p>
              $<input name="price" type="number" defaultValue={0} onChange={handleChange} />
            </p>
          </div>

          <div id="createFormLinks">
            <label htmlFor="link">Links</label>
            {[...Array(linkCount)].map((input, index) => (
              <div key={index} className={styles.link}>
                <div>
                  <input name={`linkTitle${index}`} type="text" placeholder="Link Title" onChange={(e) => handleLinkChange(e, index, "title")} />
                  <RightArrow width={22} height={22} />
                  <input name={`linkURL${index}`} type="text" placeholder="URL" onChange={(e) => handleLinkChange(e, index, "url")} />
                  <Trashcan width={28} height={28} color="var(--primaryColor)" className={styles.deleteLinkButton} onClick={() => setLinkCount((prev) => prev - 1)} />
                </div>
              </div>
            ))}
            <Button onClick={addLinkInput} icon={<Link width={16} height={16} color="var(--primaryColor)" />} className={`${styles.addLinkButton} button-quaternary`}>
              Add Link
            </Button>
          </div>

          <div id="createFormJar">
            <label htmlFor="jar">Upload Jar</label>
            <input name="jar" type="file" accept=".jar" onChange={handleJarChange} />
          </div>

          <div className={styles.buttons}>
            <Button id="createFormBackButton" className="button-quaternary" icon={<LeftArrow color="var(--primaryColor)" />} onClick={() => changeStep(-1)}>
              Back
            </Button>
            <Button id="createFormContinueButton" className="button-secondary" icon={<RightArrow color="var(--primaryColor)" />} onClick={() => changeStep(1)}>
              Continue
            </Button>
            <Button id="createFormSubmitButton" type="submit" icon={<PlusSquare color="var(--primaryColor)" />} className={`button button-secondary ${styles.submitButton}`}>
              Create {type}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
