import React, { useContext, useEffect,useState,useRef } from 'react'
import noteContext from "../NoteContext"
import { useDispatch,useSelector } from 'react-redux';
import {getNotes} from "../slices/todoslices";
// import axios from 'axios';
import DatePicker from 'react-datepicker'; // Import the date picker component
import 'react-datepicker/dist/react-datepicker.css'; // Import the date picker CSS
import {  Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TaskCard  from './TaskCard';
import DropArea  from './DropArea';


const TaskManager = () => {
  const context = useContext(noteContext);
    let navigate=useNavigate();
    const { editNote } = context;
    const dispatch=useDispatch();
    const notesData=useSelector(state=>state.notes);
    // console.log(notesData.length);
    useEffect(() => {
      if(localStorage.getItem('jwtData')){
          dispatch(getNotes());
          // getNotes();
      }
      else{
             navigate("/login");
      }
    },[dispatch,navigate,editNote]);

    const ref = useRef(null)
    const refClose = useRef(null)
    const [note1, setNote1] = useState({id:" ", title: "", edescription: "",estatus: "",epriority: ""})
     
    const updateNote = (currentNote) => {
        // console.log(currentNote);
        // console.log("this note is updating");
        ref.current.click();
       // setNote({title: note.title, description:note.description, tag: note.tag});
        setNote1({ id:currentNote._id,title: currentNote.title, edescription: currentNote.description,estatus:currentNote.status,epriority:currentNote.priority});
        console.log(note1.title);
        // console.log(setNote1);
        
    }

    const handleClick = (e)=>{ 
        editNote( note1.id,note1.title, note1.edescription,note1.estatus,note1.epriority);
        refClose.current.click();
        toast("Editted the note Sucessfully");
    }
      
    const onChange = (e)=>{
        setNote1({...note1, [e.target.name]: e.target.value})
    }

  const [active,setactive] = useState(JSON.stringify({id:" ", title: "", description: "",status: "",priority: ""}));
  const [searchInput, setSearchInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(''); // Initialize with an empty string
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortPriority,setSortPriority] = useState(''); 
  const onDrop =(i,title,s,pos)=>{
    console.log(i,title,active,s,pos);
    if(active===null || active===undefined) return; 
    const newNote=JSON.parse(active);
    editNote( newNote._id,newNote.title, newNote.description,s,newNote.priority);
  }

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };
  const handleSortPriorityChange = (e) => {
      setSortPriority(e.target.value);

  }
  // Handle priority selection
  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
    console.log(e.target.value);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
  };
  // const sortedNotes = [...notesData].sort((a, b) => a.priority.localeCompare(b.priority));
  const handleEndDateChange = (date) => {
    setEndDate(date);
  };
  const filteredNotes = notesData.filter((note) => {
    const titleMatches = note.title.toLowerCase().includes(searchInput.toLowerCase());
    const priorityMatches = !selectedPriority || note.priority.toLowerCase() === selectedPriority.toLowerCase();
    // const sortedNotes = !setSortPriority;
    const date1 = new Date(note.date);
    const date2 = new Date(startDate);
    const date3=new Date(endDate);
    const dateInRange = (!startDate || date1 >= date2 ) && (!endDate || date1 <= date3);
    return titleMatches && priorityMatches && dateInRange ;
  });

 
  
    return (
    <div>  <button ref={ref} type="button" className="btn btn-primary d-none" data-bs-toggle="modal" data-bs-target="#exampleModal">
    Launch demo modal
</button>
       <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">Edit Note</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form className="my-3">
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Title</label>
                                    <input type="text" className="form-control" id="title" name="title" value={note1.title} aria-describedby="emailHelp" onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Description</label>
                                    <input type="text" className="form-control" id="edescription" name="edescription" value={note1.edescription} onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="status" className="form-label">Status</label>
                                    <input type="text" className="form-control" id="estatus" name="estatus" value={note1.estatus} onChange={onChange} minLength={5} required/>
                                </div>
                                <div className="mb-3">
                                    <label htmlFor="priority" className="form-label">Priority</label>
                                    <input type="text" className="form-control" id="epriority" name="epriority" value={note1.epriority} onChange={onChange} minLength={5} required/>
                                </div>
 
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button ref={refClose} type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button disabled={note1.title.length<5 || note1.edescription.length<5} onClick={handleClick} type="button" className="btn btn-primary">Update Note</button>
                        </div>
                    </div>
                </div>
            </div>
       <div style={{ padding: 20 ,display :'flex',flexDirection:'row' }}>
        <h3> Fliter By : </h3>
      <Input          icon="search"
        placeholder="Search by title..."
        value={searchInput}
        onChange={handleSearchChange} 
        className='mx-3'
        style={{ fontSize:20}}
      />
      <select
        value={selectedPriority}
        onChange={handlePriorityChange}
        style={{ fontSize:20 }}
        className='mx-3 w-4'
      >
        <option value="">Select priority</option>
        <option value="p0">P0</option>
        <option value="p1">P1</option>
        <option value="p2">P2</option>
      </select>

      <DatePicker
          key={1}
        selected={startDate}
        onChange={handleStartDateChange}
        placeholderText="Select start date"
        // style={{}}
        className='mx-3'
      />
      <DatePicker
      key={2}
        selected={endDate}
        onChange={handleEndDateChange}
        // style={{ }}
        className='mx-3'
        placeholderText="Select end date"
      />
</div>
<div style={{ padding: 20 ,display :'flex',flexDirection:'row' }}>
        <h3> Sorted By : </h3>
      
      <select
        value={sortPriority}
        onChange={handleSortPriorityChange}
        style={{ fontSize:20 }}
        className='mx-3 w-5'
      >
        <option value="hi">Select priority</option>
        <option value="p0">P0</option>
        <option value="p1">P1</option>
        <option value="p2">P2</option>
      </select>
    </div>

    <div className="  my-3 mx-6  p-4">
    <h1 className="text-2xl font-bold mb-6 ml-3">Task Manager</h1>
    <div className="flex  flex-row  row bg-red-400 " index={12} >
      {/* Completed Tasks  space-x-4 */}

      <div className="hii5" key={1}>
             <div  style={{backgroundColor: '#4793AF'}}>
             <h3 className="text-lg grey font-semibold text-center bg-blue-900 mt-3 mb-0 p-4">Pending</h3>
              </div>
              {  filteredNotes.length !==0 ?  filteredNotes.filter((task) => (task.status).toLowerCase() === 'pending')
      .length!==0 ?
      filteredNotes.filter((task) => (task.status).toLowerCase() === 'pending').map((task,index) => (
           <React.Fragment>
              <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index)}  />
               <TaskCard setactive={setactive} updateNote={updateNote}  index={index} task={task} />
               <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index+1)} /> 
            </React.Fragment>  ))
        : <React.Fragment ><DropArea onDrop={()=> onDrop(0,0,"pending",0)}  /> </React.Fragment> 
       : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>
      

      <div className="hii1" key={2}>
      <div  >
         <h3 className="text-lg grey font-semibold text-center bg-blue-900  mt-3 mb-0 p-4">In Progress</h3>
      </div>
      {  filteredNotes.length !==0 ?  filteredNotes.filter((task) => (task.status).toLowerCase() === 'incomplete')
      .length!==0 ?
      filteredNotes.filter((task) => (task.status).toLowerCase() === 'incomplete').map((task,index) => (
           <React.Fragment>
              <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index)}  />
               <TaskCard setactive={setactive} updateNote={updateNote}  index={index} task={task} />
               <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index+1)} /> 
            </React.Fragment>  ))
        : <React.Fragment ><DropArea onDrop={()=> onDrop(0,0,"incomplete",0)}  /> </React.Fragment> 
       : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>

      {/* Deployed Tasks */}
      <div className="hii2 " key={3}>
      <div  style={{backgroundColor: '#7EA1FF'}}>
      <h3 className="text-lg grey font-semibold text-center bg-blue-900 mt-3 mb-0 p-4">Completed</h3>
      </div>
      {  filteredNotes.length !==0 ?  filteredNotes.filter((task) => (task.status).toLowerCase() === 'completed')
      .length!==0 ?
      filteredNotes.filter((task) => (task.status).toLowerCase() === 'completed').map((task,index) => (
           <React.Fragment>
              <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index)}  />
               <TaskCard setactive={setactive} updateNote={updateNote}  index={index} task={task} />
               <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index+1)} /> 
            </React.Fragment>  ))
        : <React.Fragment ><DropArea onDrop={()=> onDrop(0,0,"completed",0)}  /> </React.Fragment> 
       : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>

      <div className="hii3" key={4}>
      <div  style={{backgroundColor: '#ECCA9C'}}>
        <h3 className="text-lg grey font-semibold text-center bg-blue-900 mt-3 mb-0 p-4">Deployed</h3>
        </div>
        {  filteredNotes.length !==0 ?  filteredNotes.filter((task) => (task.status).toLowerCase() === 'deployed')
      .length!==0 ?
      filteredNotes.filter((task) => (task.status).toLowerCase() === 'deployed').map((task,index) => (
           <React.Fragment>
              <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index)}  />
               <TaskCard setactive={setactive} updateNote={updateNote}  index={index} task={task} />
               <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index+1)} /> 
            </React.Fragment>  ))
        : <React.Fragment ><DropArea onDrop={()=> onDrop(0,0,"deployed",0)}  /> </React.Fragment> 
       : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>


      <div className="hii4" key={5}>
      <div  style={{backgroundColor: '#BC7FCD'}}>
        <h3 className="text-lg grey font-semibold text-center bg-blue-900 mt-3 mb-0 p-4">Deffered</h3>
        </div>
        {  filteredNotes.length !==0 ?  filteredNotes.filter((task) => (task.status).toLowerCase() === 'deffered')
      .length!==0 ?
      filteredNotes.filter((task) => (task.status).toLowerCase() === 'deffered').map((task,index) => (
           <React.Fragment>
              <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index)}  />
               <TaskCard setactive={setactive} updateNote={updateNote}  index={index} task={task} />
               <DropArea onDrop={()=> onDrop(task._id,task.title,task.status,index+1)} /> 
            </React.Fragment>  ))
        : <React.Fragment ><DropArea onDrop={()=> onDrop(0,0,"deffered",0)}  /> </React.Fragment> 
       : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>
    </div>
  </div>
  </div>
    );
  };
  
  export default TaskManager;