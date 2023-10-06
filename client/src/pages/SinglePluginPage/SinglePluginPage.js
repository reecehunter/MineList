import React, { useEffect, useRef, useState } from "react";
import config from "../../config/config";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./SinglePluginPage.module.css";
import markdownStyles from "../../components/Input/MarkdownEditor/MarkdownEditor.module.css";
import User from "../../components/icons/User";
import Button from "../../components/Button/Button";
import Download from "../../components/icons/Download";
import Star from "../../components/icons/Star";
import Pencil from "../../components/icons/Pencil";
import Save from "../../components/icons/Save";
import Tag from "../../components/Tag/Tag";
import { getTimeDifference, formatTimestamp } from "../../helpers/dateTime";
import Statistic from "../../components/Statistic/Statistic";
import ContentNav from "../../components/ContentNav/ContentNav";
import InfoCard from "../../components/InfoCard/InfoCard";
import LinkButton from "../../components/LinkButton/LinkButton";
import TextInput from "../../components/Input/TextInput/TextInput";
import { checkAuth } from "../../helpers/jwt";
import { validatePluginForm } from "../../helpers/formValidation";
import MarkdownEditor from "../../components/Input/MarkdownEditor/MarkdownEditor";
import UpdateEditor from "../../components/Input/UpdateEditor/UpdateEditor";
import TextArea from "../../components/Input/TextArea/TextArea";
import Camera from "../../components/icons/Camera";
import X from "../../components/icons/X";
import Loader from "../../components/Loader/Loader";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import SelectOption from "../../components/Input/SelectOption/SelectOption";
import Hash from "../../components/icons/Hash";
import LinkInputEditor from "../../components/Input/LinkInput/LinkInputEditor/LinkInputEditor";
import Calendar from "../../components/icons/Calendar";

