import React, { useContext, useRef, useState } from 'react'
import noteContext from "../NoteContext"

const AddNote = () => {
  const context = useContext(noteContext);
    const {addNote, editNote} = context;
 
    const [note, setNote] = useState({Uid:"",title: "", description: "", tag: ""});

    const handleClick = (e)=>{
        e.preventDefault();
        
        addNote(note.Uid,note.title, note.description, note.tag);
        setNote({Uid:note.Uid,title: note.title, description:note.description, tag: note.tag});
        // console.log(note);
        // console.log(note._id);
    }

    const change = (e)=>{ 
        e.preventDefault();
        editNote(note.Uid, note.title, note.description, note.tag);
    }
  

    const onChange = (e)=>{
        setNote({...note, [e.target.name]: e.target.value})
    }
    return (
        <div className="container my-3">
            <h2>Add Patient details</h2>
            <form className="my-3">
            <div className="mb-3">
                    <label htmlFor="Uid" className="hi">user id</label>
                    <input type="text" className="form-control" id="Uid" name="Uid" aria-describedby="emailHelp" value={note.Uid} onChange={onChange} minLength={3} required /> 
                </div>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label" id="hi">Blood Pressure</label>
                    <input type="text" className="form-control" id="title" name="title" aria-describedby="emailHelp" value={note.title} onChange={onChange} minLength={5} required /> 
                </div>
                <div className="mb-3">
                    <label htmlFor="description" className="form-label">Heart Beat</label>
                    <input type="text" className="form-control" id="description" name="description" value={note.description} onChange={onChange} minLength={5} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="tag" className="form-label">Organ Problem</label>
                    <input type="text" className="form-control" id="tag" name="tag" value={note.tag} onChange={onChange} minLength={5} required />
                </div>
                
                <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={change}>change</button>
                <button  type="submit" className="btn btn-primary" onClick={handleClick}>edit</button>
            </form>
        </div>
    )
}

export default AddNote;
