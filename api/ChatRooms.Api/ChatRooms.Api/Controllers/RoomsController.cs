using System.Net;
using ChatRooms.Api.Models;
using ChatRooms.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatRooms.Api.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class ChatsController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly IChatService _chatService;

        public ChatsController(IRoomService roomService, IChatService chatService)
        {
            _roomService = roomService;
            _chatService = chatService;
        }

        [HttpGet]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _roomService.GetRoomsAsync();

            return Ok(rooms);
        }

        [HttpGet(@"{id}/history")]
        public async Task<IActionResult> GetRoomHistoryBy(string id)
        {
            var messagesGetter = _chatService.GetMessagesAsync(id);
            var roomGetter = _roomService.GetRoomByIdAsync(id);

            await Task.WhenAll(messagesGetter, roomGetter);

            return Ok(new
            {
                Room = roomGetter.Result,
                Messages = messagesGetter.Result
            });
        }

        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] Room room)
        {
            room.Timestamp = DateTime.UtcNow;
            var insertedRoom = await _roomService.CreateRoomAsync(room);

            return Ok(insertedRoom);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteRoom(string id)
        {
            var deleted = await _roomService.DeleteRoomAsync(id);

            if (deleted == false)
            {
                return this.NotFound();
            }

            return this.NoContent();
        }
    }
}