import React from 'react'
import { AboutUsImgCon, AboutUsImg } from './Css.style'

export default function AboutusImg({ img }) {
  return (
    <>
        <AboutUsImgCon>
          <AboutUsImg src={img}/>
        </AboutUsImgCon>
    </>
  )
}
