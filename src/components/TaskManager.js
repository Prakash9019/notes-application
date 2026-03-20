
import React, { useContext, useEffect, useState, useRef } from 'react';
import noteContext from "../NoteContext";
import { useDispatch, useSelector } from 'react-redux';
import { getNotes } from "../slices/todoslices";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import TaskCard from './TaskCard';
import DropArea from './DropArea';
import './TaskManager.css';

const TaskManager = () => {
  const context = useContext(noteContext);
  let navigate = useNavigate();
  const { editNote } = context;
  const dispatch = useDispatch();
  const notesData = useSelector(state => state.notes);

  useEffect(() => {
    if (localStorage.getItem('jwtData')) {
      dispatch(getNotes());
    } else {
      navigate("/login");
    }
  }, [dispatch, navigate, editNote]);

  const ref = useRef(null);
  const refClose = useRef(null);
  
  const [note1, setNote1] = useState({
    id: " ",
    title: "",
    edescription: "",
    estatus: "",
    epriority: ""
  });

  const [searchInput, setSearchInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('kanban');
  
  // AI Features State
  const [aiLoading, setAiLoading] = useState(false);
  const [showAiPanel, setShowAiPanel] = useState(false);
  const [aiInsights, setAiInsights] = useState(null);

  const updateNote = (currentNote) => {
    ref.current.click();
    setNote1({
      id: currentNote._id,
      title: currentNote.title,
      edescription: currentNote.description,
      estatus: currentNote.status,
      epriority: currentNote.priority
    });
  };

  const handleClick = (e) => {
    e.preventDefault();
    editNote(
      note1.id,
      note1.title,
      note1.edescription,
      note1.estatus,
      note1.epriority
    );
    refClose.current.click();
    toast("Note Updated Successfully!");
  };

  const onChange = (e) => {
    setNote1({ ...note1, [e.target.name]: e.target.value });
  };

  const [active, setactive] = useState(JSON.stringify({
    id: " ",
    title: "",
    description: "",
    status: "",
    priority: ""
  }));

  const onDrop = (i, title, s, pos) => {
    if (active === null || active === undefined) return;
    const newNote = JSON.parse(active);
    editNote(newNote._id, newNote.title, newNote.description, s, newNote.priority);
  };

  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const handlePriorityChange = (e) => {
    setSelectedPriority(e.target.value);
  };

  // Fetch AI Insights
  const fetchAiInsights = async () => {
    setAiLoading(true);
    try {
      const response = await fetch('YOUR_API_BASE/api/notes/productivity-insights', {
        headers: {
          'auth-token': localStorage.getItem('jwtData')
        }
      });
      const data = await response.json();
      setAiInsights(data);
      setShowAiPanel(true);
      toast("AI Insights Generated!");
    } catch (error) {
      console.error('Error fetching insights:', error);
      toast("Failed to generate insights");
    } finally {
      setAiLoading(false);
    }
  };

  // Filter logic
  const filteredNotes = notesData.filter((note) => {
    const titleMatches = note.title.toLowerCase().includes(searchInput.toLowerCase());
    const priorityMatches = !selectedPriority || 
      note.priority.toLowerCase() === selectedPriority.toLowerCase();
    
    const date1 = new Date(note.date);
    const date2 = new Date(startDate);
    const date3 = new Date(endDate);
    const dateInRange = (!startDate || date1 >= date2) && (!endDate || date1 <= date3);

    return titleMatches && priorityMatches && dateInRange;
  });

  // Sort logic
  const sortedNotes = [...filteredNotes].sort((a, b) => {
    switch (sortBy) {
      case 'priority':
        const priorityMap = { p0: 3, p1: 2, p2: 1 };
        return (priorityMap[b.priority] || 0) - (priorityMap[a.priority] || 0);
      case 'name':
        return a.title.localeCompare(b.title);
      case 'status':
        return a.status.localeCompare(b.status);
      default:
        return new Date(b.date) - new Date(a.date);
    }
  });

  // Group notes by status
  const groupedByStatus = {
    pending: sortedNotes.filter(n => n.status === 'pending'),
    inProgress: sortedNotes.filter(n => n.status === 'inProgress'),
    completed: sortedNotes.filter(n => n.status === 'completed'),
    deployed: sortedNotes.filter(n => n.status === 'deployed'),
  };

  return (
    <div className="task-manager">
      {/* Toolbar */}
      <div className="toolbar">
        <div className="toolbar-left">
          <Input
            icon="search"
            placeholder="Search tasks..."
            value={searchInput}
            onChange={handleSearchChange}
            className="search-input"
          />
        </div>

        <div className="toolbar-center">
          <select
            value={selectedPriority}
            onChange={handlePriorityChange}
            className="filter-select"
          >
            <option value="">All Priorities</option>
            <option value="p0">Critical (p0)</option>
            <option value="p1">High (p1)</option>
            <option value="p2">Normal (p2)</option>
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="filter-select"
          >
            <option value="date">Sort by Date</option>
            <option value="priority">Sort by Priority</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>

          <div className="date-range">
            <DatePicker
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              placeholderText="Start Date"
              className="date-picker"
            />
            <DatePicker
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              placeholderText="End Date"
              className="date-picker"
            />
          </div>
        </div>

        <div className="toolbar-right">
          <div className="view-toggle">
            <button
              className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
              onClick={() => setViewMode('kanban')}
            >
              📊 Kanban
            </button>
            <button
              className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
          </div>

          <button
            className="ai-insights-btn"
            onClick={fetchAiInsights}
            disabled={aiLoading}
          >
            {aiLoading ? <span className='custom-spinner'></span> : '🤖 AI Insights'}
          </button>
        </div>
      </div>

      {/* AI Insights Panel */}
      {showAiPanel && aiInsights && (
        <div className="ai-insights-panel">
          <div className="panel-header">
            <h3>🤖 AI Productivity Insights</h3>
            <button onClick={() => setShowAiPanel(false)} className="close-btn">✕</button>
          </div>
          <div className="panel-content">
            <div className="metrics-grid">
              <div className="metric-card">
                <div className="metric-label">Total Tasks</div>
                <div className="metric-value">{aiInsights.metrics.totalTasks}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Completion Rate</div>
                <div className="metric-value">{aiInsights.metrics.completionRate}%</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">In Progress</div>
                <div className="metric-value">{aiInsights.metrics.inProgressTasks}</div>
              </div>
              <div className="metric-card">
                <div className="metric-label">Pending</div>
                <div className="metric-value">{aiInsights.metrics.pendingTasks}</div>
              </div>
            </div>
            <div className="recommendations">
              <h4>📋 Recommendations:</h4>
              <p>{aiInsights.recommendations}</p>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          <DropArea
            status="pending"
            onDrop={onDrop}
            notes={groupedByStatus.pending}
            onUpdateNote={updateNote}
          />
          <DropArea
            status="inProgress"
            onDrop={onDrop}
            notes={groupedByStatus.inProgress}
            onUpdateNote={updateNote}
          />
          <DropArea
            status="completed"
            onDrop={onDrop}
            notes={groupedByStatus.completed}
            onUpdateNote={updateNote}
          />
          <DropArea
            status="deployed"
            onDrop={onDrop}
            notes={groupedByStatus.deployed}
            onUpdateNote={updateNote}
          />
        </div>
      ) : (
        <div className="list-view">
          {sortedNotes.map((note) => (
            <TaskCard
              key={note._id}
              note={note}
              onUpdate={updateNote}
            />
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <button ref={ref} type="button" className="btn btn-primary hidden" data-bs-toggle="modal" data-bs-target="#exampleModal">
        Launch demo modal
      </button>

      <div className="modal fade" id="exampleModal" tabIndex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Edit Note
              </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label htmlFor="etitle" className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    id="etitle"
                    name="title"
                    value={note1.title}
                    onChange={onChange}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="edescription" className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    id="edescription"
                    name="edescription"
                    value={note1.edescription}
                    onChange={onChange}
                    rows="3"
                  ></textarea>
                </div>
                <div className="mb-3">
                  <label htmlFor="estatus" className="form-label">Status</label>
                  <select
                    className="form-control"
                    id="estatus"
                    name="estatus"
                    value={note1.estatus}
                    onChange={onChange}
                  >
                    <option value="pending">Pending</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="deployed">Deployed</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label htmlFor="epriority" className="form-label">Priority</label>
                  <select
                    className="form-control"
                    id="epriority"
                    name="epriority"
                    value={note1.epriority}
                    onChange={onChange}
                  >
                    <option value="p0">Critical (p0)</option>
                    <option value="p1">High (p1)</option>
                    <option value="p2">Normal (p2)</option>
                  </select>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Close
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleClick}
                ref={refClose}
                data-bs-dismiss="modal"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskManager;