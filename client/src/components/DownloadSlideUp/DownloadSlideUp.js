import React, { useEffect } from 'react'
import styles from './DownloadSlideUp.module.css'
import Star from '../icons/Star';
import Eye from '../icons/Eye';

const CopyIPButton = (props) => {
    const { id, hovering, stars, views } = props;

    const downloadJar = async (event) => {
      //
    }

    const toggleDivs = () => {
      const currentDiv = document.getElementById(`pluginInfo_${id}`);
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
        <div id={`pluginInfo_${id}`} className={styles.otherStats}>
          <span><Star /> {stars}</span>
          <span><Eye /> {views}</span>
        </div>
        <div className={`${styles.downloadButton} hover-grayscale`} onClick={downloadJar}>
          <span>Download</span>
        </div>
      </div>
    )
}

export default CopyIPButton