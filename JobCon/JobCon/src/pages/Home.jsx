import React from 'react'
import { HomeMainContainer, HomeMain, HomeTextCon, HomeSpan, HomeButton, HomeImg, HomeImage, HomeBtnLink, RecommendedCard } from '../components/Css.style'
import Footer from '../components/Footer'
import Header from '../components/Header'
import bg from '../assets/bg2.jpg'
import Recommended from '../components/Recommended'

export default function Home() {
  return (
    <>
          <Header/>
         
        <HomeMainContainer>
            
           
           
            <HomeMain >
                <HomeTextCon $height="160px" $align="end">
                    <HomeSpan $color=" #2c3d43">Your Ideal Job Is Just a Click Away</HomeSpan>
                </HomeTextCon>
                <HomeTextCon>
                    <HomeSpan $fontSize="18px" >
                    Connecting job seekers and employers with opportunities, skills, and growth—JobCon, your gateway to a better future.
                    </HomeSpan>
                </HomeTextCon>
                <HomeTextCon $align="start">
                    <HomeBtnLink to={"/"}><HomeButton>Find Job Now</HomeButton></HomeBtnLink>
                </HomeTextCon>
            </HomeMain>

            <HomeImg>
                <HomeImage src={bg}/>
            </HomeImg>
            
        </HomeMainContainer>

        <Footer/>

   


    </>
  )
}
