import React from 'react';
import { FaTimes } from 'react-icons/fa';

const FilterChips = ({
  selectedPriority,
  setSelectedPriority,
  selectedStatus,
  setSelectedStatus,
}) => {
  const priorityOptions = [
    { value: '', label: 'All Priorities' },
    { value: 'p0', label: 'High' },
    { value: 'p1', label: 'Medium' },
    { value: 'p2', label: 'Low' },
  ];

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: 'pending', label: 'Pending' },
    { value: 'inprogress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'deployed', label: 'Deployed' },
  ];

  const getPriorityColor = (priority, isActive) => {
    if (isActive) {
      switch (priority) {
        case 'p0':
          return 'bg-red-500 text-white shadow-soft';
        case 'p1':
          return 'bg-amber-500 text-white shadow-soft';
        case 'p2':
          return 'bg-green-500 text-white shadow-soft';
        default:
          return 'bg-primary-500 text-white shadow-soft';
      }
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700';
  };

  const getStatusColor = (status, isActive) => {
    if (isActive) {
      switch (status) {
        case 'pending':
          return 'bg-blue-500 text-white shadow-soft';
        case 'inprogress':
          return 'bg-purple-500 text-white shadow-soft';
        case 'completed':
          return 'bg-green-500 text-white shadow-soft';
        case 'deployed':
          return 'bg-indigo-500 text-white shadow-soft';
        default:
          return 'bg-primary-500 text-white shadow-soft';
      }
    }
    return 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700';
  };

  return (
    <div className="mb-12 space-y-8">
      {/* Priority Filters */}
      <div>
        <h3 className="text-sm font-semibold text-text-light dark:text-text-dark mb-4 px-1">
          Priority
        </h3>
        <div className="flex flex-wrap gap-3">
          {priorityOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedPriority(option.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedPriority === option.value
                  ? getPriorityColor(option.value, true) + ' scale-105'
                  : getPriorityColor(option.value, false) + ' hover:scale-105'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Status Filters */}
      <div>
        <h3 className="text-sm font-semibold text-text-light dark:text-text-dark mb-4 px-1">
          Status
        </h3>
        <div className="flex flex-wrap gap-3">
          {statusOptions.map(option => (
            <button
              key={option.value}
              onClick={() => setSelectedStatus(option.value)}
              className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer ${
                selectedStatus === option.value
                  ? getStatusColor(option.value, true) + ' scale-105'
                  : getStatusColor(option.value, false) + ' hover:scale-105'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear All Filters Button */}
      {(selectedPriority || selectedStatus) && (
        <button
          onClick={() => {
            setSelectedPriority('');
            setSelectedStatus('');
          }}
          className="flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg transition-all duration-200"
        >
          <FaTimes className="w-4 h-4" /> Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterChips;
