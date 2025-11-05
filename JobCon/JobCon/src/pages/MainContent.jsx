import React from 'react'
import { useState, useEffect } from 'react'
import Sidebar from '../components/Sidebar'
import Search from '../components/Search'
import MapCon from '../components/MapCon'
import Main from '../components/Main'
import Recommended from '../components/Recommended'
import Header from '../components/Header'


function MainContent({ setFavoritesJob }) {
    const [searchQ, setSearchQ] = useState("");
    const [timer, setTimer] = useState(searchQ);
  
    useEffect(() => {
      const time = setTimeout(() => {
        setTimer(searchQ);
      }, 500);
  
      return () => clearTimeout(time);
    }, [searchQ]);
  
    return (
      <>
        <Header/>
        <Sidebar />
       
        <Main setFavoritesJob={setFavoritesJob} searchQ={timer} />

        
      </>
    );
}

export default MainContent