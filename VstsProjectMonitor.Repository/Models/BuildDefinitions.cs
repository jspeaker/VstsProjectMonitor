using Newtonsoft.Json;
using System.Collections.Generic;

namespace VstsProjectMonitor.Repository.Models
{
    public class BuildDefinitions
    {
        [JsonConstructor]
        public BuildDefinitions(int count, ICollection<Definition> value)
        {
            _count = count;
            _buildDefinitions = value;
        }


        [JsonProperty("count")] private readonly int _count;
        [JsonProperty("items")] private readonly ICollection<Definition> _buildDefinitions;
    }
}