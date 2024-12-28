import * as signalR from "@microsoft/signalr";

class SignalRService {
  private connection: signalR.HubConnection;

  constructor() {
    this.connection = new signalR.HubConnectionBuilder()
      .withUrl("http://localhost:5131/chat", {withCredentials: false})
      .withAutomaticReconnect()
      .build();
  }

  isConnected() { 
    return this.connection && signalRService.connection.state === "Connected";
  }

  async start() {
    try {
      await this.connection.start();
      console.log("SignalR connected.");
    } catch (err) {
      console.error("Error starting SignalR connection:", err);
    }
  }

  async stop() {
    try {
      await this.connection.stop();
      console.log("SignalR disconnected.");
    } catch (err) {
      console.error("Error stopping SignalR connection:", err);
    }
  }

  async sendMessage(roomId: string, senderName: string, message: string, timestamp: string) {
    try {
      await this.connection.invoke("SendMessage", roomId, senderName, message, timestamp);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  }

  onReceiveMessage(callback: (senderName: string, message: string, timestamp: string) => void) {
    this.connection.on("ReceiveMessage", callback);
  }

  offReceiveMessage(callback: (senderName: string, message: string, timestamp: string) => void){
    signalRService.connection.off("ReceiveMessage", callback);
  }

  async joinRoom(roomId: string) {
  
      try {
        await this.connection.invoke("JoinRoom", roomId);
      } catch (err) {
        console.error("Error joining room:", err);
      }
  }

  async leaveRoom(roomId: string) {
    try {
      await this.connection.invoke("LeaveRoom", roomId);
    } catch (err) {
      console.error("Error leaving room:", err);
    }
  }
}

export const signalRService = new SignalRService();
