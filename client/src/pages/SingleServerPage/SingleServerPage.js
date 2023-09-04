import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import styles from './SingleServerPage.module.css'
import UpArrowCircle from '../../components/icons/UpArrowCircle'
import User from '../../components/icons/User'
import Button from '../../components/Button/Button'
import Clipboard from '../../components/icons/Clipboard'

const SingleServerPage = () => {
    const { id } = useParams();
    const [serverData, setServerData] = useState([{}]);
    const [serverStatus, setServerStatus] = useState({});
    const [copyText, setCopyText] = useState("Copy IP");

    useEffect(() => {
        const fetchData = async () => {
            const serverDataResult = await axios.get(`http://localhost:5000/api/sections/${id}`);
            const serverStatusResult = await axios.get(`http://localhost:5000/api/status/${serverDataResult.data[0].ip}`);
            setServerData(serverDataResult.data);
            setServerStatus(serverStatusResult.data);
        }
        fetchData();
    }, []);

    const copyIP = async (event) => {
        try {
            const originalText = "Copy IP";
            const element = event.currentTarget;
            const ip = serverData[0].ip;
            await navigator.clipboard.writeText(ip);
            setCopyText("Copied!");
            setTimeout(() => {
                setCopyText(originalText);
            }, 1000 * 2);
        } catch(err) {
            console.error("Failed to copy IP: ", err);
        }
      }

    return (
        <div className='py-5'>
            <div className={styles.heading}>
                <div className={styles.headingInfo}>
                    <img src={serverStatus.icon} alt={`${serverData[0].serverName} logo`} className={styles.logo} />
                    <div>
                        <h1 className='text-primaryy'>{serverData[0].serverName}</h1>
                        <p className='text-primaryy'>
                            <UpArrowCircle className='text-secondaryy' /> {serverData[0].votes}
                            <span className='text-primaryy mx-3'>•</span>
                            <User className='text-secondaryy' /> {serverStatus.players ? serverStatus.players.online : "..."}
                        </p>
                    </div>
                </div>
                <div className={styles.headingButtons}>
                    <Button className="button-secondary" onClick={copyIP} icon={<Clipboard />}>{copyText}</Button>
                    <Button className="button-quaternary ml-3" icon={<UpArrowCircle width="22" height="22" />}>Vote</Button>
                </div>
            </div>

            <div className={styles.info}>
                <table className={styles.table}>
                    <tr>
                        <th>Owner</th>
                        <td>GooseTheBoy</td>
                    </tr>
                    <tr>
                        <th>Status</th>
                        <td>{serverStatus.online ? "Online" : "Offline"}</td>
                    </tr>
                    <tr>
                        <th>Players</th>
                        <td>{serverStatus.players ? serverStatus.players.online : "..."} / {serverStatus.players ? serverStatus.players.max : "..."}</td>
                    </tr>
                    <tr>
                        <th>Version</th>
                        <td>{serverStatus.version}</td>
                    </tr>
                    <tr>
                        <th>Website</th>
                        <td><a href={serverData[0].websiteURL} rel="noreferrer" target="_blank">{serverData[0].websiteURL}</a></td>
                    </tr>
                    <tr>
                        <th>Discord</th>
                        <td><a href={`https://discord.gg/${serverData[0].discordURL}`} rel="noreferrer" target="_blank">discord.gg/{serverData[0].discordURL}</a></td>
                    </tr>
                    <tr>
                        <th>Votes</th>
                        <td>{serverData[0].votes}</td>
                    </tr>
                    <tr>
                        <th>Tags</th>
                        <td>{serverData[0].tags}</td>
                    </tr>
                    <tr>
                        <th>Submitted</th>
                        <td>{serverData[0].dateCreated}</td>
                    </tr>
                    <tr>
                        <th>Last Edited</th>
                        <td>{serverData[0].dateModified}</td>
                    </tr>
                </table>
                <div>
                    {serverData.map((section, index) => (
                        <div key={index} className="mb-5">
                            <h2 className='text-primaryy'>{section.title}</h2>
                            <hr className='text-primaryy' />
                            <p className='text-quaternary'>{section.text}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default SingleServerPage