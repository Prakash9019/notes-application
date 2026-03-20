# Fixed NoteState.js - Corrected Version

```javascript
import { useState } from "react";
import NoteContext from "./NoteContext";

const NoteState = (props) => {
  const host = "https://notes-application-api-pi.vercel.app";
  const notesInitial = [];
  const [notes, setNotes] = useState(notesInitial);

  // GET ALL NOTES
  const getNotes = async () => {
    try {
      const response = await fetch(`${host}/api/notes/fetchall`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          "jwtData": localStorage.getItem('jwtData')
        }
      });
      const hello = await response.json();
      setNotes(hello);
    } catch (error) {
      console.error("Error fetching notes:", error);
    }
  };

  // ADD NEW NOTE - THIS IS THE KEY FIX
  const addNote = async (title, description, status, priority) => {
    try {
      const response = await fetch(`${host}/api/notes/addnote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          "jwtData": localStorage.getItem('jwtData')
        },
        body: JSON.stringify({ title, description, status, priority })
      });

      if (!response.ok) {
        throw new Error('Failed to add note');
      }

      const note = await response.json();
      // FIX: Update state immediately with the new note
      setNotes([...notes, note]);
      
      // Also refetch to ensure sync
      await getNotes();
    } catch (error) {
      console.error("Error adding note:", error);
    }
  };

  // DELETE NOTE
  const deleteNote = async (id) => {
    try {
      const response = await fetch(`${host}/api/notes/deletenote/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          "jwtData": localStorage.getItem('jwtData')
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete note');
      }

      const newNotes = notes.filter((note) => note._id !== id);
      setNotes(newNotes);
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // EDIT NOTE - FIX: Properly handle response
  const editNote = async (id, title, description, status, priority) => {
    try {
      const response = await fetch(`${host}/api/notes/updatenote/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          "jwtData": localStorage.getItem('jwtData')
        },
        body: JSON.stringify({ id, title, description, status, priority })
      });

      if (!response.ok) {
        throw new Error('Failed to update note');
      }

      const updatedData = await response.json();
      
      // Update the specific note in state
      const updatedNotes = notes.map((note) => {
        if (note._id === id) {
          return {
            ...note,
            title,
            description,
            status,
            priority
          };
        }
        return note;
      });
      
      setNotes(updatedNotes);
    } catch (error) {
      console.error("Error editing note:", error);
    }
  };

  return (
    <NoteContext.Provider
      value={{
        notes,
        getNotes,
        addNote,
        deleteNote,
        editNote
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};

export default NoteState;
```

## Key Fixes Made:

1. **addNote Function**: Now properly updates state with `setNotes([...notes, note])` and refetches to ensure data sync
2. **Error Handling**: Added try-catch blocks for all API calls
3. **Response Validation**: Check if response is ok before processing
4. **editNote Function**: Maps through notes and updates the specific one instead of reassigning entire state
5. **Consistent API Host**: Uses the vercel API URL consistently