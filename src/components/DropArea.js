import React, { useState } from 'react'

const DropArea = ({onDrop}) => {
    const [show,setShow ]=useState(false);
  return (
    <section
    onDragEnter={()=> setShow(true)}
    onDragLeave={()=> setShow(false)}
    onDrop={()=>{
        onDrop();
        setShow(false)
    }}
    onDragOver={(e)=>{e.preventDefault();}}
    className={show ? "drop_area" : "hide_drop"}
    >
        Drop Here
    </section>
  )
}

export default DropArea