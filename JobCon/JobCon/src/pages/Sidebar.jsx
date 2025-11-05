import React from 'react'
import { useEffect, useState } from 'react'
import { ProfileContainer } from './Css.style'
import { AsideContainer } from './Css.style'
import {SidebarNav} from './Css.style'
import { NavContainer } from './Css.style'
import { SidebarLink } from './Css.style'
import { SpanText2 } from './Css.style'
import { Icon } from './Css.style'
import { ProfileImg } from './Css.style'
import profile from "../assets/profile1.jpg"
import { ProfileImgCon } from './Css.style'
import { ProfileNameCon } from './Css.style'
import { ProfileName } from './Css.style'

function Sidebar() {

    const [firstname, setFirstname] = useState("");
      const [lastname, setLastname] = useState("");
    
      
    
      useEffect(() => {
        const storedFirstname = localStorage.getItem("firstname");
        const storedLastname = localStorage.getItem("lastname");
        if (storedFirstname && storedLastname) {
          setFirstname(storedFirstname);
          setLastname(storedLastname);
        }
      
      }, []);


  return (
    <>
        <AsideContainer $width="230px" >

            <ProfileContainer>
                <ProfileImgCon>
                
                    <ProfileImg src={profile} alt="profile" /> 
                    
                </ProfileImgCon>  

                <ProfileNameCon>
                    <ProfileName>{firstname && lastname ? `${firstname} ${lastname}` : "Guest"}</ProfileName>
                </ProfileNameCon>
            
            </ProfileContainer>

            <NavContainer>

                <SidebarNav>
                    <SidebarLink  to={"/profile"}> <Icon className="fa-solid fa-user"></Icon><SpanText2>My Profile</SpanText2></SidebarLink>
                    <SidebarLink to={"/"}><Icon className="fa-solid fa-laptop"></Icon><SpanText2>Jobs</SpanText2> </SidebarLink>
                    <SidebarLink to={"/"}><Icon className="fa-solid fa-calendar-days"></Icon><SpanText2>Schedule</SpanText2></SidebarLink>
                    <SidebarLink to={"/myselection"}> <Icon className="fa-solid fa-floppy-disk"></Icon><SpanText2>My Selection</SpanText2></SidebarLink>
        
                </SidebarNav>

            </NavContainer>
        </AsideContainer>
    </>
  )
}

export default Sidebar