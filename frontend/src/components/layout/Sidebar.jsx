import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { X, LayoutDashboard, ShoppingBag, PlusCircle, MessageSquare, ClipboardList, UserCircle } from 'lucide-react';
import { AuthContext } from '../../context/AuthContext';

const Sidebar = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);

  const navigationItems = [
    { name: 'Dashboard', to: '/dashboard', icon: LayoutDashboard, roles: ['farmer', 'buyer'] },
    { name: 'Browse Crops', to: '/browse', icon: ShoppingBag, roles: ['buyer'] },
    { name: 'My Harvest Lots', to: '/my-lots', icon: ClipboardList, roles: ['farmer'] },
    { name: 'Sent Offers', to: '/my-requests', icon: PlusCircle, roles: ['buyer'] },
    { name: 'Incoming Offers', to: '/buyer-requests', icon: ClipboardList, roles: ['farmer'] },
    { name: 'Messages', to: '/messages', icon: MessageSquare, roles: ['farmer', 'buyer'] },
    { name: 'Profile Account', to: '/profile', icon: UserCircle, roles: ['farmer', 'buyer'] },
  ];

  const allowedLinks = navigationItems.filter(item => item.roles.includes(user?.role));

  return (
    <>
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 bg-neutral-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside className={`fixed top-0 bottom-0 left-0 z-50 flex w-64 flex-col border-r border-neutral-200 bg-white transition-transform duration-300 ease-in-out lg:sticky lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between px-6 border-b border-neutral-100">
          <span className="text-xl font-black text-emerald-600 tracking-tight">AgroLink Portal</span>
          <button className="text-neutral-500 hover:text-neutral-800 lg:hidden" onClick={onClose}>
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 space-y-1 px-4 py-6">
          {allowedLinks.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.name}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) => `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900'}`}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
