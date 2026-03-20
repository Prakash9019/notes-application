# Jira-like UI Redesign Implementation

## Overview
This guide will transform your task manager into a Jira-like interface with improved layout, sidebar navigation, and better visual hierarchy.

## Key Features of Jira-like UI:
1. **Left Sidebar** - Projects, favorites, filters
2. **Top Navigation Bar** - Search, notifications, user profile
3. **Main Content Area** - Kanban board, list view
4. **Improved Color Scheme** - Professional dark/light theme
5. **Better Typography** - Clearer hierarchy
6. **Card Design** - Enhanced task cards with metadata

## Step 1: Updated Dashboard.js (Jira-like Layout)

```javascript
import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import noteContext from "../NoteContext";
import { useDispatch, useSelector } from 'react-redux';
import { getNotes } from "../slices/todoslices";
import { FaPlus, FaHome, FaStar, FaFilter, FaCog, FaUser, FaBell } from 'react-icons/fa';
import { toast } from 'react-toastify';
import TaskCard from './TaskCard';
import DropArea from './DropArea';
import './Dashboard.css';

const Dashboard = () => {
  const context = useContext(noteContext);
  const navigate = useNavigate();
  const { addNote, editNote, deleteNote } = context;
  const dispatch = useDispatch();
  const notesData = useSelector(state => state.notes);

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    status: "pending",
    priority: "p1"
  });

  // Modal refs
  const ref = useRef(null);
  const refClose = useRef(null);
  const [editTask, setEditTask] = useState({
    id: "",
    title: "",
    edescription: "",
    estatus: "",
    epriority: ""
  });

  // Filters
  const [searchInput, setSearchInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('kanban'); // kanban or list

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('jwtData');
    if (!token) {
      toast.error("Please login to access dashboard");
      navigate("/login");
      return;
    }
    dispatch(getNotes());
  }, [dispatch, navigate]);

  // Handle add task
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

  // Filter and sort
  const filteredNotes = notesData.filter((note) => {
    const titleMatches = note.title.toLowerCase().includes(searchInput.toLowerCase());
    const priorityMatches = !selectedPriority || note.priority.toLowerCase() === selectedPriority.toLowerCase();
    const statusMatches = !selectedStatus || note.status.toLowerCase() === selectedStatus.toLowerCase();
    return titleMatches && priorityMatches && statusMatches;
  });

  const groupedByStatus = {
    pending: filteredNotes.filter(n => n.status === 'pending'),
    inProgress: filteredNotes.filter(n => n.status === 'inProgress'),
    completed: filteredNotes.filter(n => n.status === 'completed'),
    deployed: filteredNotes.filter(n => n.status === 'deployed'),
  };

  return (
    <div className="jira-dashboard">
      {/* Top Navigation Bar */}
      <nav className="top-navbar">
        <div className="navbar-left">
          <button 
            className="menu-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            ☰
          </button>
          <div className="brand">
            <span className="logo-icon">📋</span>
            <span className="logo-text">TaskFlow</span>
          </div>
        </div>

        <div className="navbar-center">
          <div className="search-wrapper">
            <input
              type="text"
              placeholder="Search tasks..."
              className="search-input"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
            />
          </div>
        </div>

        <div className="navbar-right">
          <button className="nav-icon-btn">
            <FaBell />
          </button>
          <button className="nav-icon-btn">
            <FaUser />
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        {/* Left Sidebar */}
        <aside className={`left-sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
          <div className="sidebar-content">
            <div className="sidebar-section">
              <h3>Projects</h3>
              <div className="project-list">
                <a href="#" className="project-item active">
                  <FaHome className="project-icon" />
                  <span>My Tasks</span>
                </a>
              </div>
            </div>

            <div className="sidebar-section">
              <h3>Filters</h3>
              <div className="filter-list">
                <a href="#" className="filter-item">
                  <FaStar /> Recently viewed
                </a>
                <a href="#" className="filter-item">
                  <FaFilter /> All issues
                </a>
              </div>
            </div>

            <button className="add-filter-btn">
              <FaPlus /> Create filter
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="main-content">
          {/* Toolbar */}
          <div className="toolbar">
            <div className="toolbar-left">
              <h2>My Tasks</h2>
              <span className="task-count">{filteredNotes.length} issues</span>
            </div>

            <div className="toolbar-center">
              <select 
                className="filter-select"
                value={selectedPriority}
                onChange={(e) => setSelectedPriority(e.target.value)}
              >
                <option value="">All Priorities</option>
                <option value="p0">Critical</option>
                <option value="p1">High</option>
                <option value="p2">Normal</option>
              </select>

              <select 
                className="filter-select"
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="deployed">Deployed</option>
              </select>
            </div>

            <div className="toolbar-right">
              <div className="view-toggle">
                <button 
                  className={`view-btn ${viewMode === 'kanban' ? 'active' : ''}`}
                  onClick={() => setViewMode('kanban')}
                >
                  Kanban
                </button>
                <button 
                  className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                  onClick={() => setViewMode('list')}
                >
                  List
                </button>
              </div>

              <button 
                className="btn-add-task"
                onClick={() => setShowAddTask(true)}
              >
                <FaPlus /> Create
              </button>
            </div>
          </div>

          {/* Kanban View */}
          {viewMode === 'kanban' && (
            <div className="kanban-board">
              <DropArea
                status="pending"
                notes={groupedByStatus.pending}
                onDrop={() => onDrop('pending')}
                setactive={setactive}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
              <DropArea
                status="inProgress"
                notes={groupedByStatus.inProgress}
                onDrop={() => onDrop('inProgress')}
                setactive={setactive}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
              <DropArea
                status="completed"
                notes={groupedByStatus.completed}
                onDrop={() => onDrop('completed')}
                setactive={setactive}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
              <DropArea
                status="deployed"
                notes={groupedByStatus.deployed}
                onDrop={() => onDrop('deployed')}
                setactive={setactive}
                updateNote={updateNote}
                deleteNote={deleteNote}
              />
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="list-view">
              <table className="tasks-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Status</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredNotes.map(note => (
                    <tr key={note._id}>
                      <td>{note.title}</td>
                      <td><span className={`status-badge ${note.status}`}>{note.status}</span></td>
                      <td><span className={`priority-badge ${note.priority}`}>{note.priority}</span></td>
                      <td>
                        <button onClick={() => updateNote(note)}>Edit</button>
                        <button onClick={() => deleteNote(note._id)}>Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>

      {/* Add Task Modal */}
      {showAddTask && (
        <div className="modal-overlay" onClick={() => setShowAddTask(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Create Task</h3>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Task Title"
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
              />
              <textarea
                placeholder="Description"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
              />
              <select 
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
              >
                <option value="p0">Critical</option>
                <option value="p1">High</option>
                <option value="p2">Normal</option>
              </select>
              <select 
                value={newTask.status}
                onChange={(e) => setNewTask({...newTask, status: e.target.value})}
              >
                <option value="pending">Pending</option>
                <option value="inProgress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="deployed">Deployed</option>
              </select>
              <button type="submit" className="btn-primary">Create Task</button>
              <button type="button" onClick={() => setShowAddTask(false)}>Cancel</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
```

## Step 2: Updated Dashboard.css (Jira-like Styling)

```css
/* Jira-like Dashboard Styles */

.jira-dashboard {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: var(--color-background);
}

/* Top Navbar */
.top-navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-12) var(--space-24);
  background: white;
  border-bottom: 1px solid var(--color-border);
  box-shadow: var(--shadow-sm);
}

.navbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-16);
}

.menu-toggle {
  background: none;
  border: none;
  font-size: var(--font-size-2xl);
  cursor: pointer;
  color: var(--color-text);
  padding: 0;
}

.brand {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  font-weight: var(--font-weight-bold);
  color: var(--color-primary);
}

.logo-icon {
  font-size: var(--font-size-2xl);
}

.logo-text {
  font-size: var(--font-size-lg);
}

.navbar-center {
  flex: 1;
  max-width: 400px;
  margin: 0 var(--space-24);
}

.search-wrapper {
  position: relative;
}

.search-input {
  width: 100%;
  padding: var(--space-8) var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
}

.navbar-right {
  display: flex;
  gap: var(--space-16);
}

.nav-icon-btn {
  background: none;
  border: none;
  font-size: var(--font-size-lg);
  cursor: pointer;
  color: var(--color-text);
  padding: 0;
}

/* Dashboard Container */
.dashboard-container {
  display: flex;
  flex: 1;
  overflow: hidden;
}

/* Left Sidebar */
.left-sidebar {
  width: 260px;
  background: white;
  border-right: 1px solid var(--color-border);
  overflow-y: auto;
  transition: all 0.3s ease;
}

.left-sidebar.closed {
  width: 0;
  border-right: none;
}

.sidebar-content {
  padding: var(--space-16);
}

.sidebar-section {
  margin-bottom: var(--space-24);
}

.sidebar-section h3 {
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  margin-bottom: var(--space-12);
  letter-spacing: 0.5px;
}

.project-list,
.filter-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-8);
}

