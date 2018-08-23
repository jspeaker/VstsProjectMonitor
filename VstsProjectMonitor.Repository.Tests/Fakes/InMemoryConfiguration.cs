using Microsoft.Extensions.Configuration;
using System.Collections.Generic;

namespace VstsProjectMonitor.Repository.Tests.Fakes
{
    public class InMemoryConfiguration
    {
        public IConfiguration Instance()
        {
            return new ConfigurationBuilder().AddInMemoryCollection(
                new List<KeyValuePair<string, string>>
                {
                    new KeyValuePair<string, string>("VstsApi:BaseUrl", "https://iontechdotorg.visualstudio.com"),
                    new KeyValuePair<string, string>("VstsApi:PAT", "It's Pat!")
                }).Build();
        }
    }
}