import React from 'react'
import Dashboard from '../components/Dashboard';
import { 
        ModalMainCon, ModalContent, ModalImgCon, ModalInfoCon, ModalImg, ModalImageCon,
        

      } from '../components/Css.style'

import { JobDescription } from '../components/Css.style';     
import { DescriptionCon, DescriptionText, DescriptionUl, DescriptionLi } from '../components/Css2.style'; 
  

export default function Modal({show, close, desc}) {
 
  if (!show) return null;


  const closeModal = (e) => {
   
    if (e.target === e.currentTarget) {
      close();
    }
  };


  const description = desc.description;
  const availableJobs = description.replace("Now Hiring:", "").split(',').map(title => title.trim());


  
  return (
    <ModalMainCon  onClick={closeModal}>
      <ModalContent className='modal'>

        <ModalImgCon>
          
          <ModalImageCon>
            <ModalImg src={desc.images}/>
          </ModalImageCon>

          <ModalImageCon>
            <DescriptionCon $height = "20px" >
              <DescriptionText>{desc.title}</DescriptionText>
            </DescriptionCon>
            <DescriptionCon $align= "start" ><DescriptionText $font="none" >{desc.type}</DescriptionText></DescriptionCon>
            <DescriptionCon $align= "start" $justify="start">
              <DescriptionUl>
                <DescriptionLi>{desc.blt1}</DescriptionLi>
                <DescriptionLi>{desc.blt2}</DescriptionLi>
                <DescriptionLi>{desc.blt3}</DescriptionLi>
              </DescriptionUl>
              
            </DescriptionCon>
           
           
          </ModalImageCon> 

          
        </ModalImgCon>

        <ModalInfoCon>
            <Dashboard/>       
        </ModalInfoCon>

      </ModalContent>
    </ModalMainCon>
  )
}
