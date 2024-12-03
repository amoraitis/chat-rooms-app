namespace ChatRooms.Api.Models
{
    public class Room
    {
        public string Id { get; set; } // MongoDB's BSON Id
        public DateTime Timestamp { get; set; }
        public string Name { get; set; }
        public string Description { get; set; }
    }
}
