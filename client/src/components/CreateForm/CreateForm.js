import React, { useState } from "react";
import styles from "./CreateForm.module.css";
import axios from "axios";
import Button from "../../components/Button/Button";
import SelectOption from "../SelectOption/SelectOption";
import RightArrow from "../icons/RightArrow";
import X from "../icons/X";

const LoginForm = () => {
  const [formData, setFormData] = useState({ username: "username", password: "password" });
  const [linkCount, setLinkCount] = useState(1);
  const [errors, setErrors] = useState([]);
  const [type, setType] = useState("Server");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const onSubmit = (event) => {
    event.preventDefault();
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

  const addLink = () => {
    if (linkCount < 5) setLinkCount((prev) => prev + 1);
  };

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
        <div>
          <label htmlFor="title">
            Type<span className={styles.required}>*</span>
          </label>
          <div className={styles.typeOptions}>
            <SelectOption name="Server" selected={type === "Server"} onClick={() => setType("Server")} />
            <SelectOption name="Plugin" selected={type === "Plugin"} onClick={() => setType("Plugin")} />
          </div>
        </div>
        <div>
          <label htmlFor="title">
            Name<span className={styles.required}>*</span>
          </label>
          <input name="title" type="text" placeholder="Title" onChange={handleChange} className={styles.nameInput} />
        </div>
        <div>
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
        <div>
          <label htmlFor="summary">
            Summary<span className={styles.required}>*</span>
          </label>
          <p>A short description that appears in searches.</p>
          <textarea name="summary" type="summary" placeholder="Summary" onChange={handleChange} />
        </div>

        <div className={styles.buttons}>
          <Button className="button-quaternary" icon={<X stroke="2" color="var(--primaryColor)" />}>
            Cancel
          </Button>
          <Button className="button-secondary" icon={<RightArrow color="var(--primaryColor)" />}>
            Continue
          </Button>
        </div>
      </div>

      {/* <div>
                <label htmlFor="title">Title</label>
                <input name="title" type="text" placeholder="Title" onChange={handleChange} />
            </div>
            <div>
                <label htmlFor="summary">Summary</label>
                <input name="summary" type="summary" placeholder="Summary" onChange={handleChange} />
            </div>

            <div>
                <label htmlFor="file">Upload Jar</label>
                <input name="file" type="file" accept=".jar" />
            </div>

            <div>
                <label htmlFor="image">Upload Image</label>
                <input name="image" type="file" accept="image/*" />
            </div>

            <div>
                <label>Working Versions</label>
                <div>
                    <input type="checkbox" name="versions" value="1.7" />
                    <label htmlFor="1.7">1.7</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.8" />
                    <label htmlFor="1.8">1.8</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.9" />
                    <label htmlFor="1.9">1.9</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.10" />
                    <label htmlFor="1.10">1.10</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.11" />
                    <label htmlFor="1.11">1.11</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.12" />
                    <label htmlFor="1.12">1.12</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.13" />
                    <label htmlFor="1.13">1.13</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.14" />
                    <label htmlFor="1.14">1.14</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.15" />
                    <label htmlFor="1.15">1.15</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.16" />
                    <label htmlFor="1.16">1.16</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.17" />
                    <label htmlFor="1.17">1.17</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.18" />
                    <label htmlFor="1.18">1.18</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.19" />
                    <label htmlFor="1.19">1.19</label>
                </div>
                <div>
                    <input type="checkbox" name="versions" value="1.20" />
                    <label htmlFor="1.20">1.20</label>
                </div>
            </div>

            <div>
                <label htmlFor="description">Description</label>
                <textarea name="description" placeholder="Long description" onChange={handleChange} />
            </div>

            <div id="linksContainer">
                {[...Array(linkCount)].map((input, index) => (
                    <div key={index}>
                        <label htmlFor="link">Link {index + 1}</label>
                        <div>
                            <input name="linkTitle" type="text" placeholder="Link Title" />
                            <input name="link" type="text" placeholder="https://www.minelist.gg" />
                        </div>
                    </div>
                ))}
                <Button onClick={addLink}>Add Link</Button>
            </div>

            <input type="submit" value="Submit" className='button button-secondary' /> */}
    </form>
  );
};

export default LoginForm;
