
import React, { createContext, useContext, useState } from 'react';


const IdContext = createContext();

export const IdProvider = ({ children }) => {
  const [roomid, setroomId] = useState('');
  const [name,setname]=useState('');

  return (
    <IdContext.Provider value={{ roomid, setroomId ,name,setname}}>
      {children}
    </IdContext.Provider>
  );
};


export const useId = () => useContext(IdContext);
