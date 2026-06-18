import React, { useEffect, useRef } from 'react';
import { User } from 'lucide-react';

const ChatWindow = ({ messages, currentUserId, partnerUser }) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-neutral-50/50 min-h-[300px]">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-xs text-neutral-400 font-medium">
          Channel initiated. Post an operational message stream to break visual boundaries.
        </div>
      ) : (
        messages.map((msg) => {
          const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;

          return (
            <div key={msg._id} className={`flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[75%] sm:max-w-[65%] items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  partnerUser?.profileImage ? (
                    <img src={partnerUser.profileImage} alt="" className="h-6 w-6 rounded-full object-cover flex-shrink-0 border border-neutral-200" />
                  ) : (
                    <div className="flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-neutral-200 text-neutral-500 text-[10px]">
                      <User className="h-3 w-3" />
                    </div>
                  )
                )}
                
                <div className={`rounded-2xl px-3.5 py-2 text-xs shadow-sm leading-relaxed ${isMe ? 'bg-emerald-600 text-white rounded-br-none' : 'bg-white text-neutral-800 border border-neutral-200 rounded-bl-none'}`}>
                  <p className="break-words font-medium">{msg.text}</p>
                  <span className={`text-[9px] block text-right mt-1 font-bold ${isMe ? 'text-emerald-200' : 'text-neutral-400'}`}>
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            </div>
          );
        })
      )}
      <div ref={scrollRef} />
    </div>
  );
};

export default ChatWindow;
