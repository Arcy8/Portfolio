import React from 'react'
import {AboutUsContainer ,  AboutUsTextCon, AboutUsText, AboutUsParaText, AboutUsParaCon,  } from './Css.style'


export default function AboutusCom({ title, paragraph }) {
  return (
    <>
     

            <AboutUsContainer>
                <AboutUsTextCon>
                    <AboutUsText>{title}</AboutUsText>
                </AboutUsTextCon>

                <AboutUsParaCon>
                    <AboutUsParaText>{paragraph}</AboutUsParaText>
                </AboutUsParaCon>
            </AboutUsContainer>
        
           

   
      
    
    </>
  )
}
