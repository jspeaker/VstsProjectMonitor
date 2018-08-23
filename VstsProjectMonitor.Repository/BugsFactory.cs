using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading;
using System.Threading.Tasks;
using VstsProjectMonitor.Repository.Models;
using VstsProjectMonitor.Repository.Networking;

namespace VstsProjectMonitor.Repository
{

    public interface IBugsFactory
    {
        Task<Bugs> Create(string projectName);
    }

    public class BugsFactory : IBugsFactory
    {
        private readonly IHttpService _httpService;
        private readonly IConfiguration _configuration;

        public BugsFactory(IConfiguration configuration) : this(new VstsHttpService(new Uri(configuration["VstsApi:BaseUrl"])), configuration) { }

        public BugsFactory(IHttpService httpService, IConfiguration configuration)
        {
            _httpService = httpService;
            _configuration = configuration;
        }

        public async Task<Bugs> Create(string projectName)
        {
            HttpClient httpClient = _httpService.Client();
            httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"user:{_configuration["VstsApi:PAT"]}")));

            HttpResponseMessage result = await httpClient.PostAsync($"{projectName}/_apis/wit/wiql?$top=10000&api-version=5.0-preview.2",
                new StringContent(
                    $"{{ \'Query\': \'SELECT [Id] FROM workitems WHERE [Work Item Type] = \"Bug\" AND ([State] = \"Active\" OR [State] = \"New\") AND [Area Path] UNDER \"{projectName}\"\' }}",
                    Encoding.UTF8,
                    "application/json"), CancellationToken.None);

            Bugs bugs = JsonConvert.DeserializeObject<Bugs>(await result.Content.ReadAsStringAsync());
            if (bugs == null) return new NullBugs();

            return bugs;
        }
    }
}