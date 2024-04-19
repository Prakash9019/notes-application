// import React, { useContext, useEffect, useRef, useState } from 'react'
// import noteContext from "../NoteContext"
// import Noteitem from './Noteitem';
import AddNote from './AddNote';
// import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import TaskManager from './TaskManager';

const Notes = () => {
    // const context = useContext(noteContext);
    // let navigate=useNavigate();
    // const { notes, getNotes, editNote } = context;
    // useEffect(() => {
    //     if(localStorage.getItem('jwtData')){
    //         getNotes();
    //     }
    //     else{
    //            navigate("/login");
    //     }
    // },[])
  

    return (
        <>
            <AddNote />
            

           

            {/* <div className="container my-3 ml-3  bg-black ">
                <h2>You Notes</h2>
                <div className="container mx-2"> 
                {notes.length===0 && 'No notes to display'}
                </div>
                {notes?.map((note,index) => (
                     <Noteitem key={index} updateNote={updateNote} note={note} />
                ))}
            </div> */}
            <TaskManager />
        </>
    )
}

export default Notes

// 63ae755896b6c7351e18bfdc