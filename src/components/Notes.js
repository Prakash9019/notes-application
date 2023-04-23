import React, { useContext, useEffect, useRef, useState } from 'react'
import noteContext from "../NoteContext"
import Noteitem from './Noteitem';
import AddNote from './AddNote';
import { useNavigate } from 'react-router-dom';

const Notes = () => {
    const context = useContext(noteContext);
    let navigate=useNavigate();
    const { notes, getNotes, editNote } = context;
    useEffect(() => {
        if(localStorage.getItem('jwtData')){
            getNotes();
        }
        else{
               navigate("/login");
        }
    })
    const ref = useRef(null)
    const refClose = useRef(null)
    const [note, setNote] = useState({Uid: "", etitle: "", edescription: "", etag: ""})

    const updateNote = (currentNote) => {
        console.log(currentNote);
        console.log("this note is updating");
        ref.current.click();
       // setNote({title: note.title, description:note.description, tag: note.tag});
        setNote({Uid: currentNote.Uid, etitle: currentNote.title, edescription: currentNote.description, etag:currentNote.tag})
    }

    const handleClick = (e)=>{ 
        editNote(note.Uid, note.etitle, note.edescription, note.etag)
        refClose.current.click();
    }
      
    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }

    return (
        <>
            <AddNote />
            

            <div className="row my-3">
                <h2>You Notes</h2>
                <div className="container mx-2"> 
                { notes.length===0 && 'No notes to display'}
                </div>
             
            </div>
        </>
    )
}

export default Notes