using Newtonsoft.Json;

namespace VstsProjectMonitor.Repository.Models
{
    public class Project
    {
        [JsonConstructor]
        public Project(string id, string name)
        {
            _id = id;
            _name = name;
        }

        [JsonProperty("id")] private readonly string _id;
        [JsonProperty("name")] private readonly string _name;
    }
}