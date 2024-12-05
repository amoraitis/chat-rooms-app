using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson;

namespace ChatRooms.Api.Models
{
    public class Room
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string? Id { get; set; } 
        public DateTime? Timestamp { get; set; }
        public string Name { get; set; }
        public string? Description { get; set; }
    }
}
