using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using VstsProjectMonitor.Platform;
using VstsProjectMonitor.Repository;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Service.Controllers;

namespace VstsProjectMonitor.Service.Tests.Controllers
{
    [TestClass]
    public class ProjectControllerTests
    {
        [TestMethod, TestCategory("Unit")]
        public void ShouldReturnProjects()
        {
            // arrange
            IProjectsFactory fakeProjectsFactory = new FakeProjectsFactory(new Projects(2, new List<Project>
            {
                new Project("1", "thing1"),
                new Project("2", "thing2")
            }));
            ProjectController projectController = new Privateer().Object<ProjectController>(fakeProjectsFactory);

            // act
            OkObjectResult okObjectResult = (OkObjectResult) projectController.Projects();

            // assert
            okObjectResult.StatusCode.Should().Be(200);
            Projects projects = (Projects) okObjectResult.Value;
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(projects));
            jObject["count"].Value<int>().Should().Be(2);
            jObject["projects"].Should().HaveCount(2);
            jObject["projects"][0]["id"].Value<string>().Should().Be("1");
            jObject["projects"][0]["name"].Value<string>().Should().Be("thing1");
            jObject["projects"][1]["id"].Value<string>().Should().Be("2");
            jObject["projects"][1]["name"].Value<string>().Should().Be("thing2");
        }
    }

    public class FakeProjectsFactory : IProjectsFactory
    {
        private readonly Projects _projects;

        public FakeProjectsFactory(Projects projects)
        {
            _projects = projects;
        }

        public Projects Create() => _projects;
    }
}