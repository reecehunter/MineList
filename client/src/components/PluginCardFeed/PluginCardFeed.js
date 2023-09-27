import React from "react";
import styles from "./PluginCardFeed.module.css";
import PluginCard from "../PluginCard/PluginCard";

const PluginCardFeed = (props) => {
  const { pluginData } = props;

  const renderPluginData = () => {
    return pluginData.map((plugin, index) => (
      <PluginCard
        className={styles.gridItem}
        key={index}
        id={plugin.id}
        imgSrc={plugin.imgSrc}
        name={plugin.name}
        description={plugin.description}
        downloads={plugin.downloads}
        followers={plugin.followers}
        stars={0}
        author={plugin.username}
        tags={plugin.tags}
      />
    ));
  };

  return <section className={styles.container}>{renderPluginData()}</section>;
};

export default PluginCardFeed;
