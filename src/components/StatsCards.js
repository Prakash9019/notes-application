import React from 'react';
import { FaCheckCircle, FaClock, FaTasks, FaFire } from 'react-icons/fa';

const StatsCards = ({ tasks }) => {
  const stats = [
    {
      label: 'Total Tasks',
      value: tasks.length,
      icon: <FaTasks className="w-7 h-7" />,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50 dark:bg-blue-500/15',
      textColor: 'text-blue-600 dark:text-blue-400',
      borderColor: 'border-blue-200 dark:border-blue-500/30',
    },
    {
      label: 'In Progress',
      value: tasks.filter(t => t.status === 'inprogress').length,
      icon: <FaFire className="w-7 h-7" />,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50 dark:bg-orange-500/15',
      textColor: 'text-orange-600 dark:text-orange-400',
      borderColor: 'border-orange-200 dark:border-orange-500/30',
    },
    {
      label: 'Pending',
      value: tasks.filter(t => t.status === 'pending').length,
      icon: <FaClock className="w-7 h-7" />,
      color: 'from-yellow-500 to-yellow-600',
      bgColor: 'bg-yellow-50 dark:bg-yellow-500/15',
      textColor: 'text-yellow-600 dark:text-yellow-400',
      borderColor: 'border-yellow-200 dark:border-yellow-500/30',
    },
    {
      label: 'Completed',
      value: tasks.filter(t => t.status === 'completed').length,
      icon: <FaCheckCircle className="w-7 h-7" />,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50 dark:bg-green-500/15',
      textColor: 'text-green-600 dark:text-green-400',
      borderColor: 'border-green-200 dark:border-green-500/30',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <div
          key={index}
          className="group bg-surface-light dark:bg-surface-dark rounded-xl p-6 shadow-card hover:shadow-card-hover transition-all duration-300 hover:scale-105 hover:-translate-y-1 cursor-default border border-transparent hover:border-gray-100 dark:hover:border-gray-800"
        >
          {/* Card Content */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                {stat.label}
              </p>
              <p className="text-3xl md:text-4xl font-bold text-text-light dark:text-white group-hover:text-primary-500 transition-colors duration-300">
                {stat.value}
              </p>
            </div>
          </div>

          {/* Icon Badge */}
          <div className={`inline-flex items-center justify-center p-3 rounded-xl ${stat.bgColor} transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6`}>
            <div className={stat.textColor}>{stat.icon}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;
