import React from 'react';
import { User } from 'lucide-react';

const ConversationList = ({ rooms, activeRoom, onSelectRoom }) => {
  return (
    <div className="divide-y divide-neutral-100 overflow-y-auto h-full">
      {rooms.length === 0 ? (
        <div className="p-8 text-center text-xs text-neutral-400 font-medium">
          No chat history running. Start an expression directly from a crop lot window.
        </div>
      ) : (
        rooms.map((room) => {
          const partner = room.user;
          const isActive = activeRoom?.user?._id === partner?._id;

          return (
            <button
              key={partner?._id}
              onClick={() => onSelectRoom(room)}
              className={`w-full flex items-center gap-3 p-4 text-left transition border-l-2 ${isActive ? 'bg-emerald-50/50 border-emerald-600' : 'bg-white border-transparent hover:bg-neutral-50'}`}
            >
              {partner?.profileImage ? (
                <img 
                  src={partner.profileImage} 
                  alt={partner.name} 
                  className="h-10 w-10 rounded-full object-cover border border-neutral-200 flex-shrink-0" 
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200 flex-shrink-0">
                  <User className="h-5 w-5" />
                </div>
              )}

              <div className="min-w-0 flex-1">
                <div className="flex items-baseline justify-between gap-2">
                  <p className="text-xs font-bold text-neutral-800 truncate">{partner?.name}</p>
                  <span className="text-[10px] text-neutral-400 whitespace-nowrap">
                    {new Date(room.updatedAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-xs text-neutral-500 truncate mt-0.5 leading-normal">
                  {room.lastMessage}
                </p>
              </div>
            </button>
          );
        })
      )}
    </div>
  );
};

export default ConversationList;
