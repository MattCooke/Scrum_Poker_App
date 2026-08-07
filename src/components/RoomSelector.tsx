'use client';

import { useState } from 'react';
import { RoomListItem } from '@/types';
import AppLogo from './AppLogo';
import ThemeToggle from './ThemeToggle';

interface RoomSelectorProps {
  rooms: RoomListItem[];
  onCreateRoom: (roomName: string, userName: string) => void;
  onJoinRoom: (roomId: string, userName: string) => void;
  onDeleteRoom: (roomId: string) => void;
  onRefresh: () => void;
}

export default function RoomSelector({ rooms, onCreateRoom, onJoinRoom, onDeleteRoom, onRefresh }: RoomSelectorProps) {
  const [userName, setUserName] = useState('');
  const [newRoomName, setNewRoomName] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const handleCreateRoom = () => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    if (!newRoomName.trim()) {
      alert('Please enter a room name');
      return;
    }
    
    onCreateRoom(newRoomName.trim(), userName.trim());
  };

  const handleJoinRoom = (roomId: string) => {
    if (!userName.trim()) {
      alert('Please enter your name');
      return;
    }
    
    onJoinRoom(roomId, userName.trim());
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-gray-50 to-brand-gray-100 dark:from-gray-900 dark:to-gray-800 p-6">
      <ThemeToggle />
      <div className="max-w-4xl mx-auto">
        <div className="card p-8">
          {/* Header */}
          <div className="text-center mb-8 border-b border-brand-gray-200 dark:border-gray-700 pb-6">
            <div className="flex flex-col items-center justify-center mb-4 gap-3">
              <AppLogo size="lg" />
              <h1 className="text-4xl font-bold text-brand-black dark:text-white">
                Scrum Poker
              </h1>
            </div>
            <p className="text-brand-gray-600 dark:text-gray-400 text-lg">
              Professional estimation sessions for agile teams
            </p>
          </div>

          {/* User Name Input */}
          <div className="mb-8">
            <label className="block text-sm font-semibold text-brand-black dark:text-gray-300 mb-2 uppercase tracking-wide">
              Your Name
            </label>
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter your name"
              className="w-full px-4 py-3 border-2 border-brand-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all"
              onKeyPress={(e) => {
                if (e.key === 'Enter' && selectedRoom) {
                  handleJoinRoom(selectedRoom);
                }
              }}
            />
          </div>

          {/* Create Room Section */}
          <div className="mb-8 p-6 bg-gradient-to-r from-brand-yellow/10 to-brand-yellow/5 dark:from-brand-yellow/20 dark:to-brand-yellow/10 rounded-lg border-2 border-brand-yellow/20 dark:border-brand-yellow/30">
            {!showCreateForm ? (
              <button
                onClick={() => setShowCreateForm(true)}
                className="w-full py-3 bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black rounded-lg transition-all font-semibold text-lg shadow-md hover:shadow-lg"
              >
                + Create New Room
              </button>
            ) : (
              <div className="space-y-3">
                <input
                  type="text"
                  value={newRoomName}
                  onChange={(e) => setNewRoomName(e.target.value)}
                  placeholder="Room name (e.g., Sprint Planning)"
                  className="w-full px-4 py-3 border-2 border-brand-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-brand-yellow focus:border-brand-yellow dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 transition-all"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      handleCreateRoom();
                    }
                  }}
                  autoFocus
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleCreateRoom}
                    className="flex-1 py-3 bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black rounded-lg transition-all font-semibold shadow-md hover:shadow-lg"
                  >
                    Create Room
                  </button>
                  <button
                    onClick={() => {
                      setShowCreateForm(false);
                      setNewRoomName('');
                    }}
                    className="px-6 py-3 bg-brand-gray-200 hover:bg-brand-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-brand-gray-700 dark:text-gray-200 rounded-lg transition-all font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Room List */}
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-brand-black dark:text-white">
                Active Rooms ({rooms.length}/10)
              </h2>
              <button
                onClick={onRefresh}
                className="text-brand-yellow hover:text-brand-yellow-dark dark:hover:text-brand-yellow-light font-semibold text-sm flex items-center gap-1 transition-colors"
              >
                <span className="text-lg">🔄</span> Refresh
              </button>
            </div>

            {rooms.length === 0 ? (
              <div className="text-center py-16 text-brand-gray-500 dark:text-gray-400 bg-brand-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-brand-gray-300 dark:border-gray-600">
                <p className="text-xl font-semibold mb-2">No active rooms</p>
                <p className="text-sm">Create a new room to get started!</p>
              </div>
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {rooms.map((room) => (
                  <div
                    key={room.id}
                    className={`p-5 border-2 rounded-lg cursor-pointer transition-all ${
                      selectedRoom === room.id
                        ? 'border-brand-yellow bg-brand-yellow/5 dark:bg-brand-yellow/10 shadow-md'
                        : 'border-brand-gray-300 dark:border-gray-600 hover:border-brand-yellow/50 bg-white dark:bg-gray-700 hover:shadow-md'
                    }`}
                    onClick={() => setSelectedRoom(room.id)}
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <h3 className="font-bold text-brand-black dark:text-white text-lg mb-2">
                          {room.name}
                        </h3>
                        <div className="flex gap-4 text-sm text-brand-gray-600 dark:text-gray-400">
                          <span className="flex items-center gap-1">
                            <span className="font-semibold text-brand-black dark:text-white">{room.userCount}</span> {room.userCount === 1 ? 'user' : 'users'}
                          </span>
                          <span className="flex items-center gap-1">
                            <span className="text-brand-gray-400 dark:text-gray-500">•</span>
                            {formatDate(room.lastActivity)}
                          </span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleJoinRoom(room.id);
                          }}
                          className="px-5 py-2 bg-brand-yellow hover:bg-brand-yellow-dark text-brand-black rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                        >
                          Join
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            if (confirm(`Are you sure you want to delete the room "${room.name}"?`)) {
                              onDeleteRoom(room.id);
                            }
                          }}
                          className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all text-sm font-semibold shadow-md hover:shadow-lg"
                          title="Delete room"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Info Footer */}
          <div className="mt-8 pt-6 border-t border-brand-gray-200 dark:border-gray-700 text-center text-sm text-brand-gray-500 dark:text-gray-400">
            <p className="font-medium">Rooms are automatically closed after 7 days of inactivity</p>
            <p className="mt-1">Maximum 10 active rooms at a time</p>
          </div>
        </div>
      </div>
    </div>
  );
}
