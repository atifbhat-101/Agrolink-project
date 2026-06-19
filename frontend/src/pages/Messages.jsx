import React, { useState, useEffect, useContext, useCallback } from 'react';
import { AuthContext } from '../context/AuthContext';
import { initiateSocketConnection } from '../services/socket';
import api from '../services/api';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import Loader from '../components/common/Loader';
import { ArrowLeft, MessageSquare, Sprout, User } from 'lucide-react';

const Messages = () => {
  const { user } = useContext(AuthContext);
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  
  // Mobile responsive view selector flag state toggle 
  const [viewingChatMobile, setViewingChatMobile] = useState(false);

  const fetchChatRoomsLayout = useCallback(async (showLoader = false) => {
    try {
      if (showLoader) setLoadingRooms(true);
      const { data } = await api.get('/messages');
      setRooms(data || []);
    } catch (err) {
      console.error('Failed reading active chat channels:', err);
    } finally {
      if (showLoader) setLoadingRooms(false);
    }
  }, []);

  useEffect(() => {
    fetchChatRoomsLayout(true);
  }, [fetchChatRoomsLayout]);

  useEffect(() => {
    if (!user) return;
    const socket = initiateSocketConnection(user._id);

    const handleRealTimeMessageIncoming = (incomingMsg) => {
      // Logic injection verify if incoming message references current workspace active thread
      if (activeRoom && (incomingMsg.sender._id === activeRoom.user._id || incomingMsg.recipient === activeRoom.user._id)) {
        setMessages((prev) => [...prev, incomingMsg]);
      }
      
      // Real-time synchronization correction updating conversational master rooms previews ledger blocks
      setRooms((prevRooms) => {
        const matchingIndex = prevRooms.findIndex((r) => r.user._id === (incomingMsg.sender._id === user._id ? incomingMsg.recipient : incomingMsg.sender._id));
        if (matchingIndex !== -1) {
          const updatedRooms = [...prevRooms];
          updatedRooms[matchingIndex] = {
            ...updatedRooms[matchingIndex],
            lastMessage: incomingMsg.text,
            updatedAt: incomingMsg.createdAt
          };
          return updatedRooms.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
        }
        return prevRooms;
      });
    };

    const handleRealTimeMessageUpdated = (updatedMsg) => {
      setMessages((prev) => prev.map((msg) => (msg._id === updatedMsg._id ? updatedMsg : msg)));
      fetchChatRoomsLayout();
    };

    const handleRealTimeMessageDeleted = (deletedMsg) => {
      setMessages((prev) => prev.filter((msg) => msg._id !== deletedMsg._id));
      fetchChatRoomsLayout();
    };

    socket.on('message_received', handleRealTimeMessageIncoming);
    socket.on('message_updated', handleRealTimeMessageUpdated);
    socket.on('message_deleted', handleRealTimeMessageDeleted);
    return () => {
      socket.off('message_received', handleRealTimeMessageIncoming);
      socket.off('message_updated', handleRealTimeMessageUpdated);
      socket.off('message_deleted', handleRealTimeMessageDeleted);
    };
  }, [user, activeRoom, fetchChatRoomsLayout]);

  const handleSelectRoomChannel = async (targetRoom) => {
    setActiveRoom(targetRoom);
    setViewingChatMobile(true);
    try {
      setLoadingChat(true);
      const { data } = await api.get(`/messages/user/${targetRoom.user._id}`);
      setMessages(data || []);
    } catch (err) {
      console.error('Failed synchronizing message logs payload:', err);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleSendTextMessage = async (textPayload) => {
    if (!activeRoom || !textPayload.trim()) return;
    try {
      setSending(true);
      const { data } = await api.post('/messages', { recipientId: activeRoom.user._id, text: textPayload });
      setMessages((prev) => [...prev, data]);
      
      // Local sync update for active rooms overview strings instantly
      setRooms((prev) =>
        prev.map((r) => r.user._id === activeRoom.user._id ? { ...r, lastMessage: textPayload, updatedAt: new Date().toISOString() } : r)
      );
    } catch (err) {
      console.error('Message delivery tracking fault encountered:', err);
    } finally {
      setSending(false);
    }
  };

  const handleEditMessage = async (messageId, nextText) => {
    try {
      const { data } = await api.put(`/messages/${messageId}`, { text: nextText });
      setMessages((prev) => prev.map((msg) => (msg._id === messageId ? data : msg)));
      fetchChatRoomsLayout();
    } catch (err) {
      console.error('Message edit failed:', err);
    }
  };

  const handleDeleteMessage = async (messageId) => {
    try {
      await api.delete(`/messages/${messageId}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== messageId));
      fetchChatRoomsLayout();
    } catch (err) {
      console.error('Message removal failed:', err);
    }
  };

  if (loadingRooms) return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="relative h-[calc(100vh-11rem)] overflow-hidden rounded-[1.75rem] border border-emerald-100 bg-[#f7fbf6] shadow-[0_24px_70px_rgba(20,83,45,0.14)]">
      <div className="absolute inset-x-0 top-0 h-36 bg-[linear-gradient(135deg,#065f46_0%,#0f9f6e_46%,#eab308_120%)]" />
      <div className="absolute left-8 top-8 hidden h-20 w-20 rounded-full border border-white/30 bg-white/10 blur-sm md:block" />
      <div className="relative flex h-full overflow-hidden rounded-[1.75rem]">
      
      {/* Structural Conversations Selection List Drawer Left-Bar */}
      <div className={`w-full border-r border-white/40 bg-white/90 backdrop-blur md:w-80 lg:w-[24rem] flex flex-col ${viewingChatMobile ? 'hidden md:flex' : 'flex'}`}>
        <div className="border-b border-emerald-100/80 bg-white/70 p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-lg shadow-emerald-600/20">
              <Sprout className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-emerald-700">Market desk</p>
              <h3 className="text-base font-black text-neutral-900">Negotiations</h3>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList rooms={rooms} activeRoom={activeRoom} onSelectRoom={handleSelectRoomChannel} />
        </div>
      </div>

      {/* Real-time Interactive Chat Sub-Terminal Interface Box Frame Panel */}
      <div className={`flex-1 flex flex-col bg-white/35 backdrop-blur ${!viewingChatMobile ? 'hidden md:flex' : 'flex'}`}>
        {activeRoom ? (
          <>
            {/* Context Thread Partner Bar Banner Header */}
            <div className="h-20 border-b border-white/50 bg-white/80 px-4 flex items-center gap-3 shadow-sm backdrop-blur">
              <button onClick={() => setViewingChatMobile(false)} className="p-2 text-neutral-500 hover:text-neutral-800 md:hidden mr-1">
                <ArrowLeft className="h-5 w-5" />
              </button>
              {activeRoom.user?.profileImage ? (
                <img src={activeRoom.user.profileImage} alt="" className="h-11 w-11 rounded-2xl object-cover border-2 border-white shadow-sm" />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700 border border-emerald-100"><User className="h-5 w-5" /></div>
              )}
              <div className="min-w-0">
                <p className="truncate text-sm font-black text-neutral-900">{activeRoom.user?.name}</p>
                <p className="text-[10px] text-emerald-700 font-black uppercase tracking-[0.18em]">{activeRoom.user?.role || 'Trade partner'}</p>
              </div>
            </div>

            {/* Conversation Messages Layer */}
            {loadingChat ? (
              <div className="flex-1 flex items-center justify-center"><Loader /></div>
            ) : (
              <ChatWindow
                messages={messages}
                currentUserId={user._id}
                partnerUser={activeRoom.user}
                onEditMessage={handleEditMessage}
                onDeleteMessage={handleDeleteMessage}
              />
            )}

            {/* Message Dispatch Frame Entry Control */}
            <ChatInput onSendMessage={handleSendTextMessage} loading={sending} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="p-5 rounded-3xl bg-white/80 mb-4 text-emerald-600 shadow-lg shadow-emerald-900/5">
              <MessageSquare className="h-9 w-9" />
            </div>
            <h4 className="text-base font-black text-neutral-900">Choose a negotiation</h4>
            <p className="text-xs text-neutral-500 max-w-xs leading-relaxed mt-2">Open a buyer or farmer conversation to review offers, update terms, and keep the trade moving.</p>
          </div>
        )}
      </div>
      </div>
    </div>
  );
};

export default Messages;
