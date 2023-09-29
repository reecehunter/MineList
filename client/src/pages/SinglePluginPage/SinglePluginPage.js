import React, { useEffect, useRef, useState } from "react";
import config from "../../config/config";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./SinglePluginPage.module.css";
import markdownStyles from "../../components/MarkdownEditor/MarkdownEditor.module.css";
import User from "../../components/icons/User";
import Button from "../../components/Button/Button";
import Download from "../../components/icons/Download";
import Star from "../../components/icons/Star";
import Pencil from "../../components/icons/Pencil";
import Tag from "../../components/Tag/Tag";
import formatVersion from "../../helpers/versionFormatter";
import Statistic from "../../components/Statistic/Statistic";
import ContentNav from "../../components/ContentNav/ContentNav";
import InfoCard from "../../components/InfoCard/InfoCard";
import LinkButton from "../../components/LinkButton/LinkButton";
import TextInput from "../../components/Input/TextInput/TextInput";
import { checkAuth } from "../../helpers/jwt";
import { validatePluginForm } from "../../helpers/formValidation";
import MarkdownEditor from "../../components/MarkdownEditor/MarkdownEditor";
import TextArea from "../../components/Input/Textarea/TextArea";
import Camera from "../../components/icons/Camera";
import X from "../../components/icons/X";
import Loader from "../../components/Loader/Loader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SelectOption from "../../components/SelectOption/SelectOption";
import Hash from "../../components/icons/Hash";

