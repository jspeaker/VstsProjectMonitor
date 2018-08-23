using System;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;

namespace VstsProjectMonitor.Repository.Tests.Fakes
{
    public class FakeHttpMessageHandler : HttpMessageHandler
    {
        private readonly string _json;
        private readonly Uri _expectedUri;
        private readonly string _expectedPat;

        public FakeHttpMessageHandler(string json, Uri expectedUri, string expectedPat)
        {
            _json = json;
            _expectedUri = expectedUri;
            _expectedPat = expectedPat;
        }

        protected override Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            if (!request.RequestUri.AbsoluteUri.Equals(_expectedUri.AbsoluteUri)) throw new ArgumentException($"The URI was not correct, expected {_expectedUri.AbsoluteUri} but found {request.RequestUri.AbsoluteUri}.");
            if (!request.Headers.Contains("Authorization")) throw new Exception("Authorization header was not included in the request.");
            if (!request.Headers.GetValues("Authorization").First().Equals($"Basic {Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes($"user:{_expectedPat}"))}")) throw new Exception("Authorization header should have been set to Basic with user:[PAT] from configuration.");

            return Task.FromResult(new HttpResponseMessage(HttpStatusCode.OK)
            {
                Content = new StringContent(_json)
            });
        }
    }
}