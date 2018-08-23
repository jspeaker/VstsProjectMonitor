using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Repository.Networking;

namespace VstsProjectMonitor.Repository
{

    public interface IBuildsFactory
    {
        Builds Create(string projectName);
        Builds Create(string projectName, IEnumerable<int> buildDefinitionIds);
    }

    public class BuildsFactory : IBuildsFactory
    {
        private readonly IHttpService _httpService;
        private readonly IConfiguration _configuration;

        public BuildsFactory(IConfiguration configuration) : this(new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"])), configuration) { }

        public BuildsFactory(IHttpService httpService, IConfiguration configuration)
        {
            _httpService = httpService;
            _configuration = configuration;
        }

        public Builds Create(string projectName) => BuildsFromResult(AuthorizedHttpClient().GetStringAsync($"/{projectName}/_apis/build/builds?api-version=5.0-preview.4").Result);

        public Builds Create(string projectName, IEnumerable<int> buildDefinitionIds) => BuildsFromResult(AuthorizedHttpClient().GetStringAsync($"/{projectName}/_apis/build/builds?definitions={string.Join(",", buildDefinitionIds)}&api-version=5.0-preview.4").Result);

        private HttpClient AuthorizedHttpClient()
        {
            HttpClient httpClient = _httpService.Client();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"user:{_configuration["VstsApi:PAT"]}")));
            return httpClient;
        }

        private Builds BuildsFromResult(string result) => JsonConvert.DeserializeObject<Builds>(result);
    }
}