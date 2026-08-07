export interface User {
  id: string;
  name: string;
  vote: string | null;
  connected: boolean;
}

export interface Room {
  id: string;
  name: string;
  story: string;
  users: User[];
  revealed: boolean;
  createdAt: number;
  lastActivity: number;
}

export interface RoomListItem {
  id: string;
  name: string;
  userCount: number;
  createdAt: number;
  lastActivity: number;
}

export const FIBONACCI_VALUES = [
  '0', '1', '2', '3', '5', '8', '13', '21', '34', '55', '89', '144', '233', '377', '610', '987', '1597', '?'
];

export const MAX_ROOMS = 10;
export const ROOM_INACTIVITY_DAYS = 7;

export interface SocketEvents {
  // Client to Server
  joinRoom: (roomId: string, userName: string) => void;
  createRoom: (roomName: string, userName: string) => void;
  getRoomList: () => void;
  vote: (value: string | null) => void;
  reveal: () => void;
  reset: () => void;
  updateStory: (story: string) => void;
  leaveRoom: () => void;
  
  // Server to Client
  roomUpdate: (room: Room) => void;
  roomList: (rooms: RoomListItem[]) => void;
  userJoined: (user: User) => void;
  userLeft: (userId: string) => void;
  error: (message: string) => void;
  roomCreated: (roomId: string) => void;
}
