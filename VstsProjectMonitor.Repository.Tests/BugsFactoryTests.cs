using FluentAssertions;
using Microsoft.Extensions.Configuration;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Net.Http;
using System.Threading.Tasks;
using VstsProjectMonitor.Platform;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Repository.Networking;
using VstsProjectMonitor.Repository.Tests.Fakes;

namespace VstsProjectMonitor.Repository.Tests
{
    [TestClass]
    public class BugsFactoryTests
    {
        [TestMethod, TestCategory("Unit")]
        public void GivenBugData_WhenAskingToCreate_ThenItShouldReturnBugs()
        {
            // arrange
            string bugsJson = new TestData().Bugs();
            IConfiguration configuration = new InMemoryConfiguration().Instance();
            IHttpService vstsHttpService = new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(bugsJson, new Uri(new Uri(configuration["VstsApi:BaseUrl"]), "/Strickland/_apis/wit/wiql?$top=10000&api-version=5.0-preview.2"), configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>((VstsHttpService)vstsHttpService, "_httpClient", null);
            IBugsFactory bugsFactory = new BugsFactory(vstsHttpService, configuration);

            // act
            Bugs bugs = bugsFactory.Create("Strickland").Result;

            // assert
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(bugs));

            JToken jBugs = jObject["bugs"];
            jBugs.Should().HaveCount(11);

            jBugs[0].Value<int>("id").Should().Be(777);
            jBugs[0].Value<string>("url").Should().Be("https://premeraservices.visualstudio.com/d30fd324-c3ab-4edc-ac5d-ba4514ba5ec4/_apis/wit/workItems/777");
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenNoBugData_WhenAskingToCreate_ThenItShouldReturnNullObject()
        {
            // arrange
            const string bugsJson = "";
            IConfiguration configuration = new InMemoryConfiguration().Instance();
            IHttpService vstsHttpService = new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(bugsJson, new Uri(new Uri(configuration["VstsApi:BaseUrl"]), "/Strickland/_apis/wit/wiql?$top=10000&api-version=5.0-preview.2"), configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>((VstsHttpService)vstsHttpService, "_httpClient", null);
            IBugsFactory bugsFactory = new BugsFactory(vstsHttpService, configuration);

            // act
            Bugs bugs = bugsFactory.Create("Strickland").Result;

            // assert
            bugs.Should().BeOfType<NullBugs>();
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenDehydratedBugsResponse_WhenAskingToCreate_ThenItShouldReturnDehydratedObject()
        {
            // arrange
            const string bugsJson = "{}";
            IConfiguration configuration = new InMemoryConfiguration().Instance();
            IHttpService vstsHttpService = new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(bugsJson, new Uri(new Uri(configuration["VstsApi:BaseUrl"]), "/Strickland/_apis/wit/wiql?$top=10000&api-version=5.0-preview.2"), configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>((VstsHttpService)vstsHttpService, "_httpClient", null);
            IBugsFactory bugsFactory = new BugsFactory(vstsHttpService, configuration);

            // act
            Bugs bugs = bugsFactory.Create("Strickland").Result;

            // assert
            JObject jObject = JObject.Parse(JsonConvert.SerializeObject(bugs));

            JToken jBugs = jObject["bugs"];
            jBugs.Should().HaveCount(0);
        }

        [TestMethod, TestCategory("Unit")]
        public void GivenNullBugsData_WhenAskingToCreate_ThenItShouldThrowException()
        {
            // arrange
            IConfiguration configuration = new InMemoryConfiguration().Instance();
            IHttpService vstsHttpService = new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"]), new FakeHttpMessageHandler(null, new Uri(new Uri(configuration["VstsApi:BaseUrl"]), "/Strickland/_apis/wit/wiql?$top=10000&api-version=5.0-preview.2"), configuration["VstsApi:PAT"]));
            new Privateer().SetStaticField<VstsHttpService, HttpClient>((VstsHttpService)vstsHttpService, "_httpClient", null);
            IBugsFactory bugsFactory = new BugsFactory(vstsHttpService, configuration);

            // act
            Action action = () => Task.WaitAll(bugsFactory.Create("Strickland"));

            // assert
            action.Should().Throw<Exception>().WithMessage("Value cannot be null.\r\nParameter name: content");
        }
    }
}