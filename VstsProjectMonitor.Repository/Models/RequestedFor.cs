using Newtonsoft.Json;

namespace VstsProjectMonitor.Repository.Models
{
    public class RequestedFor
    {
        [JsonConstructor]
        public RequestedFor(string displayName, string imageUrl)
        {
            _displayName = displayName;
            _imageUrl = imageUrl;
        }

        private readonly string _displayName;

        [JsonProperty("displayName")]
        private string DisplayName => _displayName.Split(' ')[0];

        [JsonProperty("imageUrl")] private readonly string _imageUrl;
    }
}