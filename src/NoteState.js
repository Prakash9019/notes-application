import  {useState} from "react";
import  NoteContext from "./NoteContext";

//import Notes from "./components/Notes";

const NoteState=(props)=>{

  const host = "http://localhost:5000";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial) ;

      const getNotes = async () => {
        // API Call 
        const response = await fetch(`http://localhost:5000/api/notes/fetchall`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            "jwtData": localStorage.getItem('jwtData')
          }
        });
        const hello = await response.json();
        setNotes(hello);
      }

      const addNote = async (title,description) => {
        // API Call 
        const response = await fetch(`${host}/api/notes/addnote`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            "jwtData": localStorage.getItem('jwtData')
          },
           body: JSON.stringify({title,description})
        });
        const note = await response.json() 
        setNotes(notes.concat(note));
      }

      const deleteNote = async (id) => {
        // API Call
        const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            "jwtData": localStorage.getItem('jwtData')
          }
        });
        const json = response.json(); 
        console.log(json);
        const newNotes = notes.filter((note) => { return note._id !== id })
        setNotes(newNotes);
      }

     // Edit a Note
  const editNote = async (id,title,description) => {
    console.log(id+title+description+"hel.....");
   
    // API Call 
    const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        "jwtData": localStorage.getItem('jwtData')
      },
      body: JSON.stringify({title, description})
    });
    const json = await response.json(); 
    console.log(json);

     let newNotes = JSON.parse(JSON.stringify(notes))
    // Logic to edit in client
    for (let index = 0; index < newNotes.length; index++) {

      const element = newNotes[index];
      if (element._id === id) {
        console.log("hello");
        newNotes[index].title = title;
        newNotes[index].description = description;
        break; 
      }
    }  
    setNotes(newNotes);
  }


    //for the explaination of context api
    // const s1={
    //     "name":"surya",
    //     no:"i2"
    // }
    // const [state,setState]=useState(s1);
    // const  update=()=>{
    //     setTimeout(()=>{
    //         setState({
    //             "name":"prakash",
    //             no:"i2"
    //         })
    //     },1000);
    // };
    // value={{state,update}}
    return (
        <NoteContext.Provider value={{notes,addNote,deleteNote,editNote,getNotes}}>
            {props.children}
        </NoteContext.Provider>
    )
}

export default NoteState;