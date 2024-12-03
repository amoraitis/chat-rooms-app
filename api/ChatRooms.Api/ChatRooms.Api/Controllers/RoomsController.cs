using ChatRooms.Api.Models;
using ChatRooms.Api.Services;

namespace ChatRooms.Api.Controllers
{

    using Microsoft.AspNetCore.Mvc;

    [Route("api/")]
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
        [HttpGet("rooms")]
        public async Task<IActionResult> GetRooms()
        {
            var rooms = await _roomService.GetRoomsAsync();

            return Ok(rooms);
        }

        [HttpGet("room/{id}/history")]
        public async Task<ActionResult<string>> GetRoomHistoryBy(string id)
        {
            var messages = await _chatService.GetMessagesAsync(id);

            return Ok(messages);
        }

        [HttpPost("room")]
        public async Task<IActionResult> CreateRoom([FromBody] Room room)
        {
            await _roomService.CreateRoomAsync(room);

            return Ok();
        }
    }
}