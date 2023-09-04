import React from 'react';
import styles from './PluginCardFeed.module.css';
import PluginCard from '../PluginCard/PluginCard';

const PluginCardFeed = (props) => {
    const { serverData } = props;

    const renderServerdata = () => {
        return serverData.map((plugin, index) => (
            <PluginCard
                className={styles.gridItem}
                key={index}
                id={plugin.id}
                imgSrc={plugin.imgSrc}
                name={plugin.name}
                shortDescription={plugin.shortDescription}
                downloads={plugin.downloads}
                stars={plugin.stars}
                views={plugin.views}
            />
        ));
    }

    return (
        <section className={styles.container}>
            { renderServerdata() }
        </section>
    )
}

export default PluginCardFeed