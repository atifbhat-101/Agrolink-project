import React, { useContext, useEffect, useRef } from 'react';
import { NotificationContext } from '../../context/NotificationContext';
import { BellRing, CheckSquare } from 'lucide-react';

const NotificationDropdown = ({ onClose }) => {
  const { notifications, markAllAsRead } = useContext(NotificationContext);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [onClose]);

  return (
    <div ref={dropdownRef} className="absolute right-0 mt-2 w-80 sm:w-96 max-h-[480px] overflow-y-auto rounded-xl border border-neutral-200 bg-white shadow-xl z-50 flex flex-col">
      <div className="flex items-center justify-between border-b border-neutral-100 p-4">
        <div className="flex items-center gap-2">
          <BellRing className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-bold text-neutral-800">Alert Center</h3>
        </div>
        <button 
          onClick={() => { markAllAsRead(); onClose(); }}
          className="flex items-center gap-1 text-xs font-semibold text-emerald-600 hover:text-emerald-700 transition"
        >
          <CheckSquare className="h-3.5 w-3.5" />
          Mark read
        </button>
      </div>

      <div className="divide-y divide-neutral-50 overflow-y-auto flex-1">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-xs text-neutral-400 font-medium">
            No notification records discovered.
          </div>
        ) : (
          notifications.map((n) => (
            <div key={n._id} className={`p-4 text-left transition ${n.isRead ? 'bg-white' : 'bg-emerald-50/50'}`}>
              <p className="text-xs font-bold text-neutral-800 mb-0.5">{n.title}</p>
              <p className="text-xs text-neutral-600 leading-relaxed">{n.message}</p>
              <span className="text-[10px] text-neutral-400 mt-1 block">
                {new Date(n.createdAt).toLocaleDateString()}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default NotificationDropdown;
