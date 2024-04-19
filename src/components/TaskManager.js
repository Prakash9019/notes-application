import React, { useContext, useEffect,useState } from 'react'
import noteContext from "../NoteContext"
import { useDispatch,useSelector } from 'react-redux';
import {getNotes} from "../slices/todoslices";
// import axios from 'axios';
import DatePicker from 'react-datepicker'; // Import the date picker component
import 'react-datepicker/dist/react-datepicker.css'; // Import the date picker CSS
import { Card, Input } from 'semantic-ui-react';
import { useNavigate } from 'react-router-dom';
// import { toast } from 'react-toastify';
import TaskCard from './TaskCard';


const TaskManager = () => {
  const context = useContext(noteContext);
    let navigate=useNavigate();
    const { notes, getNotes } = context;
    const dispatch=useDispatch();
    const notesData=useSelector(state=>state.notes);
    useEffect(() => {
      if(localStorage.getItem('jwtData')){
          // dispatch(getNotes());
          getNotes();
      }
      else{
             navigate("/login");
      }
    })
    // {console.log(notes)}
    // const [notesData, setNotesData] = useState([]);
  const [searchInput, setSearchInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState(''); // Initialize with an empty string
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  // useEffect(() => {
  //   // Fetch notes data from your API (replace with your actual endpoint)
  //   axios.get('https://jsonplaceholder.typicode.com/posts')
  //     .then((response) => {
  //       setNotesData(response.data);
  //     })
  //     .catch((error) => {
  //       console.error('Error fetching notes data:', error);
  //     });
  // }, []);
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  // Handle priority selection
  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
    console.log(e.target.value);
    console.log(filteredNotes);
  };
  const handleStartDateChange = (date) => {
    setStartDate(date);
    console.log(date);
  };

  const sortedNotes = [...notes].sort((a, b) => a.priority.localeCompare(b.priority));
  const handleEndDateChange = (date) => {
    setEndDate(date);
    console.log(date);
  };
  const filteredNotes = notes.filter((note) => {
    const titleMatches = note.title.toLowerCase().includes(searchInput.toLowerCase());
    const priorityMatches = !selectedPriority || note.priority.toLowerCase() === selectedPriority.toLowerCase();
    const date1 = new Date(note.date);
    const date2 = new Date(startDate);
    const date3=new Date(endDate);
    const dateInRange = (!startDate || date1 >= date2 ) && (!endDate || date1 <= date3);
//     

// const date2String = "2024-03-29T10:05:38.608Z";
// 

// if (date1 > date2) {
//   console.log("The first date is greater than the second date.");
//   console.log(date1 + " "+date2);
// } else if (date1 < date2) {
//   console.log("The first date is less than the second date.");
// } else {
//   console.log("Both dates are the same.");
// }
    return titleMatches && priorityMatches && dateInRange;
  });
  // console.log(filteredNotes);
  
    return (
    //   <div className="container mx-auto p-4">
    //     <h1 className="text-2xl font-bold mb-6">Task Manager</h1>
    //     <div className="grid grid-cols-3 gap-4">
    //       {/* Completed Tasks */}
    //       <div>
    //         <h2 className="text-xl font-bold mb-4">Completed Tasks</h2>
    //         {completedTasks.map((task) => (
    //           <TaskCard key={task.id} task={task} />
    //         ))}
    //       </div>
  
    //       {/* Incomplete Tasks */}
    //       <div>
    //         <h2 className="text-xl font-bold mb-4">Incomplete Tasks</h2>
    //         {incompleteTasks.map((task) => (
    //           <TaskCard key={task.id} task={task} />
    //         ))}
    //       </div>
  
    //       {/* Deployed Tasks */}
    //       <div>
    //         <h2 className="text-xl font-bold mb-4">Deployed Tasks</h2>
    //         {deployedTasks.map((task) => (
    //           <TaskCard key={task.id} task={task} />
    //         ))}
    //       </div>
    //     </div>
    //   </div>
    <div>
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
        value={selectedPriority}
        onChange={handlePriorityChange}
        style={{ fontSize:20 }}
        className='mx-3 w-5'
      >
        <option value="">Select priority</option>
        <option value="p0">P0</option>
        <option value="p1">P1</option>
        <option value="p2">P2</option>
      </select>
    </div>
      {/* Add date range picker components here */}
      <Card.Group itemsPerRow={3} style={{ marginTop: 20 }}>
        {filteredNotes.map((note) => (
          <Card key={note.id}>
            <Card.Content>
              <Card.Header>{note.title}</Card.Header>
              <Card.Description>{note.body}</Card.Description>
            </Card.Content>
          </Card>
        ))}
      </Card.Group>
    




    <div className="  my-3 mx-6  p-4">
    <h1 className="text-2xl font-bold mb-6 ml-3">Task Manager</h1>
    <div className="flex  flex-row  row bg-red-400 ">
      {/* Completed Tasks  space-x-4 */}

      <div className="hii5">
             <div  style={{backgroundColor: '#4793AF'}}>
             <h3 className="text-lg grey font-semibold text-center bg-blue-900 mt-3 mb-0 p-4">Pending</h3>
              </div>
      {   filteredNotes.length !==0 ? filteredNotes.filter((task) => (task.status).toLowerCase() === 'completed').map((task) => (
  <TaskCard key={task.id} task={task} />
))  : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>
      

      {/* Incomplete Tasks */}
      <div className="hii1">
      <div  style={{backgroundColor: '#90D26D'}}>
         <h3 className="text-lg grey font-semibold text-center bg-blue-900  mt-3 mb-0 p-4">In Progress</h3>
      </div>
      {   filteredNotes.length !==0 ? filteredNotes.filter((task) => (task.status).toLowerCase() === 'incomplete').map((task) => (
  <TaskCard key={task.id} task={task} />
)) : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>

      {/* Deployed Tasks */}
      <div className="hii2 ">
      <div  style={{backgroundColor: '#7EA1FF'}}>
      <h3 className="text-lg grey font-semibold text-center bg-blue-900 mt-3 mb-0 p-4">Completed</h3>
      </div>
      {   filteredNotes.length !==0 ?  filteredNotes.filter((task) => (task.status).toLowerCase() === 'deploy').map((task) => (
  <TaskCard key={task.id} task={task} />
)) : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>

      <div className="hii3">
      <div  style={{backgroundColor: '#ECCA9C'}}>
        <h3 className="text-lg grey font-semibold text-center bg-blue-900 mt-3 mb-0 p-4">Deployed</h3>
        </div>
        {  filteredNotes.length !==0 ? filteredNotes.filter((task) => (task.status).toLowerCase() === 'deploy').map((task) => (
  <TaskCard key={task.id} task={task} />
))  : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>
      <div className="hii4">
      <div  style={{backgroundColor: '#BC7FCD'}}>
        <h3 className="text-lg grey font-semibold text-center bg-blue-900 mt-3 mb-0 p-4">Deffered</h3>
        </div>
        {   filteredNotes.length !==0 ? filteredNotes.filter((task) => (task.status).toLowerCase() === 'deploy').map((task) => (
  <TaskCard key={task.id} task={task} />
))  : <h4 className='text-center my-2'>No Notes to display</h4> }
      </div>
    </div>
  </div>
  </div>
    );
  };
  
  export default TaskManager;