'use client';

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Room, RoomListItem, FIBONACCI_VALUES } from '@/types';
import VotingCard from '@/components/VotingCard';
import UserList from '@/components/UserList';
import StoryInput from '@/components/StoryInput';
import RoomSelector from '@/components/RoomSelector';
import AppLogo from '@/components/AppLogo';
import ThemeToggle from '@/components/ThemeToggle';

let socket: Socket;

export default function Home() {
  const [room, setRoom] = useState<Room | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [isInRoom, setIsInRoom] = useState(false);
  const [rooms, setRooms] = useState<RoomListItem[]>([]);

  useEffect(() => {
    // Initialize socket connection
    socketInitializer();

    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, []);

  const socketInitializer = async () => {
    await fetch('/api/socket');
    socket = io({
      path: '/api/socket',
    });

    socket.on('connect', () => {
      console.log('Connected to socket server');
      // Request room list on connect
      socket.emit('getRoomList');
    });

    socket.on('roomUpdate', (updatedRoom: Room) => {
      setRoom(updatedRoom);
      const user = updatedRoom.users.find(u => u.id === socket.id);
      if (user) {
        setCurrentUser(user);
        setSelectedVote(user.vote);
      }
    });

    socket.on('roomList', (roomList: RoomListItem[]) => {
      setRooms(roomList);
    });

    socket.on('roomCreated', (roomId: string) => {
      console.log('Room created:', roomId);
      setIsInRoom(true);
    });

    socket.on('userJoined', (user: User) => {
      console.log('User joined:', user.name);
    });

    socket.on('userLeft', (userId: string) => {
      console.log('User left:', userId);
    });

    socket.on('error', (message: string) => {
      alert(message);
    });
  };

  const handleCreateRoom = (roomName: string, userName: string) => {
    socket.emit('createRoom', roomName, userName);
  };

  const handleJoinRoom = (roomId: string, userName: string) => {
    socket.emit('joinRoom', roomId, userName);
    setIsInRoom(true);
  };

  const handleRefreshRooms = () => {
    socket.emit('getRoomList');
  };

  const handleDeleteRoom = (roomId: string) => {
    socket.emit('deleteRoom', roomId);
  };

  const handleLeaveRoom = () => {
    socket.emit('leaveRoom');
    setIsInRoom(false);
    setRoom(null);
    setCurrentUser(null);
    setSelectedVote(null);
    // Refresh room list
    socket.emit('getRoomList');
  };

  const handleVote = (value: string) => {
    const newVote = selectedVote === value ? null : value;
    setSelectedVote(newVote);
    socket.emit('vote', newVote);
  };

  const handleReveal = () => {
    socket.emit('reveal');
  };

  const handleReset = () => {
    setSelectedVote(null);
    socket.emit('reset');
  };

  const handleUpdateStory = (story: string) => {
    socket.emit('updateStory', story);
  };

  // Show room selector if not in a room
  if (!isInRoom) {
    return (
      <RoomSelector
        rooms={rooms}
        onCreateRoom={handleCreateRoom}
        onJoinRoom={handleJoinRoom}
        onDeleteRoom={handleDeleteRoom}
        onRefresh={handleRefreshRooms}
      />
    );
  }

  // Show loading if in room but room data not loaded yet
  if (!room) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-gray-50 to-brand-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-yellow border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-brand-gray-600 dark:text-gray-300 font-semibold">Loading room...</p>
        </div>
      </div>
    );
  }

  const allVoted = room.users.filter(u => u.connected).every(u => u.vote !== null);
  const votedCount = room.users.filter(u => u.connected && u.vote !== null).length;
  const totalCount = room.users.filter(u => u.connected).length;

  // Calculate average of numeric votes
  const calculateAverage = (): string | null => {
    if (!room.revealed) return null;
    
    const numericVotes = room.users
      .filter(u => u.connected && u.vote !== null)
      .map(u => parseFloat(u.vote!))
      .filter(v => !isNaN(v));
    
    if (numericVotes.length === 0) return null;
    
    const sum = numericVotes.reduce((acc, val) => acc + val, 0);
    const average = sum / numericVotes.length;
    return average.toFixed(2);
  };

  const averageVote = calculateAverage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-gray-50 to-brand-gray-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <ThemeToggle />
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <div className="card p-4">
            <div className="flex items-center justify-between">
              <button
                onClick={handleLeaveRoom}
                className="bg-brand-gray-200 hover:bg-brand-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-brand-black dark:text-gray-200 font-semibold py-2 px-4 rounded-lg transition-all shadow-sm hover:shadow-md"
              >
                ← Leave Room
              </button>
              <div className="flex items-center gap-3">
                <AppLogo size="sm" />
                <div className="text-center">
                  <h1 className="text-2xl md:text-3xl font-bold text-brand-black dark:text-white">
                    {room.name}
                  </h1>
                  <p className="text-sm text-brand-gray-600 dark:text-gray-400">
                    Welcome, <span className="font-semibold text-brand-yellow">{currentUser?.name}</span>
                  </p>
                </div>
              </div>
              <div className="w-28"></div>
            </div>
          </div>
        </div>

        {/* Story Input */}
        <StoryInput
          story={room.story}
          onUpdateStory={handleUpdateStory}
        />

        {/* Voting Progress */}
        <div className="card p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-lg font-bold text-brand-black dark:text-gray-200 uppercase tracking-wide">
                Voting Progress
              </p>
              <p className="text-sm text-brand-gray-600 dark:text-gray-400 mt-1">
                <span className="font-semibold text-brand-yellow">{votedCount}</span> of <span className="font-semibold">{totalCount}</span> team members voted
              </p>
              {averageVote && (
                <p className="text-2xl font-bold text-brand-yellow dark:text-brand-yellow mt-2">
                  Average: {averageVote}
                </p>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleReveal}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-5 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                {room.revealed ? '🙈 Hide' : '👀 Reveal'}
              </button>
              <button
                onClick={handleReset}
                className="bg-brand-black hover:bg-brand-black-light text-white font-semibold py-3 px-5 rounded-lg transition-all shadow-md hover:shadow-lg"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-brand-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-yellow to-brand-yellow-light h-4 rounded-full transition-all duration-500 shadow-inner"
              style={{ width: `${(votedCount / totalCount) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Voting Cards */}
          <div className="lg:col-span-2">
            <div className="card p-6">
              <h2 className="text-2xl font-bold text-brand-black dark:text-gray-200 mb-6 uppercase tracking-wide border-b-2 border-brand-yellow pb-3">
                Select Your Vote
              </h2>
              <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                {FIBONACCI_VALUES.map((value) => (
                  <VotingCard
                    key={value}
                    value={value}
                    isSelected={selectedVote === value}
                    onClick={() => handleVote(value)}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* User List */}
          <div className="lg:col-span-1">
            <UserList
              users={room.users}
              revealed={room.revealed}
              currentUserId={currentUser?.id || ''}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