const SingleServerPage = () => {
  const { id } = useParams();
  const [selectedInfo, setSelectedInfo] = useState("Description");
  const [pluginData, setPluginData] = useState([{ imgSrc: "", name: "", downloads: 0 }]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState();

  const imageInputRef = useRef();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(image);
  const [newTags, setNewTags] = useState([]);
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const downloadJar = () => {
    addDownload();
    var link = document.createElement("a");
    const url = pluginData[0].jarURL;
    link.href = url;
    link.download = url.substr(url.lastIndexOf("/") + 1);
    link.click();
  };

  const addDownload = async () => {
    const key = `download_${id}`;
    const downloads = localStorage.getItem(key);
    if (downloads < 25) {
      const res = await axios.post(`${config.api_url}/api/plugins/downloads/add/${id}`);
      if (res.status === 200) {
        if (downloads) localStorage.setItem(key, parseInt(downloads) + 1);
        else localStorage.setItem(key, 1);
      }
    }
  };

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const toggleNewTag = (tagName) => {
    const index = newTags.indexOf(tagName);
    if (index > -1) {
      const newNewTags = [...newTags];
      newNewTags.splice(index, 1);
      setNewTags(newNewTags);
    } else {
      setNewTags([...newTags, tagName]);
    }
  };

  useEffect(() => {
    setFormData({ ...formData, tags: newTags });
  }, [newTags]);

  const onSubmit = (event) => {
    event.preventDefault();
    setSubmitted(true);
    axios
      .post(
        `${config.api_url}/api/plugins/edit/${id}`,
        { ...formData, author_id: pluginData[0].author_id },
        {
          headers: { "content-type": "multipart/form-data", user_id: pluginData[0].author_id },
        }
      )
      .then((res) => (window.location.href = `/plugin/${id}`))
      .catch((err) => {
        console.error(err);
        setErrors([err.response.data.message]);
      })
      .finally(() => setSubmitted(false));
  };

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();

      const pluginDataResult = await axios.get(`${config.api_url}/api/plugins/detailed/${id}`);
      setPluginData(pluginDataResult.data);
      setFormData({
        image: pluginDataResult.data[0].imgSrc,
        title: pluginDataResult.data[0].name,
        summary: pluginDataResult.data[0].description,
        description: pluginDataResult.data[0].longDescription,
      });
      setImage(pluginDataResult.data[0].imgSrc);

      checkAuth((authRes) => {
        if (authRes) {
          if (pluginDataResult.data[0].author_id === authRes.data.id) {
            setIsOwnProfile(true);
          }
        }
      });

      window.document.title = pluginDataResult.data[0].name + " - Description";

      const authorsOutput = [];
      const linkOutput = [];
      const tagOutput = [];
      const updateOutput = [];

      for (const dataSet of pluginDataResult.data) {
        const authorUsername = dataSet.author_username;

        const updateList = dataSet.updateList;
        const updateTitle = dataSet.updateTitle;
        const updateVersion = { major: dataSet.versionMajor, minor: dataSet.versionMinor, patch: dataSet.versionPatch };

        // Authors
        let isAuthorPresent = false;
        const authorData = { id: dataSet.author_id, username: dataSet.author_username, pfpImgSrc: dataSet.author_pfpImgSrc };
        for (const entry of authorsOutput) {
          if (entry.username === authorUsername) isAuthorPresent = true;
        }
        if (!isAuthorPresent) {
          authorsOutput.push(authorData);
          isAuthorPresent = false;
        }

        // Links
        let isLinkPresent = false;
        const linkData = { title: dataSet.link_title, url: dataSet.link_url };
        for (const entry of linkOutput) {
          if (entry.title && entry.url && entry.title === linkData.title) {
            isLinkPresent = true;
          }
        }
        if (!isLinkPresent) {
          if (linkData.title && linkData.url) linkOutput.push(linkData);
          isLinkPresent = false;
        }

        // Tags
        const tagName = dataSet.tag_name;
        if (tagName != null && !tagOutput.includes(tagName)) tagOutput.push(tagName);

        // Updates
        if (updateList != null) {
          let isUpdatePresent = false;
          const updateData = { updateList, updateVersion, updateTitle };
          for (const update of updateOutput) {
            if (update.updateList === updateData.updateList) isUpdatePresent = true;
          }
          if (!isUpdatePresent) {
            updateOutput.push(updateData);
            isUpdatePresent = false;
          }
        }
      }

      setAuthors(authorsOutput);
      setLinks(linkOutput);
      setTags(tagOutput);
      setUpdates(updateOutput);

      const timeTaken = Date.now() - startTime;
      console.log(`Fetched data in ${timeTaken} ms.`);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFormData({ ...formData, image: image });
    if (image != null && typeof image === "object") {
      setImagePreview(URL.createObjectURL(image));
    } else {
      setImagePreview(image);
    }
  }, [image]);

  useEffect(() => {
    setErrors(validatePluginForm(formData));
  }, [formData]);

  useEffect(() => {
    if (editMode) {
      for (const tag of tags) {
        newTags.push(tag);
      }
    }
    setTimeout(() => {
      setShowSaveButton(editMode);
    }, 1);
  }, [editMode]);

  const renderContent = () => {
    window.document.title = pluginData[0].name + " - " + selectedInfo;

    switch (selectedInfo) {
      case "Description":
        if (editMode) {
          return <MarkdownEditor inputName="description" defaultValue={pluginData[0].longDescription} onChange={handleChange} />;
        } else {
          return pluginData[0] ? (
            <Markdown remarkPlugins={[remarkGfm]} className={markdownStyles.previewContainer}>
              {pluginData[0].longDescription}
            </Markdown>
          ) : (
            ""
          );
        }

      case "Updates":
        if (updates.length > 0) {
          return (
            <div className={styles.updatesContainer}>
              {updates.map((updateObj, index1) => (
                <div key={index1} className={styles.update}>
                  <p className={styles.updateTitle}>
                    {updateObj.updateTitle} <span className={styles.updateVersion}>{formatVersion(updateObj.updateVersion)}</span>
                  </p>
                  <div>
                    {updateObj.updateList.split("|").map((updateBullet, index2) => {
                      return <p key={index2}>{updateBullet}</p>;
                    })}
                  </div>
                </div>
              ))}
            </div>
          );
        } else {
          return <></>;
        }
    }
  };

  return (
    <form onSubmit={onSubmit} encType="multipart/form-data">
      {editMode
        ? errors.map((error, index) => (
            <p key={index} className="text-danger mb-3">
              {error}
            </p>
          ))
        : ""}
      {submitted ? <Loader /> : ""}
      <div className={styles.heading}>
        <div className={styles.headingInfo}>
          {editMode ? (
            <div className={styles.editImageContainer}>
              <img src={imagePreview} className={styles.logo} alt={`${pluginData[0].name} logo`} />
              <Button icon={<Camera color="var(--primaryColor)" />} onClick={() => imageInputRef.current.click()} className="button-secondary">
                Change Image
              </Button>
              <input ref={imageInputRef} name="image" type="file" accept="image/*" onChange={(e) => setImage(e.target.files[0])} hidden />
            </div>
          ) : (
            <img src={pluginData[0].imgSrc ? pluginData[0].imgSrc : "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png"} alt={`${pluginData[0].name} logo`} className={styles.logo} />
          )}
          <div>
            {editMode ? (
              <div>
                <TextInput name="title" defaultValue={pluginData[0].name} onChange={handleChange} className={styles.titleInput} />
                <TextArea name="summary" defaultValue={pluginData[0].description} onChange={handleChange} className={styles.summaryInput} />
              </div>
            ) : (
              <>
                <h1 className="text-primaryy">{pluginData[0].name}</h1>
                <p className="text-quaternary">{pluginData[0].description}</p>
              </>
            )}
          </div>
        </div>
        <div>
          <div className={styles.stats}>
            <Statistic icon={<Download />} number={pluginData[0].downloads} text="downloads" />
            <Statistic icon={<Star />} number={0} text="stars" />
            <Statistic icon={<User />} number={0} text="followers" />
          </div>
        </div>
        <div className={styles.headingButtons}>
          {!editMode ? (
            <Button className="button-secondary" onClick={downloadJar} icon={<Download color="var(--primaryColor)" />}>
              Download
            </Button>
          ) : (
            ""
          )}
          {isOwnProfile ? (
            showSaveButton ? (
              <>
                <Button className="button-secondary" type="submit" icon={<Pencil color="var(--primaryColor)" width="18" />}>
                  Save
                </Button>
                <Button className="button-quaternary" icon={<X color="var(--primaryColor)" width="18" />} onClick={() => setEditMode(false)}>
                  Cancel
                </Button>
              </>
            ) : (
              <Button className="button-quaternary" onClick={() => setEditMode(true)} icon={<Pencil color="var(--primaryColor)" width="18" />}>
                Edit
              </Button>
            )
          ) : (
            ""
          )}
        </div>
      </div>

      <div className={styles.info}>
        <div>
          <InfoCard title="Authors">
            {authors.map((author, index) => (
              <Link key={index} to={`/user/${author.username}`} className={styles.link}>
                <img
                  src={
                    author.pfpImgSrc
                      ? author.pfpImgSrc
                      : "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"
                  }
                />
                <p>{author.username}</p>
              </Link>
            ))}
          </InfoCard>
          <InfoCard title="Links">
            <div className={styles.linksContainer}>
              {links.map((link, index) => (
                <LinkButton key={index} url={link.url}>
                  {link.title}
                </LinkButton>
              ))}
            </div>
          </InfoCard>
          <InfoCard title="Tags" className={styles.tags}>
            {editMode ? (
              <div>
                {config.server_tags.map((tag, index) => (
                  <SelectOption key={index} name={tag} icon={<Hash />} alwaysShowIcon={true} selected={newTags.includes(tag)} onClick={() => toggleNewTag(tag)} />
                ))}
              </div>
            ) : (
              tags.map((tag, index) => <Tag key={index} name={tag} />)
            )}
          </InfoCard>
          <InfoCard title="Downloads">
            <div></div>
          </InfoCard>
        </div>
        <div>
          {editMode ? "" : <ContentNav options={["Description", "Updates", "Reviews"]} handleClick={setSelectedInfo} className={styles.contentNav} />}
          {renderContent()}
        </div>
      </div>
    </form>
  );
};

export default SingleServerPage;
