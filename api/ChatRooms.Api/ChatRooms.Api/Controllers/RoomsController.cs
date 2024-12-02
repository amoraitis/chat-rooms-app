namespace ChatRooms.Api.Controllers
{

    using Microsoft.AspNetCore.Mvc;

    [Route("api/")]
    [ApiController]
    public class ChatsController : ControllerBase
    {
        [HttpGet("rooms")]
        public async Task<IActionResult> GetRooms()
        {
            
            return Ok();
        }

        [HttpGet("room/{id}/history")]
        public async Task<ActionResult<string>> GetRoomHistoryBy(int id)
        {
            return Ok();            
        }
    }
}