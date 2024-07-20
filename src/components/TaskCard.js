// components/TaskCard.js
import React, { useContext } from 'react'
import noteContext from "../NoteContext"

const TaskCard = (props) => {
  const context = useContext(noteContext);
    // let navigate=useNavigate();
    const { task, updateNote ,setactive} = props;
    const {  deleteNote, } = context;
    const date = new Date(task.date);
const day = String(date.getDate()).padStart(2, "0");
const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
const year = date.getFullYear();
const formattedDate = `${day}-${month}-${year}`;
  return (
    <div className="w-full  mt-2 mb-2 p-4 rounded shadow " draggable onDragStart={()=> setactive(JSON.stringify(task))} onDragEnd={()=> setactive(null)}> 
    <div className="flex flex-row">
  <h3 className="text-lg text-gray-600 font-semibold">{task.title}</h3>
  <i className="far fa-trash-alt mx-2 cursor-pointer flex-end" onClick={() => deleteNote(task._id)}></i>
  <i className="far fa-edit mx-2 cursor-pointer flex-end" onClick={() => {updateNote(task)}}></i>
</div>
        <h2 className="text-xl font-bold mb-4">{task.heading}</h2>
        <hr className='border-20'/>
     
     
      <p className="text-gray-600">{task.description}</p>
      
      <p className="text-gray-600">{formattedDate}</p>
      {/* {console.log(task.date)} */}
    </div>
  );
};

export default TaskCard;
