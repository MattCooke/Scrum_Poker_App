import { Room, RoomListItem, MAX_ROOMS, ROOM_INACTIVITY_DAYS } from '@/types';

class RoomManager {
  private rooms: Map<string, Room> = new Map();
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor() {
    this.startCleanupSchedule();
  }

  /**
   * Start automatic cleanup of inactive rooms
   * Runs every hour to check for rooms older than ROOM_INACTIVITY_DAYS
   */
  private startCleanupSchedule() {
    // Run cleanup every hour
    this.cleanupInterval = setInterval(() => {
      this.cleanupInactiveRooms();
    }, 60 * 60 * 1000);

    // Also run on startup
    this.cleanupInactiveRooms();
  }

  /**
   * Clean up rooms that haven't been used in ROOM_INACTIVITY_DAYS
   */
  private cleanupInactiveRooms() {
    const now = Date.now();
    const expiryTime = ROOM_INACTIVITY_DAYS * 24 * 60 * 60 * 1000;
    
    const roomsToDelete: string[] = [];

    this.rooms.forEach((room, roomId) => {
      const inactiveDuration = now - room.lastActivity;
      
      // Remove rooms inactive for more than ROOM_INACTIVITY_DAYS
      if (inactiveDuration > expiryTime) {
        roomsToDelete.push(roomId);
        console.log(`Cleaning up inactive room: ${room.name} (${roomId}), last active: ${new Date(room.lastActivity).toISOString()}`);
      }
    });

    roomsToDelete.forEach(roomId => {
      this.rooms.delete(roomId);
    });

    if (roomsToDelete.length > 0) {
      console.log(`Cleaned up ${roomsToDelete.length} inactive room(s)`);
    }
  }

  /**
   * Create a new room
   */
  createRoom(name: string): Room | null {
    // Check if we've reached the maximum number of rooms
    if (this.rooms.size >= MAX_ROOMS) {
      // Try cleaning up first
      this.cleanupInactiveRooms();
      
      // Check again after cleanup
      if (this.rooms.size >= MAX_ROOMS) {
        console.log(`Cannot create room: Maximum of ${MAX_ROOMS} rooms reached`);
        return null;
      }
    }

    const roomId = this.generateRoomId();
    const now = Date.now();

    const room: Room = {
      id: roomId,
      name: name || `Room ${roomId.substring(0, 6)}`,
      story: '',
      users: [],
      revealed: false,
      createdAt: now,
      lastActivity: now,
    };

    this.rooms.set(roomId, room);
    console.log(`Created room: ${room.name} (${roomId})`);
    
    return room;
  }

  /**
   * Get a room by ID
   */
  getRoom(roomId: string): Room | undefined {
    const room = this.rooms.get(roomId);
    
    if (room) {
      // Update last activity
      room.lastActivity = Date.now();
    }
    
    return room;
  }

  /**
   * Get list of all active rooms
   */
  getRoomList(): RoomListItem[] {
    const roomList: RoomListItem[] = [];

    this.rooms.forEach((room) => {
      roomList.push({
        id: room.id,
        name: room.name,
        userCount: room.users.filter(u => u.connected).length,
        createdAt: room.createdAt,
        lastActivity: room.lastActivity,
      });
    });

    // Sort by most recently active first
    return roomList.sort((a, b) => b.lastActivity - a.lastActivity);
  }

  /**
   * Delete a room
   */
  deleteRoom(roomId: string): boolean {
    const deleted = this.rooms.delete(roomId);
    if (deleted) {
      console.log(`Deleted room: ${roomId}`);
    }
    return deleted;
  }

  /**
   * Update room activity timestamp
   */
  updateRoomActivity(roomId: string) {
    const room = this.rooms.get(roomId);
    if (room) {
      room.lastActivity = Date.now();
    }
  }

  /**
   * Generate a unique room ID
   */
  private generateRoomId(): string {
    return `room_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  }

  /**
   * Clean up on shutdown
   */
  destroy() {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
    }
  }
}

// Singleton instance
export const roomManager = new RoomManager();
