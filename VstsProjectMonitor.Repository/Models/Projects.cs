using Newtonsoft.Json;
using System.Collections.Generic;

namespace VstsProjectMonitor.Repository.Models
{
    public class Projects
    {
        public Projects(int count, ICollection<Project> value)
        {
            _count = count;
            _value = value;
        }

        [JsonProperty("count")] private readonly int _count;
        [JsonProperty("projects")] private readonly ICollection<Project> _value;
    }

    public class NullProjects : Projects {
        public NullProjects() : base(0, new List<Project>()) { }
    }
}