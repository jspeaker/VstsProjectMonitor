using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using VstsProjectMonitor.Repository;
using VstsProjectMonitor.Repository.Models;

namespace VstsProjectMonitor.Service.Controllers
{
    [Route("api")]
    public class BuildController : Controller
    {
        private readonly IBuildsFactory _buildsFactory;
        private readonly IMemoryCache _memoryCache;
        public BuildController(IConfiguration configuration, IMemoryCache memoryCache) : this(new BuildsFactory(configuration), memoryCache) { }

        private BuildController(IBuildsFactory buildsFactory, IMemoryCache memoryCache)
        {
            _buildsFactory = buildsFactory;
            _memoryCache = memoryCache;
        }

        [HttpGet, Route("{projectName}/build")]
        public IActionResult Builds(string projectName)
        {
            if (string.IsNullOrWhiteSpace(projectName)) return new BadRequestResult();

            return Ok(_buildsFactory.Create(projectName));
        }

        [HttpGet, Route("{projectName}/{definitions}/build")]
        public IActionResult BuildsByDefinition(string projectName, IList<int> definitions)
        {
            if (string.IsNullOrWhiteSpace(projectName)) return new BadRequestResult();
            if (definitions == null || !definitions.Any()) return new BadRequestResult();

            string cacheKey = $"{projectName}-{string.Join("-", definitions)}";
            if (_memoryCache.TryGetValue(cacheKey, out Builds builds)) return Ok(builds);

            return Ok(_memoryCache.Set(cacheKey, _buildsFactory.Create(projectName, definitions), DateTimeOffset.Now.AddSeconds(15)));
        }
    }
}
