import React from 'react'
import { useEffect, useState } from 'react'
import { ProfileContainer, AsideContainer, SidebarNav , NavContainer ,SidebarLink ,SpanText2, Icon
    ,ProfileImg, ProfileImgCon, ProfileNameCon, ProfileName 
} from '../components/Css.style'
import { TextSpan } from '../components/Mainpage.style'
import profile from "../assets/profile1.jpg"


function AdminSidebar() {


  return (
    <>
        <AsideContainer $left="none" $right="none" $backcolor="rgb(19, 29, 48)" $top="0px" $width="230px">

            <ProfileContainer>
                <ProfileImgCon>
                
                    <ProfileImg src={profile} alt="profile" /> 
                    
                </ProfileImgCon>  

                <ProfileNameCon>
                    <TextSpan $size="20px" $textColor="#e3dfdf">Admin</TextSpan>
                </ProfileNameCon>
            
            </ProfileContainer>

            <NavContainer>

                <SidebarNav>
                    <SidebarLink $sidecolor="#efebeb"  to={"/Applicant"}> <Icon className="fa-solid fa-user"></Icon><SpanText2 $spancolor="#efebeb">Applicants</SpanText2></SidebarLink>
                    <SidebarLink $sidecolor="#efebeb" to={"/AddJobs"}><Icon className="fa-solid fa-laptop"></Icon><SpanText2 $spancolor="#efebeb">Add Jobs/View Responses</SpanText2 > </SidebarLink>
                    <SidebarLink $sidecolor="#efebeb" to={"/JobChart"}><Icon className="fa-solid fa-calendar-days"></Icon><SpanText2 $spancolor="#efebeb">Chart</SpanText2></SidebarLink>
                   
                    <SidebarLink $sidecolor="#efebeb"  to={"/Schedule"}> <Icon className="fa-solid fa-floppy-disk"></Icon ><SpanText2 $spancolor="#efebeb">Schedules</SpanText2></SidebarLink>
        
                </SidebarNav>

            </NavContainer>
        </AsideContainer>
    </>
  )
}

export default AdminSidebar