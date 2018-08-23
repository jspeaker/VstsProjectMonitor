using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using VstsProjectMonitor.Repository;

namespace VstsProjectMonitor.Service.Controllers
{
    [Route("api")]
    public class BuildDefinitionController : Controller
    {
        private readonly IBuildDefinitionsFactory _buildDefinitionsFactory;

        public BuildDefinitionController(IConfiguration configuration) : this(new BuildDefinitionsFactory(configuration)) { }

        private BuildDefinitionController(IBuildDefinitionsFactory buildDefinitionsFactory)
        {
            _buildDefinitionsFactory = buildDefinitionsFactory;
        }

        [HttpGet, Route("{projectName}/build/definition")]
        public IActionResult BuildDefinitions(string projectName)
        {
            if (string.IsNullOrWhiteSpace(projectName)) return new BadRequestResult();

            return Ok(_buildDefinitionsFactory.Create(projectName));
        }
    }
}