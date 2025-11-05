import React from 'react'
import { Buttons } from './Css.style'

function Button(props) {
  return (
    <>
        <Buttons>
            {props.btn}
        </Buttons>
    </>
  )
}

export default Button