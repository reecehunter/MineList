import React, { useEffect, useState } from 'react'
import styles from './FilterOptions.module.css'
import Hash from '../icons/Hash';

const FilterOptions = () => {
  const [filterIndexes, setFilterIndexes] = useState([]);
  
  const tags = ["Survival", "Creative", "SkyBlock", "Prison", "PVP", "Sword PVP",
    "Crystal PVP", "Neth Pot", "UHC", "Hardcore", "Vanilla", "Anarchy", "Land Claim",
    "Crossplay", "Factions", "Towny", "Parkour", "Minigames", "Lifesteal", "OneBlock"];

  const toggleTag = (event) => {
    const element = event.currentTarget;
    const index = element.getAttribute("index");
    element.classList.toggle(styles.selected);
    if(!filterIndexes.includes(index)) setFilterIndexes(old => [...old, index]);
    else setFilterIndexes(old => [...old.splice(index, 1)]);
  }

  return (
    <section className={styles.container}>
      {tags.map((tag, index) => (
        <article key={index} index={index} onClick={toggleTag}>
          <span className={`${styles.contents}`}>
            <Hash /> {tag}
          </span>
        </article>
      ))}
    </section>
  )
}

export default FilterOptions