const SingleServerPage = () => {
  const navigate = useNavigate();
  const { vanityURL, selectedInfo = "Description" } = useParams();
  const [pluginData, setPluginData] = useState([{ imgSrc: "", name: "", downloads: 0 }]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [platforms, setPlatforms] = useState([]);
  const [links, setLinks] = useState([]);
  const [versions, setVersions] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [downloads, setDownloads] = useState([]);
  const [isOwnProfile, setIsOwnProfile] = useState(false);

  const [updateData, setUpdateData] = useState({ text: null, jar: null });

  const imageInputRef = useRef();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState(null);
  const [errors, setErrors] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(image);
  const [newTags, setNewTags] = useState([]);
  const [newPlatforms, setNewPlatforms] = useState([]);
  const [newVersions, setNewVersions] = useState([]);
  const [newLinks, setNewLinks] = useState({});
  const [showSaveButton, setShowSaveButton] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function downloadJar() {
    addDownload();
    var link = document.createElement("a");
    const url = pluginData[0].jarURL;
    link.href = url;
    link.download = url.substr(url.lastIndexOf("/") + 1);
    link.click();
  }

  async function addDownload() {
    const key = `download_${vanityURL}`;
    const downloads = localStorage.getItem(key);
    if (downloads < 25) {
      const res = await axios.post(`${config.api_url}/api/plugins/downloads/add/${vanityURL}`);
      if (res.status === 200) {
        if (downloads) localStorage.setItem(key, parseInt(downloads) + 1);
        else localStorage.setItem(key, 1);
      }
    }
  }

  function handleChange(event) {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  }

  function toggleNewTag(configIndex) {
    if (newTags.includes(configIndex)) {
      const newNewTags = [...newTags];
      newNewTags.splice(newNewTags.indexOf(configIndex), 1);
      setNewTags(newNewTags);
    } else {
      setNewTags([...newTags, configIndex]);
    }
  }

  function toggleNewPlatform(configIndex) {
    if (newPlatforms.includes(configIndex)) {
      const newNewPlatforms = [...newPlatforms];
      newNewPlatforms.splice(newNewPlatforms.indexOf(configIndex), 1);
      setNewPlatforms(newNewPlatforms);
    } else {
      setNewPlatforms([...newPlatforms, configIndex]);
    }
  }

  function toggleNewVersion(configIndex) {
    if (newVersions.includes(configIndex)) {
      const newNewVersions = [...newVersions];
      newNewVersions.splice(newNewVersions.indexOf(configIndex), 1);
      setNewVersions(newNewVersions);
    } else {
      setNewVersions([...newVersions, configIndex]);
    }
  }

  function onSubmit(event) {
    event.preventDefault();
    setSubmitted(true);
    axios
      .post(
        `${config.api_url}/api/plugins/edit/${pluginData[0].id}`,
        { ...formData, author_id: pluginData[0].author_id },
        {
          headers: { "content-type": "multipart/form-data", user_id: pluginData[0].author_id },
        }
      )
      .then((res) => (window.location.href = `/plugin/${vanityURL}`))
      .catch((err) => {
        console.error(err);
        setErrors([err.response.data.message]);
      })
      .finally(() => setSubmitted(false));
  }

  function submitUpdate() {
    setSubmitted(true);
    console.log(updateData);
    axios
      .post(
        `${config.api_url}/api/plugins/update`,
        { ...updateData, plugin_id: pluginData[0].id },
        {
          headers: { "content-type": "multipart/form-data", user_id: pluginData[0].author_id },
        }
      )
      .then((res) => (window.location.href = `/plugin/${vanityURL}`))
      .catch((err) => {
        console.error(err);
        setErrors([err.response.data.message]);
      })
      .finally(() => setSubmitted(false));
  }

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();

      const pluginDataResult = await axios.get(`${config.api_url}/api/plugins/detailed/${vanityURL}`);
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
      const platformOutput = [];
      const versionOutput = [];

      for (const dataSet of pluginDataResult.data) {
        // Authors
        let isAuthorPresent = false;
        const authorData = { id: dataSet.author_id, username: dataSet.author_username, pfpImgSrc: dataSet.author_pfpImgSrc };
        for (const entry of authorsOutput) {
          if (entry.username === dataSet.author_username) isAuthorPresent = true;
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

        // Platforms
        const platformName = dataSet.platform_name;
        if (platformName != null && !platformOutput.includes(platformName)) platformOutput.push(platformName);

        // versions
        const versionName = dataSet.version_name;
        if (versionName != null && !versionOutput.includes(versionName)) versionOutput.push(versionName);

        // Updates
        if (dataSet.update_jar_url) {
          const updateData = {
            description: dataSet.update_description,
            version: dataSet.update_version,
            jar_url: dataSet.update_jar_url,
            date_created: dataSet.update_date_created,
          };
          let isUpdatePresent = false;
          for (const entry of updateOutput) {
            if (entry.jar_url === updateData.jar_url) isUpdatePresent = true;
          }
          if (!isUpdatePresent) updateOutput.push(updateData);
        }
      }

      setAuthors(authorsOutput);
      setLinks(linkOutput);
      setTags(tagOutput);
      setPlatforms(platformOutput);
      setVersions(versionOutput);
      setUpdates(updateOutput.sort((a, b) => new Date(b.date_created) - new Date(a.date_created)));

      const timeTaken = Date.now() - startTime;
      console.log(`Fetched data in ${timeTaken} ms.`);
    };
    fetchData();
  }, []);

  useEffect(() => {
    setFormData({ ...formData, tags: newTags });
  }, [newTags]);

  useEffect(() => {
    setFormData({ ...formData, platforms: newPlatforms });
  }, [newPlatforms]);

  useEffect(() => {
    setFormData({ ...formData, versions: newVersions });
  }, [newVersions]);

  useEffect(() => {
    setFormData({ ...formData, links: newLinks });
  }, [newLinks]);

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
        newTags.push(config.server_tags.indexOf(tag));
      }
      for (const platform of platforms) {
        newPlatforms.push(config.server_platforms.indexOf(platform));
      }
      for (const version of versions) {
        newVersions.push(config.server_versions.indexOf(version));
      }
      setNewLinks(links);
    }
    setTimeout(() => {
      setShowSaveButton(editMode);
    }, 1);
  }, [editMode]);

  function renderContent() {
    if (pluginData[0].name) window.document.title = pluginData[0].name + " - " + selectedInfo;

    switch (selectedInfo) {
      case "Description":
        if (editMode) {
          return <MarkdownEditor inputName="description" defaultTextValue={pluginData[0].longDescription} onChange={handleChange} />;
        } else {
          return pluginData[0] ? (
            <Markdown remarkPlugins={[remarkGfm]} className={markdownStyles.previewContainer}>
              {pluginData[0].longDescription}
            </Markdown>
          ) : (
            ""
          );
        }

      case "updates":
        return (
          <div className={styles.updatesContainer}>
            {isOwnProfile ? (
              <UpdateEditor
                inputName="update"
                placeholder="Update description"
                showSubmit={true}
                setJar={(jar) => setUpdateData({ ...updateData, jar: jar })}
                setVersion={(version) => setUpdateData({ ...updateData, version: version })}
                onChange={(e) => setUpdateData({ ...updateData, text: e.target.value })}
                onSubmit={submitUpdate}
              />
            ) : (
              ""
            )}

            {updates.map((update, index1) => (
              <div key={index1} className={styles.update}>
                <Markdown remarkPlugins={[remarkGfm]} className={markdownStyles.previewContainer}>
                  {update.description}
                </Markdown>
                <div className={styles.updateBottomRow}>
                  <span className={styles.updateDate}>
                    <Calendar />{" "}
                    <span>
                      {getTimeDifference(update.date_created)} • {formatTimestamp(update.date_created)}
                    </span>
                  </span>
                  <div className={styles.downloadContainer}>
                    <span className={styles.updateVersion}>{update.version}</span>
                    <Button className="button-septenary" icon={<Download color="var(--secondaryColor)" />}>
                      Download
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );
    }
  }

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
            <Button className="button-septenary" onClick={downloadJar} icon={<Download />}>
              Download
            </Button>
          ) : (
            ""
          )}
          {isOwnProfile ? (
            showSaveButton ? (
              <>
                <Button className="button-secondary" type="submit" icon={<Save color="var(--primaryColor)" width="18" />}>
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
          {editMode ? (
            <InfoCard title="Links">
              <LinkInputEditor defaultLinks={[...links]} links={newLinks} setLinks={setNewLinks} />
            </InfoCard>
          ) : (
            <InfoCard title="Links">
              <div className={styles.linksContainer}>
                {links.map((link, index) => (
                  <LinkButton key={index} url={link.url}>
                    {link.title}
                  </LinkButton>
                ))}
              </div>
            </InfoCard>
          )}
          <InfoCard title="Platforms">
            {editMode ? (
              <div className={styles.tags}>
                {config.server_platforms.map((platform, index) => (
                  <SelectOption
                    key={index}
                    name={platform}
                    icon={<Hash />}
                    alwaysShowIcon={true}
                    selected={newPlatforms.includes(config.server_platforms.indexOf(platform))}
                    onClick={() => toggleNewPlatform(config.server_platforms.indexOf(platform))}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.tags}>
                {platforms.map((platform, index) => (
                  <Tag key={index} name={platform} />
                ))}
              </div>
            )}
          </InfoCard>
          <InfoCard title="Versions">
            {editMode ? (
              <div className={styles.tags}>
                {config.server_versions.map((version, index) => (
                  <SelectOption
                    key={index}
                    name={version}
                    icon={<Hash />}
                    alwaysShowIcon={true}
                    selected={newVersions.includes(config.server_versions.indexOf(version))}
                    onClick={() => toggleNewVersion(config.server_versions.indexOf(version))}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.tags}>
                {versions.map((version, index) => (
                  <Tag key={index} name={version} />
                ))}
              </div>
            )}
          </InfoCard>
          <InfoCard title="Tags">
            {editMode ? (
              <div className={styles.tags}>
                {config.server_tags.map((tag, index) => (
                  <SelectOption
                    key={index}
                    name={tag}
                    icon={<Hash />}
                    alwaysShowIcon={true}
                    selected={newTags.includes(config.server_tags.indexOf(tag))}
                    onClick={() => toggleNewTag(config.server_tags.indexOf(tag))}
                  />
                ))}
              </div>
            ) : (
              <div className={styles.tags}>
                {tags.map((tag, index) => (
                  <Tag key={index} name={tag} />
                ))}
              </div>
            )}
          </InfoCard>
          <InfoCard title="Downloads">
            <div></div>
          </InfoCard>
        </div>
        <div>
          <ContentNav
            options={["description", "updates", "reviews"]}
            handleClick={(option) => {
              if (option === "description") navigate(`/plugin/${vanityURL}`);
              else navigate(`/plugin/${vanityURL}/${option}`);
            }}
            className={styles.contentNav}
          />
          {renderContent()}
        </div>
      </div>
    </form>
  );
};

export default SingleServerPage;