.project-item,
.filter-item {
  display: flex;
  align-items: center;
  gap: var(--space-12);
  padding: var(--space-8) var(--space-12);
  border-radius: var(--radius-base);
  color: var(--color-text);
  text-decoration: none;
  transition: all 0.2s ease;
  font-size: var(--font-size-sm);
}

.project-item:hover,
.filter-item:hover {
  background: var(--color-secondary);
}

.project-item.active {
  background: var(--color-bg-1);
  color: var(--color-primary);
  font-weight: var(--font-weight-medium);
}

.project-icon,
.project-item svg,
.filter-item svg {
  font-size: var(--font-size-base);
}

.add-filter-btn {
  width: 100%;
  padding: var(--space-8) var(--space-12);
  background: var(--color-secondary);
  border: 1px dashed var(--color-primary);
  border-radius: var(--radius-base);
  color: var(--color-primary);
  cursor: pointer;
  font-size: var(--font-size-sm);
  font-weight: var(--font-weight-medium);
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-8);
  transition: all 0.2s ease;
}

.add-filter-btn:hover {
  background: var(--color-bg-1);
}

/* Main Content */
.main-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

/* Toolbar */
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-16) var(--space-24);
  background: white;
  border-bottom: 1px solid var(--color-border);
}

.toolbar-left {
  display: flex;
  align-items: center;
  gap: var(--space-12);
}

