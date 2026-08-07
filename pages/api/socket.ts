import type { NextApiRequest, NextApiResponse } from 'next';
import { Server as NetServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { User, MAX_ROOMS } from '@/types';
import { roomManager } from '@/lib/roomManager';

export const config = {
  api: {
    bodyParser: false,
  },
};

interface SocketServer extends NetServer {
  io?: SocketIOServer;
}

// Track which room each socket is in
const socketRooms = new Map<string, string>();

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Type assertion for Next.js API route socket access
  const socketServer = (res.socket as any)?.server as SocketServer | undefined;

  if (!socketServer) {
    res.end();
    return;
  }

  if (!socketServer.io) {
    console.log('Starting Socket.IO server...');

    const io = new SocketIOServer(socketServer, {
      path: '/api/socket',
      addTrailingSlash: false,
    });

    io.on('connection', (socket) => {
      console.log('New client connected:', socket.id);

      // Get room list
      socket.on('getRoomList', () => {
        const roomList = roomManager.getRoomList();
        socket.emit('roomList', roomList);
      });

      // Create a new room
      socket.on('createRoom', (roomName: string, userName: string) => {
        const room = roomManager.createRoom(roomName);
        
        if (!room) {
          socket.emit('error', `Cannot create room. Maximum of ${MAX_ROOMS} rooms reached. Please try again later or join an existing room.`);
          return;
        }

        // Add user to the room
        const newUser: User = {
          id: socket.id,
          name: userName,
          vote: null,
          connected: true,
        };
        
        room.users.push(newUser);
        socketRooms.set(socket.id, room.id);
        socket.join(room.id);

        socket.emit('roomCreated', room.id);
        socket.emit('roomUpdate', room);
        
        console.log(`User ${userName} created and joined room: ${room.name} (${room.id})`);
      });

      // Join an existing room
      socket.on('joinRoom', (roomId: string, userName: string) => {
        const room = roomManager.getRoom(roomId);
        
        if (!room) {
          socket.emit('error', 'Room not found or has been closed due to inactivity.');
          return;
        }

        const existingUserIndex = room.users.findIndex(u => u.id === socket.id);
        
        if (existingUserIndex >= 0) {
          // User reconnecting
          room.users[existingUserIndex].connected = true;
          room.users[existingUserIndex].name = userName;
        } else {
          // New user
          const newUser: User = {
            id: socket.id,
            name: userName,
            vote: null,
            connected: true,
          };
          room.users.push(newUser);
        }

        socketRooms.set(socket.id, roomId);
        socket.join(roomId);

        // Send current room state to the joining user
        socket.emit('roomUpdate', room);

        // Notify all other users in the room
        socket.to(roomId).emit('userJoined', room.users.find(u => u.id === socket.id));

        console.log(`User ${userName} joined room: ${room.name} (${roomId}). Total users: ${room.users.filter(u => u.connected).length}`);
      });

      // Handle voting
      socket.on('vote', (value: string | null) => {
        const roomId = socketRooms.get(socket.id);
        if (!roomId) return;

        const room = roomManager.getRoom(roomId);
        if (!room) return;

        const user = room.users.find(u => u.id === socket.id);
        if (user) {
          user.vote = value;
          io.to(roomId).emit('roomUpdate', room);
          console.log(`User ${user.name} voted: ${value || 'cleared vote'}`);
        }
      });

      // Handle reveal
      socket.on('reveal', () => {
        const roomId = socketRooms.get(socket.id);
        if (!roomId) return;

        const room = roomManager.getRoom(roomId);
        if (!room) return;

        room.revealed = !room.revealed;
        io.to(roomId).emit('roomUpdate', room);
        console.log(`Votes ${room.revealed ? 'revealed' : 'hidden'} in room ${room.name}`);
      });

      // Handle reset
      socket.on('reset', () => {
        const roomId = socketRooms.get(socket.id);
        if (!roomId) return;

        const room = roomManager.getRoom(roomId);
        if (!room) return;

        room.users.forEach(u => u.vote = null);
        room.revealed = false;
        io.to(roomId).emit('roomUpdate', room);
        console.log(`Votes reset in room ${room.name}`);
      });

      // Handle story update
      socket.on('updateStory', (story: string) => {
        const roomId = socketRooms.get(socket.id);
        if (!roomId) return;

        const room = roomManager.getRoom(roomId);
        if (!room) return;

        room.story = story;
        io.to(roomId).emit('roomUpdate', room);
        console.log('Story updated in room', room.name, ':', story);
      });

      // Handle room deletion
      socket.on('deleteRoom', (roomId: string) => {
        const room = roomManager.getRoom(roomId);
        if (!room) return;

        // Notify all users in the room
        io.to(roomId).emit('error', 'This room has been deleted');
        
        // Disconnect all sockets from the room
        const socketsInRoom = io.sockets.adapter.rooms.get(roomId);
        if (socketsInRoom) {
          socketsInRoom.forEach((socketId) => {
            const sock = io.sockets.sockets.get(socketId);
            if (sock) {
              sock.leave(roomId);
              socketRooms.delete(socketId);
            }
          });
        }

        // Delete the room
        roomManager.deleteRoom(roomId);
        console.log(`Room ${room.name} (${roomId}) was deleted`);

        // Broadcast updated room list to all clients
        const roomList = roomManager.getRoomList();
        io.emit('roomList', roomList);
      });

      // Handle leaving room
      socket.on('leaveRoom', () => {
        const roomId = socketRooms.get(socket.id);
        if (!roomId) return;

        const room = roomManager.getRoom(roomId);
        if (room) {
          const userIndex = room.users.findIndex(u => u.id === socket.id);
          if (userIndex >= 0) {
            const user = room.users[userIndex];
            room.users.splice(userIndex, 1);
            socket.leave(roomId);
            socketRooms.delete(socket.id);
            
            io.to(roomId).emit('userLeft', socket.id);
            io.to(roomId).emit('roomUpdate', room);
            
            console.log(`User ${user.name} left room ${room.name}`);
          }
        }
      });

      // Handle disconnection
      socket.on('disconnect', () => {
        const roomId = socketRooms.get(socket.id);
        if (!roomId) return;

        const room = roomManager.getRoom(roomId);
        if (!room) return;

        const user = room.users.find(u => u.id === socket.id);
        if (user) {
          user.connected = false;
          io.to(roomId).emit('userLeft', socket.id);
          io.to(roomId).emit('roomUpdate', room);
          console.log(`User ${user.name} disconnected from room ${room.name}`);

          // Clean up disconnected users after 5 minutes
          setTimeout(() => {
            const currentRoom = roomManager.getRoom(roomId);
            if (!currentRoom) return;

            const index = currentRoom.users.findIndex(u => u.id === socket.id);
            if (index >= 0 && !currentRoom.users[index].connected) {
              currentRoom.users.splice(index, 1);
              io.to(roomId).emit('roomUpdate', currentRoom);
              socketRooms.delete(socket.id);
              console.log(`Removed disconnected user ${user.name} from room ${currentRoom.name}`);
            }
          }, 5 * 60 * 1000);
        }
      });
    });

    socketServer.io = io;
  } else {
    console.log('Socket.IO server already running');
  }

  res.end();
}
