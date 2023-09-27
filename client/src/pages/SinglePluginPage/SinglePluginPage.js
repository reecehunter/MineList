import React, { useEffect, useState } from "react";
import config from "../../config/config";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import styles from "./SinglePluginPage.module.css";
import User from "../../components/icons/User";
import Button from "../../components/Button/Button";
import Download from "../../components/icons/Download";
import Star from "../../components/icons/Star";
import Tag from "../../components/Tag/Tag";
import formatVersion from "../../helpers/versionFormatter";
import parseMarkdown from "../../helpers/markdownParser";
import Statistic from "../../components/Statistic/Statistic";
import ContentNav from "../../components/ContentNav/ContentNav";
import InfoCard from "../../components/InfoCard/InfoCard";
import LinkButton from "../../components/LinkButton/LinkButton";

const SingleServerPage = () => {
  const { id } = useParams();
  const [selectedInfo, setSelectedInfo] = useState("Description");
  const [pluginData, setPluginData] = useState([{ imgSrc: "", name: "", downloads: 0 }]);
  const [authors, setAuthors] = useState([]);
  const [tags, setTags] = useState([]);
  const [links, setLinks] = useState([]);
  const [updates, setUpdates] = useState([]);
  const [downloads, setDownloads] = useState([]);

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

  useEffect(() => {
    const fetchData = async () => {
      const startTime = Date.now();

      const pluginDataResult = await axios.get(`${config.api_url}/api/plugins/detailed/${id}`);
      setPluginData(pluginDataResult.data);

      window.document.title = pluginDataResult.data[0].name + " - Description";

      const authorsOutput = [];
      const linkOutput = [];
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
      console.log(linkOutput);
      setTags(tagOutput);
      setUpdates(updateOutput);

      const timeTaken = Date.now() - startTime;
      console.log(`Fetched data in ${timeTaken} ms.`);
    };
    fetchData();
  }, []);

  const renderContent = () => {
    window.document.title = pluginData[0].name + " - " + selectedInfo;

    switch (selectedInfo) {
      case "Description":
        return pluginData[0] ? <div className={styles.description}>{parseMarkdown(pluginData[0].longDescription)}</div> : "";

      case "Updates":
        if (updates.length > 0) {
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
        } else {
          return <></>;
        }
    }
  };

  return (
    <div>
      <div className={styles.heading}>
        <div className={styles.headingInfo}>
          <img src={pluginData[0].imgSrc ? pluginData[0].imgSrc : "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png"} alt={`${pluginData[0].name} logo`} className={styles.logo} />
          <div>
            <h1 className="text-primaryy">{pluginData[0].name}</h1>
            <p className="text-quaternary">{pluginData[0].description}</p>
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
          <Button className="button-secondary" onClick={downloadJar} icon={<Download color="var(--primaryColor)" />}>
            Download
          </Button>
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
            {tags.map((tag, index) => (
              <Tag key={index} name={tag} />
            ))}
          </InfoCard>
          <InfoCard title="Downloads">
            <div></div>
          </InfoCard>
        </div>
        <div>
          <ContentNav options={["Description", "Updates", "Reviews"]} handleClick={setSelectedInfo} className={styles.contentNav} />
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default SingleServerPage;
