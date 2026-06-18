import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { initiateSocketConnection } from '../services/socket';
import api from '../services/api';
import ConversationList from '../components/chat/ConversationList';
import ChatWindow from '../components/chat/ChatWindow';
import ChatInput from '../components/chat/ChatInput';
import Loader from '../components/common/Loader';
import { MessageSquare, User, ArrowLeft } from 'lucide-react';

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

  useEffect(() => {
    const fetchChatRoomsLayout = async () => {
      try {
        setLoadingRooms(true);
        const { data } = await api.get('/messages');
        setRooms(data || []);
      } catch (err) {
        console.error('Failed reading active chat channels:', err);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchChatRoomsLayout();
  }, []);

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

    socket.on('message_received', handleRealTimeMessageIncoming);
    return () => { socket.off('message_received', handleRealTimeMessageIncoming); };
  }, [user, activeRoom]);

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

  if (loadingRooms) return <div className="h-96 flex items-center justify-center"><Loader size="lg" /></div>;

  return (
    <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl h-[calc(100vh-12rem)] flex overflow-hidden">
      
      {/* Structural Conversations Selection List Drawer Left-Bar */}
      <div className={`w-full md:w-80 lg:w-96 border-r border-neutral-200 flex flex-col ${viewingChatMobile ? 'hidden md:flex' : 'flex'}`}>
        <div className="p-4 border-b border-neutral-100 flex items-center gap-2 bg-neutral-50/50">
          <MessageSquare className="h-4 w-4 text-emerald-600" />
          <h3 className="text-sm font-black text-neutral-800">Negotiation Dialogues</h3>
        </div>
        <div className="flex-1 overflow-y-auto">
          <ConversationList rooms={rooms} activeRoom={activeRoom} onSelectRoom={handleSelectRoomChannel} />
        </div>
      </div>

      {/* Real-time Interactive Chat Sub-Terminal Interface Box Frame Panel */}
      <div className={`flex-1 flex flex-col bg-neutral-50/30 ${!viewingChatMobile ? 'hidden md:flex' : 'flex'}`}>
        {activeRoom ? (
          <>
            {/* Context Thread Partner Bar Banner Header */}
            <div className="h-14 border-b border-neutral-200 bg-white px-4 flex items-center gap-3 shadow-sm">
              <button onClick={() => setViewingChatMobile(false)} className="p-1 text-neutral-400 hover:text-neutral-700 md:hidden mr-1">
                <ArrowLeft className="h-5 w-5" />
              </button>
              {activeRoom.user?.profileImage ? (
                <img src={activeRoom.user.profileImage} alt="" className="h-8 w-8 rounded-full object-cover border border-neutral-100" />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-neutral-100 text-neutral-500 border border-neutral-200"><User className="h-4 w-4" /></div>
              )}
              <div>
                <p className="text-xs font-black text-neutral-800">{activeRoom.user?.name}</p>
                <p className="text-[10px] text-neutral-400 font-semibold uppercase tracking-wider">{activeRoom.user?.role}</p>
              </div>
            </div>

            {/* Conversation Messages Layer */}
            {loadingChat ? (
              <div className="flex-1 flex items-center justify-center"><Loader /></div>
            ) : (
              <ChatWindow messages={messages} currentUserId={user._id} partnerUser={activeRoom.user} />
            )}

            {/* Message Dispatch Frame Entry Control */}
            <ChatInput onSendMessage={handleSendTextMessage} loading={sending} />
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center p-8">
            <div className="p-4 rounded-full bg-neutral-50 mb-3 text-neutral-300">
              <MessageSquare className="h-8 w-8" />
            </div>
            <h4 className="text-sm font-bold text-neutral-700">No Dialogue Thread Selected</h4>
            <p className="text-xs text-neutral-400 max-w-xs leading-relaxed mt-1">Select an active context communication workspace node from the side ledger to begin real-time contract negotiations.</p>
          </div>
        )}
      </div>

    </div>
  );
};

export default Messages;
