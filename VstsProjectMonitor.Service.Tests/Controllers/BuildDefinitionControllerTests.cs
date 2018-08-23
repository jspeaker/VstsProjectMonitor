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
    public class BuildDefinitionControllerTests
    {
        [TestMethod, TestCategory("Unit")]
        public void ShouldReturnBuildDefinitions()
        {
            // arrange
            const string project = "StricklandPropaneTanks";
            const string buildDefinitionName = "StricklandPropaneSpatulas";
            const int buildDefinitionId = 234;

            IBuildDefinitionsFactory buildDefinitionsFactory = new FakeBuildDefinitionsFactory(1, new List<Definition> { new Definition(buildDefinitionId, buildDefinitionName) });
            BuildDefinitionController buildDefinitionController = new Privateer().Object<BuildDefinitionController>(buildDefinitionsFactory);

            // act
            OkObjectResult okObjectResult = (OkObjectResult) buildDefinitionController.BuildDefinitions(project);

            // assert
            okObjectResult.StatusCode.Should().Be(200);
            BuildDefinitions buildDefinitions = (BuildDefinitions) okObjectResult.Value;
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(buildDefinitions));

            jObject["count"].Value<int>().Should().Be(1);
            jObject["items"].Should().HaveCount(1);
            jObject["items"][0]["id"].Value<int>().Should().Be(buildDefinitionId);
            jObject["items"][0]["name"].Value<string>().Should().Be(buildDefinitionName);
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenEmptyProjectName_ShouldThrowException()
        {
            string project = string.Empty;
            const string buildDefinitionName = "StricklandPropaneSpatulas";
            const int buildDefinitionId = 234;

            IBuildDefinitionsFactory buildDefinitionsFactory = new FakeBuildDefinitionsFactory(1, new List<Definition> { new Definition(buildDefinitionId, buildDefinitionName) });
            BuildDefinitionController buildDefinitionController = new Privateer().Object<BuildDefinitionController>(buildDefinitionsFactory);

            // act
            BadRequestResult badRequestResult = (BadRequestResult)buildDefinitionController.BuildDefinitions(project);

            // assert
            badRequestResult.StatusCode.Should().Be(400);
        }
    }

    public class FakeBuildDefinitionsFactory : IBuildDefinitionsFactory
    {
        private readonly int _count;
        private readonly ICollection<Definition> _buildDefinitions;

        public FakeBuildDefinitionsFactory(int count, ICollection<Definition> buildDefinitions)
        {
            _count = count;
            _buildDefinitions = buildDefinitions;
        }

        public BuildDefinitions Create(string project) => new BuildDefinitions(_count, _buildDefinitions);
    }
}