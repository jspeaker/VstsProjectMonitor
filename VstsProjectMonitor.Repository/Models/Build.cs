using Newtonsoft.Json;
using System;

namespace VstsProjectMonitor.Repository.Models
{
    public class Build
    {
        [JsonConstructor]
        public Build(string status, string result, string buildNumber, DateTime startTime, Definition definition, RequestedFor requestedFor)
        {
            _status = status;
            _result = result ?? "pending";
            _buildNumber = buildNumber;
            _startTime = startTime;
            _definition = definition;
            _requestedFor = requestedFor;
        }

        [JsonProperty("status")] private readonly string _status;
        [JsonProperty("result")] private readonly string _result;
        [JsonProperty("buildNumber")] private readonly string _buildNumber;
        [JsonProperty("startTime")] private readonly DateTime _startTime;
        [JsonProperty("definition")] private readonly Definition _definition;
        [JsonProperty("requestedFor")] private readonly RequestedFor _requestedFor;
    }
}