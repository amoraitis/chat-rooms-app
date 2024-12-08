interface Room {
  id: string;
  name: string;
}

interface ChatMessage {
  roomId: string;
  senderName: string;
  message: string;
  timestamp: string;
}
