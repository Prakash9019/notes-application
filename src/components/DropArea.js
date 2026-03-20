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
      className={show ? "drop_area" : "hide_drop"}
    >
      {notes && notes.length > 0 ? (
        notes.map((note) => (
          <TaskCard
            key={note._id}
            task={note}
            updateNote={onUpdateNote}
            setactive={setactive}
          />
        ))
      ) : (
        <p>Drop Here</p>
      )}
    </section>
  );
};

export default DropArea;