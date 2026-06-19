import React from 'react';
import { Leaf, User } from 'lucide-react';

const ConversationList = ({ rooms, activeRoom, onSelectRoom }) => {
  return (
    <div className="h-full space-y-2 overflow-y-auto p-3">
      {rooms.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center text-xs text-neutral-500 font-semibold">
          No negotiations yet. Start one from a crop lot.
        </div>
      ) : (
        rooms.map((room) => {
          const partner = room.user;
          const isActive = activeRoom?.user?._id === partner?._id;

          return (
            <button
              key={partner?._id}
              onClick={() => onSelectRoom(room)}
              className={`w-full rounded-3xl p-3 text-left transition ${isActive ? 'bg-emerald-700 text-white shadow-lg shadow-emerald-900/15' : 'bg-white/80 text-neutral-900 hover:bg-emerald-50 hover:shadow-sm'}`}
            >
              <div className="flex items-center gap-3">
                {partner?.profileImage ? (
                  <img
                    src={partner.profileImage}
                    alt={partner.name}
                    className={`h-12 w-12 rounded-2xl object-cover flex-shrink-0 ${isActive ? 'border-2 border-white/70' : 'border border-emerald-100'}`}
                  />
                ) : (
                  <div className={`flex h-12 w-12 items-center justify-center rounded-2xl flex-shrink-0 ${isActive ? 'bg-white/15 text-white' : 'bg-emerald-50 text-emerald-700 border border-emerald-100'}`}>
                    <User className="h-5 w-5" />
                  </div>
                )}

                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className={`text-sm font-black truncate ${isActive ? 'text-white' : 'text-neutral-900'}`}>{partner?.name}</p>
                    <span className={`text-[10px] whitespace-nowrap font-bold ${isActive ? 'text-emerald-100' : 'text-neutral-400'}`}>
                      {new Date(room.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className={`text-xs truncate mt-1 leading-normal ${isActive ? 'text-emerald-50' : 'text-neutral-500'}`}>
                    {room.lastMessage}
                  </p>
                </div>
              </div>
              <div className={`mt-3 flex items-center gap-1 text-[10px] font-black uppercase tracking-[0.16em] ${isActive ? 'text-emerald-100' : 'text-emerald-700'}`}>
                <Leaf className="h-3 w-3" />
                Active trade
              </div>
            </button>
          );
        })
      )}
    </div>
  );
};

export default ConversationList;
