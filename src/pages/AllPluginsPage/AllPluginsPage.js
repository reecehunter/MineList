import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./AllPluginsPage.module.css";
import PluginCardFeed from "../../components/PluginCardFeed/PluginCardFeed";
import TextInput from "../../components/Input/TextInput/TextInput";
import SelectOption from "../../components/Input/SelectOption/SelectOption";
import Trending from "../../components/icons/Trending";
import Download from "../../components/icons/Download";
import PlusSquare from "../../components/icons/PlusSquare";
import Calendar from "../../components/icons/Calendar";
import config from "../../config/config";
import SelectCheckbox from "../../components/Input/SelectCheckbox/SelectCheckbox";
import { API } from "aws-amplify";

const HomePage = () => {
  const [pluginData, setPluginData] = useState([]);
  const [filteredPluginData, setFilteredPluginData] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setfilter] = useState("Most Downloaded");
  const [platforms, setPlatforms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [versions, setVersions] = useState([]);

  function filterSearch() {
    if (searchQuery.length === 0) {
      setFilteredPluginData(pluginData);
    } else {
      setFilteredPluginData([...pluginData].filter((plugin) => plugin.name.toLowerCase().startsWith(searchQuery.toLowerCase())));
    }
  }

  function filterMainOptions() {
    switch (filter) {
      case "Trending":
        setFilteredPluginData(pluginData);
        break;
      case "Most Downloaded":
        setFilteredPluginData([...filteredPluginData].sort((pluginA, pluginB) => pluginB.downloads - pluginA.downloads));
        break;
      case "Recently Updated":
        setFilteredPluginData([...filteredPluginData].sort((pluginA, pluginB) => new Date(pluginB.date_modified) - new Date(pluginA.date_modified)));
        break;
      case "Newest":
        setFilteredPluginData([...filteredPluginData].sort((pluginA, pluginB) => new Date(pluginB.date_created) - new Date(pluginA.date_created)));
        break;
    }
  }

  function filterSecondaryOptions() {
    if (platforms.length === 0 && categories.length === 0 && versions.length === 0) {
      return setFilteredPluginData(pluginData);
    }

    let toFilter = filteredPluginData;

    if (platforms.length > 0) {
      toFilter = [...filteredPluginData].filter((plugin) => plugin.platforms.includes(platforms[platforms.length - 1]));
      setFilteredPluginData(toFilter);
    }

    if (categories.length > 0) {
      toFilter = [...toFilter].filter((plugin) => plugin.tags.includes(categories[categories.length - 1]));
      setFilteredPluginData(toFilter);
    }

    if (versions.length > 0) {
      toFilter = [...toFilter].filter((plugin) => plugin.versions.includes(versions[versions.length - 1]));
      setFilteredPluginData(toFilter);
    }
  }

  function togglePlatform(platformName) {
    const index = platforms.indexOf(platformName);
    if (index > -1) {
      const newPlatforms = [...platforms];
      newPlatforms.splice(index, 1);
      setPlatforms(newPlatforms);
    } else {
      setPlatforms([...platforms, platformName]);
    }
  }

  function toggleCategory(categoryName) {
    const index = categories.indexOf(categoryName);
    if (index > -1) {
      const newCategories = [...categories];
      newCategories.splice(index, 1);
      setCategories(newCategories);
    } else {
      setCategories([...categories, categoryName]);
    }
  }

  function toggleVersion(versionName) {
    const index = versions.indexOf(versionName);
    if (index > -1) {
      const newVersions = [...versions];
      newVersions.splice(index, 1);
      setVersions(newVersions);
    } else {
      setVersions([...versions, versionName]);
    }
  }

  useEffect(() => {
    API.get("pluginAPI", "/plugins", {})
      .then(res => {
        setPluginData(res)
        setFilteredPluginData(res)
      })
      .catch(err => console.error(err))
  }, []);

  useEffect(() => filterSearch(), [searchQuery]);

  useEffect(() => filterMainOptions(), [filter]);

  useEffect(() => filterSecondaryOptions(), [platforms, categories, versions]);

  return (
    <div>
      <div className={styles.header}>
        <h1>Explore the greatest plugins</h1>
        <TextInput name="search" placeholder="Search from 100+ plugins" className={styles.searchInput} onChange={(e) => setSearchQuery(e.target.value)} />
        <div className={styles.filterOptionsContainer}>
          <SelectOption name="Trending" icon={<Trending />} alwaysShowIcon={true} selected={filter === "Trending"} onClick={() => setfilter("Trending")} />
          <SelectOption name="Most Downloaded" icon={<Download />} alwaysShowIcon={true} selected={filter === "Most Downloaded"} onClick={() => setfilter("Most Downloaded")} />
          <SelectOption name="Recently Updated" icon={<Calendar width={20} />} alwaysShowIcon={true} selected={filter === "Recently Updated"} onClick={() => setfilter("Recently Updated")} />
          <SelectOption name="Newest" icon={<PlusSquare />} alwaysShowIcon={true} selected={filter === "Newest"} onClick={() => setfilter("Newest")} />
        </div>
      </div>
      <div className={styles.contentGrid}>
        <div className={styles.categoriesContainer}>
          <h3>Platforms</h3>
          <div>
            {config.server_platforms.map((platform, index) => (
              <SelectCheckbox key={index} name={platform} selected={platforms.includes(platform)} onClick={() => togglePlatform(platform)} />
            ))}
          </div>
          <h3>Categories</h3>
          <div className={styles.tagsContainer}>
            {config.server_tags.map((tag, index) => (
              <SelectCheckbox key={index} name={tag} selected={categories.includes(tag)} onClick={() => toggleCategory(tag)} />
            ))}
          </div>
          <h3>Versions</h3>
          <div>
            {config.server_versions.map((version, index) => (
              <SelectCheckbox key={index} name={version} selected={versions.includes(version)} onClick={() => toggleVersion(version)} />
            ))}
          </div>
        </div>
        <div>{pluginData ? <PluginCardFeed pluginData={filteredPluginData} /> : "Loading..."}</div>
      </div>
    </div>
  );
};

export default HomePage;
