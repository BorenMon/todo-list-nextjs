import { useState } from 'react';

const ListItem = ({ list, handleDelete, handleEdit, handleComplete }) => {
  const [isShown, setIsShown] = useState(false);

  return (
    <li
      onMouseEnter={() => setIsShown(true)}
      onMouseLeave={() => setIsShown(false)}
      className="h-12 bg-slate-100 rounded flex cursor-pointer items-center"
    >
      <span className={`flex flex-1 items-center px-4 truncate ${list.isCompleted ? 'line-through' : ''}`}>
        {list.todo}
      </span>
      {isShown && (
        <>
          <button onClick={() => handleComplete(list._id, list.isCompleted)} className="w-8 h-8 text-slate-500 active:scale-95 hover:text-slate-600">
            <i className={`${list.isCompleted ? 'fa-solid text-indigo-500 active:scale-95 hover:text-indigo-600' : 'fa-regular'} fa-circle-check`}></i>
          </button>
          <button onClick={() => handleEdit(list._id, list.todo)} className="w-8 h-8 text-green-500 active:scale-95 hover:text-green-600">
            <i className="fa-solid fa-pen"></i>
          </button>
          <button className="w-8 h-8 text-red-500 active:scale-95 hover:text-red-600" onClick={() => handleDelete(list._id)}>
            <i className="fa-solid fa-trash"></i>
          </button>
        </>
      )}
    </li>
  );
};

export default ListItem;
