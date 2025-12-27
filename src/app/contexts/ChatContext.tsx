import React,{createContext} from 'react';
export const ChatContext=createContext(null);
export const ChatProvider=({children}:{children:any})=><ChatContext.Provider value={{}}>{children}</ChatContext.Provider>;