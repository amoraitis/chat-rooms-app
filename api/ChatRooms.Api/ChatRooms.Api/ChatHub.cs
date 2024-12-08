using Microsoft.AspNetCore.SignalR;

namespace ChatRooms.Api;

public class ChatHub : Hub
{
    public async Task SendMessage(string roomId, string username, string message, string timestamp)
    {
        // Broadcast message to all clients in the room
        await Clients.Group(roomId).SendAsync("ReceiveMessage", username, message, timestamp);
    }

    public async Task JoinRoom(string roomId)
    {
        await Groups.AddToGroupAsync(Context.ConnectionId, roomId);
    }

    public async Task LeaveRoom(string roomId)
    {
        await Groups.RemoveFromGroupAsync(Context.ConnectionId, roomId);
    }
}