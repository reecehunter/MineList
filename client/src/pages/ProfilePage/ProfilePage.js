import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config/config";
import { checkAuth } from "../../helpers/jwt";
import { useNavigate, useParams } from "react-router-dom";
import PluginCardFeed from "../../components/PluginCardFeed/PluginCardFeed";
import styles from "./ProfilePage.module.css";
import Download from "../../components/icons/Download";
import Eye from "../../components/icons/Eye";
import Star from "../../components/icons/Star";

const ProfilePage = (props) => {
  const params = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [userStats, setUserStats] = useState({ downloads: 0, views: 0, stars: 0 });
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userPlugins, setUserPlugins] = useState([]);

  useEffect(() => {
    // Check Auth
    if (!params.username) {
      checkAuth((res) => {
        if (!res) {
          navigate("/login");
        } else {
          setUserData(res.data);
          setIsOwnProfile(true);
        }
      });
    }
  }, []);

  useEffect(() => {
    // Fetch plugins
    if (!userData.id) return;
    axios
      .get(`${config.api_url}/api/plugins/user/${userData.id}`)
      .then((res) => {
        setUserPlugins(res.data);
        let downloads = 0;
        let views = 0;
        for (const plugin of res.data) {
          downloads += plugin.downloads;
          views += plugin.views;
        }
        setUserStats({ downloads, views, stars: 0 });
      })
      .catch((err) => console.error(err));
  }, [userData]);

  return (
    <div className={styles.container}>
      <div className={styles.userInfoContainer}>
        <div className={styles.pfpAndUsernameContainer}>
          <img
            src={
              userData.pfpImgSrc
                ? userData.pfpImgSrc
                : "https://static.vecteezy.com/system/resources/thumbnails/002/534/006/small/social-media-chatting-online-blank-profile-picture-head-and-body-icon-people-standing-icon-grey-background-free-vector.jpg"
            }
            alt={`${userData.username}'s Profile`}
          />
          <h1 className="text-primaryy">
            {userData.username}
            {isOwnProfile ? "*" : ""}
          </h1>
        </div>
        <div className={styles.stats}>
          <p>
            <Download /> {userStats.downloads} downloads
          </p>
          <p>
            <Eye /> {userStats.views} views
          </p>
          <p>
            <Star /> {userStats.stars} / 5 stars
          </p>
        </div>
        <p className="text-quaternary ">Joined: {userData.dateCreated}</p>
      </div>

      <div className={styles.pluginsContainer}>
        <h3>Plugins by {userData.username}</h3>
        <PluginCardFeed pluginData={userPlugins} />
      </div>
    </div>
  );
};

export default ProfilePage;
