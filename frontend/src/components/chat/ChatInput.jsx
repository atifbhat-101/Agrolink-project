import React, { useState } from 'react';
import { SendHorizontal } from 'lucide-react';

const ChatInput = ({ onSendMessage, loading = false }) => {
  const [text, setText] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim() || loading) return;
    onSendMessage(text.trim());
    setText('');
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-neutral-200 bg-white p-3 flex items-center gap-2">
      <input
        type="text"
        disabled={loading}
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your bargaining message here..."
        className="flex-1 rounded-xl border border-neutral-200 px-4 py-2.5 text-xs text-neutral-800 bg-neutral-50 focus:bg-white focus:border-emerald-500 focus:outline-none transition disabled:opacity-60"
      />
      <button
        type="submit"
        disabled={!text.trim() || loading}
        className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600 text-white shadow-sm hover:bg-emerald-700 transition disabled:opacity-40 disabled:hover:bg-emerald-600 flex-shrink-0"
      >
        <SendHorizontal className="h-4 w-4" />
      </button>
    </form>
  );
};

export default ChatInput;
