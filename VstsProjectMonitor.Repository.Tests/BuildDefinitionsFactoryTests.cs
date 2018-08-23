using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using VstsProjectMonitor.Platform;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Repository.Networking;
using VstsProjectMonitor.Repository.Tests.Fakes;

namespace VstsProjectMonitor.Repository.Tests
{
    [TestClass]
    public class BuildDefinitionsFactoryTests
    {
        private IConfiguration _configuration;
        private VstsHttpService _vstsHttpService;
        private const string Project = "StricklandPropaneAccessories";

        [TestInitialize]
        public void Setup()
        {
            _configuration = new InMemoryConfiguration().Instance();
            _vstsHttpService = new VstsHttpService(
                new Uri(_configuration["VstsApi:BaseUrl"]), 
                new FakeHttpMessageHandler(
                    new TestData().BuildDefinitions(), 
                    new Uri(new Uri(_configuration["VstsApi:BaseUrl"]), $"/{Project}/_apis/build/definitions?api-version=4.1"), 
                    _configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>(_vstsHttpService, "_httpClient", null);
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenProjectName_WhenAskingToCreate_ShouldHydrateBuildDefinitions()
        {
            // arrange
            IBuildDefinitionsFactory buildDefinitionsFactory = new BuildDefinitionsFactory(_vstsHttpService, _configuration);

            // act
            BuildDefinitions buildDefinitions = buildDefinitionsFactory.Create(Project);

            // assert

            JObject jBuildDefinitions = JObject.Parse(JsonConvert.SerializeObject(buildDefinitions));

            jBuildDefinitions["count"].Value<int>().Should().Be(3);

            jBuildDefinitions["items"][0]["id"].Value<int>().Should().Be(3);
            jBuildDefinitions["items"][0]["name"].Value<string>().Should().Be("NaturalGasToPropaneAdapters");
        }
    }
}