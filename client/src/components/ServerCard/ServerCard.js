import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from "./ServerCard.module.css"
import UpArrowCircle from '../icons/UpArrowCircle'
import CopyIPButton from '../CopyIPButton/CopyIPButton'
import Coin from '../icons/Coin'
import { Link } from 'react-router-dom'

const ServerCard = (props) => {
  const { className, id, imgSrc, name, description, ip, totalVotes, coins } = props;
  const [hovering, setHovering] = useState(false);
  const [status, setStatus] = useState({});
  const link = `/server/${id}`;

  useEffect(() => {
    const fetchData = async () => {
      const result = await axios.get(`http://localhost:5000/api/status/${ip}`);
      setStatus(result.data);
    }
    fetchData();
  }, []);

  return (
    <article className={`${props.className} ${styles.serverCard} text-primaryy`} onMouseEnter={() => setHovering(true)} onMouseLeave={() => setHovering(false)}>
      <div className={styles.imgContainer}>
        <Link to={link}>
          <img src={imgSrc} className={styles.img} alt={`${name} server banner`} />
        </Link>
      </div>
      <div className={styles.text}>
        <div className={styles.nameAndVotes}>
          <Link to={link} style={{ textDecoration: 'none' }}>
            <h5 className={styles.name}>{name}</h5>
          </Link>
          <div className={styles.stats}>
            <p className={styles.coin}><Coin /> {coins}</p>
            <p className={styles.upArrowCircle}><UpArrowCircle /> {totalVotes}</p>
          </div>
        </div>
        <p className={styles.description}>{description}</p>
        <CopyIPButton id={id} ip={ip} playerCount={status.players ? status.players.online : 0} online={status.online ? status.online : false} hovering={hovering} />
      </div>
    </article>
  )
}

export default ServerCard