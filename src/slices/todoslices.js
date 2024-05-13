import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

const host = "http://localhost:5000";

const fetchNotes = async () => {
    const response = await fetch('https://notes-application-api-pi.vercel.app/api/notes/fetchall', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            "jwtData": localStorage.getItem('jwtData')
        }
    });
    const data = await response.json();
    return data;
}

export const getNotes = createAsyncThunk('todo/getNotes', async () => {
    const notes = await fetchNotes();
    console.log("fetching data from the redux "+notes.length);
    return notes;
});

export const todoSlice = createSlice({
    name: 'todo',
    initialState: {
        todos: [{ id: 1, text: "Hello world" }],
        notes: [],
    },
    reducers: {
        addTodo: (state, action) => {
            const todo = {
                id: nanoid(),
                text: action.payload
            }
            state.todos.push(todo)
        },
        removeTodo: (state, action) => {
            state.todos = state.todos.filter((todo) => todo.id !== action.payload)
        },
        updateNoteStatus(state, action) {
            // Find the index of the note you want to update
            const indexToUpdate = state.findIndex((note) => note.id === action.payload.id);
      
            if (indexToUpdate !== -1) {
              // Create a new state with the updated note status
              state[indexToUpdate].status = action.payload.status;
            }
          },
          setNotes(state, action) {
            // Replace the existing notesData with the updated array
            return action.payload;
          },
    },
    extraReducers: (builder) => {
        builder.addCase(getNotes.fulfilled, (state, action) => {
            while (state.notes.length) {
                state.notes.pop();
            }
            
            state.notes.push(...action.payload);
            console.log("length of state note"+state.notes.length);
        });

    }
});

export const { addTodo, removeTodo,updateNoteStatus,setNotes } = todoSlice.actions;
export default todoSlice.reducer;
