using System;
using System.Net.Http;

namespace VstsProjectMonitor.Repository.Networking
{
    public interface IHttpService
    {
        HttpClient Client();
    }

    public class VstsHttpService : IHttpService
    {
        private readonly Uri _baseUri;
        private readonly HttpMessageHandler _httpMessageHandler;
        private static volatile object _lockObject = new object();
        private static HttpClient _httpClient;

        public VstsHttpService(Uri baseUri) : this(baseUri, new HttpClientHandler()) { }

        public VstsHttpService(Uri baseUri, HttpMessageHandler httpMessageHandler)
        {
            _baseUri = baseUri;
            _httpMessageHandler = httpMessageHandler;
        }

        public HttpClient Client()
        {
            if (_httpClient != null) return _httpClient;
            lock (_lockObject)
            {
                return _httpClient ?? (_httpClient = new HttpClient(_httpMessageHandler) {BaseAddress = _baseUri});
            }
        }
    }
}