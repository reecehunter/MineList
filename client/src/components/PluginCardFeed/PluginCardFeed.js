import React from "react";
import styles from "./PluginCardFeed.module.css";
import PluginCard from "../PluginCard/PluginCard";

const PluginCardFeed = (props) => {
  const { pluginData } = props;

  return (
    <section className={styles.container}>
      {pluginData.map((plugin, index) => (
        <PluginCard
          className={styles.gridItem}
          key={index}
          id={plugin.id}
          vanityURL={plugin.vanity_url}
          imgSrc={plugin.imgSrc}
          name={plugin.name}
          description={plugin.description}
          downloads={plugin.downloads}
          followers={plugin.followers}
          stars={0}
          author={plugin.username}
          tags={plugin.tags}
        />
      ))}
    </section>
  );
};

export default PluginCardFeed;
