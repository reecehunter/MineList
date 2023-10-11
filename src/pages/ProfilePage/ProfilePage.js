import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config/config";
import { useNavigate, useParams } from "react-router-dom";
import PluginCardFeed from "../../components/PluginCardFeed/PluginCardFeed";
import styles from "./ProfilePage.module.css";
import Download from "../../components/icons/Download";
import User from "../../components/icons/User";
import Statistic from "../../components/Statistic/Statistic";
import ContentNav from "../../components/ContentNav/ContentNav";
import InfoCard from "../../components/InfoCard/InfoCard";
import { getTimeDifference } from "../../helpers/dateTime";
import Star from "../../components/icons/Star";

const ProfilePage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [userStats, setUserStats] = useState({ downloads: 0, views: 0, followers: 0 });
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [userPlugins, setUserPlugins] = useState([]);
  const [selectedInfo, setSelectedInfo] = useState("Plugins");

  const renderContent = () => {
    switch (selectedInfo) {
      case "Plugins":
        return <PluginCardFeed pluginData={userPlugins} />;
      default:
        return "";
    }
  };

  useEffect(() => {
    // Fetch data for queried user
    axios
      .get(`${config.api_url}/api/users/${params.username}`)
      .then((res) => setUserData(res.data))
      .catch((err) => console.error(err));
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
        let followers = 0;
        for (const plugin of res.data) {
          downloads += plugin.downloads;
          views += plugin.views;
          followers += plugin.followers;
        }
        setUserStats({ downloads, views, followers });
      })
      .catch((err) => console.error(err));
  }, [userData]);

  return (
    <div className={styles.container}>
      <div>
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
            <div>
              <h1 className={styles.username}>{userData.username}</h1>
              <p className="text-quaternary ">Joined: {getTimeDifference(userData.dateCreated)}</p>
            </div>
          </div>
        </div>
        <InfoCard title="Favorite Server">
          <div></div>
        </InfoCard>
        <InfoCard title="Statistics">
          <div className={styles.stats}>
            <Statistic icon={<Download />} number={userStats.downloads} text="downloads" />
            <Statistic icon={<Star />} number={0} text="stars" />
            <Statistic icon={<User />} number={userStats.followers} text="followers" />
          </div>
        </InfoCard>
        <InfoCard title="Links">
          <div></div>
        </InfoCard>
      </div>

      <div className={styles.pluginsContainer}>
        <ContentNav options={["Plugins", "Servers"]} handleClick={setSelectedInfo} className={styles.contentNav} />
        {renderContent()}
      </div>
    </div>
  );
};

export default ProfilePage;
