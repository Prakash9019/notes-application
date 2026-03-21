import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

const host = "https://notes-application-api-pi.vercel.app";

// ✅ FETCH
export const getNotes = createAsyncThunk('notes/getNotes', async () => {
    console.log('Fetching notes from API...');
  const res = await fetch(`${host}/api/notes/fetchall`, {
    headers: { jwtData: localStorage.getItem('jwtData') }
  });
  console.log('Fetched notes:', res);
  const data= await res.json();
  console.log('Parsed notes data:', data);
  return data;

});

// ✅ ADD
export const addNote = createAsyncThunk('notes/addNote', async (data) => {
  const res = await fetch(`${host}/api/notes/addnote`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      jwtData: localStorage.getItem('jwtData')
    },
    body: JSON.stringify(data)
  });
  return await res.json();
});

// ✅ DELETE
export const deleteNote = createAsyncThunk('notes/deleteNote', async (id) => {
  await fetch(`${host}/api/notes/deletenote/${id}`, {
    method: 'DELETE',
    headers: { jwtData: localStorage.getItem('jwtData') }
  });
  return id;
});

// ✅ EDIT
export const editNote = createAsyncThunk(
  'notes/editNote',
  async ({ id, title, description, status, priority }) => {

    await fetch(`${host}/api/notes/updatenote/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        jwtData: localStorage.getItem('jwtData')
      },
      body: JSON.stringify({ title, description, status, priority })
    });

    // return updated data for UI
    return { id, title, description, status, priority };
  }
);

const noteSlice = createSlice({
  name: 'notes',
  initialState: {
    notes: [],
  },
  reducers: {
    // 🔥 instant UI update (drag drop)
    updateNoteStatus(state, action) {
      const note = state.notes.find(n => n._id === action.payload.id);
      if (note) note.status = action.payload.status;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotes.fulfilled, (state, action) => {
        state.notes = action.payload;
      })
      .addCase(addNote.fulfilled, (state, action) => {
        state.notes.push(action.payload);
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        state.notes = state.notes.filter(n => n._id !== action.payload);
      })
      .addCase(editNote.fulfilled, (state, action) => {
        const note = state.notes.find(n => n._id === action.payload.id);
        if (note) Object.assign(note, action.payload);
      });
  }
});

export const { updateNoteStatus } = noteSlice.actions;
export default noteSlice.reducer;