import React, { useState } from 'react';
import TaskCard from './TaskCard';

const DropArea = ({ onDrop, notes, onUpdateNote, setactive }) => {
  const [show, setShow] = useState(false);

  return (
    <section
      onDragEnter={() => setShow(true)}
      onDragLeave={() => setShow(false)}
      onDrop={() => {
        onDrop();
        setShow(false);
      }}
      onDragOver={(e) => e.preventDefault()}
      className={`transition-all duration-200 rounded-xl ${show ? 'ring-2 ring-primary-400 bg-primary-50/50 dark:bg-primary-500/10 scale-[1.01]' : ''}`}
    >
      {notes && notes.length > 0 ? (
        <div className="space-y-3">
          {notes.map((note) => (
            <TaskCard
              key={note._id}
              task={note}
              updateNote={onUpdateNote}
              setactive={setactive}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-32 text-gray-400 dark:text-gray-600 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-700">
          <p className="text-center text-sm font-medium">
            {show ? '📥 Drop here' : '✨ No tasks yet'}
          </p>
        </div>
      )}
    </section>
  );
};

export default DropArea;