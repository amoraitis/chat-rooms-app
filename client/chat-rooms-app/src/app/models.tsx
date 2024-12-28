interface Room {
  id: string | undefined;
  name: string | undefined;
}

interface ChatMessage {
  roomId: string;
  senderName: string;
  message: string;
  timestamp: string;
}

interface RoomHistoryResponse {
  messages: ChatMessage[];
  room: Room
}