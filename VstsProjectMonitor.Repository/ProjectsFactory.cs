using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Repository.Networking;

namespace VstsProjectMonitor.Repository
{
    public interface IProjectsFactory
    {
        Projects Create();
    }

    public class ProjectsFactory : IProjectsFactory
    {
        private readonly IHttpService _httpService;
        private readonly IConfiguration _configuration;

        public ProjectsFactory(IConfiguration configuration) : this(new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"])), configuration) { }

        public ProjectsFactory(IHttpService httpService, IConfiguration configuration)
        {
            _httpService = httpService;
            _configuration = configuration;
        }

        public Projects Create()
        {
            HttpClient httpClient = _httpService.Client();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"user:{_configuration["VstsApi:PAT"]}")));
            string result = httpClient.GetStringAsync("_apis/projects?api-version=4.1-preview.1").Result;
            Projects projects = JsonConvert.DeserializeObject<Projects>(result);
            if (projects == null) return new NullProjects();
            return projects;
        }
    }
}