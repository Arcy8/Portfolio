import React from 'react'
import {MemberContainer, MemberImg, AboutUsCon, MyTeam, MyTeamText,  AboutUsContainerMain, CardContainer, MemberCon, MemberTitleCon, SpanText2, Default } from '../components/Css.style'
import AboutusCom from '../components/AboutusCom'
import AboutusImg from '../components/AboutusImg'
import Header from '../components/Header'
import img1 from "../assets/dan.jpg"
import img2 from "../assets/tin.jpg"
import img3 from "../assets/cris.jpg"
import img4 from "../assets/aboutus.jpg"
import img5 from "../assets/ab2.png"
import img6 from "../assets/ab3.jpg"



function Aboutus(){
    const members = [
        {id: 1, img: img1, name: "Danre A. Del Castillo", role: "Ui/Ux Designer"},
        {id: 2, img: img2, name: "Christine C. Villabeto", role: "Documenter"},
        {id: 3, img: img3, name: "Christian Robert L. Dequilla", role: "Programmer"},
    ]

    
const texts = [
        {img: img4 , title: "About Us", paragraph: `Welcome to JobCon: Local Employment & Skill Enhancement System,
            a platform designed to bridge the gap between job seekers and employers in Panay and nearby areas.
            JobCon, a complete employment and trainingorganizer dedicated to empowering individuals and supporting local businesses,
            was created by Phinma students and is more than just a job portal.
        `},

        {img: img5,  title: "Our Purpose", paragraph: `JobCon was created to address unemployment and skills
            mismatches by providing a seamless job-matching experience and easy access to training programs.
            We believe that finding the right job should be simple, efficient, and accessible to everyone,
            regardless of background or industry.
        `},

        { img: img6 , title: "Our Mission", paragraph: `Our mission is to connect businesses with skilled professionals
            and help job seekers enhance their careers through data-driven insights, skill development resources,
            and real-time job opportunities. By integrating user-friendly technology and analytics, we aim to create
            a sustainable and thriving workforce that drives economic growth.
        `}
]


    
    


    return(
        <>
            <Header/>
            <AboutUsContainerMain>
                <AboutUsCon>
                    <AboutusCom title={texts[0].title} paragraph={texts[0].paragraph}/>
                    <AboutusImg img={texts[0].img}/>
                    <AboutusImg img={texts[1].img}/>
                    <AboutusCom title={texts[1].title} paragraph={texts[1].paragraph}/>
                    <AboutusCom title={texts[2].title} paragraph={texts[2].paragraph}/>
                    <AboutusImg img={texts[2].img}/>
                </AboutUsCon>
            </AboutUsContainerMain>



            


        </>
    )
}


export default Aboutus
