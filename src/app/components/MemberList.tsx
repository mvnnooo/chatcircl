import React from 'react';
import { useChat } from '../contexts/ChatContext';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { Users, UserPlus, Crown, Shield } from 'lucide-react';

export const MemberList: React.FC = () => {
  const { activeRoom, users, currentUser } = useChat();

  if (!activeRoom) {
    return nulal;
  }

  const roomMembers = users.filter(user => activeRoom.members.includes(user.id));
  const onlineMembers = roomMembers.filter(user => user.status === 'online');
  const offlineMembers = roomMembers.filter(user => user.status !== 'online');

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-500';
      case 'away':
        return 'bg-yellow-500';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <div className="w-64 bg-gray-50 border-l border-gray-200 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold flex items-center gap-2">
            <Users className="w-4 h-4" />
            Members
          </h3>
          <Badge variant="secondary">{roomMembers.length}</Badge>
        </div>
        <Button variant="outline" size="sm" className="w-full">
          <UserPlus className="w-4 h-4 mr-2" />
          Invite
        </Button>
      </div>

      {/* Members List */}
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {/* Online Members */}
          {onlineMembers.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-500 mb-2 uppercase">
                Online — {onlineMembers.length}
              </h4>
              <div className="space-y-2">
                {onlineMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-indigo-600 text-white">
                          {getInitials(member.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                          member.status
                        )}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium truncate">{member.username}</p>
                        {member.id === activeRoom.createdBy && (
                          <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                        )}
                        {member.id === currentUser?.id && (
                          <span className="text-xs text-gray-500 flex-shrink-0">(you)</span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {onlineMembers.length > 0 && offlineMembers.length > 0 && (
            <Separator className="my-4" />
          )}

          {/* Offline Members */}
          {offlineMembers.length > 0 && (
            <div>
              <h4 className="text-xs text-gray-500 mb-2 uppercase">
                Offline — {offlineMembers.length}
              </h4>
              <div className="space-y-2">
                {offlineMembers.map((member) => (
                  <div
                    key={member.id}
                    className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors opacity-60"
                  >
                    <div className="relative">
                      <Avatar className="w-9 h-9">
                        <AvatarFallback className="bg-gray-400 text-white">
                          {getInitials(member.username)}
                        </AvatarFallback>
                      </Avatar>
                      <div
                        className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${getStatusColor(
                          member.status
                        )}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1">
                        <p className="text-sm font-medium truncate">{member.username}</p>
                        {member.id === activeRoom.createdBy && (
                          <Crown className="w-3 h-3 text-yellow-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Room Info */}
      <div className="p-4 border-t border-gray-200 bg-white">
        <h4 className="text-xs text-gray-500 mb-2 uppercase">About</h4>
        <p className="text-sm text-gray-700 mb-3">
          {activeRoom.description || 'No description available'}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <Shield className="w-3 h-3" />
          <span className="capitalize">{activeRoom.type} Room</span>
        </div>
      </div>
    </div>
  );
};
