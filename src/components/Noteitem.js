import React, {useContext,useState} from 'react'
import { NoteContext  } from "../NoteContext";
const Noteitem = (props) => {
  const context = useContext(NoteContext);
    const { deleteNote } = context;
    const { note, updateNote } = props;
    const [check,setcheck]=useState(true);
    const handleclick=(e)=>{
         setcheck(!check);
    }
    return (
      
        <div className="col-md-3">
            <div className="card my-3">
                <div className="card-body">
                    <div className="d-flex align-items-center">
                        <h5 className="card-title">{note.title}</h5>
                        <i className="far fa-trash-alt mx-2" onClick={()=>{deleteNote(note._id)}}></i>
                   { check && <i className="far fa-edit mx-2" onClick={()=>{updateNote(note)}} ></i>}
                       
                        <div className="form-check">
                        <input className="form-check-input" type="checkbox" value={check} id="flexCheckDefault" onClick={handleclick}/>
                        </div>
                    </div>
                    <p className="card-text">{note.description}</p>

                </div>
            </div>
        </div>
    )
}

export default Noteitem
