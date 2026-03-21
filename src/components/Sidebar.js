import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FaTasks, FaClock, FaCheckCircle, FaFire } from 'react-icons/fa';

const Sidebar = () => {
  const location = useLocation();
  const [expandedMenus, setExpandedMenus] = useState({});

  const isActive = (path) => location.pathname === path;

  const toggleMenu = (menu) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menu]: !prev[menu]
    }));
  };

  const menuItems = [
    {
      id: 'overview',
      label: 'Overview',
      icon: <FaTasks className="w-5 h-5" />,
      path: '/dashboard',
      badge: '',
    },
    {
      id: 'active',
      label: 'Active Tasks',
      icon: <FaFire className="w-5 h-5" />,
      path: '/dashboard?filter=active',
      badge: '',
    },
    {
      id: 'pending',
      label: 'Pending',
      icon: <FaClock className="w-5 h-5" />,
      path: '/dashboard?filter=pending',
      badge: '',
    },
    {
      id: 'completed',
      label: 'Completed',
      icon: <FaCheckCircle className="w-5 h-5" />,
      path: '/dashboard?filter=completed',
      badge: '',
    },
  ];

  return (
    <aside className="fixed left-0 top-16 h-[calc(100vh-64px)] w-64 bg-surface-light dark:bg-surface-dark overflow-y-auto transition-colors duration-300 border-r border-transparent">
      <div className="p-6 space-y-8">
        {/* Main Navigation */}
        <div>
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-4 px-2">
            Menu
          </h2>

          {/* Menu Items */}
          <nav className="space-y-1">
            {menuItems.map(item => (
              <Link
                key={item.id}
                to={item.path}
                className={`relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group ${
                  isActive(item.path)
                    ? 'text-primary-600 dark:text-primary-400 font-medium bg-primary-50 dark:bg-primary-500/10'
                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-900/30'
                }`}
              >
                {/* Left indicator bar for active items */}
                {isActive(item.path) && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary-500 dark:bg-primary-400 rounded-r-full"></div>
                )}
                
                <span className={`transition-transform duration-200 ${isActive(item.path) ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {item.icon}
                </span>
                <span className="text-sm font-medium">{item.label}</span>
                
                {item.badge && (
                  <span className="ml-auto px-2 py-1 text-xs font-semibold bg-primary-500 text-white rounded-full">
                    {item.badge}
                  </span>
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Quick Filters Section */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-800">
          <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-500 uppercase tracking-widest mb-4 px-2">
            Quick Filters
          </h3>
          <div className="space-y-2">
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 cursor-pointer transition-colors duration-200 group">
              <div className="w-2.5 h-2.5 rounded-full bg-priority-high group-hover:scale-125 transition-transform duration-200"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-text-light dark:group-hover:text-text-dark transition-colors duration-200">
                High Priority
              </span>
            </div>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 cursor-pointer transition-colors duration-200 group">
              <div className="w-2.5 h-2.5 rounded-full bg-priority-medium group-hover:scale-125 transition-transform duration-200"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-text-light dark:group-hover:text-text-dark transition-colors duration-200">
                Medium Priority
              </span>
            </div>
             {/* <div className="flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-bg-light dark:hover:bg-bg-dark cursor-pointer transition-colors duration-200 group">
              <div className="w-3 h-3 rounded-full bg-priority-low"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-text-light dark:group-hover:text-text-dark transition-colors duration-200">
                Low Priority
              </span>
            </div> */}
            <div className="flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-900/30 cursor-pointer transition-colors duration-200 group">
              <div className="w-2.5 h-2.5 rounded-full bg-priority-low group-hover:scale-125 transition-transform duration-200"></div>
              <span className="text-sm text-gray-600 dark:text-gray-400 group-hover:text-text-light dark:group-hover:text-text-dark transition-colors duration-200">
                Low Priority
              </span>
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
        

