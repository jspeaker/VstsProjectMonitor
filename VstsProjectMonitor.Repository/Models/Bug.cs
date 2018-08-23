using Newtonsoft.Json;

namespace VstsProjectMonitor.Repository.Models
{
    public class Bug
    {
        [JsonProperty("id")]
        private readonly int _id;

        [JsonProperty("url")]
        private readonly string _url;

        public Bug(int id, string url)
        {
            _id = id;
            _url = url;
        }
    }
}