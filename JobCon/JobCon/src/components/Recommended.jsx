import React from 'react'
import { RecommendedCard, RecommendedContainer, Img } from './Css.style'
import { useState, useEffect } from "react";
import auto from "../assets/auto4.png"
import agri from "../assets/agri6.png"

function Recommended() {
  const images = [
    auto,
    agri
    
  ];

 
  const [slides, setSlides] = useState(0);

  const slide = () => {
    setSlides((prevIndex) => (prevIndex + 1) % images.length);
  };

  useEffect(() => {
    const intervalId = setInterval(slide, 3000); 
    return () => clearInterval(intervalId);
  }, []);

  return (
    <RecommendedContainer>
      <RecommendedCard>
        <Img
          src={images[slides]}
        />
      </RecommendedCard>  
    </RecommendedContainer>
  );
};

export default Recommended