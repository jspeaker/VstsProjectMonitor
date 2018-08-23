using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using VstsProjectMonitor.Repository;

namespace VstsProjectMonitor.Service.Controllers
{
    [Route("api")]
    public class ProjectController : Controller
    {
        private readonly IProjectsFactory _projectsFactory;

        public ProjectController(IConfiguration configuration) : this(new ProjectsFactory(configuration)) { }

        private ProjectController(IProjectsFactory projectsFactory)
        {
            _projectsFactory = projectsFactory;
        }

        [HttpGet, Route("project")]
        public IActionResult Projects() => Ok(_projectsFactory.Create());
    }
}