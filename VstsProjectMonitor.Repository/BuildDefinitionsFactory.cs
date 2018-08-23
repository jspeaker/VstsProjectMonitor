using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Repository.Networking;

namespace VstsProjectMonitor.Repository
{
    public interface IBuildDefinitionsFactory
    {
        BuildDefinitions Create(string project);
    }

    public class BuildDefinitionsFactory : IBuildDefinitionsFactory
    {
        private readonly IHttpService _httpService;
        private readonly IConfiguration _configuration;

        public BuildDefinitionsFactory(IConfiguration configuration) : 
            this(new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"])), configuration) { }

        public BuildDefinitionsFactory(IHttpService httpService, IConfiguration configuration)
        {
            _httpService = httpService;
            _configuration = configuration;
        }

        public BuildDefinitions Create(string project)
        {
            HttpClient httpClient = _httpService.Client();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.ASCII.GetBytes($"user:{_configuration["VstsApi:PAT"]}")));
            string result = httpClient.GetStringAsync($"/{project}/_apis/build/definitions?api-version=4.1").Result;
            return JsonConvert.DeserializeObject<BuildDefinitions>(result);
        }
    }
}