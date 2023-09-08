import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./HomePage.module.css";
import FilterOptions from "../../components/FilterOptions/FilterOptions";
import PluginCardFeed from "../../components/PluginCardFeed/PluginCardFeed";

const HomePage = () => {
  const [serverData, setServerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5050/api/plugins");
      setServerData(res.data);
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="py-5">
        <h1 className="text-primaryy">Explore the greatest plugins</h1>
        <p className="text-quaternary mb-4">Select tags to narrow your search</p>
        <FilterOptions />
      </div>
      <div className="py-5">
        <div className={styles.heading}>
          <div>
            <h2 className="text-primaryy">Top Plugins</h2>
            <p className="text-quaternary mb-4">Top servers on MineList.gg</p>
          </div>
          <div className={styles.selectContainer}>
            <select className={styles.select}>
              <option>Top</option>
              <option>Hot</option>
              <option>New</option>
            </select>
            <p>Filter your search</p>
          </div>
        </div>
        {serverData ? <PluginCardFeed serverData={serverData} /> : "Loading..."}
      </div>
    </>
  );
};

export default HomePage;
