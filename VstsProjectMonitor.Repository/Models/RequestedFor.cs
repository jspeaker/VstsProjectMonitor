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

        [JsonProperty("displayName")] private readonly string _displayName;
        [JsonProperty("imageUrl")] private readonly string _imageUrl;
    }
}