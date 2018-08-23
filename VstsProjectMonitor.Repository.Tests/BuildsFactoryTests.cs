using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Net.Http;
using VstsProjectMonitor.Platform;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Repository.Networking;
using VstsProjectMonitor.Repository.Tests.Fakes;

namespace VstsProjectMonitor.Repository.Tests
{
    [TestClass]
    public class BuildsFactoryTests
    {
        private IConfiguration _configuration;
        private VstsHttpService _vstsHttpService;

        [TestMethod, TestCategory("Unit")]
        public void GivenProjectNameAndDefinitionId_ShouldHydrateBuilds()
        {
            // arrange
            const string projectName = "POCs";
            List<int> buildDefinitionIds = new List<int> { 1, 2 };
            _configuration = new InMemoryConfiguration().Instance();
            _vstsHttpService = new VstsHttpService(new Uri(_configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(new TestData().Builds(), new Uri(new Uri(_configuration["VstsApi:BaseUrl"]), $"/POCs/_apis/build/builds?definitions={string.Join(",", buildDefinitionIds)}&api-version=5.0-preview.4"), _configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>(_vstsHttpService, "_httpClient", null);

            IBuildsFactory buildsFactory = new BuildsFactory(_vstsHttpService, _configuration);

            // act
            Builds buildsResult = buildsFactory.Create(projectName, buildDefinitionIds);

            // assert
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(buildsResult));
            jObject.Value<int>("count").Should().Be(2);
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenProjectName_ShouldHydrateBuilds()
        {
            // arrange
            const string projectName = "POCs";
            _configuration = new InMemoryConfiguration().Instance();
            _vstsHttpService = new VstsHttpService(new Uri(_configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(new TestData().Builds(), new Uri(new Uri(_configuration["VstsApi:BaseUrl"]), "/POCs/_apis/build/builds?api-version=5.0-preview.4"), _configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>(_vstsHttpService, "_httpClient", null);

            IBuildsFactory buildsFactory = new BuildsFactory(_vstsHttpService, _configuration);

            // act
            Builds buildsResult = buildsFactory.Create(projectName);

            // assert
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(buildsResult));
            jObject.Value<int>("count").Should().Be(2);

            JToken jBuilds = jObject["builds"];
            jBuilds.Should().HaveCount(2);
            jBuilds[0].Value<string>("status").Should().Be("inProgress");
            jBuilds[1].Value<string>("status").Should().Be("completed");
            jBuilds[0].Value<string>("result").Should().Be("pending");
            jBuilds[1].Value<string>("result").Should().Be("succeeded");
            jBuilds[0].Value<string>("buildNumber").Should().Be("1.0.0.2");
            jBuilds[1].Value<string>("buildNumber").Should().Be("20180401.7");

            DateTime dateTime1 = DateTime.Parse("2018-05-17T03:56:10.1694968Z");
            jBuilds[0].Value<DateTime>("startTime").AddHours(TimeZoneInfo.Local.GetUtcOffset(dateTime1).TotalHours).Should().Be(dateTime1);

            DateTime dateTime2 = DateTime.Parse("2018-04-01T22:42:00.0890697Z");
            jBuilds[1].Value<DateTime>("startTime").AddHours(TimeZoneInfo.Local.GetUtcOffset(dateTime2).TotalHours).Should().Be(dateTime2);

            JObject jDefinition = jBuilds[0].Value<JObject>("definition");
            jDefinition["id"].Value<int>().Should().Be(3);
            jDefinition["name"].Value<string>().Should().Be("Honest Joe's CI");

            JObject jRequestedFor = jBuilds[0].Value<JObject>("requestedFor");
            jRequestedFor["displayName"].Value<string>().Should().Be("Jim Speaker");
            jRequestedFor["imageUrl"].Value<string>().Should().Be("https://iontechdotorg.visualstudio.com/_api/_common/identityImage?id=f9a18dab-76b3-42bc-bb3a-103865994dae");
        }
    }
}
