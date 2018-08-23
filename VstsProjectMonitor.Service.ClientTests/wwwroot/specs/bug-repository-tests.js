// ReSharper disable UseOfImplicitGlobalInFunctionScope

/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/extensions.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/project-monitor.js" />
/// <reference path="../../../VstsProjectMonitor.Service/wwwroot/scripts/bug-repository.js" />

/// <reference path="../dependencies/jquery-3.3.1.min.js" />

/// <reference path="../scripts/fakes/fake-bug-data.js" />

describe("GivenBugRepository",
  function () {
    it("WhenAskingForBugs_ThenItShouldUseCorrectUrl",
      function () {
        var fakeDomAccess = new Fakes.DomAccess();
        var bugRepository = new ProjectMonitor.BugRepository(fakeDomAccess);
        var projectName = "strickland-website-redesign";

        bugRepository.bugs(projectName);
        expect(fakeDomAccess.relativePath()).toBe("/api/" + projectName + "/bug");
      });

    describe("AndBugData",
      function () {
        var fakeData = new Fakes.BugData().get();
        var fakeDomAccess = new Fakes.DomAccess(fakeData);
        var bugRepository = new ProjectMonitor.BugRepository(fakeDomAccess);

        it("WhenAskingForBugs_ThenItShouldReturnData",
          function () {
            var actualData;
            var projectName = "strickland-website-redesign";

            bugRepository.bugs(projectName, function (result) {
              actualData = result;
            });
            expect(actualData).toBe(fakeData);
          });
      });
  });
