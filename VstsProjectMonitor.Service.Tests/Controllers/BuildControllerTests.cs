using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using VstsProjectMonitor.Platform;
using VstsProjectMonitor.Repository;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Service.Controllers;

namespace VstsProjectMonitor.Service.Tests.Controllers
{
    [TestClass]
    public class BuildControllerTests
    {
        [TestMethod, TestCategory("Unit")]
        public void WhenCallingBuildsByDefinition_ShouldCacheAndReturnBuilds()
        {
            const string projectName = "StricklandPropane-CI";
            const string result = "result";
            const string status = "status";
            const int hanksDefinitionId = 11;
            const string hanksBuildNumber = "1.2.3.4";
            const string hanksDefinitionName = "The Hill's CI";
            const int peggysDefinitionId = 12;
            const string peggysBuildNumber = "1.0.0.1";
            const string peggysDefinitionName = "Peggy's Quilting Seminar CI";

            IBuildsFactory fakeBuildsFactory = new FakeBuildsFactory(2, new List<Build>
            {
                new Build(status, result, hanksBuildNumber, DateTime.Today, new Definition(hanksDefinitionId, hanksDefinitionName), new RequestedFor("Hank Hill", "http://image.shack.usa/hankhill")),
                new Build(status, result, peggysBuildNumber, DateTime.Today, new Definition(peggysDefinitionId, peggysDefinitionName), new RequestedFor("Peggy Hill", "http://image.shack.usa/peggyhill"))
            });

            MemoryCache memoryCache = new MemoryCache(new MemoryCacheOptions());
            BuildController controller = new Privateer().Object<BuildController>(fakeBuildsFactory, memoryCache);

            // act
            OkObjectResult okObjectResult = (OkObjectResult)controller.BuildsByDefinition(projectName, new List<int> { hanksDefinitionId, peggysDefinitionId });
            
            // assert
            okObjectResult.StatusCode.Should().Be(200);
            Builds builds = (Builds)okObjectResult.Value;
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(builds));

            jObject["count"].Value<int>().Should().Be(2);
            jObject["builds"].Should().HaveCount(2);

            jObject["builds"][0]["status"].Value<string>().Should().Be(status);
            jObject["builds"][0]["result"].Value<string>().Should().Be(result);
            jObject["builds"][0]["buildNumber"].Value<string>().Should().Be(hanksBuildNumber);
            jObject["builds"][0]["definition"]["id"].Value<int>().Should().Be(hanksDefinitionId);
            jObject["builds"][0]["definition"]["name"].Value<string>().Should().Be(hanksDefinitionName);

            jObject["builds"][1]["status"].Value<string>().Should().Be(status);
            jObject["builds"][1]["result"].Value<string>().Should().Be(result);
            jObject["builds"][1]["buildNumber"].Value<string>().Should().Be(peggysBuildNumber);
            jObject["builds"][1]["definition"]["id"].Value<int>().Should().Be(peggysDefinitionId);
            jObject["builds"][1]["definition"]["name"].Value<string>().Should().Be(peggysDefinitionName);

