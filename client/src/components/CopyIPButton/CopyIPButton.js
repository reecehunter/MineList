import React, { useEffect } from 'react'
import styles from './CopyIPButton.module.css'
import User from '../icons/User';
import Power from '../icons/Power';

const CopyIPButton = (props) => {
    const { id, ip, playerCount, online, hovering } = props;

    const copyIP = async (event) => {
      try {
        const ipText = event.currentTarget.children[0];
        await navigator.clipboard.writeText(ip);
        ipText.innerText = "Copied!";
        setTimeout(() => {
          ipText.innerText = ip;
        }, 1000 * 2);
      } catch(err) {
        console.error("Failed to copy IP: ", err);
      }
    }

    const changeIpText = (event) => {
        const ipText = event.currentTarget.children[0];
        ipText.innerText = "Click to copy!";
    }

    const revertIpText = (event) => {
        const ipText = event.currentTarget.children[0];
        ipText.innerText = ip;
    }

    const toggleDivs = () => {
      const currentDiv = document.getElementById(`serverInfo_${id}`);
      const nextDiv = currentDiv.nextSibling;
      if(hovering) {
        nextDiv.style.display = "flex";
        nextDiv.style.animation = `${styles.slideUpAnimation} 0.2s ease-in-out forwards`;
      } else {
        setTimeout(() => {
          nextDiv.style.display = "none";
        }, 200);
        nextDiv.style.animation = `${styles.slideDownAnimation} 0.2s ease-in-out forwards`;
      }
    }

    useEffect(() => {
      toggleDivs();
    }, [hovering])

    return (
      <div className={styles.container}>
        <div id={`serverInfo_${id}`} className={styles.playerCount}>
          <span><User /> {playerCount}</span>
          <span style={{color: online ? "var(--green)" : "var(--red)"}}><Power /></span>
        </div>
        <div className={`${styles.ipButton} hover-grayscale`} onClick={copyIP} onMouseOver={changeIpText} onMouseOut={revertIpText}>
          <span>{ip}</span>
        </div>
      </div>
    )
}

export default CopyIPButton