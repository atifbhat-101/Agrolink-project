import React, { useEffect, useRef, useState } from 'react';
import { Check, MoreVertical, Pencil, Trash2, User, X } from 'lucide-react';

const ChatWindow = ({ messages, currentUserId, partnerUser, onEditMessage, onDeleteMessage }) => {
  const scrollRef = useRef(null);
  const [editingId, setEditingId] = useState(null);
  const [draftText, setDraftText] = useState('');

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const startEditing = (msg) => {
    setEditingId(msg._id);
    setDraftText(msg.text);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraftText('');
  };

  const submitEdit = async (messageId) => {
    const cleanText = draftText.trim();
    if (!cleanText) return;
    await onEditMessage?.(messageId, cleanText);
    cancelEditing();
  };

  const removeMessage = (messageId) => {
    const shouldDelete = window.confirm('Delete this message?');
    if (shouldDelete) onDeleteMessage?.(messageId);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-[radial-gradient(circle_at_top_left,rgba(16,185,129,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(240,253,244,0.78))] p-4 sm:p-6 space-y-4 min-h-[300px]">
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center text-center">
          <div className="rounded-3xl border border-dashed border-emerald-200 bg-white/70 px-6 py-5 shadow-sm">
            <p className="text-sm font-black text-neutral-800">No messages yet</p>
            <p className="mt-1 text-xs text-neutral-500">Send the first note and start the negotiation.</p>
          </div>
        </div>
      ) : (
        messages.map((msg) => {
          const isMe = msg.sender?._id === currentUserId || msg.sender === currentUserId;
          const isEditing = editingId === msg._id;

          return (
            <div key={msg._id} className={`group flex w-full ${isMe ? 'justify-end' : 'justify-start'}`}>
              <div className={`flex gap-2 max-w-[86%] sm:max-w-[68%] items-end ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {!isMe && (
                  partnerUser?.profileImage ? (
                    <img src={partnerUser.profileImage} alt="" className="h-8 w-8 rounded-2xl object-cover flex-shrink-0 border-2 border-white shadow-sm" />
                  ) : (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-2xl bg-white text-emerald-700 text-[10px] shadow-sm">
                      <User className="h-4 w-4" />
                    </div>
                  )
                )}
                
                <div className={`relative rounded-[1.35rem] px-4 py-3 text-xs shadow-sm leading-relaxed ${isMe ? 'bg-emerald-700 text-white rounded-br-md shadow-emerald-900/15' : 'bg-white/95 text-neutral-800 border border-white rounded-bl-md shadow-emerald-900/5'}`}>
                  {isMe && !isEditing && (
                    <div className="absolute -left-11 top-2 hidden items-center gap-1 rounded-full border border-neutral-200 bg-white p-1 text-neutral-500 opacity-0 shadow-sm transition group-hover:flex group-hover:opacity-100">
                      <button
                        type="button"
                        onClick={() => startEditing(msg)}
                        className="rounded-full p-1.5 hover:bg-emerald-50 hover:text-emerald-700"
                        title="Edit message"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => removeMessage(msg._id)}
                        className="rounded-full p-1.5 hover:bg-red-50 hover:text-red-600"
                        title="Delete message"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}

                  {isEditing ? (
                    <div className="space-y-2">
                      <textarea
                        value={draftText}
                        onChange={(e) => setDraftText(e.target.value)}
                        className="min-h-20 w-full resize-none rounded-2xl border border-emerald-200 bg-white px-3 py-2 text-xs font-semibold text-neutral-800 outline-none focus:border-emerald-500"
                        autoFocus
                      />
                      <div className="flex justify-end gap-1.5">
                        <button type="button" onClick={cancelEditing} className="rounded-full bg-neutral-100 p-2 text-neutral-600 hover:bg-neutral-200" title="Cancel edit">
                          <X className="h-3.5 w-3.5" />
                        </button>
                        <button type="button" onClick={() => submitEdit(msg._id)} className="rounded-full bg-emerald-600 p-2 text-white hover:bg-emerald-700" title="Save edit">
                          <Check className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-start gap-2">
                        <p className="break-words font-semibold">{msg.text}</p>
                        {isMe && <MoreVertical className="mt-0.5 h-3.5 w-3.5 shrink-0 opacity-50 md:hidden" />}
                      </div>
                      <span className={`text-[9px] block text-right mt-1.5 font-black uppercase tracking-wider ${isMe ? 'text-emerald-100' : 'text-neutral-400'}`}>
                        {msg.editedAt ? 'Edited · ' : ''}{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      {isMe && (
                        <div className="mt-2 flex justify-end gap-1 md:hidden">
                          <button type="button" onClick={() => startEditing(msg)} className="rounded-full bg-white/15 p-1.5 text-white" title="Edit message">
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button type="button" onClick={() => removeMessage(msg._id)} className="rounded-full bg-white/15 p-1.5 text-white" title="Delete message">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </>
                  )}
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
