import React, { useContext, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { getNotes, updateNoteStatus, addNote, editNote } from "../slices/todoslices";
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import TaskCard from './TaskCard';
import DropArea from './DropArea';
import Sidebar from './Sidebar';
import StatsCards from './StatsCards';
import FilterChips from './FilterChips';
import TaskModal from './TaskModal';
import { FaPlus, FaList, FaTh, FaSearch } from 'react-icons/fa';
import './Dashboard.css';

const Dashboard = () => {
  
  // const context = useContext(noteContext);
  const navigate = useNavigate();
  // const { addNote, editNote } = context;
  const dispatch = useDispatch();
const notesData = useSelector(state => {
  // If your Redux store saves it directly as an array (state.notes):
  if (Array.isArray(state.notes)) {
    return state.notes;
  }
  // If your Redux store saves it inside an object (state.notes.notes):
  return state.notes?.notes || [];
});
  useEffect(() => {
    const token = localStorage.getItem('jwtData');
    if (!token) {
      toast.error("Please login to access dashboard");
      navigate("/login");
      return;
    }
    dispatch(getNotes());
    console.log('Notes fetched on dashboard load:', notesData);
  }, [dispatch, navigate]);
  useEffect(() => {
    if (notesData && notesData.length > 0) {
      console.log('Backend data successfully loaded into Redux:', notesData);
    }
  }, [notesData]);

  // State for task modals
  const [showAddTask, setShowAddTask] = useState(false);
  const [showEditTask, setShowEditTask] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  // Filters and search
  const [searchInput, setSearchInput] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [viewMode, setViewMode] = useState('kanban');

  // Drag and drop
  const [active, setactive] = useState(null);

  // Handle add new task - WRAP EXISTING LOGIC
const handleAddTask = (formData) => {
  if (!formData.title.trim() || !formData.description.trim()) {
    toast.error("Title and description are required!");
    return;
  }
  
  // Dispatch the Redux action with a single object payload
  dispatch(addNote({
    title: formData.title,
    description: formData.description,
    status: formData.status,
    priority: formData.priority
  }));
  
  setShowAddTask(false);
  toast.success("Task added successfully!");
};
  // Handle edit task - WRAP EXISTING LOGIC
  const handleEditTask = (currentNote) => {
    setEditingTask(currentNote);
    setShowEditTask(true);
  };

const handleUpdateTask = (formData) => {
  if (!editingTask) return;
  
  // Dispatch the Redux action
  dispatch(editNote({
    id: editingTask._id,
    title: formData.title,
    description: formData.description,
    status: formData.status,
    priority: formData.priority
  }));
  
  setShowEditTask(false);
  setEditingTask(null);
  toast.success("Task updated successfully!");
};

const onDrop = (status) => {
  if (!active) return;

  const draggedNote = active;

  // ✅ Update Redux instantly
  dispatch(updateNoteStatus({
    id: draggedNote._id,
    status
  }));

  // ✅ Backend call
  dispatch(editNote({
    id: active._id,
    title: active.title,
    description: active.description,
    status,
    priority: active.priority
  }));
};

  // Filter and sort logic - PRESERVE EXISTING LOGIC
// Filter and sort logic - PRESERVE EXISTING LOGIC
  const filteredNotes = (notesData || []).filter((note) => {
    const titleMatches = note?.title?.toLowerCase().includes(searchInput.toLowerCase());
    const priorityMatches = !selectedPriority || note?.priority?.toLowerCase() === selectedPriority.toLowerCase();
    const statusMatches = !selectedStatus || note?.status?.toLowerCase() === selectedStatus.toLowerCase();

    return titleMatches && priorityMatches && statusMatches;
  });

  // Group by status - PRESERVE EXISTING LOGIC
  const groupedByStatus = {
    pending: filteredNotes.filter(n => n.status === 'pending'),
    inprogress: filteredNotes.filter(n => n.status === 'inprogress'),
    completed: filteredNotes.filter(n => n.status === 'completed'),
    deployed: filteredNotes.filter(n => n.status === 'deployed'),
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 ml-64 pt-16 pb-12 px-8 lg:px-10 bg-bg-light dark:bg-bg-dark transition-colors duration-300">
        {/* Dashboard Header */}
        <div className="flex items-center justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl lg:text-5xl font-bold text-text-light dark:text-text-dark mb-2">
              My Tasks
            </h1>
            <p className="text-gray-600 dark:text-gray-400 text-base">
              Manage and organize your work efficiently
            </p>
          </div>
          <button
            onClick={() => {
              setEditingTask(null);
              setShowAddTask(true);
            }}
            className="flex items-center gap-2 px-6 py-3.5 bg-primary-500 hover:bg-primary-600 text-white rounded-xl font-medium transition-all duration-200 hover:shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            <FaPlus className="w-4 h-4" /> New Task
          </button>
        </div>

        {/* Stats Cards */}
        <StatsCards tasks={notesData || []} />

        {/* Search Bar */}
        <div className="mb-12">
          <div className="flex items-center gap-3 bg-surface-light dark:bg-surface-dark px-5 py-4 rounded-xl shadow-card border border-transparent hover:border-gray-100 dark:hover:border-gray-800 transition-all duration-300">
            <FaSearch className="text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search tasks by title..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="flex-1 bg-transparent outline-none text-text-light dark:text-text-dark placeholder-gray-400 dark:placeholder-gray-600 text-base"
            />
          </div>
        </div>

        {/* Filters */}
        <FilterChips
          selectedPriority={selectedPriority}
          setSelectedPriority={setSelectedPriority}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
        />

        <div className="flex items-center mb-8">
          <div className="flex p-1 rounded-xl bg-gray-100 dark:bg-gray-800">
            <button
              onClick={() => setViewMode('kanban')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                viewMode === 'kanban'
                  ? ' dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <FaTh className="w-4 h-4" />
              Kanban
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                viewMode === 'list'
                  ? ' dark:bg-gray-900 shadow-sm text-gray-900 dark:text-white'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              <FaList className="w-4 h-4" />
              List
            </button>
          </div>
        </div>

        {/* Content */}
        {viewMode === 'kanban' ? (
          // Kanban Board View
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { key: 'pending', label: 'Pending', icon: '📋', color: 'blue' },
              { key: 'inprogress', label: 'In Progress', icon: '🔄', color: 'purple' },
              { key: 'completed', label: 'Completed', icon: '✅', color: 'green' },
              { key: 'deployed', label: 'Deployed', icon: '🚀', color: 'indigo' },
            ].map(column => (
              <div
                key={column.key}
                className=" dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 flex flex-col"
              >
                {/* Column Header */}
                <div className="px-5 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{column.icon}</span>
                    <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                      {column.label}
                    </h3>
                  </div>

                  <span className="text-xs font-medium px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                    {groupedByStatus[column.key].length}
                  </span>
                </div>

                {/* Drop Area */}
                <div className="flex-1 p-5 overflow-y-auto">
                  <DropArea
                    onDrop={() => onDrop(column.key)}
                    notes={groupedByStatus[column.key]}
                    onUpdateNote={handleEditTask}
                    setactive={setactive}
                  />
                </div>
              </div>
            ))}
          </div>
        ) : (
          // List View
          <div>
            {filteredNotes.length > 0 ? (
              <div className="space-y-3">
                {filteredNotes.map(task => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    updateNote={handleEditTask}
                    setactive={setactive}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-24 bg-surface-light dark:bg-surface-dark rounded-xl">
                <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">📭 No tasks found</p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters or create a new task</p>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Add Task Modal */}
      <TaskModal
        isOpen={showAddTask && !editingTask}
        onClose={() => setShowAddTask(false)}
        onSubmit={handleAddTask}
        isEditing={false}
      />

      {/* Edit Task Modal */}
      <TaskModal
        isOpen={showEditTask && editingTask !== null}
        onClose={() => {
          setShowEditTask(false);
          setEditingTask(null);
        }}
        onSubmit={handleUpdateTask}
        initialData={editingTask}
        isEditing={true}
      />
    </div>
  );
};

export default Dashboard;