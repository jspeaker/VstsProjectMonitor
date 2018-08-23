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
    public class ProjectsFactoryTests
    {
        [TestMethod, TestCategory("Unit")]
        public void GivenProjects_WhenAskingToCreate_ShouldHydrateProjects()
        {
            // arrange
            string projectsJson = new TestData().Projects();
            IConfiguration configuration = new InMemoryConfiguration().Instance();
            IHttpService vstsHttpService = new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(projectsJson, new Uri(new Uri(configuration["VstsApi:BaseUrl"]), "/_apis/projects?api-version=4.1-preview.1"), configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>((VstsHttpService) vstsHttpService, "_httpClient", null);
            IProjectsFactory projectsFactory = new ProjectsFactory(vstsHttpService, configuration);

            // act
            Projects projects = projectsFactory.Create();

            // assert
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(projects));
            jObject.Value<int>("count").Should().Be(2);

            JToken jProjects = jObject["projects"];
            jProjects.Should().HaveCount(2);

            jProjects[0]["id"].Value<string>().Should().Be("8e161f07-7901-483a-bfd1-52bbc68499a3");
            jProjects[0]["name"].Value<string>().Should().Be("VstsProjectMonitor");
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenEmptyProjects_WhenAskingToCreate_ShouldReturnNullObject()
        {
            // arrange
            const string projectsJson = "";
            IConfiguration configuration = new InMemoryConfiguration().Instance();
            IHttpService vstsHttpService = new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(projectsJson, new Uri(new Uri(configuration["VstsApi:BaseUrl"]), "/_apis/projects?api-version=4.1-preview.1"), configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>((VstsHttpService)vstsHttpService, "_httpClient", null);
            IProjectsFactory projectsFactory = new ProjectsFactory(vstsHttpService, configuration);

            // act
            Projects projects = projectsFactory.Create();

            // assert
            projects.Should().BeOfType<NullProjects>();
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenDehydratedProjectsResponse_WhenAskingToCreate_ShouldReturnDehydratedObject()
        {
            // arrange
            const string projectsJson = "{}";
            IConfiguration configuration = new InMemoryConfiguration().Instance();
            IHttpService vstsHttpService = new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(projectsJson, new Uri(new Uri(configuration["VstsApi:BaseUrl"]), "/_apis/projects?api-version=4.1-preview.1"), configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>((VstsHttpService)vstsHttpService, "_httpClient", null);
            IProjectsFactory projectsFactory = new ProjectsFactory(vstsHttpService, configuration);

            // act
            Projects projects = projectsFactory.Create();

            // assert
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(projects));
            jObject.Value<int>("count").Should().Be(0);

            JToken jProjects = jObject["projects"];
            jProjects.Should().HaveCount(0);
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenNullProjects_WhenAskingToCreate_ShouldThrowException()
        {
            // arrange
            string projectsJson = null;
            IConfiguration configuration = new InMemoryConfiguration().Instance();
            IHttpService vstsHttpService = new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(projectsJson, new Uri(new Uri(configuration["VstsApi:BaseUrl"]), "/_apis/projects?api-version=4.1-preview.1"), configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>((VstsHttpService) vstsHttpService, "_httpClient", null);
            IProjectsFactory projectsFactory = new ProjectsFactory(vstsHttpService, configuration);

            // act
            Action action = () => projectsFactory.Create();

            // assert
            action.Should().Throw<Exception>().WithMessage("Value cannot be null.\r\nParameter name: content");
        }
    }
}