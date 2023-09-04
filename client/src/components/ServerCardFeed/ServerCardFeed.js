import React from 'react';
import styles from './ServerCardFeed.module.css';
import ServerCard from '../ServerCard/ServerCard';

const ServerCardFeed = (props) => {
    const { serverData } = props;

    const renderServerdata = () => {
        return serverData.map((server, index) => (
            <ServerCard
                className={styles.gridItem}
                key={index}
                id={server.id}
                imgSrc={server.imgSrc}
                name={server.serverName}
                description={server.description}
                ip={server.ip}
                totalVotes={server.votes}
                coins={server.coins}
            />
        ));
    }

    return (
        <section className={styles.container}>
            { renderServerdata() }
        </section>
    )
}

export default ServerCardFeed