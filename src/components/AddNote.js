
import React, { useContext, useState, useRef } from 'react';
import noteContext from "../NoteContext";
import { toast } from 'react-toastify';
import './AddNote.css';

const AddNote = () => {
  const context = useContext(noteContext);
  const { addNote } = context;
  
  const [note, setNote] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "p1"
  });

  const [aiLoading, setAiLoading] = useState(false);
  const [showAiOptions, setShowAiOptions] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState({
    tags: [],
    suggestedPriority: null,
    summary: null
  });

  const priorityOptions = [
    { value: 'p0', label: 'Critical (p0)', color: '#FF6B6B' },
    { value: 'p1', label: 'High (p1)', color: '#FFA500' },
    { value: 'p2', label: 'Normal (p2)', color: '#4ECDC4' }
  ];

  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'inProgress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'deployed', label: 'Deployed' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNote({ ...note, [name]: value });
  };

  const handleClick = (e) => {
    e.preventDefault();
    
    if (!note.title.trim() || !note.description.trim()) {
      toast.error("Title and description are required!");
      return;
    }

    addNote(note.title, note.description, note.status, note.priority);
    setNote({ title: "", description: "", status: "pending", priority: "p1" });
    setShowAiOptions(false);
    setAiSuggestions({ tags: [], suggestedPriority: null, summary: null });
    toast.success("Note Added Successfully!");
  };

  // AI Features
  const getSuggestedPriority = async () => {
    if (!note.title || !note.description) {
      toast.warning("Enter title and description first!");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('YOUR_API_BASE/api/ai-notes/suggest-priority', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('jwtData')
        },
        body: JSON.stringify({
          title: note.title,
          description: note.description
        })
      });

      const data = await response.json();
      if (data.priority) {
        setAiSuggestions({ ...aiSuggestions, suggestedPriority: data.priority });
        toast.success("Priority suggested!");
      }
    } catch (error) {
      toast.error("Failed to get priority suggestion");
    } finally {
      setAiLoading(false);
    }
  };

  const getAutoTags = async () => {
    if (!note.title || !note.description) {
      toast.warning("Enter title and description first!");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('YOUR_API_BASE/api/ai-notes/auto-tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('jwtData')
        },
        body: JSON.stringify({
          title: note.title,
          description: note.description
        })
      });

      const data = await response.json();
      if (data.tags) {
        setAiSuggestions({ ...aiSuggestions, tags: data.tags });
        toast.success("Tags generated!");
      }
    } catch (error) {
      toast.error("Failed to generate tags");
    } finally {
      setAiLoading(false);
    }
  };

  const getSummary = async () => {
    if (!note.description) {
      toast.warning("Enter description first!");
      return;
    }

    setAiLoading(true);
    try {
      const response = await fetch('YOUR_API_BASE/api/ai-notes/summarize', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'auth-token': localStorage.getItem('jwtData')
        },
        body: JSON.stringify({
          description: note.description
        })
      });

      const data = await response.json();
      if (data.summary) {
        setAiSuggestions({ ...aiSuggestions, summary: data.summary });
        toast.success("Summary generated!");
      }
    } catch (error) {
      toast.error("Failed to generate summary");
    } finally {
      setAiLoading(false);
    }
  };

  const applyPriority = (priority) => {
    setNote({ ...note, priority });
    toast.success("Priority applied!");
  };

  return (
    <div className="add-note-container">
      <div className="add-note-card">
        <div className="card-header">
          <h2>➕ Create New Task</h2>
          <button
            className="ai-toggle-btn"
            onClick={() => setShowAiOptions(!showAiOptions)}
            title="Toggle AI Assistant"
          >
            {showAiOptions ? '✕' : '🤖'}
          </button>
        </div>

        <form onSubmit={handleClick}>
          <div className="form-group">
            <label htmlFor="title">Task Title *</label>
            <input
              type="text"
              id="title"
              name="title"
              value={note.title}
              onChange={handleChange}
              placeholder="Enter task title..."
              className="form-control"
              maxLength={100}
            />
            <span className="char-count">{note.title.length}/100</span>
          </div>

          <div className="form-group">
            <label htmlFor="description">Description *</label>
            <textarea
              id="description"
              name="description"
              value={note.description}
              onChange={handleChange}
              placeholder="Enter task description..."
              className="form-control textarea"
              rows="4"
              maxLength={500}
            />
            <span className="char-count">{note.description.length}/500</span>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="status">Status</label>
              <select
                id="status"
                name="status"
                value={note.status}
                onChange={handleChange}
                className="form-control select"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="priority">Priority</label>
              <select
                id="priority"
                name="priority"
                value={note.priority}
                onChange={handleChange}
                className="form-control select"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* AI Suggestions Panel */}
          {showAiOptions && (
            <div className="ai-suggestions-panel">
              <div className="ai-panel-header">
                <h3>🤖 AI Assistant</h3>
              </div>

              <div className="ai-buttons-group">
                <button
                  type="button"
                  className="ai-btn"
                  onClick={getAutoTags}
                  disabled={aiLoading}
                >
                  {aiLoading ? <span className='custom-spinner'></span> : '🏷️'} Auto Tags
                </button>
                <button
                  type="button"
                  className="ai-btn"
                  onClick={getSuggestedPriority}
                  disabled={aiLoading}
                >
                  {aiLoading ? <span className='custom-spinner'></span> : '⚡'} Priority Hint
                </button>
                <button
                  type="button"
                  className="ai-btn"
                  onClick={getSummary}
                  disabled={aiLoading}
                >
                  {aiLoading ? <span className='custom-spinner'></span> : '📝'} Summarize
                </button>
              </div>

              {/* Display AI Suggestions */}
              {aiSuggestions.tags.length > 0 && (
                <div className="ai-suggestion-box">
                  <h4>Suggested Tags:</h4>
                  <div className="tags-container">
                    {aiSuggestions.tags.map((tag, idx) => (
                      <span key={idx} className="tag">{tag}</span>
                    ))}
                  </div>
                </div>
              )}

              {aiSuggestions.suggestedPriority && (
                <div className="ai-suggestion-box">
                  <h4>Suggested Priority:</h4>
                  <button
                    type="button"
                    className="priority-suggestion"
                    onClick={() => applyPriority(aiSuggestions.suggestedPriority)}
                  >
                    {priorityOptions.find(p => p.value === aiSuggestions.suggestedPriority)?.label}
                  </button>
                </div>
              )}

              {aiSuggestions.summary && (
                <div className="ai-suggestion-box">
                  <h4>AI Summary:</h4>
                  <p className="summary-text">{aiSuggestions.summary}</p>
                </div>
              )}
            </div>
          )}

          <div className="button-group">
            <button type="submit" className="btn btn-primary">
              ✓ Add Task
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setNote({ title: "", description: "", status: "pending", priority: "p1" })}
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNote;
