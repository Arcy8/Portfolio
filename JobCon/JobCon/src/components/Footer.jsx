import React from 'react'
import { FooterContainer, FooterContentContainer, FooterLogoImg, JobconText,LinksContainer, Footerboxes, SpanText , AboutUsParaText, FooterIconCon, FooterIcon, TextContainer,} from '../components/Css.style'
import logo from "../assets/JobCon.jpg"
import { Link } from 'react-router-dom'

export default function Footer() {
  const text = `Unlock your next opportunity—JobCon makes it easy to connect, apply, and get hired.`
  return (
    <>
    
    <FooterContainer>
            <FooterContentContainer>
              

                <Footerboxes>
                  <FooterLogoImg src={logo}/>
                </Footerboxes>
                  <Footerboxes>
                    <JobconText>
                      <AboutUsParaText>{text}</AboutUsParaText>
                    </JobconText>
                </Footerboxes>


            </FooterContentContainer>

            <FooterContentContainer>
                <Footerboxes $height={"60px"}>
                  <SpanText size="20px" color='#2c3d43'>Links</SpanText>
                </Footerboxes>
                <Footerboxes $height="150px">
                  <LinksContainer $align="start" $width="90px">
                  <LinksContainer $width="90px">
                    <SpanText size="15px" color='#2c3d43'>Jobs</SpanText>
                    <SpanText size="15px" color='#2c3d43'>About us</SpanText>
                    <SpanText size="15px" color='#2c3d43'>Events</SpanText>
                    <SpanText size="15px" color='#2c3d43'>Home</SpanText>
                  </LinksContainer>
                    
                   
                  </LinksContainer>

                  
                  <LinksContainer $align="end" >
                    <LinksContainer $width="100px">
                    <SpanText size="15px" color='#2c3d43'>Profile</SpanText>
                    <SpanText size="15px" color='#2c3d43'>Schedule</SpanText>
                    <SpanText size="15px" color='#2c3d43'>My Selection</SpanText>
                    </LinksContainer>
                    

                  </LinksContainer>
                  
                  
                </Footerboxes>


                  
               
            </FooterContentContainer>

            <FooterContentContainer>
                <Footerboxes>
                    <SpanText size="20px" color='#2c3d43'>Contacts</SpanText>
                </Footerboxes>

                <Footerboxes>
                    <FooterIconCon>
                      <FooterIcon className="fa-brands fa-facebook-f"></FooterIcon>
                      <TextContainer>
                        <SpanText size="12px" color='#2c3d43'>Jobcon</SpanText>
                      </TextContainer>
                      
                    </FooterIconCon>
                    <FooterIconCon>
                      <FooterIcon className="fa-regular fa-envelope"></FooterIcon>
                      <TextContainer>
                        <SpanText size="12px" color='#2c3d43'>jobcon@gmail.com</SpanText>
                      </TextContainer> 
                    </FooterIconCon>
                    <FooterIconCon>
                      <FooterIcon className="fa-solid fa-phone"></FooterIcon>
                      <TextContainer>
                        <SpanText size="12px" color='#2c3d43'>09931758175</SpanText>
                      </TextContainer>
                    </FooterIconCon>
               
                </Footerboxes>
            </FooterContentContainer>
        </FooterContainer>
    </>
  )
}
