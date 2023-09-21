import React, { useContext, useState } from 'react'
import noteContext from "../NoteContext"
import { toast } from 'react-toastify';

const AddNote = () => {
  const context = useContext(noteContext);
    const {addNote} = context;
 
    const [note, setNote] = useState({title: "", description: ""});

    const handleClick = (e)=>{
        e.preventDefault();
        
        addNote(note.title, note.description );
        setNote({title: note.title, description:note.description });
        toast("Notes Successfully Added");
        // console.log(note);
        // console.log(note._id);
    }
  

    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    return (
        <div className="container my-3">
            <h2>Todo-List</h2>
            <form className="my-3">
           
                <div className="mb-3">
                    <label htmlFor="title" className="form-label" id="hi">Title</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={5} required /> 
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Description</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
                </div>
            
                
                <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>
        </div>
    )
}

export default AddNote;
