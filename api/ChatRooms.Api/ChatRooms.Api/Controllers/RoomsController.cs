using System.Net;
using ChatRooms.Api.Models;
using ChatRooms.Api.Services;

namespace ChatRooms.Api.Controllers
{

    using Microsoft.AspNetCore.Mvc;

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

        [HttpGet("{id}/history")]
        public async Task<ActionResult<string>> GetRoomHistoryBy(string id)
        {
            var messages = await _chatService.GetMessagesAsync(id);

            return Ok(messages);
        }

        [HttpPost]
        public async Task<IActionResult> CreateRoom([FromBody] Room room)
        {
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