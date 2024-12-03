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
        Task CreateRoomAsync(Room room);
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
        public async Task CreateRoomAsync(Room room)
        {
            await _rooms.InsertOneAsync(room);
        }

        /// <inheritdoc />
        public async Task<List<Room>> GetRoomsAsync()
        {
            return await _rooms.AsQueryable().ToListAsync();
        }

    }
}
