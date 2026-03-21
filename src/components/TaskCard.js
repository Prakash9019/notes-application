import React, { useContext } from 'react'
import noteContext from "../NoteContext"
import { FaTrash, FaEdit, FaFlag, FaCalendarAlt } from 'react-icons/fa'

const TaskCard = (props) => {
  const context = useContext(noteContext);
  const { task, updateNote, setactive } = props;
  const { deleteNote } = context;
  
  const date = new Date(task.date);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  const formattedDate = `${day}-${month}-${year}`;

  const getPriorityColor = (priority, isBg = false) => {
    if (isBg) {
      switch (priority) {
        case 'p0':
          return 'bg-red-50 dark:bg-red-500/15 text-red-600 dark:text-red-400';
        case 'p1':
          return 'bg-amber-50 dark:bg-amber-500/15 text-amber-600 dark:text-amber-400';
        case 'p2':
          return 'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400';
        default:
          return 'bg-gray-50 dark:bg-gray-500/15 text-gray-600 dark:text-gray-400';
      }
    }
    switch (priority) {
      case 'p0':
        return 'text-red-600 dark:text-red-400';
      case 'p1':
        return 'text-amber-600 dark:text-amber-400';
      case 'p2':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-gray-600 dark:text-gray-400';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'p0':
        return 'High';
      case 'p1':
        return 'Medium';
      case 'p2':
        return 'Low';
      default:
        return 'Normal';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-blue-50 dark:bg-blue-500/15 text-blue-600 dark:text-blue-400';
      case 'inprogress':
        return 'bg-purple-50 dark:bg-purple-500/15 text-purple-600 dark:text-purple-400';
      case 'completed':
        return 'bg-green-50 dark:bg-green-500/15 text-green-600 dark:text-green-400';
      case 'deployed':
        return 'bg-indigo-50 dark:bg-indigo-500/15 text-indigo-600 dark:text-indigo-400';
      default:
        return 'bg-gray-50 dark:bg-gray-500/15 text-gray-600 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status) => {
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  return (
    <div
      className=" dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-4 transition-all duration-200 hover:shadow-md cursor-move mb-3"
      draggable
      onDragStart={() => setactive(task)}
      onDragEnd={() => setactive(null)}
    >
      {/* Header with Title and Actions */}
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-snug">
          {task.title}
        </h3>
        <div className="flex items-center gap-1">
          <button
            onClick={() => updateNote(task)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Edit task"
          >
            <FaEdit className="w-3.5 h-3.5 text-gray-500" />
          </button>
          <button
            onClick={() => deleteNote(task._id)}
            className="p-1.5 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            title="Delete task"
          >
            <FaTrash className="w-3.5 h-3.5 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 line-clamp-2">
        {task.description}
      </p>

      {/* Badges Row */}
      <div className="flex items-center justify-between gap-3 mt-3">
        <div className="flex items-center gap-2">
          <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {getPriorityLabel(task.priority)}
          </span>
          <span className="text-xs px-2 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
            {getStatusLabel(task.status)}
          </span>
        </div>
      </div>

      {/* Footer - Date */}
      <div className="flex items-center gap-2 text-[11px] text-gray-400 mt-3">
        <FaCalendarAlt className="w-3 h-3" />
        {formattedDate}
      </div>
    </div>
  );
};

export default TaskCard;
