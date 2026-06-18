import React, { useContext, useState } from 'react';
import { Menu, Bell, LogOut, User as UserIcon } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';
import { NotificationContext } from '../../context/NotificationContext';
import NotificationDropdown from './NotificationDropdown';
import { Link } from 'react-router-dom';

const Header = ({ onMenuClick }) => {
  const { user, logout } = useContext(AuthContext);
  const { unreadCount } = useContext(NotificationContext);
  const [showNotificationMenu, setShowNotificationMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-neutral-200 bg-white px-4 shadow-sm md:px-6">
      <button 
        className="text-neutral-500 hover:text-neutral-700 lg:hidden"
        onClick={onMenuClick}
      >
        <Menu className="h-6 w-6" />
      </button>

      <div className="ml-4 flex lg:ml-0">
        <Link to="/dashboard" className="text-xl font-bold tracking-tight text-emerald-600">
          Agro<span className="text-neutral-800">Link</span>
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <div className="relative">
          <button 
            onClick={() => setShowNotificationMenu(!showNotificationMenu)}
            className="relative p-1.5 text-neutral-500 hover:bg-neutral-100 hover:text-neutral-700 rounded-full transition"
          >
            <Bell className="h-6 w-6" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>
          {showNotificationMenu && (
            <NotificationDropdown onClose={() => setShowNotificationMenu(false)} />
          )}
        </div>

        <div className="flex items-center gap-3 border-l border-neutral-200 pl-4">
          <Link to="/profile" className="flex items-center gap-2 group">
            {user?.profileImage ? (
              <img src={user.profileImage} alt={user.name} className="h-8 w-8 rounded-full object-cover border border-neutral-200" />
            ) : (
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                <UserIcon className="h-4 w-4" />
              </div>
            )}
            <div className="hidden text-left md:block">
              <p className="text-sm font-medium text-neutral-700 group-hover:text-emerald-600 transition">{user?.name}</p>
              <p className="text-xs uppercase tracking-wider text-neutral-400 font-bold">{user?.role}</p>
            </div>
          </Link>
          <button 
            onClick={logout}
            className="p-1.5 text-neutral-400 hover:text-red-600 rounded-full hover:bg-red-50 transition"
            title="Log Out"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
