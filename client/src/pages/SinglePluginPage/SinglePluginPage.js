import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './SinglePluginPage.module.css'
import Star from '../../components/icons/Star'
import Button from '../../components/Button/Button'
import Download from '../../components/icons/Download'
import Eye from '../../components/icons/Eye'
import Tag from '../../components/Tag/Tag'

const SingleServerPage = () => {
    const { id } = useParams();
    const [pluginData, setPluginData] = useState([{ imgSrc:"", name:"", stars:0, downloads:0, views:0 }]);
    const [sections, setSections] = useState([]);
    const [authors, setAuthors] = useState([]);
    const [tags, setTags] = useState([]);

    const addView = async () => {
        const key = `view_${id}`;
        const views = localStorage.getItem(key);
        if(views < 25) {
            const res = await axios.post(`http://localhost:5000/api/plugins/views/add/${id}`);
            if(res.status === 200) {
                if(views) localStorage.setItem(key, parseInt(views) + 1);
                else localStorage.setItem(key, 1);
            }
        }
    }

    const downloadJar = async (event) => {
        const key = `download_${id}`;
        const downloads = localStorage.getItem(key);
        if(downloads < 25) {
            const res = await axios.post(`http://localhost:5000/api/plugins/downloads/add/${id}`);
            if(res.status === 200) {
                if(downloads) localStorage.setItem(key, parseInt(downloads) + 1);
                else localStorage.setItem(key, 1);
            }
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            const startTime = Date.now();
            
            addView();

            const pluginDataResult = await axios.get(`http://localhost:5000/api/sections/${id}`);
            setPluginData(pluginDataResult.data);

            const sectionsOutput = [];
            const authorsOutput = [];
            const tagOutput = [];

            for(const dataSet of pluginDataResult.data) {
                const sectionTitle = dataSet.section_title;
                const sectionText = dataSet.section_text;
                const authorUsername = dataSet.username;

                const sectionData = { title: sectionTitle, text: sectionText };
                const authorData = { username: dataSet.username, pfpImgSrc: dataSet.pfpImgSrc };

                let isSectionPresent = false;
                for(const entry of sectionsOutput) {
                    if(entry.title === sectionTitle)
                        isSectionPresent = true;
                }
                if(!isSectionPresent) {
                    sectionsOutput.push(sectionData);
                    isSectionPresent = false;
                }

                let isAuthorPresent = false;
                for(const entry of authorsOutput) {
                    if(entry.username === authorUsername)
                        isAuthorPresent = true;
                }
                if(!isAuthorPresent) {
                    authorsOutput.push(authorData);
                    isAuthorPresent = false;
                }

                const tagName = dataSet.tag_name;
                if(!tagOutput.includes(tagName))
                    tagOutput.push(tagName);
            }

            setSections(sectionsOutput);
            setAuthors(authorsOutput);
            setTags(tagOutput);

            const timeTaken = Date.now() - startTime;
            console.log(`Fetched data in ${timeTaken} ms.`);
        }
        fetchData();
    }, []);

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
                        <div className={styles.authorsContainer}>
                            {authors.map((author, index) => (
                                <Link key={index} to={`/users/${author.username}`} className={styles.link}>
                                    <img src={author.pfpImgSrc ? author.pfpImgSrc : "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"} />
                                    <p>{author.username}</p>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoCardHeader}>
                            <h5>Tags</h5>
                        </div>
                        <div className={styles.tagContainer}>
                            {tags.map((tag, index) => (
                                <Tag key={index} name={tag} />
                            ))}
                        </div>
                    </div>
                    <div className={styles.infoCard}>
                        <div className={styles.infoCardHeader}>
                            <h5>Updates</h5>
                        </div>
                    </div>
                </div>
                <div>
                    {sections.map((section, index) => (
                        <div key={index} className={`${styles.section}`}>
                            <h2>{section.title}</h2>
                            <hr />
                            <p>{section.text}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* <div className={styles.reviewsContainer}>
                <h2>Reviews</h2>
            </div> */}
        </div>
    )
}

export default SingleServerPage