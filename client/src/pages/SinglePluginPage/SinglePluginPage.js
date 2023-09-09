import React, { useEffect, useState } from "react";
import config from "../../config/config";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./SinglePluginPage.module.css";
import Star from "../../components/icons/Star";
import Button from "../../components/Button/Button";
import Download from "../../components/icons/Download";
import Eye from "../../components/icons/Eye";
import Tag from "../../components/Tag/Tag";
import formatVersion from "../../helpers/versionFormatter";
import parseMarkdown from "../../helpers/markdownParser";

const SingleServerPage = () => {
  const { id } = useParams();
  const [selectedInfo, setSelectedInfo] = useState("Description");
  const [pluginData, setPluginData] = useState([{ imgSrc: "", name: "", stars: 0, downloads: 0, views: 0 }]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [downloads, setDownloads] = useState([]);

  const addView = async () => {
    const key = `view_${id}`;
    const views = localStorage.getItem(key);
    if (views < 25) {
      const res = await axios.post(`${config.api_url}/api/plugins/views/add/${id}`);
      if (res.status === 200) {
        if (views) localStorage.setItem(key, parseInt(views) + 1);
        else localStorage.setItem(key, 1);
      }
    }
  };

  const downloadJar = async (event) => {
    addDownload();
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

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();

      addView();

      const pluginDataResult = await axios.get(`${config.api_url}/api/sections/${id}`);
      setPluginData(pluginDataResult.data);

      window.document.title = pluginDataResult.data[0].name + " - Description";

      const authorsOutput = [];
      const tagOutput = [];
      const updateOutput = [];

      for (const dataSet of pluginDataResult.data) {
        const authorUsername = dataSet.username;

        const updateList = dataSet.updateList;
        const updateTitle = dataSet.updateTitle;
        const updateVersion = { major: dataSet.versionMajor, minor: dataSet.versionMinor, patch: dataSet.versionPatch };

        // Authors
        let isAuthorPresent = false;
        const authorData = { username: dataSet.username, pfpImgSrc: dataSet.pfpImgSrc };
        for (const entry of authorsOutput) {
          if (entry.username === authorUsername) isAuthorPresent = true;
        }
        if (!isAuthorPresent) {
          authorsOutput.push(authorData);
          isAuthorPresent = false;
        }

        // Tags
        const tagName = dataSet.tag_name;
        if (!tagOutput.includes(tagName)) tagOutput.push(tagName);

        // Updates
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

      setAuthors(authorsOutput);
      setTags(tagOutput);
      setUpdates(updateOutput);

      const timeTaken = Date.now() - startTime;
      console.log(`Fetched data in ${timeTaken} ms.`);
    };
    fetchData();
  }, []);

  const handleInfoSelector = (event) => {
    const element = event.currentTarget;
    const text = element.innerText;
    setSelectedInfo(text);

    const allSelected = element.parentElement.getElementsByClassName(styles.selected);
    for (const child of allSelected) {
      child.classList.remove(styles.selected);
    }
    element.classList.add(styles.selected);
  };

  const renderContent = () => {
    switch (selectedInfo) {
      case "Description":
        return pluginData[0] ? <div className={styles.description}>{parseMarkdown(pluginData[0].longDescription)}</div> : "";

      case "Updates":
        window.document.title = pluginData[0].name + " - Updates";
        return (
          <div className={styles.updatesContainer}>
            {" "}
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
    }
  };

  return (
    <div className="py-5">
      <div className={styles.heading}>
        <div className={styles.headingInfo}>
          <img src={pluginData[0].imgSrc ? pluginData[0].imgSrc : "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png"} alt={`${pluginData[0].name} logo`} className={styles.logo} />
          <div>
            <h1 className="text-primaryy">{pluginData[0].name}</h1>
            <p className="text-quaternary">{pluginData[0].description}</p>
          </div>
        </div>
        <div>
          <p className={styles.stats}>
            <span>
              <Star /> {pluginData[0].stars} Stars
            </span>
            <span>
              <Download /> {pluginData[0].downloads} Downloads
            </span>
            <span>
              <Eye /> {pluginData[0].views} Views
            </span>
          </p>
        </div>
        <div className={styles.headingButtons}>
          <Button className="button-secondary" onClick={downloadJar} icon={<Download color="var(--primaryColor)" />}>
            Download
          </Button>
        </div>
      </div>

      <div className={styles.info}>
        <div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <h5>Authors</h5>
            </div>
            <div>
              {authors.map((author, index) => (
                <Link key={index} to={`/users/${author.username}`} className={styles.link}>
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
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <h5>Links</h5>
            </div>
            <div></div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <h5>Tags</h5>
            </div>
            <div>
              {tags.map((tag, index) => (
                <Tag key={index} name={tag} />
              ))}
            </div>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.infoCardHeader}>
              <h5>
                Downloads <Link to={`/plugin/${id}/updates`}>See All</Link>
              </h5>
            </div>
            <div className={styles.updatesContainer}>
              {updates.map((updateObj, index1) => {
                return (
                  <div key={index1} className={styles.update}>
                    <p>
                      {updateObj.updateTitle} <span className={styles.updateVersion}>{formatVersion(updateObj.updateVersion)}</span>
                    </p>
                    {updateObj.updateList.split("|").map((updateBullet, index2) => {
                      return <p key={index2}>{updateBullet}</p>;
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <div className={styles.infoSelector}>
            <p className={styles.selected} onClick={handleInfoSelector}>
              Description
            </p>
            <p onClick={handleInfoSelector}>Updates</p>
            <p onClick={handleInfoSelector}>Reviews</p>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SingleServerPage;
