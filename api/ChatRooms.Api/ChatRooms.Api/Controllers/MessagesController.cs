using ChatRooms.Api.Models;
using ChatRooms.Api.Services;
using Microsoft.AspNetCore.Mvc;

namespace ChatRooms.Api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private readonly IChatService _chatService;

        public MessagesController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpPost]
        public async Task<IActionResult> SaveMessage([FromBody] ChatMessage message)
        {
            message.Timestamp = DateTime.UtcNow;
            var result = await _chatService.SaveMessageAsync(message);

            return Ok(result);
        }
    }
}
