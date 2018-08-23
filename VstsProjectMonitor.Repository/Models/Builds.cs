using Newtonsoft.Json;
using System.Collections.Generic;

namespace VstsProjectMonitor.Repository.Models
{
    public class Builds
    {
        [JsonConstructor]
        public Builds(int count, ICollection<Build> value)
        {
            _count = count;
            _builds = value;
        }

        [JsonProperty("count")] private readonly int _count;
        [JsonProperty("builds")] private readonly ICollection<Build> _builds;
    }
}