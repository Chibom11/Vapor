import React, { useEffect, useRef, useState } from 'react';
import { useId } from '../contexts/IdContext';
import { useNavigate } from 'react-router-dom';

// --- Helper Components for Icons ---
const SendIcon = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
    <path d="M3.478 2.405a.75.75 0 0 0-.926.94l2.432 7.905H13.5a.75.75 0 0 1 0 1.5H4.984l-2.432 7.905a.75.75 0 0 0 .926.94 60.519 60.519 0 0 0 18.445-8.986.75.75 0 0 0 0-1.218A60.517 60.517 0 0 0 3.478 2.405Z" />
  </svg>
);

const LeaveIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
        <polyline points="16 17 21 12 16 7"></polyline>
        <line x1="21" y1="12" x2="9" y2="12"></line>
    </svg>
);


function ChatInterface() {
    const navigate = useNavigate();
    const { roomid } = useId();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const wsRef = useRef(null);
    const messagesEndRef = useRef(null);

    const username = localStorage.getItem('username');

    // Effect for WebSocket connection and message handling
    useEffect(() => {
        if (!roomid || !username) {
            navigate('/join-room');
            return;
        }

        const messageHistoryKey = `messages_${roomid}`;
        const savedMessages = JSON.parse(localStorage.getItem(messageHistoryKey)) || [];
        setMessages(savedMessages);

        const ws = new WebSocket('ws://localhost:8080');
        wsRef.current = ws;

        ws.onopen = () => {
            console.log("Connected to socket successfully");
            ws.send(JSON.stringify({
                type: "join",
                payload: {
                    roomId: roomid,
                    name: username
                }
            }));
        };

        ws.onmessage = (event) => {
            const received = JSON.parse(event.data);
            if (received.type === 'newMessage') {
                setMessages(prevMessages => [...prevMessages, received.payload]);
            }
        };

        ws.onclose = () => {
            console.log("WebSocket connection closed");
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            if (ws.readyState === WebSocket.OPEN) {
                ws.close();
            }
        };
    }, [roomid, username, navigate]);

    // Effect for persisting messages to localStorage
    useEffect(() => {
        if (roomid) {
            const messageHistoryKey = `messages_${roomid}`;
            localStorage.setItem(messageHistoryKey, JSON.stringify(messages));
        }
    }, [messages, roomid]);

    // Effect for auto-scrolling to the latest message
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSend = () => {
        const trimmed = input.trim();
        if (trimmed === '' || !wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
            return;
        }

        wsRef.current.send(JSON.stringify({
            type: "chat",
            payload: {
                message: trimmed
            }
        }));
        setInput("");
    };
    
    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    const handleLeaveRoom = () => {
        const messageHistoryKey = `messages_${roomid}`;
        localStorage.removeItem(messageHistoryKey);
        localStorage.removeItem('username');
        
        if (wsRef.current) {
            wsRef.current.close();
        }
        navigate('/join-room');
    };

    return (
        <div className="flex flex-col h-screen bg-gradient-to-br from-gray-900 to-black text-white font-press-start text-sm">
            {/* Header */}
            <header className="flex items-center justify-between p-4 bg-black/30 border-b border-gray-800 flex-shrink-0">
                <div className="truncate">
                    <p className="text-xs text-gray-500 mb-1">ROOM ID:</p>
                    <h1 className="text-lg text-lime-400 truncate" title={roomid} style={{ textShadow: '0 0 8px #a3e635' }}>
                        {roomid}
                    </h1>
                </div>
                <div className="text-right">
                     <p className="text-xs text-gray-500 mb-1">USER:</p>
                     <p className="text-lg text-white truncate">{username}</p>
                </div>
            </header>

            {/* Message Display Area */}
            <main className="flex-1 p-4 space-y-4 overflow-y-auto">
                {messages.map((msg) => {
                    const isOwnMessage = msg.sender === username;
                    const messageDate = new Date(msg.timestamp);
                    return (
                        <div
                            key={msg.id}
                            className={`flex items-end gap-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`max-w-md lg:max-w-lg p-3 border ${isOwnMessage ? 'bg-cyan-900/40 border-cyan-700/50' : 'bg-gray-800/70 border-gray-700/80'}`}>
                                {!isOwnMessage && (
                                    <p className="text-xs text-yellow-400 mb-2" style={{ textShadow: '0 0 6px #facc15' }}>{msg.sender}</p>
                                )}
                                <p className="text-white break-words text-base leading-relaxed">{msg.text}</p>
                                <p className="text-xs text-gray-500 text-right mt-2">
                                    {messageDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </main>

            {/* Message Input Area */}
            <footer className="p-4 bg-black/30 border-t border-gray-800 flex-shrink-0">
                <div className="flex items-center space-x-4">
                    <input
                        className="flex-1 p-3 bg-gray-900/70 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-sm"
                        value={input}
                        type="text"
                        placeholder="Enter message..."
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={handleKeyPress}
                    />
                    <button
                        className="bg-cyan-400 text-blue-950 p-3 transition-all duration-300 shadow-[0_0_8px_theme(colors.cyan.400)] hover:shadow-[0_0_20px_theme(colors.cyan.400)] focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
                        onClick={handleSend}
                        disabled={input.trim() === ''}
                        title="Send Message"
                    >
                        <SendIcon />
                    </button>
                     <button
                        onClick={handleLeaveRoom}
                        className="bg-red-500 text-white p-3 transition-all duration-300 shadow-[0_0_8px_theme(colors.red.500)] hover:shadow-[0_0_20px_theme(colors.red.500)] focus:outline-none"
                        title="Leave Room"
                    >
                        <LeaveIcon />
                    </button>
                </div>
            </footer>
        </div>
    );
}

export default ChatInterface;
