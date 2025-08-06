import React, { useState } from 'react';
import { nanoid } from 'nanoid';
import { useNavigate } from 'react-router-dom';
import { useId} from '../contexts/IdContext';
import { FaRegCopy } from "react-icons/fa";
import toast, { Toaster } from 'react-hot-toast';

function JoinRoom() {
  const navigate = useNavigate();
  const { roomid, setroomId,name,setname } = useId(); 
  const [generatedId, setGeneratedId] = useState(''); 
  const [username, setusername] = useState(''); 

  // Logic remains unchanged
  const handleGenerate = () => {
    const newId = nanoid(10);
    setGeneratedId(newId);
  };

  const copytoclipboard = async () => {
    await navigator.clipboard.writeText(generatedId);
    toast.success('Copied to clipboard!');
  };

  const handleRoomJoin = () => {
    if (roomid.trim() !== '' && username.trim() !== '') {
      setname(username)
      localStorage.setItem('username', username);
      navigate('/chat');
    } else {
      toast.error("Enter name and Room ID.");
    }
  };

  return (
    // Added a dark gradient background
    <div className='min-h-screen w-full bg-gradient-to-br from-gray-900 to-black flex flex-col justify-center items-center p-4 font-press-start'>
      
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e1e1e',
            color: '#e2e2e2',
            border: '1px solid #333',
            boxShadow: '0 0 20px #00000080',
            fontFamily: '"Press Start 2P", cursive',
            fontSize: '12px',
          },
          success: { iconTheme: { primary: '#a3e635', secondary: '#1e1e1e' } },
          error: { iconTheme: { primary: '#ef4444', secondary: '#1e1e1e' } },
        }}
      />
      
      <div className='w-full max-w-md space-y-6'>

        {/* Static, styled text banner */}
        <div className="mb-[3rem] w-[150%] -ml-[6rem] border-y border-gray-800/50 py-4 text-center">
          <div className="flex justify-center items-center gap-4 flex-wrap text-xs">
            <span className="text-red-500 transition-all duration-300 hover:scale-110 cursor-cell" style={{textShadow: '0 0 8px #ef4444'}}>
              Create a Room
            </span>
            <span className="text-gray-600">•</span>
            <span className="text-lime-400 transition-all duration-300 hover:scale-110 cursor-cell" style={{textShadow: '0 0 8px #a3e635'}}>
              Join a Session
            </span>
             <span className="text-gray-600">•</span>
            <span className="text-yellow-400 transition-all duration-300 hover:scale-110 cursor-cell" style={{textShadow: '0 0 8px #facc15'}}>
              Collaborate
            </span>
          </div>
        </div>

        {/* Header */}
        <div className='text-center space-y-4'>
          <h1 className='text-5xl text-white'>
            Vapor
          </h1>
          <p className='text-xs text-gray-500 leading-relaxed mt-[2rem]'>Join or Create a Real-time Collaboration Room</p>
        </div>

        {/* Username Input */}
        <div className='space-y-3'>
          <label htmlFor='username' className='text-xs text-gray-400 px-1'>
            Enter Your Name:
          </label>
          <input
            id='username'
            type='text'
            value={username}
            onChange={(e) => setusername(e.target.value)}
            placeholder='...'
            className='w-full p-3 bg-gray-900/70 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-sm'
          />
        </div>

        {/* Action Sections */}
        <div className='space-y-6'>
          <div className='space-y-3'>
            <label htmlFor='roomid-paste' className='text-xs text-gray-400 px-1'>
              Paste Room ID:
            </label>
            <div className='flex items-center space-x-2'>
              <input
                id='roomid-paste'
                type='text'
                value={roomid}
                onChange={(e) => setroomId(e.target.value)}
                placeholder='...'
                className='w-full p-3 bg-gray-900/70 text-white rounded-md border border-gray-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200 text-sm'
              />
              <button
                onClick={handleRoomJoin}
                className='bg-cyan-400 text-blue-950 px-6 py-3 rounded-md transition-all duration-300 shadow-[0_0_8px_theme(colors.cyan.400)] hover:shadow-[0_0_20px_theme(colors.cyan.400)] focus:outline-none whitespace-nowrap text-sm'
              >
                Join
              </button>
            </div>
          </div>
          
          <div className='flex items-center'>
            <hr className='w-full border-gray-800' />
            <span className='px-3 text-gray-600 text-xs'>OR</span>
            <hr className='w-full border-gray-800' />
          </div>

          <div className='space-y-4'>
            <button
              onClick={handleGenerate}
              className='w-full bg-cyan-400 text-blue-950 px-4 py-3 rounded-md transition-all duration-300 shadow-[0_0_8px_theme(colors.cyan.400)] hover:shadow-[0_0_20px_theme(colors.cyan.400)] focus:outline-none text-sm'
            >
              Create New Room
            </button>
            {generatedId && (
              <div className='bg-black/30 p-4 rounded-md border border-gray-800 text-center'>
                <p className='text-xs text-gray-500 mb-3'>New Room ID:</p>
                <div className='flex justify-center items-center gap-4'>
                  <span 
                    className='text-lg text-lime-400'
                    style={{ textShadow: '0 0 10px #a3e635' }}
                  >
                    {generatedId}
                  </span>
                  <FaRegCopy
                    onClick={copytoclipboard}
                    className='text-gray-500 h-5 w-5 cursor-pointer hover:text-lime-400 transition-colors duration-200'
                    title='Copy to clipboard'
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default JoinRoom;
