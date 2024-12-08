import * as signalR from "@microsoft/signalr";

class SignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5131/chat", {withCredentials: false})
      .withAutomaticReconnect()
      .build();
  }

  async start() {
    if (this.connection.state === signalR.HubConnectionState.Connected) return;

    try {
      await this.connection.start();
      console.log("SignalR connected.");
    } catch (err) {
      console.error("Error starting SignalR connection:", err);
    }
  }

  async sendMessage(roomId: string, senderName: string, message: string, timestamp: string) {
    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn("SignalR connection is not in the 'Connected' state.");
      return;
    }

    try {
      await this.connection.invoke("SendMessage", roomId, senderName, message, timestamp);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  onReceiveMessage(callback: (senderName: string, message: string, timestamp: string) => void) {
    this.connection.on("ReceiveMessage", callback);
  }

  async joinRoom(roomId: string) {
    setTimeout(async () => {
      if (this.connection.state !== signalR.HubConnectionState.Connected) {
        console.warn("SignalR connection is not in the 'Connected' state.");
        return;
      }
  
      try {
        await this.connection.invoke("JoinRoom", roomId);
      } catch (err) {
        console.error("Error joining room:", err);
      }
    }, 150);
  }

  async leaveRoom(roomId: string) {
    if (this.connection.state !== signalR.HubConnectionState.Connected) {
      console.warn("SignalR connection is not in the 'Connected' state.");
      return;
    }

    try {
      await this.connection.invoke("LeaveRoom", roomId);
    } catch (err) {
      console.error("Error leaving room:", err);
    }
  }
}

export const signalRService = new SignalRService();
