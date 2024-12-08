const API_URL = "http://localhost:5131"; // process.env.NEXT_PUBLIC_API_URL;

export const apiService = {
  async getRooms(): Promise<Room[]> {
    const response = await fetch(`${API_URL}/api/rooms`);
    if (!response.ok) {
      throw new Error(`Failed to fetch rooms: ${response.statusText}`);
    }
    return response.json();
  },

  async createRoom(roomName: string): Promise<Room> {
    const response = await fetch(`${API_URL}/api/rooms`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: roomName }),
    });

    if (!response.ok) {
      throw new Error(`Failed to create room: ${response.statusText}`);
    }

    return response.json();
  },

  async deleteRoom(roomId: string): Promise<void> {
    const response = await fetch(`${API_URL}/api/rooms/${roomId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete room: ${response.statusText}`);
    }
  },

  async saveMessage(message: string, roomId: string, senderName: string): Promise<ChatMessage> {
    const response = await fetch(`${API_URL}/api/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: message,
        roomId: roomId,
        senderName: senderName,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to save message: ${response.statusText}`);
    }

    return response.json();
  },

  async fetchChatHistory(roomId: string): Promise<ChatMessage[]> {
    try {
      const response = await fetch(`${API_URL}/api/rooms/${roomId}/history`);

      if (response.ok) {
        return await response.json();
      } else {
        throw new Error("Failed to load chat history");
      }
    } catch (error) {
      throw new Error(`Error fetching chat history: ${error}`);
    }
  }
};
