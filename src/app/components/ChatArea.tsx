import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '../contexts/ChatContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import {
  Phone,
  Video,
  Settings,
  Send,
  Paperclip,
  Smile,
  MoreVertical,
  Edit,
  Trash,
  Image as ImageIcon,
  File,
  Download,
} from 'lucide-react';
import { Message as MessageType } from '../types';

const EMOJI_LIST = ['👍', '❤️', '😂', '😮', '😢', '🎉', '🚀', '👏'];

export const ChatArea: React.FC = () => {
  const {
    activeRoom,
    messages,
    currentUser,
    sendMessage,
    editMessage,
    deleteMessage,
    addReaction,
    startCall,
    typingIndicators,
    setTyping,
  } = useChat();

  const [messageInput, setMessageInput] = useState('');
  const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [reactionMessageId, setReactionMessageId] = useState<string | null>(null);
  const [activeCall, setActiveCall] = useState<{ type: 'voice' | 'video' } | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();

  const roomMessages = messages.filter(msg => msg.roomId === activeRoom?.id);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [roomMessages]);

  const handleSendMessage = () => {
    if (messageInput.trim() && activeRoom) {
      sendMessage(activeRoom.id, messageInput.trim());
      setMessageInput('');
      setTyping(activeRoom.id, false);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    }
  };

  const handleEditMessage = () => {
    if (editingMessageId && editingContent.trim()) {
      editMessage(editingMessageId, editingContent.trim());
      setEditingMessageId(null);
      setEditingContent('');
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && activeRoom) {
      const fileUrl = URL.createObjectURL(file);
      const isImage = file.type.startsWith('image/');
      sendMessage(
        activeRoom.id,
        isImage ? 'Shared an image' : 'Shared a file',
        isImage ? 'image' : 'file',
        fileUrl,
        file.name
      );
    }
  };

  const handleInputChange = (value: string) => {
    setMessageInput(value);
    
    if (activeRoom) {
      setTyping(activeRoom.id, true);
      
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      
      typingTimeoutRef.current = setTimeout(() => {
        setTyping(activeRoom.id, false);
      }, 2000);
    }
  };

  const handleStartCall = (type: 'voice' | 'video') => {
    if (activeRoom) {
      startCall(activeRoom.id, type);
      setActiveCall({ type });
    }
  };

  const handleEndCall = () => {
    setActiveCall(null);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const currentRoomTyping = typingIndicators.filter(
    t => t.roomId === activeRoom?.id && t.userId !== currentUser?.id
  );

  if (!activeRoom) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Send className="w-10 h-10 text-indigo-600" />
          </div>
          <h3 className="text-xl mb-2">No room selected</h3>
          <p className="text-gray-500">Select a room from the sidebar to start chatting</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-white">
      {/* Header */}
      <div className="h-16 border-b border-gray-200 flex items-center justify-between px-6">
        <div>
          <h2 className="font-semibold">{activeRoom.name}</h2>
          <p className="text-sm text-gray-500">{activeRoom.members.length} members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStartCall('voice')}
          >
            <Phone className="w-4 h-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleStartCall('video')}
          >
            <Video className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-6" ref={scrollRef}>
        <div className="space-y-4">
          {roomMessages.map((message) => {
            const isOwnMessage = message.userId === currentUser?.id;
            return (
              <div
                key={message.id}
                className={`flex gap-3 ${isOwnMessage ? 'flex-row-reverse' : ''}`}
              >
                <Avatar className="flex-shrink-0">
                  <AvatarFallback className={isOwnMessage ? 'bg-indigo-600' : 'bg-gray-400'}>
                    {getInitials(message.username)}
                  </AvatarFallback>
                </Avatar>
                <div className={`flex-1 ${isOwnMessage ? 'flex flex-col items-end' : ''}`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{message.username}</span>
                    <span className="text-xs text-gray-400">{formatTime(message.timestamp)}</span>
                    {message.isEdited && (
                      <span className="text-xs text-gray-400 italic">(edited)</span>
                    )}
                  </div>
                  
                  <div className="relative group">
                    <div
                      className={`inline-block rounded-lg px-4 py-2 max-w-xl ${
                        isOwnMessage
                          ? 'bg-indigo-600 text-white'
                          : 'bg-gray-100 text-gray-900'
                      }`}
                    >
                      {message.type === 'image' && message.fileUrl && (
                        <div className="mb-2">
                          <img
                            src={message.fileUrl}
                            alt={message.fileName}
                            className="rounded-lg max-w-sm max-h-64 object-cover"
                          />
                        </div>
                      )}
                      
                      {message.type === 'file' && message.fileUrl && (
                        <div className="flex items-center gap-3 mb-2 p-3 bg-white/10 rounded">
                          <File className="w-8 h-8" />
                          <div className="flex-1 min-w-0">
                            <p className="truncate">{message.fileName}</p>
                          </div>
                          <a href={message.fileUrl} download={message.fileName}>
                            <Download className="w-4 h-4" />
                          </a>
                        </div>
                      )}
                      
                      <p className="whitespace-pre-wrap break-words">{message.content}</p>
                      
                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction, idx) => (
                            <button
                              key={idx}
                              onClick={() => addReaction(message.id, reaction.emoji)}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-white/20 rounded-full text-xs hover:bg-white/30"
                            >
                              <span>{reaction.emoji}</span>
                              <span>{reaction.users.length}</span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    {isOwnMessage && (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="absolute -right-8 top-0 opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
                          >
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem
                            onClick={() => {
                              setEditingMessageId(message.id);
                              setEditingContent(message.content);
                            }}
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => deleteMessage(message.id)}
                            className="text-red-600"
                          >
                            <Trash className="w-4 h-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                    
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute -left-8 top-0 opacity-0 group-hover:opacity-100 h-8 w-8 p-0"
                      onClick={() => setReactionMessageId(message.id)}
                    >
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
          
          {currentRoomTyping.length > 0 && (
            <div className="flex gap-3 text-gray-500 text-sm">
              <div className="flex items-center gap-1">
                <span>{currentRoomTyping.map(t => t.username).join(', ')}</span>
                <span>{currentRoomTyping.length === 1 ? 'is' : 'are'} typing</span>
                <span className="flex gap-1">
                  <span className="animate-bounce">.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.2s' }}>.</span>
                  <span className="animate-bounce" style={{ animationDelay: '0.4s' }}>.</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t border-gray-200 p-4">
        <div className="flex items-end gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
          >
            <Paperclip className="w-4 h-4" />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileUpload}
            accept="image/*,application/pdf,.doc,.docx,.txt"
          />
          
          <div className="flex-1">
            <Input
              value={messageInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              placeholder="Type a message..."
              className="resize-none"
            />
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          >
            <Smile className="w-4 h-4" />
          </Button>
          
          <Button onClick={handleSendMessage}>
            <Send className="w-4 h-4" />
          </Button>
        </div>
        
        {showEmojiPicker && (
          <div className="mt-2 p-3 bg-white border border-gray-200 rounded-lg shadow-lg">
            <div className="flex gap-2">
              {EMOJI_LIST.map((emoji) => (
                <button
                  key={emoji}
                  onClick={() => {
                    setMessageInput(messageInput + emoji);
                    setShowEmojiPicker(false);
                  }}
                  className="text-2xl hover:scale-125 transition-transform"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Edit Message Dialog */}
      <Dialog open={!!editingMessageId} onOpenChange={() => setEditingMessageId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Message</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <Input
              value={editingContent}
              onChange={(e) => setEditingContent(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleEditMessage();
                }
              }}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setEditingMessageId(null)}>
              Cancel
            </Button>
            <Button onClick={handleEditMessage}>Save</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Reaction Picker Dialog */}
      <Dialog open={!!reactionMessageId} onOpenChange={() => setReactionMessageId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Reaction</DialogTitle>
          </DialogHeader>
          <div className="flex gap-3 py-4">
            {EMOJI_LIST.map((emoji) => (
              <button
                key={emoji}
                onClick={() => {
                  if (reactionMessageId) {
                    addReaction(reactionMessageId, emoji);
                    setReactionMessageId(null);
                  }
                }}
                className="text-3xl hover:scale-125 transition-transform"
              >
                {emoji}
              </button>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Active Call Dialog */}
      <Dialog open={!!activeCall} onOpenChange={() => handleEndCall()}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>
              {activeCall?.type === 'video' ? 'Video Call' : 'Voice Call'} - {activeRoom.name}
            </DialogTitle>
          </DialogHeader>
          <div className="py-8">
            <div className="bg-gray-900 rounded-lg aspect-video flex items-center justify-center">
              {activeCall?.type === 'video' ? (
                <Video className="w-20 h-20 text-white" />
              ) : (
                <Phone className="w-20 h-20 text-white" />
              )}
              <p className="text-white ml-4 text-xl">Call in progress...</p>
            </div>
          </div>
          <div className="flex justify-center gap-4">
            <Button variant="outline">
              Mute
            </Button>
            {activeCall?.type === 'video' && (
              <Button variant="outline">
                Turn Off Camera
              </Button>
            )}
            <Button variant="destructive" onClick={handleEndCall}>
              End Call
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
