using Newtonsoft.Json;

namespace VstsProjectMonitor.Repository.Models
{
    public class Definition
    {
        [JsonConstructor]
        public Definition(int id, string name)
        {
            _id = id;
            _name = name;
        }

        [JsonProperty("id")] private readonly int _id;
        [JsonProperty("name")] private readonly string _name;
    }
}