            memoryCache.TryGetValue($"{projectName}-{hanksDefinitionId}-{peggysDefinitionId}", out Builds cachedBuilds);
            cachedBuilds.Should().Be(builds);
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenCachedBuilds_WhenCallingBuildsByDefinition_ShouldReturnBuildsFromCache()
        {
            const string projectName = "StricklandPropane-CI";
            const string result = "result";
            const string status = "status";
            const int hanksDefinitionId = 11;
            const string hanksBuildNumber = "1.2.3.4";
            const string hanksDefinitionName = "TheHillsCI";
            const int peggysDefinitionId = 12;
            const string peggysBuildNumber = "1.0.0.1";
            const string peggysDefinitionName = "PeggysQuiltingSeminarCI";

            Build hanksBuild = new Build("some-other-status", result, hanksBuildNumber, DateTime.Today, new Definition(hanksDefinitionId, hanksDefinitionName), new RequestedFor("Hank Hill", "http://image.shack.usa/hankhill"));
            Build peggysBuild = new Build("some-other-status", result, peggysBuildNumber, DateTime.Today, new Definition(peggysDefinitionId, peggysDefinitionName), new RequestedFor("Peggy Hill", "http://image.shack.usa/peggyhill"));
            IBuildsFactory fakeBuildsFactory = new FakeBuildsFactory(2, new List<Build>
            {
                hanksBuild,
                peggysBuild
            });

            MemoryCache memoryCache = new MemoryCache(new MemoryCacheOptions());
            Build hanksCachedBuild = new Build(status, result, hanksBuildNumber, DateTime.Today, new Definition(hanksDefinitionId, hanksDefinitionName), new RequestedFor("Hank Hill", "http://image.shack.usa/hankhill"));
            Build peggysCachedBuild = new Build(status, result, peggysBuildNumber, DateTime.Today, new Definition(peggysDefinitionId, peggysDefinitionName), new RequestedFor("Peggy Hill", "http://image.shack.usa/peggyhill"));
            memoryCache.Set($"{projectName}-{hanksDefinitionId}-{peggysDefinitionId}", new Builds(2, new List<Build> { hanksCachedBuild, peggysCachedBuild }));


            BuildController controller = new Privateer().Object<BuildController>(fakeBuildsFactory, memoryCache);

            // act
            OkObjectResult okObjectResult = (OkObjectResult)controller.BuildsByDefinition(projectName, new List<int> { hanksDefinitionId, peggysDefinitionId });
            
            // assert
            okObjectResult.StatusCode.Should().Be(200);
            Builds builds = (Builds)okObjectResult.Value;
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(builds));

