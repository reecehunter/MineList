import React, { useEffect, useState } from 'react'
import axios from 'axios';
import FilterOptions from '../components/FilterOptions/FilterOptions'
import PluginCardFeed from '../components/PluginCardFeed/PluginCardFeed'

const HomePage = () => {
  const [serverData, setServerData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get("http://localhost:5000/api/plugins");
      setServerData(res.data);
    }
    fetchData();
  }, [])
  

  return (
    <>
      <div className="py-5">
        <h1 className="text-primaryy">Explore the greatest plugins</h1>
        <p className="text-quaternary mb-4">Select tags to narrow your search</p>
        <FilterOptions />
      </div>
      <div className="py-5">
        <h2 className="text-primaryy">Top Plugins</h2>
        <p className="text-quaternary mb-4">Top servers on MineList.gg</p>
        {serverData ? <PluginCardFeed serverData={serverData} /> : "x"}
      </div>
    </>
  )
}

export default HomePage