.toolbar-left h2 {
  margin: 0;
  font-size: var(--font-size-xl);
}

.task-count {
  background: var(--color-secondary);
  padding: var(--space-4) var(--space-12);
  border-radius: var(--radius-full);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
}

.toolbar-center {
  display: flex;
  gap: var(--space-12);
}

.filter-select {
  padding: var(--space-8) var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  background: white;
}

.toolbar-right {
  display: flex;
  gap: var(--space-12);
  align-items: center;
}

.view-toggle {
  display: flex;
  gap: 0;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  overflow: hidden;
}

.view-btn {
  padding: var(--space-8) var(--space-16);
  background: white;
  border: none;
  cursor: pointer;
  font-size: var(--font-size-sm);
  transition: all 0.2s ease;
}

.view-btn.active {
  background: var(--color-primary);
  color: white;
}

.btn-add-task {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  padding: var(--space-8) var(--space-16);
  background: var(--color-primary);
  color: white;
  border: none;
  border-radius: var(--radius-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.btn-add-task:hover {
  background: var(--color-primary-hover);
}

/* Kanban Board */
.kanban-board {
  display: flex;
  gap: var(--space-16);
  padding: var(--space-16) var(--space-24);
  overflow-x: auto;
  overflow-y: hidden;
  flex: 1;
}

.kanban-column {
  min-width: 300px;
  background: var(--color-secondary);
  border-radius: var(--radius-base);
  display: flex;
  flex-direction: column;
}

/* List View */
.list-view {
  flex: 1;
  overflow: auto;
  padding: var(--space-16) var(--space-24);
}

.tasks-table {
  width: 100%;
  border-collapse: collapse;
  background: white;
  border-radius: var(--radius-base);
  overflow: hidden;
  box-shadow: var(--shadow-sm);
}

.tasks-table thead {
  background: var(--color-secondary);
}

.tasks-table th {
  padding: var(--space-12) var(--space-16);
  text-align: left;
  font-weight: var(--font-weight-semibold);
  font-size: var(--font-size-sm);
  color: var(--color-text-secondary);
  text-transform: uppercase;
}

.tasks-table td {
  padding: var(--space-12) var(--space-16);
  border-top: 1px solid var(--color-border);
  font-size: var(--font-size-sm);
}

.status-badge,
.priority-badge {
  display: inline-block;
  padding: var(--space-4) var(--space-12);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: var(--font-weight-medium);
  text-transform: capitalize;
}

.status-badge.pending {
  background: rgba(255, 152, 0, 0.15);
  color: #FF9800;
}

.status-badge.inProgress {
  background: rgba(33, 150, 243, 0.15);
  color: #2196F3;
}

.status-badge.completed {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
}

.status-badge.deployed {
  background: rgba(33, 128, 141, 0.15);
  color: var(--color-primary);
}

.priority-badge.p0 {
  background: rgba(255, 71, 87, 0.15);
  color: #FF4757;
}

.priority-badge.p1 {
  background: rgba(255, 193, 7, 0.15);
  color: #FFC107;
}

.priority-badge.p2 {
  background: rgba(76, 175, 80, 0.15);
  color: #4CAF50;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  border-radius: var(--radius-lg);
  padding: var(--space-24);
  max-width: 500px;
  width: 90%;
  box-shadow: var(--shadow-lg);
}

.modal-content h3 {
  margin: 0 0 var(--space-16) 0;
  font-size: var(--font-size-xl);
}

.modal-content form {
  display: flex;
  flex-direction: column;
  gap: var(--space-16);
}

.modal-content input,
.modal-content textarea,
.modal-content select {
  padding: var(--space-12);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-base);
  font-size: var(--font-size-sm);
  font-family: inherit;
}

.modal-content textarea {
  resize: vertical;
  min-height: 100px;
}

.modal-content button {
  padding: var(--space-12);
  border: none;
  border-radius: var(--radius-base);
  font-weight: var(--font-weight-medium);
  cursor: pointer;
  transition: all 0.2s ease;
}

.modal-content .btn-primary {
  background: var(--color-primary);
  color: white;
}

.modal-content .btn-primary:hover {
  background: var(--color-primary-hover);
}

.modal-content button[type="button"] {
  background: var(--color-secondary);
  color: var(--color-text);
}

.modal-content button[type="button"]:hover {
  background: var(--color-secondary-hover);
}

/* Responsive */
@media (max-width: 768px) {
  .left-sidebar {
    position: absolute;
    left: 0;
    top: 50px;
    height: calc(100vh - 50px);
    z-index: 100;
  }

  .kanban-board {
    padding: var(--space-12);
    gap: var(--space-12);
  }

  .kanban-column {
    min-width: 280px;
  }

  .toolbar {
    flex-wrap: wrap;
    gap: var(--space-12);
  }

  .toolbar-center,
  .toolbar-right {
    flex-direction: column;
    width: 100%;
  }
}
```

## Step 3: Update Home.js to Navigate to Dashboard

```javascript
// Add this to your Home.js
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("jwtData");

  const handleGetStarted = () => {
    if (isLoggedIn) {
      navigate("/dashboard");
    } else {
      navigate("/signup");
    }
  };

  return (
    // ... your existing Home component
    <button onClick={handleGetStarted} className="cta-button">
      {isLoggedIn ? "Go to Dashboard" : "Get Started"}
    </button>
  );
};
```

## Step 4: Add Updated App.js Routes

Update your App.js to ensure all routes are properly configured:

```javascript
<Route path="/" element={<Home />} />
<Route path="/dashboard" element={<Dashboard />} />
<Route path="/login" element={<Login />} />
<Route path="/signup" element={<Signup />} />
```

## Key Improvements:
✅ **Jira-like Sidebar Navigation**
✅ **Professional Top Navigation Bar**
✅ **Improved Kanban Board Layout**
✅ **List View with Table**
✅ **Better Visual Hierarchy**
✅ **Enhanced Color Scheme**
✅ **Responsive Design**
✅ **Better Task Card Styling**