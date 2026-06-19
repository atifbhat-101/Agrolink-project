import React, { useState } from 'react';
import { SendHorizontal, Wheat } from 'lucide-react';

const ChatInput = ({ onSendMessage, loading = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-white/70 bg-white/85 p-3 backdrop-blur">
      <div className="flex items-center gap-2 rounded-3xl border border-emerald-100 bg-white p-2 shadow-[0_10px_35px_rgba(20,83,45,0.08)]">
        <div className="hidden h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 sm:flex">
          <Wheat className="h-4 w-4" />
        </div>
        <input
          type="text"
          disabled={loading}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write offer details, quantity, pickup date..."
          className="min-w-0 flex-1 rounded-2xl border-0 bg-transparent px-2 py-2.5 text-xs font-semibold text-neutral-800 placeholder:text-neutral-400 focus:outline-none disabled:opacity-60"
        />
      <button
        type="submit"
        disabled={!text.trim() || loading}
        className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20 hover:bg-emerald-700 transition disabled:opacity-40 disabled:hover:bg-emerald-600 flex-shrink-0"
      >
        <SendHorizontal className="h-4 w-4" />
      </button>
      </div>
    </form>
  );
};

export default ChatInput;
