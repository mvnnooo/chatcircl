import React, { useState } from 'react';
import { useChat } from '../contexts/ChatContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from './ui/dialog';
import { Label } from './ui/label';
import { Textarea } from './ui/textarea';
import { 
  Hash, 
  Lock, 
  Plus, 
  Search, 
  Settings, 
  LogOut,
  MessageCircle,
} from 'lucide-react';
import { Room } from '../types';

export const Sidebar: React.FC = () => {
  const { currentUser, rooms, setActiveRoom, activeRoom, createRoom, logout } = useChat();
  const [searchQuery, setSearchQuery] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [newRoomDescription, setNewRoomDescription] = useState('');
  const [newRoomType, setNewRoomType] = useState<'public' | 'private'>('public');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const userRooms = rooms.filter(room => room.members.includes(currentUser?.id || ''));

  const filteredRooms = userRooms.filter(room =>
    room.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateRoom = () => {
    if (newRoomName.trim()) {
      createRoom(newRoomName, newRoomDescription, newRoomType);
      setNewRoomName('');
      setNewRoomDescription('');
      setNewRoomType('public');
      setIsDialogOpen(false);
    }
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
    const now = new Date();
    const messageDate = new Date(date);
    const diffInHours = (now.getTime() - messageDate.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      const mins = Math.floor(diffInHours * 60);
      return `${mins}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return messageDate.toLocaleDateString();
    }
  };

  return (
    <div className="w-80 bg-gray-900 text-white flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="font-semibold text-lg">Circl Chat</span>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search rooms..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-gray-800 border-gray-700 text-white placeholder:text-gray-400"
          />
        </div>
      </div>

      {/* Rooms List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          <div className="flex items-center justify-between px-2 py-2 mb-2">
            <span className="text-sm text-gray-400">Channels</span>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0 text-gray-400 hover:text-white">
                  <Plus className="w-4 h-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-gray-800 text-white border-gray-700">
                <DialogHeader>
                  <DialogTitle>Create New Room</DialogTitle>
                  <DialogDescription className="text-gray-400">
                    Create a new chat room for your team
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Room Name</Label>
                    <Input
                      id="name"
                      value={newRoomName}
                      onChange={(e) => setNewRoomName(e.target.value)}
                      placeholder="e.g. Project Discussion"
                      className="bg-gray-900 border-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      value={newRoomDescription}
                      onChange={(e) => setNewRoomDescription(e.target.value)}
                      placeholder="What's this room about?"
                      className="bg-gray-900 border-gray-700 resize-none"
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Room Type</Label>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant={newRoomType === 'public' ? 'default' : 'outline'}
                        onClick={() => setNewRoomType('public')}
                        className="flex-1"
                      >
                        <Hash className="w-4 h-4 mr-2" />
                        Public
                      </Button>
                      <Button
                        type="button"
                        variant={newRoomType === 'private' ? 'default' : 'outline'}
                        onClick={() => setNewRoomType('private')}
                        className="flex-1"
                      >
                        <Lock className="w-4 h-4 mr-2" />
                        Private
                      </Button>
                    </div>
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateRoom}>Create Room</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <div className="space-y-1">
            {filteredRooms.map((room) => (
              <button
                key={room.id}
                onClick={() => setActiveRoom(room)}
                className={`w-full p-3 rounded-lg text-left transition-colors ${
                  activeRoom?.id === room.id
                    ? 'bg-indigo-600 text-white'
                    : 'hover:bg-gray-800 text-gray-300'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {room.type === 'public' ? (
                      <Hash className="w-5 h-5" />
                    ) : (
                      <Lock className="w-5 h-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium truncate">{room.name}</span>
                      {room.lastMessage && (
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatTime(room.lastMessage.timestamp)}
                        </span>
                      )}
                    </div>
                    {room.lastMessage && (
                      <p className="text-sm text-gray-400 truncate">
                        {room.lastMessage.username}: {room.lastMessage.content}
                      </p>
                    )}
                    {room.unreadCount && room.unreadCount > 0 && (
                      <Badge variant="destructive" className="mt-1">
                        {room.unreadCount}
                      </Badge>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback className="bg-indigo-600">
                {currentUser && getInitials(currentUser.username)}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{currentUser?.username}</p>
              <p className="text-sm text-green-400">● Online</p>
            </div>
          </div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-gray-400 hover:text-white">
              <Settings className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 text-gray-400 hover:text-white"
              onClick={logout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
