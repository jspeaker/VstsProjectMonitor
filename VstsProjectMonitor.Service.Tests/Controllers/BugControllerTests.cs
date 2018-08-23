using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Threading.Tasks;
using VstsProjectMonitor.Platform;
using VstsProjectMonitor.Repository;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Service.Controllers;

namespace VstsProjectMonitor.Service.Tests.Controllers
{
    [TestClass]
    public class BugControllerTests
    {
        [TestMethod, TestCategory("Unit")]
        public void GivenProjectName_WhenAskingForBugs_ThenItShouldReturnBugs()
        {
            // arrange
            IBugsFactory fakeBugsFactory = new FakeBugsFactory(new Bugs(new List<Bug>
            {
                new Bug(1, "thing1"),
                new Bug(2, "thing2")
            }));

            BugController bugController = new Privateer().Object<BugController>(fakeBugsFactory);

            // act
            OkObjectResult okObjectResult = (OkObjectResult) bugController.Bugs("HankHill").Result;

            // assert
            okObjectResult.StatusCode.Should().Be(200);
            Bugs bugs = (Bugs) okObjectResult.Value;
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(bugs));
            jObject["bugs"].Should().HaveCount(2);
            jObject["bugs"][0]["id"].Value<int>().Should().Be(1);
            jObject["bugs"][0]["url"].Value<string>().Should().Be("thing1");
            jObject["bugs"][1]["id"].Value<int>().Should().Be(2);
            jObject["bugs"][1]["url"].Value<string>().Should().Be("thing2");
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenEmptyProjectName_WhenAskingForBugs_ThenItShouldReturnBadRequest()
        {
            // arrange
            IBugsFactory fakeBugsFactory = new FakeBugsFactory(new Bugs(new List<Bug>
            {
                new Bug(1, "thing1"),
                new Bug(2, "thing2")
            }));

            BugController bugController = new Privateer().Object<BugController>(fakeBugsFactory);

            // act
            BadRequestResult badRequestResult = (BadRequestResult) bugController.Bugs(string.Empty).Result;

            // assert
            badRequestResult.StatusCode.Should().Be(400);
        }
    }

    public class FakeBugsFactory : IBugsFactory
    {
        private readonly Bugs _bugs;

        public FakeBugsFactory(Bugs bugs)
        {
            _bugs = bugs;
        }

        public Task<Bugs> Create(string projectName) => Task.FromResult(_bugs);
    }
}