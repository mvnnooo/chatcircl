import React from 'react';
import { ChatProvider, useChat } from './contexts/ChatContext';
import { LoginScreen } from './components/LoginScreen';
import { Sidebar } from './components/Sidebar';
import { ChatArea } from './components/ChatArea';
import { MemberList } from './components/MemberList';
import { Toaster } from './components/ui/sonner';

const ChatApp: React.FC = () => {
  const { currentUser, login } = useChat();

  if (!currentUser) {
    return <LoginScreen onLogin={login} />;
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <Sidebar />
      <ChatArea />
      <MemberList />
    </div>
  );
};

export default function App() {
  return (
    <ChatProvider>
      <ChatApp />
      <Toaster />
    </ChatProvider>
  );
}
