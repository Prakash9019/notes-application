import React, { useContext, useState } from 'react'
import noteContext from "../NoteContext"
import { toast } from 'react-toastify';
import Select from 'react-select'

const AddNote = () => {
  const context = useContext(noteContext);
    const {addNote} = context;
 
    const [note, setNote] = useState({title: "", description: "",status:"",priority:""});

    const handleClick = (e)=>{
        e.preventDefault();
        console.log(note.status + " " + note.priority);
        addNote(note.title, note.description,note.status,note.priority );
        setNote({title: note.title, description:note.description, status:note.status, priority:note.priority});
        toast("Notes Successfully Added");
        console.log(note);
        // console.log(note._id);
    }
    const options = [
        { value: 'p0', label: 'p0' },
        { value: 'p1', label: 'p1' },
        { value: 'p2', label: 'p2' }
      ]  
    const handleChange=(e)=>{
        note.priority=e.value;
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
                <div className="mb-3">
                    <label htmlFor="status" className="form-label">status</label>
                    <input type="text" className="form-control" id="status" name="status" value={note.status} onChange={onChange} minLength={5} required />
                </div>
                <div className="max-w-sm mx-auto">
                <label htmlFor="description" className="form-label">Priority</label>
               <br/>
               {/* <select id="priority" className="my-1 w-50 h-40 text-lg" value={note.priority}>
                       <option  className="text-lg" value="p0">p0</option>
                        <option className="text-lg" value="p1">p1</option>
                         <option className="text-lg" value="p2">p2</option>
                </select> */}
                <Select options={options} onChange={handleChange} />
                {/* {console.log(options.value)} */}
               </div>
            
                
                <button disabled={note.title.length<5 || note.description.length<5} type="submit" className="btn btn-primary" onClick={handleClick}>Add Note</button>
                </form>
        </div>
    )
}

export default AddNote;
