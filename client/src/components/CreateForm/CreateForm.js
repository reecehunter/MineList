import React, { useEffect, useRef, useState } from "react";
import styles from "./CreateForm.module.css";
import axios from "axios";
import config from "../../config/config";
import Button from "../../components/Button/Button";
import SelectOption from "../Input/SelectOption/SelectOption";
import RightArrow from "../icons/RightArrow";
import LeftArrow from "../icons/LeftArrow";
import X from "../icons/X";
import PlusSquare from "../icons/PlusSquare";
import Hash from "../icons/Hash";
import MarkdownEditor from "../Input/MarkdownEditor/MarkdownEditor";
import SquareImage from "../SquareImage/SquareImage";
import Loader from "../Loader/Loader";
import LinkInputEditor from "../Input/LinkInput/LinkInputEditor/LinkInputEditor";

const CreateForm = (props) => {
  const { show, setShow } = props;

  const formContainerRef = useRef();
  const formRef = useRef();
  const imageUploadButtonRef = useRef();

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ title: "", url: "", summary: "", versions: [], tags: [], image: null, description: "", jar: null, links: { 0: { title: "", url: "" } }, price: "0" });
  const [errors, setErrors] = useState([]);
  const [type, setType] = useState("Plugin");
  const [step, setStep] = useState(1);
  const [image, setImage] = useState();
  const [imagePreview, setImagePreview] = useState();
  const [description, setDescription] = useState("");
  const [platforms, setPlatforms] = useState([]);
  const [versions, setVersions] = useState([]);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function validateStep(cb) {
    const newErrors = [];
    if (step === 1) {
      if (formData.title.length < 3) newErrors.push("Title must be more than 3 characters.");
      if (formData.title.length > 30) newErrors.push("Title must be less than 30 characters.");
      if (formData.url.length < 3) newErrors.push("URL must be at least 3 characters.");
      if (formData.url.length > 20) newErrors.push("URL must be less than 20 characters.");
      if (formData.summary.length < 30) newErrors.push("The summary must be at least 30 characters.");
    } else if (step === 2) {
      if (formData.platforms.length < 1) newErrors.push("You must select at least 1 server platform.");
      if (formData.versions.length < 1) newErrors.push("You must select at least 1 working version.");
      if (formData.tags.length < 1) newErrors.push("You must select at least 1 tag.");
    } else if (step === 3) {
      if (formData.image === null) newErrors.push("You must upload an image.");
      if (formData.description.length < 100) newErrors.push("The description must be at least 100 characters.");
    } else if (step === 4) {
      if (formData.price === "" || !formData.price) newErrors.push("You must enter a price (put $0 to make it free).");
      const linkRegex = new RegExp(/[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)?/gi);
      for (const link of Object.values(formData.links)) {
        if (!link.title || link.title === "") newErrors.push("All links must have a title.");
        if (link.title && link.title.length > 20) newErrors.push("Link titles must be less than 20 characters.");
        if (link.url && !link.url.match(linkRegex)) newErrors.push("Links URL must be a valid URL.");
        if (!link.url || link.url === "") newErrors.push("All links must have a url.");
        if (link.url && link.url.length > 255) newErrors.push("Link URLs must be less than 255 characters.");
      }
      if (!formData.jar) newErrors.push("You must upload a plugin jar.");
    }
    if (newErrors.length === 0) {
      cb(true);
    } else {
      cb(false);
    }
    setErrors(newErrors);
  }

  function changeStep(amount) {
    if (step + amount > 5) return;
    else if (step + amount < 1) return;
    setStep((prev) => prev + amount);
  }

  function handleImageChange(event) {
    setImage(event.target.files[0]);
  }

  function handleJarChange(event) {
    setFormData({ ...formData, jar: event.target.files[0] });
  }

  useEffect(() => {
    setFormData({ ...formData, image: image });
    if (image) {
      setImagePreview(URL.createObjectURL(image));
    }
  }, [image]);

  function onSubmit(event) {
    event.preventDefault();
    if (submitted) return;
    if (type === "Plugin") {
      setSubmitted(true);
      axios
        .post(`${config.api_url}/api/plugins/create`, formData, {
          headers: { "content-type": "multipart/form-data" },
        })
        .then((res) => (window.location.href = `/plugin/${res.data.vanity_url}`))
        .catch((err) => {
          console.error(err);
          setErrors([err.response.data.message]);
        })
        .finally(() => setSubmitted(false));
    }
  }

  function toggleUrlBorder(event) {
    const element = event.currentTarget.parentElement;
    const border = "2px solid var(--secondaryColor)";
    if (element.style.border === border) element.style.border = "";
    else element.style.border = border;
  }

  function setFocus(event) {
    const element = event.currentTarget;
    element.children[0].focus();
  }

  function togglePlatform(platformName) {
    const index = platforms.indexOf(platformName);
    if (index > -1) {
      const newPlatform = [...platforms];
      newPlatform.splice(index, 1);
      setPlatforms(newPlatform);
    } else {
      setPlatforms([...platforms, platformName]);
    }
  }

  function toggleTag(tagName) {
    const index = tags.indexOf(tagName);
    if (index > -1) {
      const newTags = [...tags];
      newTags.splice(index, 1);
      setTags(newTags);
    } else {
      setTags([...tags, tagName]);
    }
  }

  function toggleVersion(version) {
    const index = versions.indexOf(version);
    if (index > -1) {
      const newVersions = [...versions];
      newVersions.splice(index, 1);
      setVersions(newVersions);
    } else {
      setVersions([...versions, version]);
    }
  }

  useEffect(() => {
    handleChange({ target: { name: "type", value: type } });
  }, [type]);

  useEffect(() => {
    handleChange({ target: { name: "platforms", value: platforms } });
  }, [platforms]);

  useEffect(() => {
    handleChange({ target: { name: "tags", value: tags } });
  }, [tags]);

  useEffect(() => {
    handleChange({ target: { name: "versions", value: versions } });
  }, [versions]);

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

  useEffect(() => setFormData({ ...formData, links: links }), [links]);

  return (
    <div ref={formContainerRef} className={styles.container}>
      <form ref={formRef} encType="multipart/form-data" className={styles.form} onSubmit={onSubmit}>
        <div className={styles.header}>
          <h2>Create a Project {submitted ? <Loader /> : ""}</h2>
          <X className={styles.xButton} onClick={() => setShow(false)} />
        </div>

        <div className={styles.formContent}>
          {errors.map((error, index) => (
            <p key={index} className="text-danger mb-3">
              {error}
            </p>
          ))}
          <div id="createFormType" className={step === 1 ? "" : styles.hide}>
            <label htmlFor="type">
              Type<span className={styles.required}>*</span>
            </label>
            <div className={styles.typeOptions}>
              <input type="type" defaultValue={type} onChange={handleChange} hidden />
              {/* <SelectOption name="Server" selected={type === "Server"} onClick={() => setType("Server")} /> */}
              <SelectOption name="Plugin" selected={type === "Plugin"} onClick={() => setType("Plugin")} />
            </div>
          </div>

          <div id="createFormTitle" className={step === 1 ? "" : styles.hide}>
            <label htmlFor="title">
              Name<span className={styles.required}>*</span>
            </label>
            <input name="title" type="text" placeholder="Title" onChange={handleChange} className={styles.nameInput} />
          </div>

          <div id="createFormUrl" className={step === 1 ? "" : styles.hide}>
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

          <div id="createFormSummary" className={step === 1 ? "" : styles.hide}>
            <label htmlFor="summary">
              Summary<span className={styles.required}>*</span>
            </label>
            <p>A short description that appears in searches.</p>
            <textarea name="summary" type="summary" placeholder="Summary" onChange={handleChange} />
          </div>

          <div id="createFormImage" className={`${step === 3 ? styles.imageContainer : styles.hide}`}>
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

          <div id="createFormDescription" className={step === 3 ? "" : styles.hide}>
            <label htmlFor="description">
              Description<span className={styles.required}>*</span>
            </label>
            <p>The long description to go on the main {type.toLowerCase()} page.</p>
            <MarkdownEditor
              inputName="description"
              defaultHeight={100}
              onChange={(e) => {
                setDescription(e.currentTarget.value);
                handleChange(e);
              }}
            />
          </div>

          <div id="createFormPlatforms" className={step === 2 ? "" : styles.hide}>
            <label htmlFor="platforms">
              Server Platforms<span className={styles.required}>*</span>
            </label>
            <div className={styles.tags}>
              {config.server_platforms.map((version, index) => (
                <SelectOption key={index} name={version} icon="" selected={platforms.includes(index + 1)} onClick={() => togglePlatform(index + 1)} />
              ))}
            </div>
          </div>

          <div id="createFormVersions" className={step === 2 ? "" : styles.hide}>
            <label htmlFor="versions">
              Working Versions<span className={styles.required}>*</span>
            </label>
            <div className={styles.tags}>
              {config.server_versions.map((version, index) => (
                <SelectOption key={index} name={version} icon="" selected={versions.includes(index + 1)} onClick={() => toggleVersion(index + 1)} />
              ))}
            </div>
          </div>

          <div id="createFormTags" className={step === 2 ? "" : styles.hide}>
            <label htmlFor="tags">
              Tags<span className={styles.required}>*</span>
            </label>
            <div className={styles.tags}>
              {config.server_tags.map((tag, index) => (
                <SelectOption key={index} name={tag} icon={<Hash />} alwaysShowIcon={true} selected={tags.includes(index + 1)} onClick={() => toggleTag(index + 1)} />
              ))}
            </div>
          </div>

          <div id="createFormPrice" className={`${step === 4 ? "" : styles.hide} ${styles.priceContainer}`}>
            <label htmlFor="price">Price</label>
            <p>
              $<input name="price" type="number" defaultValue={0} onChange={handleChange} />
            </p>
          </div>

          <div id="createFormLinks" className={step === 4 ? "" : styles.hide}>
            <LinkInputEditor links={links} setLinks={setLinks} />
          </div>

          <div id="createFormJar" className={step === 4 ? "" : styles.hide}>
            <label htmlFor="jar">Upload Jar</label>
            <input name="jar" type="file" accept=".jar" onChange={handleJarChange} />
          </div>

          <div className={styles.buttons}>
            <Button
              id="createFormBackButton"
              className="button-quaternary"
              icon={<LeftArrow color="var(--primaryColor)" />}
              onClick={() => {
                changeStep(-1);
                setErrors([]);
              }}
            >
              Back
            </Button>
            {step !== 4 ? (
              <Button
                id="createFormContinueButton"
                className={`${styles.continueButton} button-secondary`}
                icon={<RightArrow color="var(--primaryColor)" />}
                onClick={() =>
                  validateStep((res) => {
                    if (res) changeStep(1);
                  })
                }
              >
                Continue
              </Button>
            ) : (
              ""
            )}
            {step === 4 ? (
              <Button
                id="createFormSubmitButton"
                icon={<PlusSquare color="var(--primaryColor)" />}
                className={`button button-secondary ${styles.submitButton}`}
                type={errors.length === 0 ? "submit" : "button"}
                onClick={() => validateStep(() => {})}
              >
                Create {type}
              </Button>
            ) : (
              ""
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default CreateForm;
