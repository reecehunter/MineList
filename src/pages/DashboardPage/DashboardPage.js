import React, { useEffect, useState } from "react";
import axios from "axios";
import config from "../../config/config";
import { checkAuth } from "../../helpers/jwt";
import { useNavigate, useParams } from "react-router-dom";
import PluginCardFeed from "../../components/PluginCardFeed/PluginCardFeed";
import styles from "./DashboardPage.module.css";
import Download from "../../components/icons/Download";
import Eye from "../../components/icons/Eye";
import User from "../../components/icons/User";
import Statistic from "../../components/Statistic/Statistic";
import ContentNav from "../../components/ContentNav/ContentNav";
import InfoCard from "../../components/InfoCard/InfoCard";
import { getTimeDifference } from "../../helpers/dateTime";

const DashboardPage = () => {
  const params = useParams();
  const navigate = useNavigate();
  const [userData, setUserData] = useState({});
  const [userStats, setUserStats] = useState({ downloads: 0, views: 0, followers: 0 });
  const [userResources, setUserResources] = useState({ plugins: [], servers: [] });
  const [category, setCategory] = useState("Overview");

  const renderContent = () => {
    switch (category) {
      case "Overview":
        return (
          <div className={styles.overviewContainer}>
            <InfoCard title="Downloads">{userStats.downloads}</InfoCard>
            <InfoCard title="Stars">{userStats.stars}</InfoCard>
            <InfoCard title="Followers">{userStats.followers}</InfoCard>
          </div>
        );
      default:
        return "";
    }
  };

  useEffect(() => {
    // Fetch data for authenticated user
    if (!params.username) {
      checkAuth((res) => {
        if (!res) {
          navigate("/auth/sign-in");
        } else {
          setUserData(res.data);
        }
      });
    } else {
      // Fetch data for queried user
      axios
        .get(`${config.api_url}/api/users/${params.username}`)
        .then((res) => setUserData(res.data))
        .catch((err) => console.error(err));
    }
  }, []);

  useEffect(() => {
    // Fetch plugins
    if (!userData.id) return;
    axios
      .get(`${config.api_url}/api/plugins/user/${userData.id}`)
      .then((res) => {
        setUserResources(res.data);
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
        <InfoCard title="Dashboard">
          <div className={styles.categorySelector}>
            <p>
              <User /> Overview
            </p>
            <p>
              <User /> Your Projects
            </p>
            <p>
              <User /> Followed Projects
            </p>
            <p>
              <User /> Notifications
            </p>
          </div>
        </InfoCard>
      </div>

      {renderContent()}
    </div>
  );
};

export default DashboardPage;
