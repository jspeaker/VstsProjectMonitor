using Newtonsoft.Json;
using System.Collections.Generic;

namespace VstsProjectMonitor.Repository.Models
{
    public class Bugs
    {
        [JsonProperty("bugs")]
        private readonly ICollection<Bug> _bugs;

        public Bugs(ICollection<Bug> workItems)
        {
            _bugs = workItems;
        }
    }

    public class NullBugs : Bugs
    {
        public NullBugs() : base(new List<Bug>()) { }
    }
}