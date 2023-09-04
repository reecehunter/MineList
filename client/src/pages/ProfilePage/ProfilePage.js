import React, { useEffect, useState } from 'react'
import axios from 'axios'
import styles from './ProfilePage.module.css'
import Coin from '../../components/icons/Coin'
import UpArrowCircle from '../../components/icons/UpArrowCircle'
import { useParams } from 'react-router-dom'

const ProfilePage = (props) => {
    const params = useParams();
    const [userData, setUserData] = useState({});
    const [isOwnProfile, setIsOwnProfile] = useState(false);

    useEffect(() => {
        let username = params.username;
        if(username === undefined)  {
            username = localStorage.getItem("username");
            setIsOwnProfile(true);
        }
        axios.get(`http://localhost:5000/api/users/${username}`)
        .then(res => setUserData(res.data))
        .catch(err => console.error(err));
    }, []);

    return (
        <div>
            {
                isOwnProfile ? 
                <p className='text-primaryy'>This is your profile</p>
                : ""
            }
            <h1 className='text-primaryy'>{userData.username}</h1>
            <p className='text-primaryy'><Coin /> {userData.coins}</p>
            <p className='text-primaryy'><UpArrowCircle /> {userData.votes}</p>
        </div>
    )
}

export default ProfilePage