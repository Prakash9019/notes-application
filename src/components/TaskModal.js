import React, { useEffect, useRef } from 'react';
import { FaTimes, FaFlag } from 'react-icons/fa';

const TaskModal = ({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
  isEditing = false,
}) => {
  const formRef = useRef(null);
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    status: 'pending',
    priority: 'p1',
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        description: initialData.edescription || initialData.description || '',
        status: initialData.estatus || initialData.status || 'pending',
        priority: initialData.epriority || initialData.priority || 'p1',
      });
    } else {
      setFormData({
        title: '',
        description: '',
        status: 'pending',
        priority: 'p1',
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm transition-all duration-300">
      <div className=" dark:bg-gray-900 rounded-2xl shadow-xl w-full max-w-md border border-gray-200 dark:border-gray-800">
        {/* Modal Header */}
        <div className="sticky top-0  dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-6 py-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
            {isEditing ? 'Edit Task' : 'Create Task'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-bg-light dark:hover:bg-bg-dark rounded-lg transition-colors duration-200 group"
          >
            <FaTimes className="w-5 h-5 text-gray-500 group-hover:text-gray-700 dark:group-hover:text-gray-300" />
          </button>
        </div>

        {/* Modal Body */}
        <form ref={formRef} onSubmit={handleSubmit} className="p-8 space-y-6">
          {/* Title Field */}
          <div>
            <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-3">
              Task Title
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="Enter an engaging title..."
              required
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            />
          </div>

          {/* Description Field */}
          <div>
            <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-3">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Add details about your task..."
              required
              rows="5"
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
            />
          </div>

          {/* Priority Field */}
          <div>
            <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-3 flex items-center gap-2">
              <FaFlag className="w-3.5 h-3.5 text-primary-500" /> Priority
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
            >
              <option value="p2">Low Priority</option>
              <option value="p1">Medium Priority</option>
              <option value="p0">High Priority</option>
            </select>
          </div>

          {/* Status Field */}
          <div>
            <label className="block text-sm font-semibold text-text-light dark:text-text-dark mb-3">
              Status
            </label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-bg-light dark:bg-bg-dark border border-gray-200 dark:border-gray-800 rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200"
            >
              <option value="pending">Pending</option>
              <option value="inprogress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="deployed">Deployed</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-800 text-text-light dark:text-text-dark hover:bg-bg-light dark:hover:bg-bg-dark transition-all duration-200 font-medium hover:shadow-soft"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-all duration-200 font-medium hover:shadow-lg hover:scale-105 active:scale-95"
            >
              {isEditing ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
