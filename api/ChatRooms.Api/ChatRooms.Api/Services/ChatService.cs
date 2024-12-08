using ChatRooms.Api.Models;
using MongoDB.Driver;

namespace ChatRooms.Api.Services
{
    /// <summary>
    /// The Chat service.
    /// </summary>
    public interface IChatService
    {
        /// <summary>
        /// Save a message.
        /// </summary>
        /// <param name="message">The message.</param>
        /// <returns>The Task</returns>
        Task<ChatMessage> SaveMessageAsync(ChatMessage message);

        /// <summary>
        /// Get the messages by room Id.
        /// </summary>
        /// <param name="roomId">The room Id.</param>
        /// <returns>The list of messages.</returns>
        Task<List<ChatMessage>> GetMessagesAsync(string roomId);
    }

    /// <inheritdoc />
    public class ChatService : IChatService
    {
        private readonly IMongoCollection<ChatMessage> _messages;

        public ChatService(IMongoDatabase database)
        {
            _messages = database.GetCollection<ChatMessage>("Messages");
        }

        /// <inheritdoc />
        public async Task<ChatMessage> SaveMessageAsync(ChatMessage message)
        {
            await _messages.InsertOneAsync(message);

            return message;
        }

        /// <inheritdoc />
        public async Task<List<ChatMessage>> GetMessagesAsync(string roomId)
        {
            return await _messages.Find(m => m.RoomId == roomId).ToListAsync();
        }
    }

}
