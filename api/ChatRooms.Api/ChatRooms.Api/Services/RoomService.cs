using ChatRooms.Api.Models;
using MongoDB.Driver;
using MongoDB.Driver.Linq;

namespace ChatRooms.Api.Services
{
    /// <summary>
    /// The Room service.
    /// </summary>
    public interface IRoomService
    {
        /// <summary>
        /// Get the list of rooms.
        /// </summary>
        /// <returns>The list of rooms.</returns>
        Task<List<Room>> GetRoomsAsync();

        /// <summary>
        /// Create a room/
        /// </summary>
        /// <param name="room">The room.</param>
        /// <returns>The task.</returns>
        Task<Room> CreateRoomAsync(Room room);

        Task<bool> DeleteRoomAsync(string id);

        Task<Room> GetRoomByIdAsync(string id);
    }

    /// <inheritdoc />
    public class RoomService : IRoomService
    {
        private readonly IMongoCollection<Room> _rooms;

        public RoomService(IMongoDatabase database)
        {
            _rooms = database.GetCollection<Room>("Rooms");
        }

        /// <inheritdoc />
        public async Task<Room> CreateRoomAsync(Room room)
        {
            await _rooms.InsertOneAsync(room);

            return room;
        }

        public async Task<bool> DeleteRoomAsync(string id)
        {
            var result = await _rooms.DeleteOneAsync(room => room.Id != null && room.Id.Equals(id));
            return result.DeletedCount > 0;
        }

        public async Task<Room> GetRoomByIdAsync(string id)
        {
            var result = await _rooms.FindAsync(r => r.Id != null && r.Id.Equals(id));
            return result.FirstOrDefault();
        }

        /// <inheritdoc />
        public async Task<List<Room>> GetRoomsAsync()
        {
            return await _rooms.AsQueryable().ToListAsync();
        }

    }
}
