using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using System.Threading.Tasks;
using VstsProjectMonitor.Repository;

namespace VstsProjectMonitor.Service.Controllers
{
    [Route("api")]
    public class BugController : Controller
    {
        private readonly IBugsFactory _bugsFactory;

        public BugController(IConfiguration configuration) : this(new BugsFactory(configuration)) { }

        private BugController(IBugsFactory bugsFactory)
        {
            _bugsFactory = bugsFactory;
        }

        [HttpGet, Route("{projectName}/bug")]
        public async Task<IActionResult> Bugs(string projectName)
        {
            if (string.IsNullOrWhiteSpace(projectName)) return BadRequest();

            return Ok(await _bugsFactory.Create(projectName));
        }
    }
}