import React from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import ChatInterface from './components/ChatInterface'
import JoinRoom from './components/JoinRoom.jsx'
import { IdProvider } from './contexts/IdContext'
import toast, { Toaster } from 'react-hot-toast';
function App() {
  return (
    <IdProvider>
    <BrowserRouter>
      <Routes>
      <Route path='/' element={<Navigate replace to='join-room'/>}/>
      <Route path='/join-room' element={<JoinRoom/>}/>
      <Route path='/chat' element={<ChatInterface/>} />
      </Routes>
    
    </BrowserRouter>
    </IdProvider>
  )
}

export default App