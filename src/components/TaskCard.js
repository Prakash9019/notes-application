// components/TaskCard.js
import React, { useContext } from 'react'
import noteContext from "../NoteContext"

const TaskCard = ({ task }) => {
  const context = useContext(noteContext);
    // let navigate=useNavigate();
    const {  editNote,deleteNote, } = context;
  return (
    <div className="hello mt-2 mb-2 p-4 rounded shadow"> 
    <div className="flex flex-row">
  <h3 className="text-lg text-gray-600 font-semibold">{task.title}</h3>
  <i className="far fa-trash-alt mx-2 cursor-pointer" onClick={() => deleteNote(task)}></i>
  <i className="far fa-edit mx-2 cursor-pointer" onClick={() => editNote(task)}></i>
</div>
        <h2 className="text-xl font-bold mb-4">{task.heading}</h2>
        <hr className='border-20'/>
     
     
      <p className="text-gray-600">{task.description}</p>
      <p className="text-gray-600">{task.date}</p>
    </div>
  );
};

export default TaskCard;
