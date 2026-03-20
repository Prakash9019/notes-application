import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import noteContext from "../NoteContext";
import { useDispatch, useSelector } from 'react-redux';
import { getNotes } from "../slices/todoslices";
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Input } from 'semantic-ui-react';
import { toast } from 'react-toastify';
import TaskCard from './TaskCard';
import DropArea from './DropArea';
import './Dashboard.css';

const Dashboard = () => {
  const context = useContext(noteContext);
  const navigate = useNavigate();
  const { addNote, editNote } = context;
  const dispatch = useDispatch();
  const notesData = useSelector(state => state.notes);
  console.log(notesData);
  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('jwtData');
    if (!token) {
      toast.error("Please login to access dashboard");
      navigate("/login");
      return;
    }
    dispatch(getNotes());
  }, [dispatch, navigate]);

  // State for add task modal
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "p1"
  });

  // State for edit task
  const ref = useRef(null);
  const refClose = useRef(null);
  const [editTask, setEditTask] = useState({
    id: "",
    title: "",
    edescription: "",
    estatus: "",
    epriority: ""
  });

  // Filters and search
  const [searchInput, setSearchInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [sortBy, setSortBy] = useState('date');
  const [viewMode, setViewMode] = useState('kanban');

  // Handle add new task
  const handleAddTask = (e) => {
    e.preventDefault();
    if (!newTask.title.trim() || !newTask.description.trim()) {
      toast.error("Title and description are required!");
      return;
    }
    
    addNote(newTask.title, newTask.description, newTask.status, newTask.priority);
    setNewTask({ title: "", description: "", status: "pending", priority: "p1" });
    setShowAddTask(false);
    toast.success("Task added successfully!");
  };

  // Handle edit task
  const updateNote = (currentNote) => {
    ref.current.click();
    setEditTask({
      id: currentNote._id,
      title: currentNote.title,
      edescription: currentNote.description,
      estatus: currentNote.status,
      epriority: currentNote.priority
    });
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();
    editNote(editTask.id, editTask.title, editTask.edescription, editTask.estatus, editTask.epriority);
    refClose.current.click();
    toast.success("Task updated successfully!");
  };

  // Drag and drop
  const [active, setactive] = useState(null);

  const onDrop = (status) => {
    if (active === null || active === undefined) return;
    const draggedNote = JSON.parse(active);
    editNote(draggedNote._id, draggedNote.title, draggedNote.description, status, draggedNote.priority);
  };
 
  // Filter and sort logic
  const filteredNotes = notesData.filter((note) => {
    const titleMatches = note.title.toLowerCase().includes(searchInput.toLowerCase());
    const priorityMatches = !selectedPriority || note.priority.toLowerCase() === selectedPriority.toLowerCase();
    
    const date1 = new Date(note.date);
    const date2 = startDate ? new Date(startDate) : null;
    const date3 = endDate ? new Date(endDate) : null;
    const dateInRange = (!date2 || date1 >= date2) && (!date3 || date1 <= date3);

    return titleMatches && priorityMatches && dateInRange;
  });
 console.log("length of filtered note"+filteredNotes);
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

  const groupedByStatus = {
    pending: sortedNotes.filter(n => n.status === 'pending'),
    inProgress: sortedNotes.filter(n => n.status === 'inProgress'),
    completed: sortedNotes.filter(n => n.status === 'completed'),
    deployed: sortedNotes.filter(n => n.status === 'deployed'),
  };

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">My Dashboard</h1>
          <p className="dashboard-subtitle">Manage your tasks efficiently</p>
        </div>
        <button className="btn btn-primary btn-add-task" onClick={() => setShowAddTask(true)}>
          ➕ Add New Task
        </button>
      </div>

      {/* Toolbar */}
      <div className="toolbar">
        <Input
          icon="search"
          placeholder="Search tasks..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="search-input"
        />

        <select value={selectedPriority} onChange={(e) => setSelectedPriority(e.target.value)} className="filter-select">
          <option value="">All Priorities</option>
          <option value="p0">Critical (p0)</option>
          <option value="p1">High (p1)</option>
          <option value="p2">Normal (p2)</option>
        </select>

        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="filter-select">
          <option value="date">Sort by Date</option>
          <option value="priority">Sort by Priority</option>
          <option value="name">Sort by Name</option>
          <option value="status">Sort by Status</option>
        </select>

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
      </div>

      {/* Task Statistics */}
      <div className="task-stats">
        <div className="stat-card">
          <div className="stat-icon">📋</div>
          <div className="stat-info">
            <span className="stat-number">{notesData.length}</span>
            <span className="stat-label">Total Tasks</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-info">
            <span className="stat-number">{groupedByStatus.pending.length}</span>
            <span className="stat-label">Pending</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🔄</div>
          <div className="stat-info">
            <span className="stat-number">{groupedByStatus.inProgress.length}</span>
            <span className="stat-label">In Progress</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-info">
            <span className="stat-number">{groupedByStatus.completed.length}</span>
            <span className="stat-label">Completed</span>
          </div>
        </div>
      </div>

      {/* Kanban Board / List View */}
      {viewMode === 'kanban' ? (
        <div className="kanban-board">
          {['pending', 'inProgress', 'completed', 'deployed'].map(status => (
            <div key={status} className={`kanban-column column-${status}`}>
              <div className="column-header">
                <h3>{status === 'inProgress' ? 'In Progress' : status.charAt(0).toUpperCase() + status.slice(1)}</h3>
                <span className="task-count">{groupedByStatus[status].length}</span>
              </div>
              <DropArea
                status={status}
                onDrop={() => onDrop(status)}
                notes={groupedByStatus[status]}
                onUpdateNote={updateNote}
                setactive={setactive}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="list-view">
          {sortedNotes.map((note) => (
            <TaskCard
              key={note._id}
              task={note}
              onUpdate={updateNote}
              setactive={setactive}
            />
          ))}
        </div>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add New Task</h2>
              <button className="close-btn" onClick={() => setShowAddTask(false)}>✕</button>
            </div>
            <form onSubmit={handleAddTask}>
              <div className="form-group">
                <label>Title *</label>
                <input
                  type="text"
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description"
                  rows="4"
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Status</label>
                  <select value={newTask.status} onChange={(e) => setNewTask({...newTask, status: e.target.value})}>
                    <option value="pending">Pending</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="deployed">Deployed</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Priority</label>
                  <select value={newTask.priority} onChange={(e) => setNewTask({...newTask, priority: e.target.value})}>
                    <option value="p0">Critical (p0)</option>
                    <option value="p1">High (p1)</option>
                    <option value="p2">Normal (p2)</option>
                  </select>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddTask(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Task Modal */}
      <button ref={ref} type="button" className="hidden" data-bs-toggle="modal" data-bs-target="#editModal">
        Launch modal
      </button>

      <div className="modal fade" id="editModal" tabIndex="-1">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Edit Task</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              <form>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={editTask.title}
                    onChange={(e) => setEditTask({...editTask, title: e.target.value})}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <textarea
                    className="form-control"
                    value={editTask.edescription}
                    onChange={(e) => setEditTask({...editTask, edescription: e.target.value})}
                    rows="3"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Status</label>
                  <select
                    className="form-control"
                    value={editTask.estatus}
                    onChange={(e) => setEditTask({...editTask, estatus: e.target.value})}
                  >
                    <option value="pending">Pending</option>
                    <option value="inProgress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="deployed">Deployed</option>
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-control"
                    value={editTask.epriority}
                    onChange={(e) => setEditTask({...editTask, epriority: e.target.value})}
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
                onClick={handleEditSubmit}
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

export default Dashboard;