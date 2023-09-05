import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './SinglePluginPage.module.css'
import Star from '../../components/icons/Star'
import Button from '../../components/Button/Button'
import Download from '../../components/icons/Download'
import Eye from '../../components/icons/Eye'

const SingleServerPage = () => {
    const { id } = useParams();
    const [pluginData, setPluginData] = useState([{imgSrc:"", name:"", stars:0, downloads:0, views:0}]);

    useEffect(() => {
        const fetchData = async () => {
            const pluginDataResult = await axios.get(`http://localhost:5000/api/sections/${id}`);
            setPluginData(pluginDataResult.data);
            console.log(pluginDataResult.data);
        }
        fetchData();
    }, []);

    const downloadJar = async (event) => {
    }

    return (
        <div className='py-5'>
            <div className={styles.heading}>
                <div className={styles.headingInfo}>
                    <img src={pluginData[0].imgSrc ? pluginData[0].imgSrc : "https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png"} alt={`${pluginData[0].name} logo`} className={styles.logo} />
                    <div>
                        <h1 className='text-primaryy'>{pluginData[0].name}</h1>
                        <p className='text-quaternary'>{pluginData[0].description}</p>
                        <p className='text-primaryy'>
                            <Star /> {pluginData[0].stars}
                            <span className='text-primaryy mx-3'></span>
                            <Download /> {pluginData[0].downloads}
                            <span className='text-primaryy mx-3'></span>
                            <Eye /> {pluginData[0].views}
                        </p>
                    </div>
                </div>
                <div className={styles.headingButtons}>
                    <Button className="button-secondary" onClick={downloadJar} icon={<Download color="var(--primaryColor)" />}>Download</Button>
                </div>
            </div>

            <div className={styles.info}>
                <div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoCardHeader}>
                            <h5>Authors</h5>
                        </div>
                        <Link to={`/users/${pluginData[0].username}`} className={styles.link}>
                            <img src={pluginData[0].pfpImgSrc ? pluginData[0].pfpImgSrc : "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"} />
                            <p>{pluginData[0].username}</p>
                        </Link>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoCardHeader}>
                            <h5>Tags</h5>
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoCardHeader}>
                            <h5>Updates</h5>
                        </div>
                    </div>
                </div>
                <div>
                    {pluginData.map((section, index) => (
                        <div key={index} className={`${styles.section}`}>
                            <h2>{section.title}</h2>
                            <hr />
                            <p>{section.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SingleServerPage