            jObject["count"].Value<int>().Should().Be(2);
            jObject["builds"].Should().HaveCount(2);
            jObject["builds"][0]["status"].Value<string>().Should().Be(status);
            jObject["builds"][1]["status"].Value<string>().Should().Be(status);
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenEmptyProjectName_WhenCallingBuildsByDefinition_ShouldThrowException()
        {
            // arrange
            const string result = "result";
            const string status = "status";
            const int definitionId = 11;
            const string buildNumber = "1.2.3.4";
            const string definitionName = "The Hill's CI";

            IBuildsFactory fakeBuildsFactory = new FakeBuildsFactory(1, new List<Build>
            {
                new Build(status, result, buildNumber, DateTime.Today, new Definition(definitionId, definitionName), new RequestedFor("Hank Hill", "http://image.shack.usa/hankhill"))
            });

            IPrivateer privateer = new Privateer();
            BuildController controller = privateer.Object<BuildController>(fakeBuildsFactory, new MemoryCache(new MemoryCacheOptions()));

            // act
            BadRequestResult badRequestResult = (BadRequestResult)controller.BuildsByDefinition(string.Empty, new List<int> { definitionId });

            // assert
            badRequestResult.Should().BeOfType<BadRequestResult>();
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenEmptyDefinitions_WhenCallingBuildsByDefinition_ShouldThrowException()
        {
            // arrange
            const string result = "result";
            const string status = "status";
            const int definitionId = 11;
            const string buildNumber = "1.2.3.4";
            const string definitionName = "The Hill's CI";

            IBuildsFactory fakeBuildsFactory = new FakeBuildsFactory(1, new List<Build>
            {
                new Build(status, result, buildNumber, DateTime.Today, new Definition(definitionId, definitionName), new RequestedFor("Hank Hill", "http://image.shack.usa/hankhill"))
            });

            IPrivateer privateer = new Privateer();
            BuildController controller = privateer.Object<BuildController>(fakeBuildsFactory, new MemoryCache(new MemoryCacheOptions()));

            // act
            BadRequestResult badRequestResult = (BadRequestResult)controller.BuildsByDefinition("project", new List<int>());

            // assert
            badRequestResult.Should().BeOfType<BadRequestResult>();
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenNullDefinitions_WhenCallingBuildsByDefinition_ShouldThrowException()
        {
            // arrange
            const string result = "result";
            const string status = "status";
            const int definitionId = 11;
            const string buildNumber = "1.2.3.4";
            const string definitionName = "The Hill's CI";

            IBuildsFactory fakeBuildsFactory = new FakeBuildsFactory(1, new List<Build>
            {
                new Build(status, result, buildNumber, DateTime.Today, new Definition(definitionId, definitionName), new RequestedFor("Hank Hill", "http://image.shack.usa/hankhill"))
            });

            IPrivateer privateer = new Privateer();
            BuildController controller = privateer.Object<BuildController>(fakeBuildsFactory, new MemoryCache(new MemoryCacheOptions()));

            // act
            BadRequestResult badRequestResult = (BadRequestResult)controller.BuildsByDefinition("project", null);

            // assert
            badRequestResult.Should().BeOfType<BadRequestResult>();
        }

        [TestMethod, TestCategory("Unit")]
        public void WhenCallingBuilds_ShouldReturnBuilds()
        {
            // arrange
            const string result = "result";
            const string status = "status";
            const int definitionId = 11;
            const string buildNumber = "1.2.3.4";
            const string definitionName = "The Hill's CI";

            IBuildsFactory fakeBuildsFactory = new FakeBuildsFactory(1, new List<Build>
            {
                new Build(status, result, buildNumber, DateTime.Today, new Definition(definitionId, definitionName), new RequestedFor("Hank Hill", "http://image.shack.usa/hankhill"))
            });

            BuildController controller = new Privateer().Object<BuildController>(fakeBuildsFactory, new MemoryCache(new MemoryCacheOptions()));

            // act
            OkObjectResult okObjectResult = (OkObjectResult) controller.Builds("StricklandPropane-CI");

            // assert
            okObjectResult.StatusCode.Should().Be(200);
            Builds builds = (Builds) okObjectResult.Value;
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(builds));

            jObject["count"].Value<int>().Should().Be(1);
            jObject["builds"].Should().HaveCount(1);

            jObject["builds"][0]["status"].Value<string>().Should().Be(status);
            jObject["builds"][0]["result"].Value<string>().Should().Be(result);
            jObject["builds"][0]["buildNumber"].Value<string>().Should().Be(buildNumber);

            jObject["builds"][0]["definition"]["id"].Value<int>().Should().Be(definitionId);
            jObject["builds"][0]["definition"]["name"].Value<string>().Should().Be(definitionName);
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenEmptyProjectName_WhenCallingBuilds_ShouldThrowException()
        {
            // arrange
            const string result = "result";
            const string status = "status";
            const int definitionId = 11;
            const string buildNumber = "1.2.3.4";
            const string definitionName = "The Hill's CI";

            IBuildsFactory fakeBuildsFactory = new FakeBuildsFactory(1, new List<Build>
            {
                new Build(status, result, buildNumber, DateTime.Today, new Definition(definitionId, definitionName), new RequestedFor("Hank Hill", "http://image.shack.usa/hankhill"))
            });

            IPrivateer privateer = new Privateer();
            BuildController controller = privateer.Object<BuildController>(fakeBuildsFactory, new MemoryCache(new MemoryCacheOptions()));

            // act
            BadRequestResult badRequestResult = (BadRequestResult) controller.Builds(string.Empty);

            // assert
            badRequestResult.Should().BeOfType<BadRequestResult>();
        }
    }

    public class FakeBuildsFactory : IBuildsFactory
    {
        private readonly int _count;
        private readonly ICollection<Build> _builds;

        public FakeBuildsFactory(int count, ICollection<Build> builds)
        {
            _count = count;
            _builds = builds;
        }

        public Builds Create(string projectName) => new Builds(_count, _builds);
        public Builds Create(string projectName, IEnumerable<int> buildDefinitionIds) => new Builds(_count, _builds);
    }
}
