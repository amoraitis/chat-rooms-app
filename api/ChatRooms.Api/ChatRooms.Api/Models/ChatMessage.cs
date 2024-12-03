namespace ChatRooms.Api.Models
{
    public class ChatMessage
    {
        public string Id { get; set; } // MongoDB's BSON Id
        public string RoomId { get; set; }
        public string SenderName { get; set; }
        public string Message { get; set; }
        public DateTime Timestamp { get; set; }
    }
}
